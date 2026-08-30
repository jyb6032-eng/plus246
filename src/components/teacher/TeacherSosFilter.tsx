import React from 'react';
import { StudentData } from '../../types';
import { AnalysisService, SosStudentInsight } from '../../services/analysisService';
import { CharacterAvatar } from '../character/CharacterAvatar';
import {
  AlertTriangle,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

interface Props {
  studentsMap: Record<string, StudentData>;
  onSelectStudent: (student: StudentData) => void;
}

export const TeacherSosFilter: React.FC<Props> = ({ studentsMap, onSelectStudent }) => {
  const sosList: SosStudentInsight[] = AnalysisService.detectSosStudents(studentsMap);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              SOS 집중 보충 지도 대상 학생 진단
            </h3>
          </div>
          <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-md">
            {sosList.length}명 감지됨
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
          동일 오답 3회 이상 반복, 힌트 과다 의존, 보충 단계 연속 정체, 학급 평균 대비 현저히 낮은 정답률을 보이는 학생을 자동 진단하여 1:1 맞춤 피드백을 지원합니다.
        </p>
      </div>

      {/* SOS Students Cards Grid */}
      {sosList.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-900">현재 SOS 지도 대상 학생이 없습니다.</h4>
          <p className="text-xs text-slate-500 mt-1">학급 전체 학생이 안정적인 정답률과 진도를 유지하고 있습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sosList.map((sos) => {
            const { student, reasons, dominantErrorType, urgencyLevel } = sos;
            const totalSolved = student.totalCorrect + student.totalWrong;
            const acc = totalSolved > 0 ? Math.round((student.totalCorrect / totalSolved) * 100) : 0;

            return (
              <div
                key={student.account.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <CharacterAvatar character={student.character} size="sm" showBadge={false} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">
                            {student.account.number}번 {student.account.name}
                          </h4>
                          <span className="text-xs text-slate-400 font-mono">({student.account.id})</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Lv.{student.character.level} · {student.character.job === 'warrior' ? '전사' : student.character.job === 'wizard' ? '마법사' : student.character.job === 'healer' ? '힐러' : '탐험가'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        urgencyLevel === 'high'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {urgencyLevel === 'high' ? '긴급 지도 대상' : '관심 관찰 대상'}
                    </span>
                  </div>

                  {/* Acc & Dominant Error Summary */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-slate-500">학습 정답률:</span>{' '}
                      <strong className="text-rose-600 font-bold text-sm">{acc}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">취약 오류:</span>{' '}
                      <strong className="text-indigo-600 font-semibold">{dominantErrorType}</strong>
                    </div>
                  </div>

                  {/* Diagnostic Reasons List */}
                  <div className="space-y-1.5 mb-3">
                    <span className="text-xs font-semibold text-slate-700 block">진단 원인:</span>
                    {reasons.map((r, i) => (
                      <div key={i} className="text-[11px] text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200/80 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  {/* Suggested Intervention */}
                  <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs text-slate-700 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-indigo-900">지도 가이드:</strong> 세로셈 보조 격자선을 활용하여 <strong>{dominantErrorType}</strong> 계산 절차를 1:1로 직접 피드백해 주세요.
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onSelectStudent(student)}
                    className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>학생 오답노트 & 칭찬 보상 열기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
