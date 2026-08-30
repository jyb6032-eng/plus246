import React, { useState, useEffect } from 'react';
import { StudentData, Problem, StageRecord, WrongQuestionRecord, ProblemType } from '../../types';
import { STAGES_CONFIG } from '../../services/curriculumData';
import { LearningService, GradingResult } from '../../services/learningService';
import { GameService, RewardResult } from '../../services/gameService';
import { getLevelProgress } from '../../services/gameData';
import { DataService } from '../../services/dataService';
import { GoogleSheetService } from '../../services/googleSheetService';
import { CharacterAvatar } from '../character/CharacterAvatar';
import { VerticalMathGrid } from './VerticalMathGrid';
import { MathVisualAid } from './MathVisualAid';
import { Scratchpad } from './Scratchpad';
import { triggerConfetti } from '../common/ConfettiEffect';
import {
  Sparkles,
  ArrowLeft,
  PenTool,
  RotateCcw,
  Delete,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Trophy,
  Flame,
  Coins,
  Crown,
  ChevronRight,
  ShieldAlert,
  Zap,
  BookOpen,
} from 'lucide-react';

interface Props {
  student: StudentData;
  stageId: number;
  onBackToMap: () => void;
  onUpdateStudent: (updated: StudentData) => void;
}

export const MathStagePlay: React.FC<Props> = ({
  student,
  stageId,
  onBackToMap,
  onUpdateStudent,
}) => {
  const stageConfig = STAGES_CONFIG.find(s => s.id === stageId) || STAGES_CONFIG[0];

  // Base 15 problems
  const [baseProblems] = useState<Problem[]>(() => LearningService.getStageProblems(stageId));
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
  const [currentProblem, setCurrentProblem] = useState<Problem>(() => baseProblems[0] || LearningService.generateDynamicProblem(stageId));
  const [isEndlessMode, setIsEndlessMode] = useState<boolean>(false);
  const [endlessCounter, setEndlessCounter] = useState<number>(1);

  // Input & Scratchpad State
  const [studentInput, setStudentInput] = useState<string>('');
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<GradingResult | null>(null);
  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);

  // Active Job Skills in play
  const [highlightDigitsActive, setHighlightDigitsActive] = useState<boolean>(false);
  const [stepGridActive, setStepGridActive] = useState<boolean>(false);
  const [showRangeActive, setShowRangeActive] = useState<boolean>(false);
  const [skillUsedNotice, setSkillUsedNotice] = useState<string | null>(null);

  // Stage Score & Stats tracker
  const [correctInSession, setCorrectInSession] = useState<number>(0);
  const [wrongInSession, setWrongInSession] = useState<number>(0);
  const [hintsInSession, setHintsInSession] = useState<number>(0);
  const [comboStreak, setComboStreak] = useState<number>(student.comboStreak || 0);

  // Modals
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [completionReward, setCompletionReward] = useState<RewardResult | null>(null);
  const [levelUpModalData, setLevelUpModalData] = useState<{ newLevel: number } | null>(null);

  // Load problem when index or endless counter changes
  useEffect(() => {
    if (isEndlessMode) {
      const dynType: ProblemType = endlessCounter % 5 === 0 ? 'boss' : endlessCounter % 3 === 0 ? 'challenge' : 'advanced';
      setCurrentProblem(LearningService.generateDynamicProblem(stageId, dynType, endlessCounter));
    } else if (baseProblems[currentProblemIndex]) {
      setCurrentProblem(baseProblems[currentProblemIndex]);
    }
    setStudentInput('');
    setAttemptCount(0);
    setFeedback(null);
    setHighlightDigitsActive(false);
    setStepGridActive(false);
    setShowRangeActive(false);
    setSkillUsedNotice(null);
  }, [currentProblemIndex, isEndlessMode, endlessCounter, stageId, baseProblems]);

  // Keypad Handlers
  const handleKeypadPress = (val: string) => {
    if (studentInput.length < 7) {
      setStudentInput(prev => prev + val);
    }
  };

  const handleBackspace = () => {
    setStudentInput(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setStudentInput('');
  };

  // Job Skill Activation Handlers
  const handleUseJobSkill = (skillId: string) => {
    if (skillId.includes('focus_sword') || skillId.includes('detect')) {
      setHighlightDigitsActive(true);
      setSkillUsedNotice('🗡️ 직업 스킬 발동! 문제의 핵심 숫자가 밝게 강조되었습니다.');
    } else if (skillId.includes('magic_circle') || skillId.includes('grid')) {
      setStepGridActive(true);
      setSkillUsedNotice('✨ 덧셈·뺄셈 마법진 발동! 자릿값 정렬 격자가 활성화되었습니다.');
    } else if (skillId.includes('light') || skillId.includes('heal')) {
      setStepGridActive(true);
      setSkillUsedNotice('🌿 회복의 빛 발동! 10 묶음 및 낱개 분해 힌트가 표시됩니다.');
    } else if (skillId.includes('eye') || skillId.includes('range')) {
      setShowRangeActive(true);
      setSkillUsedNotice('👁️ 도전자의 눈 발동! 대략적인 정답 범위가 포착되었습니다.');
    }
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (!studentInput.trim()) return;

    const nextAttempt = attemptCount + 1;
    setAttemptCount(nextAttempt);

    const grade = LearningService.evaluateAnswer(currentProblem, studentInput, nextAttempt);
    setFeedback(grade);

    let currentStudent = student;

    if (grade.isCorrect) {
      triggerConfetti('small');
      const newCombo = comboStreak + 1;
      setComboStreak(newCombo);
      setCorrectInSession(prev => prev + 1);

      // Calculate Reward
      const reward = GameService.calculateReward({
        student: currentStudent,
        problemType: currentProblem.type,
        isCorrect: true,
        isRemedialFixed: nextAttempt > 1,
        comboStreak: newCombo,
      });

      const updated = GameService.applyRewards(currentStudent.account.id, reward);
      if (updated) {
        currentStudent = updated;
        onUpdateStudent(updated);
      }

      if (reward.isLevelUp && reward.newLevel) {
        setLevelUpModalData({ newLevel: reward.newLevel });
        triggerConfetti('huge');
      }

      // Check if we should advance to next question or show stage complete modal
      setTimeout(() => {
        if (!isEndlessMode && currentProblemIndex === baseProblems.length - 1) {
          // Final question of 15 completed!
          finishStage(currentStudent);
        } else if (!isEndlessMode) {
          setCurrentProblemIndex(prev => prev + 1);
        } else {
          setEndlessCounter(prev => prev + 1);
        }
      }, 1400);

    } else {
      // Wrong Answer
      setWrongInSession(prev => prev + 1);
      setComboStreak(0); // Reset combo

      // Record Wrong Question
      const wrongRecord: WrongQuestionRecord = {
        problemId: currentProblem.id,
        stageId,
        problem: currentProblem.questionText,
        studentAns: studentInput,
        correctAns: String(currentProblem.answer),
        errorType: grade.errorType,
        retryCount: nextAttempt,
        hintLevel: nextAttempt,
        createdAt: new Date().toISOString(),
      };
      DataService.recordWrongQuestion(student.account.id, stageId, wrongRecord);

      // Hints count
      setHintsInSession(prev => prev + 1);

      // Update student overall totals
      DataService.updateStudentData(student.account.id, {
        totalWrong: student.totalWrong + 1,
        totalHints: student.totalHints + 1,
        comboStreak: 0,
      });
    }
  };

  // Finish 15 Base Stage Questions
  const finishStage = (latestStudent: StudentData) => {
    const finalCorrect = correctInSession + 1;
    const finalTotal = 15;
    const mastery = LearningService.determineStageMastery(finalCorrect, finalTotal, hintsInSession);
    const isFirstTime = !latestStudent.stages[stageId]?.completed;

    const reward = GameService.calculateReward({
      student: latestStudent,
      problemType: 'boss',
      isCorrect: true,
      comboStreak,
      stageCompleted: true,
      isFirstCompletion: isFirstTime,
      stageId,
    });

    const updated = GameService.applyRewards(latestStudent.account.id, reward);
    if (updated) {
      onUpdateStudent(updated);
    }

    // Save stage record
    const updatedStageData = {
      completed: true,
      mastery,
      score: finalCorrect * 10,
      correctCount: finalCorrect,
      wrongCount: wrongInSession,
      tryCount: finalTotal + wrongInSession,
      hintCount: hintsInSession,
      basicSolved: Math.min(finalCorrect, 8),
      advancedSolved: mastery === '심화' || mastery === '완전정복' ? 3 : 1,
      challengeSolved: mastery === '완전정복' ? 2 : 0,
      applicationSolved: 2,
      createdProblems: mastery === '완전정복' ? 1 : 0,
      wrongQuestions: latestStudent.stages[stageId]?.wrongQuestions || [],
      updatedAt: new Date().toISOString(),
    };

    DataService.updateStageProgress(latestStudent.account.id, stageId, updatedStageData);

    // Auto-sync to Google Spreadsheet if configured
    if (GoogleSheetService.isConfigured()) {
      GoogleSheetService.submitStageResult({
        student: updated || latestStudent,
        stageRecord: {
          stageId,
          ...updatedStageData,
        },
        stageTitle: stageConfig.title,
        isSos: mastery === '보충' || (wrongInSession >= 5),
        earnedGold: reward.goldGained,
        earnedExp: reward.expGained,
      }).catch(err => console.error('Google Sheet auto-sync error:', err));
    }

    setCompletionReward(reward);
    setShowCompletionModal(true);
    triggerConfetti('huge');
  };

  const expProgress = getLevelProgress(student.character.exp, student.character.level);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none">
      {/* Top RPG Player Stat Bar */}
      <header className="bg-white border-b-2 border-slate-200 px-4 py-2.5 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Back Button & Stage Name */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToMap}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">월드맵</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-2xl p-1 rounded-lg bg-amber-50 border border-amber-200">
                {stageConfig.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm md:text-base font-bold font-jua text-slate-800">
                    {stageConfig.title}
                  </h1>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-sky-100 text-sky-800">
                    {stageConfig.mapLocationName}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">{stageConfig.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Right: Character Info, EXP & Gold */}
          <div className="flex items-center gap-3">
            {/* Combo Streak Flame */}
            {comboStreak > 1 && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-2.5 py-1 rounded-full text-xs font-black animate-pulse shadow-md">
                <Flame className="w-3.5 h-3.5 fill-yellow-200 text-yellow-200" />
                <span>{comboStreak} 콤보!</span>
              </div>
            )}

            {/* Gold Balance */}
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-300 text-amber-900 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>{student.character.gold} G</span>
            </div>

            {/* Avatar & Level Bar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <CharacterAvatar character={student.character} size="sm" showBadge={false} />
              <div className="hidden sm:block">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-slate-900">Lv.{student.character.level}</span>
                  <span className="text-xs font-bold text-slate-600">{student.character.nickname}</span>
                </div>
                {/* EXP Gauge */}
                <div
                  className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden mt-0.5"
                  title={`${expProgress.currentLevelExp}/${expProgress.neededInLevel} EXP (${expProgress.percent}%)`}
                >
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${expProgress.percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Play Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Problem Area (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Stage Progress Card */}
          <div className="bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">진행도:</span>
              <span className="text-sm font-extrabold text-sky-700 font-jua">
                {isEndlessMode ? `무한 훈련 #${endlessCounter}` : `${currentProblemIndex + 1} / 15 문항`}
              </span>
              {isEndlessMode && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                  무한 도전 모드
                </span>
              )}
            </div>

            {/* Progress Bar Dots */}
            {!isEndlessMode && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i < currentProblemIndex
                        ? 'bg-emerald-500 ring-2 ring-emerald-200'
                        : i === currentProblemIndex
                        ? 'bg-amber-500 ring-2 ring-amber-300 scale-125'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Question Box Card */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-md flex-1 flex flex-col justify-between relative overflow-hidden">
            {/* Background Watermark */}
            <div className="absolute top-2 right-2 opacity-10 text-8xl pointer-events-none select-none font-jua">
              {stageConfig.icon}
            </div>

            <div>
              {/* Context Story Badge if Word Problem */}
              {currentProblem.context && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold mb-3">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{currentProblem.context}</span>
                </div>
              )}

              {/* Question Text */}
              <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed font-sans">
                {currentProblem.questionText}
              </h2>

              {/* Range guide if explorer skill is active */}
              {showRangeActive && (
                <div className="mt-2 p-2 rounded-lg bg-sky-50 border border-sky-300 text-xs font-bold text-sky-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  <span>도전자의 눈: 어림 정답 범위는 대략 {Math.round((currentProblem.answer * 0.85) / 10) * 10} ~ {Math.round((currentProblem.answer * 1.15) / 10) * 10} 사이입니다!</span>
                </div>
              )}

              {/* Math Display Area (Visual Aid, Vertical grid, or Large Math Display) */}
              <MathVisualAid problem={currentProblem} highlight={highlightDigitsActive} />

              <div className="my-4 flex items-center justify-center">
                {currentProblem.format === 'vertical' ? (
                  <VerticalMathGrid
                    num1={currentProblem.num1 ?? currentProblem.multiplicand ?? 0}
                    num2={currentProblem.num2 ?? currentProblem.multiplier ?? 0}
                    operator={currentProblem.operator || '+'}
                    highlightDigits={highlightDigitsActive}
                    showStepGrid={stepGridActive}
                  />
                ) : currentProblem.format === 'three_add' && currentProblem.num3 !== undefined ? (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 text-2xl md:text-3xl font-extrabold text-slate-800 tracking-wider font-mono text-center shadow-inner">
                    <span className={highlightDigitsActive ? 'bg-amber-200 px-2 rounded' : ''}>
                      {currentProblem.num1}
                    </span>
                    <span className="text-sky-600 mx-2">+</span>
                    <span className={highlightDigitsActive ? 'bg-amber-200 px-2 rounded' : ''}>
                      {currentProblem.num2}
                    </span>
                    <span className="text-sky-600 mx-2">+</span>
                    <span className={highlightDigitsActive ? 'bg-amber-200 px-2 rounded' : ''}>
                      {currentProblem.num3}
                    </span>
                    <span className="text-amber-600 mx-2">=</span>
                    <span className="text-amber-600 font-jua">?</span>
                  </div>
                ) : currentProblem.format === 'three_sub' && currentProblem.num3 !== undefined ? (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 text-2xl md:text-3xl font-extrabold text-slate-800 tracking-wider font-mono text-center shadow-inner">
                    <span className={highlightDigitsActive ? 'bg-amber-200 px-2 rounded' : ''}>
                      {currentProblem.num1}
                    </span>
                    <span className="text-rose-600 mx-2">-</span>
                    <span className={highlightDigitsActive ? 'bg-amber-200 px-2 rounded' : ''}>
                      {currentProblem.num2}
                    </span>
                    <span className="text-rose-600 mx-2">-</span>
                    <span className={highlightDigitsActive ? 'bg-amber-200 px-2 rounded' : ''}>
                      {currentProblem.num3}
                    </span>
                    <span className="text-amber-600 mx-2">=</span>
                    <span className="text-amber-600 font-jua">?</span>
                  </div>
                ) : currentProblem.format === 'puzzle' ? (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 text-2xl md:text-4xl font-extrabold text-slate-800 tracking-wider font-mono text-center shadow-inner">
                    <span className={highlightDigitsActive ? 'bg-amber-200 px-2 rounded' : ''}>
                      {currentProblem.num1}
                    </span>
                    <span className="text-sky-600 mx-3">{currentProblem.operator || '+'}</span>
                    <span className="px-3 py-1 bg-white border-2 border-dashed border-amber-500 rounded-xl text-amber-600 font-jua">
                      ?
                    </span>
                    <span className="text-amber-600 mx-3">=</span>
                    <span>{currentProblem.num1 + (currentProblem.operator === '-' ? -currentProblem.answer : currentProblem.answer)}</span>
                  </div>
                ) : currentProblem.format === 'split_join' ? null : (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 text-3xl md:text-4xl font-extrabold text-slate-800 tracking-wider font-mono text-center shadow-inner">
                    <span className={highlightDigitsActive ? 'bg-amber-200 px-2 rounded' : ''}>
                      {currentProblem.num1 ?? currentProblem.multiplicand}
                    </span>
                    <span className="text-sky-600 mx-3">{currentProblem.operator || '+'}</span>
                    <span className={highlightDigitsActive ? 'bg-amber-200 px-2 rounded' : ''}>
                      {currentProblem.num2 ?? currentProblem.multiplier}
                    </span>
                    <span className="text-amber-600 mx-3">=</span>
                    <span className="text-amber-600 font-jua">?</span>
                  </div>
                )}
              </div>
            </div>

            {/* Answer Display Box */}
            <div className="mt-2 flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 border-2 border-slate-300 rounded-xl px-5 py-3 min-w-[200px] justify-center text-3xl font-black font-mono text-slate-800 shadow-inner">
                {studentInput ? studentInput : <span className="text-slate-300 italic text-2xl font-jua">정답 입력</span>}
              </div>

              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={!studentInput}
                className={`rpg-btn px-6 py-3.5 rounded-xl font-bold font-jua text-lg shadow-lg flex items-center gap-2 text-white transition-all ${
                  studentInput
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 border-b-4 border-emerald-800'
                    : 'bg-slate-300 cursor-not-allowed text-slate-500'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>확인</span>
              </button>
            </div>

            {/* Feedback Alert Bar */}
            {feedback && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-sm font-bold flex items-center gap-2.5 transition-all ${
                  feedback.isCorrect
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}
              >
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
                <div>
                  <p>{feedback.feedbackMessage}</p>
                  {feedback.hintForNextAttempt && (
                    <p className="text-xs text-slate-700 font-normal mt-1 bg-white/70 p-1.5 rounded">
                      💡 {feedback.hintForNextAttempt}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Keypad & Tools & Job Skills (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Job Skills Toolbar */}
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 mb-2 flex items-center justify-between">
              <span>{student.character.job === 'warrior' ? '⚔️ 전사' : student.character.job === 'wizard' ? '🔮 마법사' : student.character.job === 'healer' ? '🌿 힐러' : '🏹 탐험가'} 전용 스킬</span>
              <span className="text-[10px] text-amber-600">도움이 필요할 때 클릭!</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {student.character.skills.map((skillId) => {
                const labels: Record<string, { name: string; desc: string; icon: string }> = {
                  warrior_focus_sword: { name: '집중의 검', desc: '핵심 숫자 강조', icon: '🗡️' },
                  warrior_shield: { name: '계산 방패', desc: '오답 재도전 보호', icon: '🛡️' },
                  warrior_slash: { name: '연속 베기', desc: '콤보 보너스', icon: '⚡' },
                  wizard_detect: { name: '숫자 탐색', desc: '조건 강조', icon: '🔍' },
                  wizard_magic_circle: { name: '곱셈 마법진', desc: '세로셈 부분곱 정렬', icon: '✨' },
                  wizard_accel: { name: '지혜 가속', desc: '심화 EXP 1.5배', icon: '🌟' },
                  healer_light: { name: '회복의 빛', desc: '수 모형 분해 보기', icon: '💫' },
                  healer_retry: { name: '다시 도전', desc: '오답 수정 추가EXP', icon: '💖' },
                  healer_focus_heal: { name: '집중 회복', desc: '선수 개념 힌트', icon: '🌸' },
                  explorer_eye: { name: '도전자의 눈', desc: '어림 범위 표시', icon: '👁️' },
                  explorer_weakpoint: { name: '약점 탐색', desc: '오류 경고', icon: '🧭' },
                  explorer_trail: { name: '모험 나침반', desc: '신유형 클리어 보상', icon: '🗺️' },
                };
                const sk = labels[skillId] || { name: '모험가의 스킬', desc: '학습 보조', icon: '✨' };

                return (
                  <button
                    key={skillId}
                    type="button"
                    onClick={() => handleUseJobSkill(skillId)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-left transition-all flex items-center gap-2 group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{sk.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{sk.name}</p>
                      <p className="text-[10px] text-slate-500">{sk.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {skillUsedNotice && (
              <p className="mt-2 text-xs font-bold text-sky-700 bg-sky-50 p-2 rounded-lg border border-sky-200 animate-fadeIn">
                {skillUsedNotice}
              </p>
            )}
          </div>

          {/* Numeric Touch Keypad Card */}
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-md">
            <div className="grid grid-cols-3 gap-2.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(String(num))}
                  className="rpg-btn py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border-2 border-slate-200 text-2xl font-black text-slate-800 shadow-sm font-mono"
                >
                  {num}
                </button>
              ))}

              {/* Clear */}
              <button
                type="button"
                onClick={handleClear}
                className="rpg-btn py-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 text-rose-700 font-bold text-sm shadow-sm flex items-center justify-center"
              >
                지우기
              </button>

              {/* 0 */}
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="rpg-btn py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border-2 border-slate-200 text-2xl font-black text-slate-800 shadow-sm font-mono"
              >
                0
              </button>

              {/* Backspace */}
              <button
                type="button"
                onClick={handleBackspace}
                className="rpg-btn py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 font-bold shadow-sm flex items-center justify-center"
              >
                <Delete className="w-6 h-6" />
              </button>
            </div>

            {/* Utility Buttons: Scratchpad Toggle & Endless Practice Mode */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowScratchpad(!showScratchpad)}
                className={`py-2.5 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  showScratchpad
                    ? 'bg-sky-500 text-white border-sky-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>{showScratchpad ? '연습장 닫기' : '수학 연습장 열기'}</span>
              </button>

              {!isEndlessMode ? (
                <button
                  type="button"
                  onClick={() => setIsEndlessMode(true)}
                  className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 text-purple-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span>무한 연습 모드</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEndlessMode(false)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>기본 15문항 복귀</span>
                </button>
              )}
            </div>
          </div>

          {/* Slide-in Scratchpad */}
          {showScratchpad && (
            <div className="animate-fadeIn">
              <Scratchpad onClose={() => setShowScratchpad(false)} />
            </div>
          )}
        </div>
      </main>

      {/* Stage Completion Rewards Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-amber-400 shadow-2xl p-6 text-center animate-scaleUp">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-4xl mb-3 animate-bounce">
              {stageConfig.icon}
            </div>

            <h2 className="text-2xl md:text-3xl font-black font-jua text-slate-800">
              🎉 {stageConfig.mapLocationName} 완전 정복!
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {stageConfig.title} 15문항을 모두 완수했습니다!
            </p>

            {/* Reward Badges Box */}
            <div className="my-5 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 grid grid-cols-2 gap-3 text-left">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-slate-500">획득 경험치</p>
                  <p className="text-base text-amber-600 font-jua">+{completionReward?.expGained || 80} EXP</p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Coins className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-slate-500">획득 골드</p>
                  <p className="text-base text-amber-600 font-jua">+{completionReward?.goldGained || 50} Gold</p>
                </div>
              </div>
            </div>

            {/* Unlocked Math Monster Callout */}
            {completionReward?.newMonsterUnlocked && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900 flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span>새로운 수호 정령 [수학몬]이 도감에 등록되었습니다! 📖</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCompletionModal(false);
                  setIsEndlessMode(true);
                }}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
              >
                무한 추가 문제 풀기
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCompletionModal(false);
                  onBackToMap();
                }}
                className="rpg-btn px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white font-bold font-jua text-base shadow-lg border-b-4 border-amber-800 flex items-center gap-1.5"
              >
                <span>월드맵으로 이동</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Up Celebration Modal */}
      {levelUpModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border-4 border-yellow-400 shadow-2xl p-6 text-center animate-scaleUp">
            <Crown className="w-16 h-16 mx-auto text-yellow-500 animate-bounce mb-2" />
            <h3 className="text-2xl font-black font-jua text-slate-800">LEVEL UP! 🌟</h3>
            <p className="text-sm font-bold text-amber-600 mt-1">
              축하합니다! 레벨 Lv.{levelUpModalData.newLevel} 에 도달했습니다!
            </p>
            <p className="text-xs text-slate-500 mt-2">
              상점에서 새로운 장비가 해금되었습니다.
            </p>

            <button
              type="button"
              onClick={() => setLevelUpModalData(null)}
              className="mt-5 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold font-jua text-base shadow-md"
            >
              멋져요! 계속하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
