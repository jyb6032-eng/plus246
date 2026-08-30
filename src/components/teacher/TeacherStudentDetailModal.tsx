import React, { useState } from 'react';
import { StudentData, StageRecord, StudentRemark } from '../../types';
import { STAGES_CONFIG } from '../../services/curriculumData';
import { GameService } from '../../services/gameService';
import { DataService } from '../../services/dataService';
import { GeminiService } from '../../services/geminiService';
import { CharacterAvatar } from '../character/CharacterAvatar';
import { triggerConfetti } from '../common/ConfettiEffect';
import {
  X,
  Sparkles,
  Award,
  Coins,
  Zap,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Gift,
  Crown,
  Star,
  Flame,
  Bot,
  Copy,
  Check,
  Edit3,
  Save,
  RotateCw,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  student: StudentData;
  onClose: () => void;
  onUpdate: () => void;
}

export const TeacherStudentDetailModal: React.FC<Props> = ({ student, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'stages' | 'wrong' | 'ai_remark' | 'rewards'>('stages');
  const [rewardNotice, setRewardNotice] = useState<string | null>(null);

  // AI Remark State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isEditingRemark, setIsEditingRemark] = useState(false);
  const [remarkText, setRemarkText] = useState(student.remark?.evaluationText || '');
  const [dominantTrait, setDominantTrait] = useState(student.remark?.dominantTrait || '');
  const [copied, setCopied] = useState(false);

  const handleGrantReward = (type: 'sticker' | 'exp50' | 'gold50' | 'special_item' | 'special_title') => {
    const res = GameService.grantTeacherReward(student.account.id, type);
    if (res.success) {
      setRewardNotice(res.message);
      triggerConfetti('small');
      onUpdate();
    }
  };

  const handleGenerateRemark = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const res = await GeminiService.generateStudentRemark(
        student,
        student.remark?.evaluationText
      );

      if (res.success && res.remark) {
        const newRemark: StudentRemark = {
          evaluationText: res.remark,
          dominantTrait: res.dominantTrait || '성실 탐구형',
          keyStrengths: res.keyStrengths || ['계산 원리 습득'],
          generatedAt: new Date().toISOString(),
          isEditedByUser: false,
        };
        DataService.updateStudentRemark(student.account.id, newRemark);
        setRemarkText(res.remark);
        setDominantTrait(newRemark.dominantTrait);
        setIsEditingRemark(false);
        triggerConfetti('small');
        onUpdate();
      } else {
        setGenerationError(res.error || '평어 생성에 실패했습니다.');
      }
    } catch (err: any) {
      setGenerationError(err.message || '평어 생성 중 통신 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRemark = () => {
    if (!remarkText.trim()) return;
    const updated: StudentRemark = {
      evaluationText: remarkText.trim(),
      dominantTrait: dominantTrait.trim() || student.remark?.dominantTrait || '성실 탐구형',
      keyStrengths: student.remark?.keyStrengths || ['계산 원리 습득', '꾸준한 참여'],
      generatedAt: student.remark?.generatedAt || new Date().toISOString(),
      isEditedByUser: true,
    };
    DataService.updateStudentRemark(student.account.id, updated);
    setIsEditingRemark(false);
    onUpdate();
  };

  const handleCopyRemark = () => {
    const textToCopy = remarkText || student.remark?.evaluationText;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Collect all wrong questions across all stages
  const allWrongQuestions = (Object.values(student.stages) as StageRecord[]).flatMap((stage: StageRecord) =>
    (stage.wrongQuestions || []).map(wq => ({ ...wq, stageId: stage.stageId }))
  );

  const totalSolved = student.totalCorrect + student.totalWrong;
  const accuracy = totalSolved > 0 ? Math.round((student.totalCorrect / totalSolved) * 100) : 0;
  const completedStagesCount = (Object.values(student.stages) as StageRecord[]).filter(s => s.completed).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border-4 border-indigo-500 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CharacterAvatar character={student.character} size="sm" showBadge={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">
                  Lv.{student.character.level}
                </span>
                <h3 className="text-lg font-bold font-jua">
                  {student.account.grade}학년 {student.account.classNo}반 {student.account.number}번 학생
                </h3>
                <span className="text-xs text-slate-400">({student.character.nickname})</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                아이디: {student.account.id} · 초기 비밀번호: {student.account.password}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('ai_remark');
                if (!student.remark?.evaluationText) {
                  handleGenerateRemark();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI 평어 생성</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold text-slate-700">
          <div>전체 정답률: <span className="text-indigo-700 font-extrabold">{accuracy}%</span> ({student.totalCorrect}정답/{student.totalWrong}오답)</div>
          <div>학습 진도: <span className="text-emerald-700 font-extrabold">{completedStagesCount}/12 차시</span> 완료</div>
          <div>총 재도전/힌트: <span className="text-purple-700 font-extrabold">{student.totalRetries}회</span> / {student.totalHints}회</div>
          <div>수학몬 수집: <span className="text-amber-600 font-extrabold">{student.character.mathMonsters.length}/12</span></div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-4 text-xs font-bold pt-2 bg-slate-50">
          {[
            { id: 'stages', label: '1~12차시 성취도', icon: <Star className="w-4 h-4" /> },
            { id: 'wrong', label: `오답 노트 (${allWrongQuestions.length})`, icon: <AlertTriangle className="w-4 h-4 text-rose-500" /> },
            { id: 'ai_remark', label: 'AI 수학 평어 생성', icon: <Sparkles className="w-4 h-4 text-amber-500" />, badge: student.remark ? '작성됨' : undefined },
            { id: 'rewards', label: '선생님 칭찬 보상', icon: <Gift className="w-4 h-4 text-indigo-500" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Tab 1: Stages Progress */}
          {activeTab === 'stages' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {STAGES_CONFIG.map((st) => {
                const rec = student.stages[st.id];
                const isDone = rec?.completed;
                return (
                  <div
                    key={st.id}
                    className={`p-3 rounded-xl border-2 flex flex-col justify-between ${
                      isDone ? 'bg-white border-emerald-300' : 'bg-slate-50 border-slate-200 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-700">{st.id}차시</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {rec?.mastery || '미완료'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{st.title}</p>
                      <p className="text-[10px] text-slate-500">{st.mapLocationName}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex justify-between">
                      <span>정답: {rec?.correctCount || 0} / 오답: {rec?.wrongCount || 0}</span>
                      <span>힌트: {rec?.hintCount || 0}회</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Wrong Questions Note */}
          {activeTab === 'wrong' && (
            <div>
              {allWrongQuestions.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <CheckCircle className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                  <p className="font-bold text-sm text-slate-700">기록된 오답이 없습니다!</p>
                  <p className="text-xs text-slate-400 mt-1">모든 문제를 한 번에 정확하게 해결했습니다.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
                  {allWrongQuestions.map((wq, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                            {wq.stageId}차시
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {wq.problem}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 flex items-center gap-3 mt-1">
                          <span>학생 입력: <strong className="text-rose-600">{wq.studentAns}</strong></span>
                          <span>정답: <strong className="text-emerald-700">{wq.correctAns}</strong></span>
                          {wq.errorType && (
                            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              진단: {wq.errorType}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 font-semibold">
                        재도전 {wq.retryCount}회
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: AI Math Remark Generation */}
          {activeTab === 'ai_remark' && (
            <div className="space-y-5">
              {/* Analytics Summary Card */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-extrabold text-sm text-indigo-950">
                      {student.account.name} 학생 다면 학습 데이터 분석 요약
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-md border border-indigo-200 shadow-2xs">
                    Gemini 3.7 Flash 연동
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                    <span className="text-slate-500 text-[10px] block">성취도 / 정답률</span>
                    <strong className="text-slate-800 text-xs">
                      {accuracy}% ({completedStagesCount}/12 차시)
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                    <span className="text-slate-500 text-[10px] block">오답 수정력</span>
                    <strong className="text-indigo-700 text-xs">
                      {student.totalRetries > 0 ? `재도전 ${student.totalRetries}회 극복` : '원샷 해결'}
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                    <span className="text-slate-500 text-[10px] block">주요 오답 유형</span>
                    <strong className="text-rose-600 text-xs truncate block">
                      {allWrongQuestions[0]?.errorType || '특이 오답 없음'}
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                    <span className="text-slate-500 text-[10px] block">도전/창의 과제</span>
                    <strong className="text-emerald-700 text-xs">
                      보스/확장 미션 참여
                    </strong>
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {generationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{generationError}</span>
                </div>
              )}

              {/* Generation State / Content */}
              {isGenerating ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-indigo-300">
                  <RotateCw className="w-8 h-8 mx-auto text-indigo-600 animate-spin mb-3" />
                  <p className="font-bold text-sm text-indigo-900">
                    Gemini AI가 {student.account.name} 학생의 맞춤형 수학 평어를 작성 중입니다...
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    정답률, 오류 극복 과정, 차시별 도달 수준을 종합하여 긍정적 성장 문장을 생성합니다.
                  </p>
                </div>
              ) : student.remark?.evaluationText || remarkText ? (
                <div className="space-y-4">
                  {/* Generated Card */}
                  <div className="bg-white border-2 border-indigo-200 rounded-xl p-5 shadow-xs space-y-3">
                    {/* Header info inside card */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold border border-indigo-200">
                          {dominantTrait || student.remark?.dominantTrait || '성실 탐구형'}
                        </span>
                        {student.remark?.keyStrengths?.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {student.remark?.isEditedByUser ? (
                          <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            교사 직접 수정본
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            AI 자동 생성
                          </span>
                        )}
                        <span>{student.remark?.generatedAt ? student.remark.generatedAt.slice(0, 10) : ''}</span>
                      </div>
                    </div>

                    {/* Text Area (Editing vs Display) */}
                    {isEditingRemark ? (
                      <div className="space-y-2">
                        <textarea
                          rows={4}
                          value={remarkText}
                          onChange={(e) => setRemarkText(e.target.value)}
                          placeholder="수정할 수학 평어를 입력하세요..."
                          className="w-full text-sm p-3 border-2 border-indigo-400 rounded-lg focus:outline-none leading-relaxed text-slate-800"
                        />
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <span>글자수: {remarkText.length}자</span>
                          <span className="text-indigo-600 font-medium">
                            * 생활기록부 문체(~함, ~보임)로 작성해 주세요.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                          {remarkText || student.remark?.evaluationText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Operational Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleGenerateRemark}
                        disabled={isGenerating}
                        className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-indigo-200 transition-colors"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>다시 생성 (어휘·문장 변경)</span>
                      </button>

                      {isEditingRemark ? (
                        <button
                          type="button"
                          onClick={handleSaveRemark}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>저장하기</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setRemarkText(student.remark?.evaluationText || '');
                            setDominantTrait(student.remark?.dominantTrait || '');
                            setIsEditingRemark(true);
                          }}
                          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>수정하기</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyRemark}
                      className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                        copied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? '클립보드 복사 완료!' : '평어 복사하기'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty state when no remark exists */
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800">
                      아직 생성된 AI 수학 평어가 없습니다
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Gemini API를 통해 학생의 덧셈·뺄셈 성취도, 오답 교정 과정, 심화 문제 해결력을 분석하여 생활기록부용 맞춤 평어를 즉시 생성합니다.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateRemark}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-extrabold shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>지금 AI 수학 평어 생성하기</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Rewards Granting */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                선생님이 학생에게 즉각적인 칭찬 스티커, 경험치, 골드, 또는 특별 아이템을 지급하여 학습 동기를 북돋아 줍니다.
              </p>

              {rewardNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{rewardNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleGrantReward('sticker')}
                  className="p-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-left transition-all flex items-center gap-3"
                >
                  <span className="text-3xl">🌟</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">칭찬 스티커 지급</h4>
                    <p className="text-xs text-slate-500">+20 EXP & +20 Gold 즉시 지급</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGrantReward('exp50')}
                  className="p-3.5 rounded-xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 text-left transition-all flex items-center gap-3"
                >
                  <span className="text-3xl">⚡</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">성장 부스터 (+50 EXP)</h4>
                    <p className="text-xs text-slate-500">레벨 업 촉진용 추가 경험치</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGrantReward('gold50')}
                  className="p-3.5 rounded-xl bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-300 text-left transition-all flex items-center gap-3"
                >
                  <span className="text-3xl">💰</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">격려 보상금 (+50 Gold)</h4>
                    <p className="text-xs text-slate-500">상점 장비 구매 지원금</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGrantReward('special_item')}
                  className="p-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 text-left transition-all flex items-center gap-3"
                >
                  <span className="text-3xl">🎁</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">전설의 문제 해결책 하사</h4>
                    <p className="text-xs text-slate-500">선생님 전용 특별 드롭 희귀 장신구</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGrantReward('special_title')}
                  className="p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-left transition-all flex items-center gap-3 sm:col-span-2"
                >
                  <span className="text-3xl">👑</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">특별 칭호 수여</h4>
                    <p className="text-xs text-slate-500">[선생님의 자랑스러운 수제자] 칭호 부여</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

