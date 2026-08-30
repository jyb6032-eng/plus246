import React, { useState } from 'react';
import { StudentData } from '../../types';
import { DataService } from '../../services/dataService';
import { Sparkles, Shield, User, Lock, ArrowRight, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';

interface Props {
  onLoginSuccess: (student: StudentData) => void;
  onSwitchToTeacher: () => void;
}

export const StudentLogin: React.FC<Props> = ({ onLoginSuccess, onSwitchToTeacher }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('1234');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Quick Demo Account Helpers
  const studentsMap = DataService.getAllStudents();
  const demoStudents = Object.values(studentsMap).slice(0, 8);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const trimmedId = studentId.trim();
    if (!trimmedId) {
      setLoginError('학생 아이디를 입력해 주세요.');
      return;
    }

    const student = DataService.getStudentData(trimmedId);
    if (!student) {
      setLoginError('등록되지 않은 학생 아이디입니다. 번호나 아이디를 확인해 주세요.');
      return;
    }

    if (student.account.password && student.account.password !== password) {
      setLoginError('비밀번호가 일치하지 않습니다. (기본: 1234)');
      return;
    }

    onLoginSuccess(student);
  };

  const handleDemoClick = (st: StudentData) => {
    onLoginSuccess(st);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 select-none font-sans">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl p-8 relative overflow-hidden">
        {/* Top Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>초등 1학년 2학기 덧셈과 뺄셈 맞춤형 학습 RPG</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            수학 RPG 마스터: 덧셈과 뺄셈 탐험대
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">
            차시별 모험에 참여하여 나만의 캐릭터를 키우고 덧셈과 뺄셈을 정복하세요!
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>학생 아이디 (예: 1401)</span>
              </span>
              <span className="text-[11px] font-normal text-indigo-600">
                1학년 4반 1번 = 1401
              </span>
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="예: 1401 또는 1415 (번호 입력)"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none text-sm text-slate-900 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>비밀번호 (기본: 1234)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none text-sm text-slate-900 bg-slate-50"
            />
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>탐험 시작하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Test Account Selector */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>테스트용 학생 계정 빠른 선택</span>
            </span>
            <span className="text-[10px] text-slate-400">클릭 즉시 접속</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {demoStudents.map((st) => {
              const jobIcons = { warrior: '⚔️', wizard: '🔮', healer: '🌿', explorer: '🏹' };
              return (
                <button
                  key={st.account.id}
                  type="button"
                  onClick={() => handleDemoClick(st)}
                  className="p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 text-left transition-all text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 line-clamp-1">{st.account.id}번</span>
                    <span className="text-xs">{jobIcons[st.character.job]}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {st.account.number}번 학생 · Lv.{st.character.level}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Switch to Teacher Dashboard */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onSwitchToTeacher}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>교사용 관리자 대시보드 로그인 (비밀번호: 0000)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
