import './App.css';
import React, { useState } from 'react';

export default function Calculator() {

  

  const [currentValue, setCurrentValue] = useState(0); // Stores the running calculation result as a number
  const [operator, setOperator] = useState(null); // Stores the current operator (+, -, ×, ÷)
  const [inputValue, setInputValue] = useState('0'); // What the user is currently typing (shown on display)
  const [waitingForOperand, setWaitingForOperand] = useState(false); // True when we just pressed an operator and need a new number
  const [displayExpression, setDisplayExpression] = useState('0'); // The full expression shown to user (like "1 + 1" or "2 + 1") 

  const handleNumberClick = (number) => {
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
  };

  const handleOperatorClick = (nextOperator) => {
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
  };

  const handleEqualsClick = () => {
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
      
      // Show only the final result when equals is pressed
      // For example: just "2" instead of "1 + 1 = 2"
      setDisplayExpression(result.toString());
      
      setCurrentValue(0); // Reset for next calculation
      setOperator(null); // Clear the operator
      setWaitingForOperand(true); // Ready for new calculation
    }
  };

  const handleClearClick = () => {
    console.log('Clear clicked');
  };

  const handleClearAllClick = () => {
    console.log('Clear All clicked');
  };

  const handleDecimalClick = () => {
    console.log('Decimal clicked');
  };

  const viewHistory = () => {
    
  }

  return (
    <div>
      <h2>Calculator Button Test</h2>
      <p>Open browser dev tools to see console logs</p>
      
      <div style={{border: '1px solid black', padding: '10px', margin: '10px', fontSize: '24px'}}>
        Display: {displayExpression} {/* Shows the full calculation expression like "1 + 1" or "2 + 1" */}
      </div>
      
      <div>
        <h3>Numbers</h3>
        <button onClick={() => handleNumberClick(1)}>1</button>
        <button onClick={() => handleNumberClick(2)}>2</button>
        <button onClick={() => handleNumberClick(3)}>3</button>
        <br />
        <button onClick={() => handleNumberClick(4)}>4</button>
        <button onClick={() => handleNumberClick(5)}>5</button>
        <button onClick={() => handleNumberClick(6)}>6</button>
        <br />
        <button onClick={() => handleNumberClick(7)}>7</button>
        <button onClick={() => handleNumberClick(8)}>8</button>
        <button onClick={() => handleNumberClick(9)}>9</button>
        <br />
        <button onClick={() => handleNumberClick(0)}>0</button>
        <button onClick={handleDecimalClick}>.</button>
      </div>

      <div>
        <h3>Operators</h3>
        <button onClick={() => handleOperatorClick('+')}>+</button>
        <button onClick={() => handleOperatorClick('-')}>-</button>
        <button onClick={() => handleOperatorClick('×')}>×</button>
        <button onClick={() => handleOperatorClick('÷')}>÷</button>
      </div>

      <div>
        <h3>Actions</h3>
        <button onClick={handleEqualsClick}>=</button>
        <button onClick={handleClearClick}>C</button>
        <button onClick={handleClearAllClick}>CE</button>
      </div>
      
        
    </div>
  );
}

