import React from 'react';
import { StudentData } from '../../types';
import { AnalysisService, ClassOverviewMetrics } from '../../services/analysisService';
import {
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Sparkles,
  Printer,
  Download,
  AlertTriangle,
  Flame,
  Shield,
  Wand2,
  HeartHandshake,
  Compass,
} from 'lucide-react';

interface Props {
  studentsMap: Record<string, StudentData>;
  onNavigateTab: (tab: string) => void;
  onOpenPrintCards: () => void;
}

export const TeacherOverview: React.FC<Props> = ({
  studentsMap,
  onNavigateTab,
  onOpenPrintCards,
}) => {
  const overview: ClassOverviewMetrics = AnalysisService.computeClassOverview(studentsMap);

  const handleExportCsv = () => {
    AnalysisService.exportLearningAnalyticsToCsv(studentsMap);
  };

  const totalStudents = overview.totalStudents;
  const advancedPercent = totalStudents > 0 ? Math.round((overview.levelDistribution.advanced / totalStudents) * 100) : 0;
  const basicPercent = totalStudents > 0 ? Math.round((overview.levelDistribution.basic / totalStudents) * 100) : 0;
  const remedialPercent = totalStudents > 0 ? Math.round((overview.levelDistribution.remedial / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Total & Active Students */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Total Students Active</h3>
            <div className="text-3xl font-bold text-slate-900">
              {overview.activeStudents} <span className="text-sm font-medium text-slate-400">/ {overview.totalStudents}명</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-emerald-600 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>활성화율 {totalStudents > 0 ? Math.round((overview.activeStudents / totalStudents) * 100) : 0}% 참여 중</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Class Average Progress */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Average Progress</h3>
            <div className="text-3xl font-bold text-indigo-600">
              {overview.averageProgressRate}%
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div className="bg-indigo-500 h-full transition-all" style={{ width: `${overview.averageProgressRate}%` }} />
            </div>
          </div>
        </div>

        {/* Metric 3: Class Average Accuracy */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Class Accuracy</h3>
            <div className="text-3xl font-bold text-slate-900">
              {overview.averageAccuracy}%
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-slate-500 text-xs font-medium">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>학급 평균 레벨 Lv.{overview.averageLevel}</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Math Monster Collection Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Monster Collection</h3>
            <div className="text-3xl font-bold text-slate-900">
              {overview.monsterCollectionRate}%
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-slate-500 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>평균 보상 {overview.averageGold} Gold</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Level Distribution & Job Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Level Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span>학급 덧셈·뺄셈 성취도 3단계 분포</span>
              </h3>
              <span className="text-xs font-medium text-slate-400">총 {totalStudents}명 대상</span>
            </div>

            <div className="space-y-4 my-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">심화 / 완전정복 ({overview.levelDistribution.advanced}명)</span>
                  <span className="font-bold text-indigo-600">{advancedPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all" style={{ width: `${advancedPercent}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">기본 도달 ({overview.levelDistribution.basic}명)</span>
                  <span className="font-bold text-emerald-600">{basicPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${basicPercent}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">보충 지도 필요 ({overview.levelDistribution.remedial}명)</span>
                  <span className="font-bold text-rose-600">{remedialPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-400 h-full transition-all" style={{ width: `${remedialPercent}%` }}></div>
                </div>
              </div>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 text-center">
                <span className="text-[11px] font-bold text-indigo-900 block">심화 학습자</span>
                <strong className="text-lg font-bold text-indigo-950">{overview.levelDistribution.advanced}명</strong>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-center">
                <span className="text-[11px] font-bold text-emerald-900 block">기본 학습자</span>
                <strong className="text-lg font-bold text-emerald-950">{overview.levelDistribution.basic}명</strong>
              </div>
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 text-center">
                <span className="text-[11px] font-bold text-rose-900 block">보충 학습자</span>
                <strong className="text-lg font-bold text-rose-950">{overview.levelDistribution.remedial}명</strong>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">집중 지도가 필요한 학생 확인</span>
            <button
              type="button"
              onClick={() => onNavigateTab('sos')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>SOS 학생 진단 목록 바로가기 &rarr;</span>
            </button>
          </div>
        </div>

        {/* RPG Job Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
              RPG 직업별 학생 분포
            </h3>

            <div className="flex flex-col gap-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <Shield className="w-3.5 h-3.5 text-amber-500" /> 전사 (콤보 유지)
                  </span>
                  <span className="font-bold text-slate-900">{overview.jobDistribution.warrior}명</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full"
                    style={{ width: `${totalStudents > 0 ? (overview.jobDistribution.warrior / totalStudents) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <Wand2 className="w-3.5 h-3.5 text-purple-500" /> 마법사 (심화 탐구)
                  </span>
                  <span className="font-bold text-slate-900">{overview.jobDistribution.wizard}명</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full"
                    style={{ width: `${totalStudents > 0 ? (overview.jobDistribution.wizard / totalStudents) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-500" /> 힐러 (오답 수정)
                  </span>
                  <span className="font-bold text-slate-900">{overview.jobDistribution.healer}명</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${totalStudents > 0 ? (overview.jobDistribution.healer / totalStudents) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <Compass className="w-3.5 h-3.5 text-indigo-500" /> 탐험가 (보너스 골드)
                  </span>
                  <span className="font-bold text-slate-900">{overview.jobDistribution.explorer}명</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full"
                    style={{ width: `${totalStudents > 0 ? (overview.jobDistribution.explorer / totalStudents) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>학생별 상세 이력 및 성장 관리</span>
            <button
              onClick={() => onNavigateTab('students')}
              className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              학생 목록 보기 &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts Banner */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <span>교사용 빠른 실행 도구</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            학생 배부용 로그인 카드를 인쇄하거나 종합 학습 분석 데이터를 CSV 형식으로 내보냅니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenPrintCards}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-2 border border-slate-200 transition-all"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>A4 학생 로그인 카드 인쇄</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>종합 분석 CSV 다운로드</span>
          </button>
        </div>
      </div>
    </div>
  );
};
