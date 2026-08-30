import React, { useState } from 'react';
import { StudentData } from '../../types';
import { AnalysisService, StageStatSummary, VulnerableStageInsight } from '../../services/analysisService';
import { STAGES_CONFIG } from '../../services/curriculumData';
import {
  BarChart2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  PieChart,
  BookOpen,
  TrendingDown,
  Info,
} from 'lucide-react';

interface Props {
  studentsMap: Record<string, StudentData>;
}

export const TeacherStageAnalysis: React.FC<Props> = ({ studentsMap }) => {
  const stageStats: StageStatSummary[] = AnalysisService.computeStageStats(studentsMap);
  const vulnerableStages: VulnerableStageInsight[] = AnalysisService.getTop3VulnerableStages(studentsMap);
  const errorTypes = AnalysisService.computeErrorTypeBreakdown(studentsMap);

  const [selectedStageId, setSelectedStageId] = useState<number>(1);
  const selectedStageConfig = STAGES_CONFIG.find(s => s.id === selectedStageId) || STAGES_CONFIG[0];
  const selectedStageStat = stageStats.find(s => s.stageId === selectedStageId) || stageStats[0];

  return (
    <div className="space-y-6">
      {/* Top Section: Top 3 Vulnerable Stages & Pedagogical Suggestions */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            학급 취약 차시 TOP 3 및 맞춤형 보충 지도 제안
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          학급 전체 오답률과 반복 오답 패턴을 분석하여 신속한 지도가 필요한 영역을 도출했습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vulnerableStages.map((vuln, idx) => {
            const ranks = ['1위 (집중 지도)', '2위', '3위'];
            const badgeClasses = [
              'bg-rose-100 text-rose-700 border-rose-200',
              'bg-amber-100 text-amber-800 border-amber-200',
              'bg-slate-100 text-slate-700 border-slate-200',
            ];

            return (
              <div
                key={vuln.stageId}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeClasses[idx]}`}>
                      {ranks[idx]}
                    </span>
                    <span className="text-xs font-bold text-rose-600">
                      오답률 {vuln.errorRate}%
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">
                    {vuln.stageId}차시: {vuln.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    주요 오답 유형: <strong className="text-indigo-600 font-semibold">{vuln.dominantError}</strong>
                  </p>

                  {/* Pedagogical Guidance Tip */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 space-y-1">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span>교사용 지도 가이드:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      {vuln.pedagogicalSuggestion}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                  <span>집중 대상 학생</span>
                  <strong className="text-slate-800 font-semibold">{vuln.affectedStudentsCount}명</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Section: 1~12 Stages Matrix */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <span>1~12차시별 덧셈·뺄셈 학습 현황 및 정답률 매트릭스</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              차시 카드를 클릭하여 상세 학습 지표와 취약 요소를 확인하세요.
            </p>
          </div>
        </div>

        {/* 12 Stage Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {stageStats.map((st) => {
            const isSelected = selectedStageId === st.stageId;
            return (
              <button
                key={st.stageId}
                type="button"
                onClick={() => setSelectedStageId(st.stageId)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded">
                    {st.stageId}차시
                  </span>
                  <span className="text-xs font-bold text-indigo-600">
                    {st.averageAccuracy}%
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{st.locationName}</p>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full ${
                      st.averageAccuracy >= 80 ? 'bg-emerald-500' : st.averageAccuracy >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${st.averageAccuracy}%` }}
                  />
                </div>

                <div className="mt-2 text-[10px] text-slate-400 flex justify-between">
                  <span>완료 {st.completedStudentsCount}명</span>
                  <span>보충 {st.remedialCount}명</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Deep-Dive Banner */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xl p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                {selectedStageConfig.icon}
              </span>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {selectedStageConfig.id}차시: {selectedStageConfig.title} ({selectedStageConfig.mapLocationName})
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{selectedStageConfig.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 flex-wrap">
            <div>평균 정답률: <strong className="text-indigo-600 text-sm font-bold">{selectedStageStat.averageAccuracy}%</strong></div>
            <div>평균 재시도: <strong className="text-slate-900">{selectedStageStat.averageRetries}회</strong></div>
            <div>평균 힌트: <strong className="text-indigo-600">{selectedStageStat.averageHints}회</strong></div>
            <div>주요 오류: <strong className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">{selectedStageStat.dominantError}</strong></div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Calculation Error Type Breakdown */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <PieChart className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            연산 오류 유형별 발생 비율 분석
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          학생들의 풀이 로그에서 수집된 자동 진단 오답 원인 분석입니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {errorTypes.map((err) => (
            <div key={err.type} className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-800">{err.type}</span>
                  <span className="text-xs font-bold text-indigo-600 font-mono">{err.percent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${err.percent}%` }} />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-right">총 {err.count}건</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
