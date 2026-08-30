import React, { useState } from 'react';
import { StudentData } from '../../types';
import { MATH_MONSTERS } from '../../services/gameData';
import { STAGES_CONFIG } from '../../services/curriculumData';
import { BookOpen, Sparkles, X, Lock, CheckCircle2, Flame, Droplets, Leaf, Sun, Moon, Zap } from 'lucide-react';

interface Props {
  student: StudentData;
  onClose: () => void;
}

export const MonsterBookModal: React.FC<Props> = ({ student, onClose }) => {
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>(MATH_MONSTERS[0].id);

  const collectedCount = student.character.mathMonsters.length;
  const totalCount = MATH_MONSTERS.length;
  const progressPercent = Math.round((collectedCount / totalCount) * 100);

  const selectedMonster = MATH_MONSTERS.find(m => m.id === selectedMonsterId) || MATH_MONSTERS[0];
  const isSelectedUnlocked = student.character.mathMonsters.includes(selectedMonster.id);

  const elementIcons: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    fire: { icon: <Flame className="w-4 h-4" />, color: 'bg-rose-100 text-rose-700', label: '불꽃' },
    water: { icon: <Droplets className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700', label: '물결' },
    nature: { icon: <Leaf className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-700', label: '자연' },
    light: { icon: <Sun className="w-4 h-4" />, color: 'bg-amber-100 text-amber-700', label: '빛' },
    dark: { icon: <Moon className="w-4 h-4" />, color: 'bg-purple-100 text-purple-700', label: '어둠' },
    thunder: { icon: <Zap className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-700', label: '번개' },
  };

  const getStageName = (stageId: number) => {
    const found = STAGES_CONFIG.find(s => s.id === stageId);
    return found ? `${stageId}차시 [${found.mapLocationName}]` : `${stageId}차시`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full border-4 border-emerald-400 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-200" />
            <h2 className="text-xl md:text-2xl font-bold font-jua">📖 수학몬 도감 & 수호 정령</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/60 px-3 py-1 rounded-full text-xs font-bold text-emerald-300 border border-emerald-400">
              수집률 {collectedCount}/{totalCount} ({progressPercent}%)
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto flex-1">
          {/* Left: Monster List Grid */}
          <div className="md:col-span-7 flex flex-col">
            <h3 className="text-xs font-bold text-slate-500 mb-2">차시별 수학몬 목록</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto p-1">
              {MATH_MONSTERS.map((monster) => {
                const unlocked = student.character.mathMonsters.includes(monster.id);
                const isSelected = selectedMonsterId === monster.id;
                return (
                  <button
                    key={monster.id}
                    onClick={() => setSelectedMonsterId(monster.id)}
                    className={`p-2.5 rounded-xl border-2 text-center flex flex-col items-center justify-between transition-all relative ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-300'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    } ${!unlocked ? 'opacity-60 bg-slate-50' : ''}`}
                  >
                    {unlocked ? (
                      <span className="text-3xl mb-1">{monster.icon}</span>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center mb-1 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1">
                      {unlocked ? monster.name : `${monster.stageId}차시 미발견`}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5">
                      {monster.stageId}차시
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Monster Details */}
          <div className="md:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            {isSelectedUnlocked ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 수집 완료
                  </span>
                  <div className="flex items-center gap-1">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${elementIcons[selectedMonster.element].color}`}>
                      {elementIcons[selectedMonster.element].icon}
                      {elementIcons[selectedMonster.element].label}
                    </span>
                  </div>
                </div>

                <div className="text-center py-4">
                  <div className="text-6xl mb-2 drop-shadow-md animate-bounce">{selectedMonster.icon}</div>
                  <h4 className="text-lg font-bold font-jua text-slate-800">{selectedMonster.name}</h4>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                    서식지: {getStageName(selectedMonster.stageId)}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 my-2">
                  <p className="text-xs text-slate-600 leading-relaxed">{selectedMonster.description}</p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 mt-2">
                  <p className="text-xs font-bold text-emerald-900 italic">
                    💬 "{selectedMonster.quote}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 mb-3">
                  <Lock className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-700 mb-1">
                  {selectedMonster.stageId}차시 완료 시 해금!
                </h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  {getStageName(selectedMonster.stageId)}의 모든 문제를 해결하고 수호 정령을 동료로 영입하세요!
                </p>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>차시 클리어 보너스</span>
              <span className="font-bold text-amber-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> +{selectedMonster.bonusExp} EXP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
