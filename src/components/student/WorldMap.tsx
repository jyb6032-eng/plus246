import React, { useState } from 'react';
import { StudentData, StageRecord } from '../../types';
import { STAGES_CONFIG } from '../../services/curriculumData';
import { getLevelProgress } from '../../services/gameData';
import { CharacterAvatar } from '../character/CharacterAvatar';
import { InventoryModal } from '../character/InventoryModal';
import { ShopModal } from '../character/ShopModal';
import { MonsterBookModal } from '../character/MonsterBookModal';
import { CharacterCreationModal } from '../character/CharacterCreationModal';
import {
  Map,
  Sparkles,
  Store,
  Backpack,
  BookOpen,
  UserCheck,
  Coins,
  LogOut,
  Star,
  Lock,
  Play,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface Props {
  student: StudentData;
  onSelectStage: (stageId: number) => void;
  onLogout: () => void;
  onUpdateStudent: (updated: StudentData) => void;
}

export const WorldMap: React.FC<Props> = ({
  student,
  onSelectStage,
  onLogout,
  onUpdateStudent,
}) => {
  const [activeModal, setActiveModal] = useState<'inventory' | 'shop' | 'monsters' | 'profile' | null>(null);

  // Total completed stages count
  const completedStagesCount = (Object.values(student.stages) as (StageRecord | undefined)[]).filter(s => s?.completed).length;

  const getStageStatus = (stageId: number) => {
    const record = student.stages[stageId];
    if (record?.completed) {
      return { isCompleted: true, isUnlocked: true, mastery: record.mastery, score: record.score };
    }
    // Stage 1 is always unlocked; subsequent stages unlocked if previous completed or player level >= stageId
    const isUnlocked = stageId === 1 || Boolean(student.stages[stageId - 1]?.completed) || student.character.level >= stageId;
    return { isCompleted: false, isUnlocked, mastery: undefined, score: 0 };
  };

  const expProgress = getLevelProgress(student.character.exp, student.character.level);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none font-sans">
      {/* Top RPG Player Status Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Avatar & Character Specs */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setActiveModal('profile')}
              title="캐릭터 정보 변경"
              className="hover:opacity-90 transition-opacity"
            >
              <CharacterAvatar character={student.character} size="md" showBadge={false} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded">
                  Lv.{student.character.level}
                </span>
                <span className="font-bold text-slate-900 text-sm md:text-base">
                  {student.character.nickname}
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  ({student.account.grade}학년 {student.account.classNo}반 {student.account.number}번 학생 · 아이디: {student.account.id})
                </span>
              </div>

              {/* EXP Progress Bar */}
              <div className="flex items-center gap-2 mt-1.5">
                <div
                  className="w-28 sm:w-44 bg-slate-200 h-2 rounded-full overflow-hidden"
                  title={`${expProgress.currentLevelExp}/${expProgress.neededInLevel} EXP (${expProgress.percent}%)`}
                >
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${expProgress.percent}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-indigo-600">
                  {expProgress.currentLevelExp}/{expProgress.neededInLevel} EXP ({expProgress.percent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Gold & Action Modal Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gold Pill */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-amber-900 font-bold text-xs">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{student.character.gold.toLocaleString()} G</span>
            </div>

            {/* Inventory Button */}
            <button
              onClick={() => setActiveModal('inventory')}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Backpack className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">인벤토리</span>
            </button>

            {/* Shop Button */}
            <button
              onClick={() => setActiveModal('shop')}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Store className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">상점</span>
            </button>

            {/* Monster Book Button */}
            <button
              onClick={() => setActiveModal('monsters')}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">도감</span>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors border border-transparent hover:border-rose-200"
              title="로그아웃"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* World Map Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Map Header Banner */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>1학년 2학기 덧셈과 뺄셈 탐험 지도</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              총 12개 차시를 순서대로 해결하며 덧셈·뺄셈 탐험대 마스터 칭호에 도전하세요!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-indigo-600 text-indigo-600" />
              <span>원정 진행률: {completedStagesCount}/12 ({Math.round((completedStagesCount / 12) * 100)}%)</span>
            </div>
          </div>
        </div>

        {/* 12 Stage Nodes Grid on the Fantasy Map */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {STAGES_CONFIG.map((stage) => {
            const { isCompleted, isUnlocked, mastery } = getStageStatus(stage.id);

            const masteryBadges: Record<string, { label: string; bg: string; text: string }> = {
              '완전정복': { label: '★★★ 완전정복', bg: 'bg-indigo-100', text: 'text-indigo-700' },
              '심화': { label: '★★ 심화', bg: 'bg-emerald-100', text: 'text-emerald-700' },
              '기본': { label: '★ 기본', bg: 'bg-slate-100', text: 'text-slate-700' },
              '보충': { label: '보충 완료', bg: 'bg-amber-100', text: 'text-amber-800' },
            };

            return (
              <div
                key={stage.id}
                className={`rounded-xl border p-4 flex flex-col justify-between transition-all relative overflow-hidden ${
                  isCompleted
                    ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                    : isUnlocked
                    ? 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  {/* Top Row: Stage Number & Location */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                      {stage.id}차시
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {stage.mapLocationName}
                    </span>
                  </div>

                  {/* Stage Title */}
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{stage.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{stage.subtitle}</p>

                  {/* Mastery Badge if completed */}
                  {isCompleted && mastery && (
                    <div className="mt-3">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${masteryBadges[mastery]?.bg || 'bg-slate-100'} ${masteryBadges[mastery]?.text || 'text-slate-800'}`}>
                        {masteryBadges[mastery]?.label || '완료'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-2xl">{stage.icon}</span>

                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => onSelectStage(stage.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors ${
                        isCompleted
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCompleted ? '다시 풀기' : '도전하기'}</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> 잠김
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modals */}
      {activeModal === 'inventory' && (
        <InventoryModal
          student={student}
          onClose={() => setActiveModal(null)}
          onUpdate={(up) => {
            onUpdateStudent(up);
          }}
        />
      )}

      {activeModal === 'shop' && (
        <ShopModal
          student={student}
          onClose={() => setActiveModal(null)}
          onUpdate={(up) => {
            onUpdateStudent(up);
          }}
        />
      )}

      {activeModal === 'monsters' && (
        <MonsterBookModal
          student={student}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'profile' && (
        <CharacterCreationModal
          student={student}
          isInitialSetup={false}
          onComplete={(up) => {
            onUpdateStudent(up);
            setActiveModal(null);
          }}
        />
      )}
    </div>
  );
};
