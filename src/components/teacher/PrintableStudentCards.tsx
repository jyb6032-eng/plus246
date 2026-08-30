import React from 'react';
import { StudentData } from '../../types';
import { Printer, X, Sparkles, Shield, User, Lock } from 'lucide-react';

interface Props {
  students: StudentData[];
  onClose: () => void;
}

export const PrintableStudentCards: React.FC<Props> = ({ students, onClose }) => {
  const sortedStudents = [...students].sort((a, b) => a.account.number - b.account.number);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-5xl w-full border-4 border-amber-400 shadow-2xl p-6 print:border-none print:shadow-none print:p-0 max-h-[90vh] overflow-y-auto print:max-h-none">
        {/* Print Toolbar (Hidden during actual print) */}
        <div className="no-print mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-bold text-sm text-slate-800 font-jua">
                🖨️ A4 학생 로그인 안내 카드 인쇄 미리보기 ({sortedStudents.length}명)
              </h3>
              <p className="text-xs text-slate-500">
                A4 한 장에 8장의 학생 원정대 카드가 깔끔하게 인쇄되도록 규격이 맞추어져 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="rpg-btn px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>A4 인쇄하기</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
            >
              닫기
            </button>
          </div>
        </div>

        {/* Printable Grid of Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 print:grid-cols-2 gap-4 print:gap-3">
          {sortedStudents.map((s) => {
            const jobIcons = { warrior: '⚔️ 전사', wizard: '🔮 마법사', healer: '🌿 힐러', explorer: '🏹 탐험가' };
            return (
              <div
                key={s.account.id}
                className="a4-print-card border-2 border-dashed border-slate-400 p-4 rounded-xl bg-white flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                  <div>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                      수학 RPG 덧셈과 뺄셈 탐험대
                    </span>
                    <h4 className="font-bold text-sm text-slate-800 mt-1">
                      {s.account.grade}학년 {s.account.classNo}반 {s.account.number}번
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black font-jua text-indigo-900">{s.account.number}번 학생</span>
                    <p className="text-[10px] text-slate-500 font-semibold">{jobIcons[s.character.job]}</p>
                  </div>
                </div>

                {/* Credentials */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1.5 my-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-indigo-600" /> 아이디:
                    </span>
                    <span className="font-mono font-black text-indigo-900 bg-white px-2.5 py-0.5 rounded border border-indigo-200 text-sm">
                      {s.account.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-indigo-600" /> 비밀번호:
                    </span>
                    <span className="font-mono font-black text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {s.account.password}
                    </span>
                  </div>
                </div>

                {/* Footer instructions */}
                <div className="text-[9px] text-slate-400 text-center mt-2 border-t border-slate-100 pt-1.5">
                  ⭐ 학생 아이디({s.account.id})와 비밀번호를 입력해 탐험에 참여하세요! (개인정보 보호 번호 계정)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
