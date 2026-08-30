import React, { useState } from 'react';
import { DataService } from '../../services/dataService';
import { GraduationCap, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  onLoginSuccess: () => void;
  onBackToStudent: () => void;
}

export const TeacherLogin: React.FC<Props> = ({ onLoginSuccess, onBackToStudent }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = DataService.getTeacherPassword();

    if (password === correctPassword) {
      onLoginSuccess();
    } else {
      setError('선생님 관리자 비밀번호가 일치하지 않습니다. (기본: 0000)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 select-none font-sans">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">교사용 학습 관리 시스템</h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            1학년 2학기 덧셈과 뺄셈 진도, 오답 진단 및 실시간 SOS 피드백 포털
          </p>
        </div>

        <form onSubmit={handleTeacherLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>관리자 비밀번호 (기본: 0000)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 4자리 입력"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none text-sm text-slate-900 bg-slate-50"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>대시보드 접속</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onBackToStudent}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>학생 원정대 모드로 전환</span>
          </button>
        </div>
      </div>
    </div>
  );
};
