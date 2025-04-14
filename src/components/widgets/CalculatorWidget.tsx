
import { useState } from 'react';
import { cn } from '@/lib/utils';

const CalculatorWidget = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  
  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };
  
  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };
  
  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);
    
    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate();
      setDisplay(typeof result === 'number' ? String(result) : result);
      setFirstOperand(typeof result === 'number' ? result : null);
    }
    
    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  const calculate = (): number | string => {
    const secondOperand = parseFloat(display);
    
    if (operator === '+') {
      return (firstOperand || 0) + secondOperand;
    } else if (operator === '-') {
      return (firstOperand || 0) - secondOperand;
    } else if (operator === '×') {
      return (firstOperand || 0) * secondOperand;
    } else if (operator === '÷') {
      return secondOperand !== 0 ? (firstOperand || 0) / secondOperand : 'Error';
    }
    
    return secondOperand;
  };
  
  const resetCalculator = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };
  
  const toggleSign = () => {
    setDisplay(String(-parseFloat(display)));
  };
  
  const percentage = () => {
    setDisplay(String(parseFloat(display) / 100));
  };
  
  const handleEquals = () => {
    if (operator && !waitingForSecondOperand) {
      const result = calculate();
      setDisplay(typeof result === 'number' ? String(result) : result);
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
    }
  };

  // Button component
  const CalcButton = ({ 
    children, 
    onClick, 
    className 
  }: { 
    children: React.ReactNode, 
    onClick: () => void, 
    className?: string 
  }) => (
    <button 
      className={cn(
        "glass-button flex items-center justify-center h-10",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
  
  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        className="w-full p-2 glass-input text-right text-xl"
        value={display}
        readOnly
      />
      
      <div className="grid grid-cols-4 gap-2">
        <CalcButton onClick={resetCalculator}>C</CalcButton>
        <CalcButton onClick={toggleSign}>±</CalcButton>
        <CalcButton onClick={percentage}>%</CalcButton>
        <CalcButton onClick={() => handleOperator('÷')} className="bg-blue-600/70">÷</CalcButton>
        
        <CalcButton onClick={() => inputDigit('7')}>7</CalcButton>
        <CalcButton onClick={() => inputDigit('8')}>8</CalcButton>
        <CalcButton onClick={() => inputDigit('9')}>9</CalcButton>
        <CalcButton onClick={() => handleOperator('×')} className="bg-blue-600/70">×</CalcButton>
        
        <CalcButton onClick={() => inputDigit('4')}>4</CalcButton>
        <CalcButton onClick={() => inputDigit('5')}>5</CalcButton>
        <CalcButton onClick={() => inputDigit('6')}>6</CalcButton>
        <CalcButton onClick={() => handleOperator('-')} className="bg-blue-600/70">-</CalcButton>
        
        <CalcButton onClick={() => inputDigit('1')}>1</CalcButton>
        <CalcButton onClick={() => inputDigit('2')}>2</CalcButton>
        <CalcButton onClick={() => inputDigit('3')}>3</CalcButton>
        <CalcButton onClick={() => handleOperator('+')} className="bg-blue-600/70">+</CalcButton>
        
        <CalcButton onClick={() => inputDigit('0')} className="col-span-2">0</CalcButton>
        <CalcButton onClick={inputDecimal}>.</CalcButton>
        <CalcButton onClick={handleEquals} className="bg-blue-600/70">=</CalcButton>
      </div>
    </div>
  );
};

export default CalculatorWidget;
