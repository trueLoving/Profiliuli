import { useState, useCallback } from 'react';

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [pendingOp, setPendingOp] = useState(false);

  const currentNum = parseFloat(display);

  const handleDigit = useCallback(
    (d: string) => {
      setDisplay(prev => {
        if (pendingOp) return d;
        if (prev === '0' && d !== '.') return d;
        if (d === '.' && prev.includes('.')) return prev;
        return prev + d;
      });
      setPendingOp(false);
    },
    [pendingOp]
  );

  const handleOperator = useCallback(
    (op: string) => {
      if (prevValue === null) {
        setPrevValue(currentNum);
        setOperator(op);
        setPendingOp(true);
        return;
      }
      let result = prevValue;
      if (operator === '+') result += currentNum;
      else if (operator === '−') result -= currentNum;
      else if (operator === '×') result *= currentNum;
      else if (operator === '÷') result = currentNum === 0 ? 0 : result / currentNum;
      setDisplay(String(result));
      setPrevValue(result);
      setOperator(op === '=' ? null : op);
      setPendingOp(true);
      if (op === '=') setPrevValue(null);
    },
    [prevValue, operator, currentNum]
  );

  const handleClear = useCallback(() => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setPendingOp(false);
  }, []);

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const onButton = (key: string) => {
    if (key === 'C') return handleClear();
    if (key === '±') {
      setDisplay(prev => (parseFloat(prev) ? String(-parseFloat(prev)) : prev));
      return;
    }
    if (key === '%') {
      setDisplay(prev => String(parseFloat(prev) / 100));
      return;
    }
    if (['+', '−', '×', '÷', '='].includes(key)) return handleOperator(key);
    handleDigit(key);
  };

  return (
    <div className="h-full min-h-0 flex flex-col p-3 sm:p-4 bg-gray-900 rounded-xl font-mono overflow-hidden">
      <div
        className="text-right text-white min-h-[2.5rem] break-all flex-shrink-0 mb-3 text-2xl sm:text-3xl md:text-4xl"
        style={{ fontSize: 'clamp(1.25rem, 4vw + 1rem, 2.25rem)' }}
        aria-live="polite"
      >
        {display}
      </div>
      <div className="grid grid-cols-4 grid-rows-5 gap-1.5 sm:gap-2 flex-1 min-h-0 auto-rows-fr">
        {buttons.flat().map((key, idx) => {
          const isWide = key === '0';
          const isOp = ['+', '−', '×', '÷', '='].includes(key);
          const isUtil = ['C', '±', '%'].includes(key);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onButton(key)}
              className={`min-h-0 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center justify-center text-base sm:text-xl ${
                isOp
                  ? 'bg-amber-500 hover:bg-amber-400 text-gray-900'
                  : isUtil
                    ? 'bg-gray-600 hover:bg-gray-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
              } ${isWide ? 'col-span-2' : ''}`}
              style={{ fontSize: 'clamp(0.875rem, 2.5vw + 0.5rem, 1.5rem)' }}
              aria-label={key === 'C' ? 'Clear' : key}
            >
              {key}
            </button>
          );
        })}
      </div>
    </div>
  );
}
