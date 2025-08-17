import './App.css';
import React, { useState, useEffect, useCallback } from 'react'; // Added useEffect for keyboard event listener and useCallback

export default function Calculator() {

  

  const [currentValue, setCurrentValue] = useState(0); // Stores the running calculation result as a number
  const [operator, setOperator] = useState(null); // Stores the current operator (+, -, ×, ÷)
  const [inputValue, setInputValue] = useState('0'); // What the user is currently typing (shown on display)
  const [waitingForOperand, setWaitingForOperand] = useState(false); // True when we just pressed an operator and need a new number
  const [displayExpression, setDisplayExpression] = useState('0'); // The full expression shown to user (like "1 + 1" or "2 + 1")
  const [history, setHistory] = useState([]); // Array to store all completed calculations like ["1 + 1 = 2", "2 + 3 = 5"]
  const [showHistory, setShowHistory] = useState(false); // Controls whether history section is visible or hidden 

  const handleNumberClick = useCallback((number) => {
    if (waitingForOperand) {
      // If we just pressed an operator, start fresh with this number
      setInputValue(number.toString());
      // Update display expression to replace the last number with the new one
      // For example: "1 +" becomes "1 + 2" when user clicks 2
      if (operator && currentValue !== 0) {
        setDisplayExpression(`${currentValue} ${operator} ${number}`);
      } else {
        // If no operator yet, just show the number
        setDisplayExpression(number.toString());
      }
      setWaitingForOperand(false);
    } else {
      // Otherwise, add this digit to what we're already typing
      const newInputValue = inputValue === '0' ? number.toString() : inputValue + number.toString();
      setInputValue(newInputValue);
      
      // Update the display expression as we build the number
      if (operator && currentValue !== 0) {
        // We're building the second number in an expression like "1 + 12"
        setDisplayExpression(`${currentValue} ${operator} ${newInputValue}`);
      } else {
        // We're building the first number, just show it
        setDisplayExpression(newInputValue);
      }
    }
  }, [inputValue, waitingForOperand, operator, currentValue]);

  const handleOperatorClick = useCallback((nextOperator) => {
    const inputValueNumber = parseFloat(inputValue); // Convert current input to number for calculation

    if (currentValue === 0) {
      // First time pressing an operator - just store the current input as our starting value
      setCurrentValue(inputValueNumber);
      // Show the first number with the operator, like "1 +"
      setDisplayExpression(`${inputValueNumber} ${nextOperator}`);
    } else if (operator) {
      // We already have an operator, so calculate the result of the previous operation
      const currentValueNumber = currentValue || 0;
      let result;
      
      if (operator === '+') {
        result = currentValueNumber + inputValueNumber;
      } else if (operator === '-') {
        result = currentValueNumber - inputValueNumber;
      } else if (operator === '×') {
        result = currentValueNumber * inputValueNumber;
      } else if (operator === '÷') {
        result = currentValueNumber / inputValueNumber;
      }
      
      // Save this calculation to history before continuing to the next one
      // For example: when you type "9 + 9" and then press "+", save "9 + 9 = 18"
      const completedCalculation = `${currentValueNumber} ${operator} ${inputValueNumber} = ${result}`;
      setHistory(prevHistory => [...prevHistory, completedCalculation]);
      
      setCurrentValue(result); // Store result for next calculation
      setInputValue(result.toString()); // Show result on display
      
      // This is the key part! Show the result with the new operator
      // For example: after "1 + 1" and pressing "+", show "2 +"
      // This creates the chaining effect you wanted like "2 + 1" when you type next number
      setDisplayExpression(`${result} ${nextOperator}`);
    } else {
      // Edge case: we have a currentValue but no operator (shouldn't happen often)
      setDisplayExpression(`${inputValueNumber} ${nextOperator}`);
    }

    setWaitingForOperand(true); // Now we're waiting for the next number
    setOperator(nextOperator); // Remember which operator was pressed
  }, [inputValue, currentValue, operator]);

  const handleEqualsClick = useCallback(() => {
    const inputValueNumber = parseFloat(inputValue); // Convert current input to number

    if (operator && currentValue !== null) {
      // Only calculate if we have an operator and a stored value
      const currentValueNumber = currentValue || 0;
      let result;
      
      if (operator === '+') {
        result = currentValueNumber + inputValueNumber;
      } else if (operator === '-') {
        result = currentValueNumber - inputValueNumber;
      } else if (operator === '×') {
        result = currentValueNumber * inputValueNumber;
      } else if (operator === '÷') {
        result = currentValueNumber / inputValueNumber;
      }
      
      setInputValue(result.toString()); // Show final result
      
      // Save the complete calculation to history before showing just the result
      // This stores expressions like "1 + 1 = 2" for the history view
      const completedCalculation = `${currentValueNumber} ${operator} ${inputValueNumber} = ${result}`;
      setHistory(prevHistory => [...prevHistory, completedCalculation]); // Add to end of history array
      
      // Show only the final result when equals is pressed
      // For example: just "2" instead of "1 + 1 = 2"
      setDisplayExpression(result.toString());
      
      setCurrentValue(0); // Reset for next calculation
      setOperator(null); // Clear the operator
      setWaitingForOperand(true); // Ready for new calculation
    }
  }, [inputValue, currentValue, operator]);

  const handleClearClick = useCallback(() => {
    // Clear just the current display and reset calculator state (but keep history)
    setInputValue('0'); // Reset to starting display value
    setDisplayExpression('0'); // Reset display expression 
    setCurrentValue(0); // Clear stored calculation value
    setOperator(null); // Clear any pending operator
    setWaitingForOperand(false); // Reset to not waiting for input
    // Note: history is NOT cleared - only the current calculation is reset
  }, []);

  const handleClearAllClick = useCallback(() => {
    // Clear everything - both current display AND all history
    setInputValue('0'); // Reset to starting display value
    setDisplayExpression('0'); // Reset display expression
    setCurrentValue(0); // Clear stored calculation value
    setOperator(null); // Clear any pending operator
    setWaitingForOperand(false); // Reset to not waiting for input
    setHistory([]); // Clear all calculation history
    // This completely resets the calculator to its initial state
  }, []);

  const handleDecimalClick = useCallback(() => {
    // Only add decimal if there isn't already one in the current number
    if (inputValue.indexOf('.') === -1) {
      if (waitingForOperand) {
        // If we just pressed an operator, start fresh with "0."
        setInputValue('0.');
        // Update display expression to show the decimal
        if (operator && currentValue !== 0) {
          setDisplayExpression(`${currentValue} ${operator} 0.`);
        } else {
          setDisplayExpression('0.');
        }
        setWaitingForOperand(false);
      } else {
        // Add decimal to current number being typed
        const newInputValue = inputValue + '.';
        setInputValue(newInputValue);
        
        // Update the display expression with the decimal
        if (operator && currentValue !== 0) {
          // We're building the second number in an expression like "1 + 2."
          setDisplayExpression(`${currentValue} ${operator} ${newInputValue}`);
        } else {
          // We're building the first number, just show it with decimal
          setDisplayExpression(newInputValue);
        }
      }
    }
    // If there's already a decimal point, do nothing (ignore the click)
  }, [inputValue, waitingForOperand, operator, currentValue]);

  const viewHistory = () => {
    // Toggle the history visibility - if it's showing, hide it; if it's hidden, show it
    setShowHistory(!showHistory);
  }

  // useEffect runs when the component mounts (loads) and sets up keyboard event listener
  useEffect(() => {
    // Function to handle keyboard key presses
    const handleKeyPress = (event) => {
      const key = event.key; // Get the key that was pressed
      
      // Prevent default browser behavior for certain keys (like / opening search)
      if (['+', '-', '*', '/', 'Enter', '=', 'Escape', 'Delete'].includes(key)) {
        event.preventDefault();
      }
      
      // Handle number keys 0-9
      if (key >= '0' && key <= '9') {
        handleNumberClick(parseInt(key)); // Convert string to number and call existing function
      }
      // Handle operator keys
      else if (key === '+') {
        handleOperatorClick('+');
      }
      else if (key === '-') {
        handleOperatorClick('-');
      }
      else if (key === '*') { // * key maps to × symbol
        handleOperatorClick('×');
      }
      else if (key === '/') { // / key maps to ÷ symbol
        handleOperatorClick('÷');
      }
      // Handle decimal point (both . and , keys work)
      else if (key === '.' || key === ',') {
        handleDecimalClick();
      }
      // Handle equals (both Enter and = keys work)
      else if (key === 'Enter' || key === '=') {
        handleEqualsClick();
      }
      // Handle clear (Escape key)
      else if (key === 'Escape') {
        handleClearClick();
      }
      // Handle clear all (Delete key)
      else if (key === 'Delete') {
        handleClearAllClick();
      }
    };

    // Add the event listener to the entire window (so it works anywhere on the page)
    window.addEventListener('keydown', handleKeyPress);
    
    // Cleanup function: removes the event listener when component unmounts
    // This prevents memory leaks and duplicate listeners
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleNumberClick, handleOperatorClick, handleDecimalClick, handleEqualsClick, handleClearClick, handleClearAllClick]); // Include handler functions so keyboard has access to current state

  return (
    <div className="calculator">
      <div className="calculator-main">
        <div className="display">
          {displayExpression}
        </div>
        
        <div className="button-grid">
          <button className="btn btn-clear" onClick={handleClearClick}>C</button>
          <button className="btn btn-clear" onClick={handleClearAllClick}>CE</button>
          <button className="btn btn-operator" onClick={() => handleOperatorClick('÷')}>÷</button>
          <button className="btn btn-operator" onClick={() => handleOperatorClick('×')}>×</button>
          
          <button className="btn btn-number" onClick={() => handleNumberClick(7)}>7</button>
          <button className="btn btn-number" onClick={() => handleNumberClick(8)}>8</button>
          <button className="btn btn-number" onClick={() => handleNumberClick(9)}>9</button>
          <button className="btn btn-operator" onClick={() => handleOperatorClick('-')}>-</button>
          
          <button className="btn btn-number" onClick={() => handleNumberClick(4)}>4</button>
          <button className="btn btn-number" onClick={() => handleNumberClick(5)}>5</button>
          <button className="btn btn-number" onClick={() => handleNumberClick(6)}>6</button>
          <button className="btn btn-operator" onClick={() => handleOperatorClick('+')}>+</button>
          
          <button className="btn btn-number" onClick={() => handleNumberClick(1)}>1</button>
          <button className="btn btn-number" onClick={() => handleNumberClick(2)}>2</button>
          <button className="btn btn-number" onClick={() => handleNumberClick(3)}>3</button>
          <button className="btn btn-equals" onClick={handleEqualsClick} rowSpan="2">=</button>
          
          <button className="btn btn-number btn-zero" onClick={() => handleNumberClick(0)}>0</button>
          <button className="btn btn-number" onClick={handleDecimalClick}>.</button>
        </div>
        
        <button className="history-toggle" onClick={viewHistory}>
          📊
        </button>
      </div>
      
      {/* History sidebar */}
      <div className={`history-sidebar ${showHistory ? 'show' : ''}`}>
        <div className="history-header">
          <h3>History</h3>
          <button className="close-history" onClick={viewHistory}>×</button>
        </div>
        <div className="history-content">
          {history.length === 0 ? (
            <p className="no-history">No calculations yet</p>
          ) : (
            <div className="history-list">
              {history.map((calculation, index) => (
                <div key={index} className="history-item">
                  {calculation}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

