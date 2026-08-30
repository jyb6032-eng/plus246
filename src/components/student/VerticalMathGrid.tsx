import React from 'react';

interface Props {
  num1: number;
  num2: number;
  operator?: string;
  highlightDigits?: boolean;
  showStepGrid?: boolean;
  multiplicand?: number; // legacy fallback
  multiplier?: number;   // legacy fallback
}

export const VerticalMathGrid: React.FC<Props> = ({
  num1,
  num2,
  operator = '+',
  highlightDigits = false,
  showStepGrid = false,
  multiplicand,
  multiplier,
}) => {
  const topNum = num1 ?? multiplicand ?? 0;
  const bottomNum = num2 ?? multiplier ?? 0;

  const topStr = String(topNum);
  const bottomStr = String(bottomNum);

  const topOnes = topNum % 10;
  const topTens = Math.floor(topNum / 10);
  const bottomOnes = bottomNum % 10;
  const bottomTens = Math.floor(bottomNum / 10);

  const onesResult = operator === '-' ? (topOnes - bottomOnes) : (topOnes + bottomOnes);
  const tensResult = operator === '-' ? (topTens - bottomTens) : (topTens + bottomTens);

  return (
    <div className="inline-block p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-300 shadow-md font-mono select-none">
      {/* Place Value Header */}
      <div className="flex justify-end gap-3 text-xs font-bold text-slate-400 mb-2 pb-1 border-b border-slate-100">
        <span className="w-8 text-center text-indigo-500 font-jua">십의 자리</span>
        <span className="w-8 text-center text-emerald-500 font-jua">일의 자리</span>
      </div>

      {/* Visual Alignment Container */}
      <div className="flex flex-col items-end text-2xl md:text-3xl font-bold tracking-widest text-slate-800 space-y-1">
        {/* Row 1: Top Number */}
        <div className="flex items-center gap-2">
          {topStr.length === 1 && <span className="w-8" />}
          {topStr.split('').map((digit, idx) => (
            <span
              key={idx}
              className={`w-8 text-center rounded py-0.5 ${
                highlightDigits ? 'bg-amber-100 text-amber-900 ring-2 ring-amber-400' : ''
              }`}
            >
              {digit}
            </span>
          ))}
        </div>

        {/* Row 2: Operator & Bottom Number */}
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-bold text-sky-600 w-6 text-center">
            {operator}
          </span>
          {bottomStr.length === 1 && <span className="w-8" />}
          {bottomStr.split('').map((digit, idx) => (
            <span
              key={idx}
              className={`w-8 text-center rounded py-0.5 ${
                highlightDigits ? 'bg-amber-100 text-amber-900 ring-2 ring-amber-400' : ''
              }`}
            >
              {digit}
            </span>
          ))}
        </div>

        {/* Solid Separator Line */}
        <div className="w-full border-b-4 border-slate-800 my-1.5" />

        {/* Step-by-step place value breakdown when Skill is active */}
        {showStepGrid && (
          <div className="w-full space-y-1 text-xs md:text-sm font-bold text-slate-600 bg-sky-50 p-2 rounded-lg border border-sky-200">
            <div className="flex justify-between text-emerald-700">
              <span>일의 자리 ({topOnes} {operator} {bottomOnes})</span>
              <span>{onesResult}</span>
            </div>
            {(topTens > 0 || bottomTens > 0) && (
              <div className="flex justify-between text-indigo-700">
                <span>십의 자리 ({topTens}0 {operator} {bottomTens}0)</span>
                <span>{tensResult * 10}</span>
              </div>
            )}
            <div className="w-full border-b border-sky-300" />
          </div>
        )}

        {/* Answer Prompt Box */}
        <div className="text-right text-amber-600 font-jua text-xl md:text-2xl pt-1">
          <span>= ?</span>
        </div>
      </div>
    </div>
  );
};
