import React from 'react';
import { Problem } from '../../types';

interface Props {
  problem: Problem;
  highlight?: boolean;
}

export const MathVisualAid: React.FC<Props> = ({ problem, highlight }) => {
  const { visualAid, operator, num1, num2, num3, format } = problem;

  // 1. Split & Join Diagram (가르기와 모으기)
  if (format === 'split_join' || visualAid?.type === 'split_diagram') {
    const isJoin = operator === '+' || (operator === 'split_join' && problem.answer === (num1 + num2));
    const total = visualAid?.target ?? (isJoin ? (num1 + num2) : num1);

    // If joining (모으기): top node is unknown '?'
    // If splitting (가르기): one bottom branch is known, the other is unknown '?'
    const isTopUnknown = isJoin || problem.answer === total;
    const branch1 = isTopUnknown ? num1 : (visualAid?.count1 ?? num2);
    const branch2 = isTopUnknown ? num2 : '?';

    return (
      <div className="flex flex-col items-center my-3 p-4 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 shadow-sm">
        <span className="text-xs font-bold text-emerald-800 font-jua mb-2 flex items-center gap-1.5">
          <span>🌱</span>
          <span>{isTopUnknown ? '수 모으기' : '수 가르기'}</span>
        </span>

        {/* Top Node */}
        <div className={`w-14 h-14 rounded-full font-extrabold text-2xl flex items-center justify-center shadow-md border-2 border-white transition-all ${
          isTopUnknown
            ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-300 animate-pulse'
            : 'bg-emerald-500 text-white ring-2 ring-emerald-300'
        }`}>
          {isTopUnknown ? '?' : total}
        </div>

        {/* Connecting Branches */}
        <div className="flex items-center justify-center w-36 my-1">
          <svg className="w-36 h-8 text-emerald-400" viewBox="0 0 144 32">
            <path d="M 72 0 L 28 32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M 72 0 L 116 32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        {/* Bottom Nodes */}
        <div className="flex items-center justify-between w-40">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-950 font-bold text-xl flex items-center justify-center shadow border-2 border-emerald-400">
            {branch1}
          </div>
          <div className={`w-12 h-12 rounded-full font-bold text-xl flex items-center justify-center shadow border-2 transition-all ${
            branch2 === '?'
              ? 'bg-amber-400 text-amber-950 border-white ring-4 ring-amber-300 animate-pulse'
              : 'bg-emerald-100 text-emerald-950 border-emerald-400'
          }`}>
            {branch2}
          </div>
        </div>
      </div>
    );
  }

  // 2. 10-Frame Visualizer (10칸 상자)
  if (visualAid?.type === 'ten_frame' || (operator === '+' && (num1 + num2 === 10 || problem.answer === 10))) {
    const givenCount = Math.min(10, Math.max(0, num1));

    return (
      <div className="flex flex-col items-center my-3 p-3.5 rounded-2xl bg-teal-50 border-2 border-teal-300 shadow-sm">
        <span className="text-xs font-bold text-teal-800 font-jua mb-2 flex items-center gap-1.5">
          <span>🎁</span>
          <span>10칸 상자 짝꿍 수 (더해서 10 만들기)</span>
        </span>
        <div className="grid grid-cols-5 gap-1.5 p-2 bg-white rounded-xl border-2 border-teal-300 shadow-inner">
          {Array.from({ length: 10 }).map((_, i) => {
            const isFilled = i < givenCount;

            return (
              <div
                key={i}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center text-lg transition-transform ${
                  isFilled
                    ? 'bg-amber-400 border-amber-500 shadow-sm scale-95'
                    : 'bg-slate-50 border-dashed border-teal-400 text-teal-400 font-bold text-xs'
                }`}
              >
                {isFilled ? '🟡' : '?'}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs font-bold text-teal-900">
          <span className="text-amber-800 flex items-center gap-1">🟡 {givenCount}개 채움</span>
          <span className="text-slate-400">+</span>
          <span className="text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md font-jua">❓ 몇 개 더 필요할까요?</span>
          <span className="text-slate-400">=</span>
          <span className="text-teal-800 font-jua">10개 완성</span>
        </div>
      </div>
    );
  }

  // 3. Three-numbers addition or subtraction visual steps
  if (format === 'three_add' && num3 !== undefined) {
    return (
      <div className="flex flex-col items-center my-3 p-3 rounded-2xl bg-lime-50 border-2 border-lime-200 shadow-sm">
        <span className="text-xs font-bold text-lime-800 font-jua mb-1.5 flex items-center gap-1">
          <span>🍡</span>
          <span>세 수의 덧셈 순서 안내</span>
        </span>
        <div className="flex items-center gap-1 text-xs text-lime-900 font-bold bg-white/80 px-3 py-1.5 rounded-xl border border-lime-300">
          <span className="bg-lime-200 px-2 py-0.5 rounded text-lime-950">1단계: 앞의 두 수 먼저 더하기</span>
          <span>➔</span>
          <span className="bg-amber-100 px-2 py-0.5 rounded text-amber-950">2단계: 세 번째 수 더하기</span>
        </div>
      </div>
    );
  }

  if (format === 'three_sub' && num3 !== undefined) {
    return (
      <div className="flex flex-col items-center my-3 p-3 rounded-2xl bg-amber-50 border-2 border-amber-200 shadow-sm">
        <span className="text-xs font-bold text-amber-800 font-jua mb-1.5 flex items-center gap-1">
          <span>🍫</span>
          <span>세 수의 뺄셈 순서 안내</span>
        </span>
        <div className="flex items-center gap-1 text-xs text-amber-950 font-bold bg-white/80 px-3 py-1.5 rounded-xl border border-amber-300">
          <span className="bg-amber-200 px-2 py-0.5 rounded text-amber-950">1단계: 앞의 두 수 먼저 빼기</span>
          <span>➔</span>
          <span className="bg-rose-100 px-2 py-0.5 rounded text-rose-950">2단계: 남은 수 빼기</span>
        </div>
      </div>
    );
  }

  return null;
};

