import React, { useState } from 'react';
import { StudentData, JobType, CharacterAppearance } from '../../types';
import { JOB_INFO_LIST, SKILLS_LIST } from '../../services/gameData';
import { DataService } from '../../services/dataService';
import { CharacterAvatar } from './CharacterAvatar';
import { triggerConfetti } from '../common/ConfettiEffect';
import { Sparkles, CheckCircle, Shield, Wand2, HeartHandshake, Compass } from 'lucide-react';

interface Props {
  student: StudentData;
  onComplete: (updatedStudent: StudentData) => void;
  isInitialSetup?: boolean;
}

export const CharacterCreationModal: React.FC<Props> = ({
  student,
  onComplete,
  isInitialSetup = true,
}) => {
  const defaultNick = student.character.nickname || `${student.account.number}번 용사`;
  const [nickname, setNickname] = useState(defaultNick);
  const [selectedJob, setSelectedJob] = useState<JobType>(student.character.job || 'warrior');
  const [appearance, setAppearance] = useState<CharacterAppearance>({
    base: student.character.appearance?.base || 'boy1',
    hairStyle: student.character.appearance?.hairStyle || 'short',
    hairColor: student.character.appearance?.hairColor || 'black',
    outfit: student.character.appearance?.outfit || 'adventurer',
    skinTone: 'fair',
  });

  const tempCharacter = {
    ...student.character,
    nickname,
    job: selectedJob,
    appearance,
  };

  const handleSave = () => {
    if (!nickname.trim()) {
      alert('캐릭터 닉네임을 입력해 주세요!');
      return;
    }

    // Assign job starter weapon and skills if changed or initial
    const starterWeapons: Record<JobType, string> = {
      warrior: 'w_sword_1',
      wizard: 'm_staff_1',
      healer: 'h_staff_1',
      explorer: 'e_bow_1',
    };

    const starterWeapon = starterWeapons[selectedJob];
    const inventory = Array.from(new Set([...student.character.inventory, starterWeapon]));
    const initialSkills = SKILLS_LIST.filter(s => s.job === selectedJob && s.unlockLevel <= student.character.level).map(s => s.id);

    const updated: StudentData = {
      ...student,
      character: {
        ...student.character,
        nickname: nickname.trim(),
        job: selectedJob,
        appearance,
        inventory,
        equipment: {
          ...student.character.equipment,
          weapon: student.character.equipment.weapon || starterWeapon,
        },
        skills: Array.from(new Set([...student.character.skills, ...initialSkills])),
      },
      updatedAt: new Date().toISOString(),
    };

    DataService.saveStudentData(updated);
    triggerConfetti('huge');
    onComplete(updated);
  };

  const jobIcons: Record<JobType, React.ReactNode> = {
    warrior: <Shield className="w-6 h-6 text-amber-500" />,
    wizard: <Wand2 className="w-6 h-6 text-purple-500" />,
    healer: <HeartHandshake className="w-6 h-6 text-emerald-500" />,
    explorer: <Compass className="w-6 h-6 text-sky-500" />,
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border-4 border-amber-400 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 via-amber-400 to-amber-500 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-200 animate-spin" />
            <h2 className="text-xl md:text-2xl font-bold font-jua">
              {isInitialSetup ? '✨ 1학년 덧셈과 뺄셈 탐험대: 나만의 캐릭터 생성' : '🎨 캐릭터 스타일 변경'}
            </h2>
          </div>
          <span className="text-xs md:text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            {student.account.grade}학년 {student.account.classNo}반 {student.account.number}번 학생 (아이디: {student.account.id})
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Left Column: Live Preview & Nickname */}
          <div className="md:col-span-5 flex flex-col items-center bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 mb-3">캐릭터 실시간 미리보기</h3>
            <CharacterAvatar character={tempCharacter} size="xl" />

            <div className="w-full mt-5">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                용사 닉네임
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={8}
                placeholder="닉네임 입력 (최대 8자)"
                className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-center font-bold text-slate-800 focus:outline-none focus:border-amber-500 bg-white"
              />
            </div>

            {/* Selected Job Card Preview */}
            <div className="w-full mt-4 p-3 rounded-lg bg-white border border-slate-200 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1.5 font-bold text-slate-800">
                {jobIcons[selectedJob]}
                <span className="text-base font-jua">{JOB_INFO_LIST[selectedJob].name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {JOB_INFO_LIST[selectedJob].badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{JOB_INFO_LIST[selectedJob].growthBonus}</p>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="md:col-span-7 space-y-5">
            {/* 1. Job Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. 직업 선택 (나의 성장 스타일)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(JOB_INFO_LIST) as JobType[]).map((jobKey) => {
                  const job = JOB_INFO_LIST[jobKey];
                  const isSelected = selectedJob === jobKey;
                  return (
                    <button
                      key={jobKey}
                      type="button"
                      onClick={() => setSelectedJob(jobKey)}
                      className={`p-3 rounded-xl border-2 text-left transition-all relative ${
                        isSelected
                          ? `${job.bgColor} ${job.borderColor} ring-2 ring-amber-400 shadow-md`
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-emerald-500 absolute top-2 right-2" />
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{job.icon}</span>
                        <div>
                          <p className="font-bold text-sm text-slate-800">{job.name}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{job.badge}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Hair Style */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                2. 헤어 스타일
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'short', label: '단정한 숏' },
                  { id: 'twin', label: '양갈래 머리' },
                  { id: 'curly', label: '퐁퐁 곱슬' },
                  { id: 'wild', label: '역동 스타일' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAppearance({ ...appearance, hairStyle: item.id })}
                    className={`py-2 px-1 rounded-lg text-xs font-bold border-2 transition-all ${
                      appearance.hairStyle === item.id
                        ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Hair Color */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                3. 머리 색상
              </label>
              <div className="flex items-center gap-3">
                {[
                  { id: 'black', label: '흑발', bg: 'bg-slate-900' },
                  { id: 'brown', label: '갈색', bg: 'bg-amber-900' },
                  { id: 'blonde', label: '금발', bg: 'bg-yellow-400' },
                  { id: 'blue', label: '푸른색', bg: 'bg-blue-500' },
                  { id: 'pink', label: '핑크', bg: 'bg-pink-400' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    title={item.label}
                    onClick={() => setAppearance({ ...appearance, hairColor: item.id })}
                    className={`w-9 h-9 rounded-full ${item.bg} border-2 flex items-center justify-center transition-transform ${
                      appearance.hairColor === item.id
                        ? 'ring-4 ring-amber-400 scale-110 border-white'
                        : 'border-slate-300 hover:scale-105'
                    }`}
                  >
                    {appearance.hairColor === item.id && (
                      <CheckCircle className="w-4 h-4 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Outfit */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                4. 기본 의상
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'adventurer', label: '모험가 튜닉', color: 'bg-amber-500' },
                  { id: 'robe', label: '마법 로브', color: 'bg-purple-500' },
                  { id: 'sporty', label: '스포티 룩', color: 'bg-sky-500' },
                  { id: 'formal', label: '단정한 제복', color: 'bg-slate-700' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAppearance({ ...appearance, outfit: item.id })}
                    className={`py-2 px-1 rounded-lg text-xs font-bold border-2 transition-all flex flex-col items-center gap-1 ${
                      appearance.outfit === item.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${item.color}`} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="rpg-btn px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold font-jua text-lg shadow-lg border-b-4 border-amber-800 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-yellow-200" />
            {isInitialSetup ? '모험 시작하기!' : '스타일 저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
};
