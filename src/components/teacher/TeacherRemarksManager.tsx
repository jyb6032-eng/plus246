import React, { useState, useEffect } from 'react';
import { StudentData, StudentRemark } from '../../types';
import { DataService } from '../../services/dataService';
import { GeminiService } from '../../services/geminiService';
import { triggerConfetti } from '../common/ConfettiEffect';
import {
  Sparkles,
  Bot,
  Copy,
  Check,
  Edit3,
  Save,
  RotateCw,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  HelpCircle,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';

interface Props {
  studentsMap: Record<string, StudentData>;
  onRefresh: () => void;
  onSelectStudent: (student: StudentData) => void;
}

export const TeacherRemarksManager: React.FC<Props> = ({
  studentsMap,
  onRefresh,
  onSelectStudent,
}) => {
  const students: StudentData[] = (Object.values(studentsMap) as StudentData[]).sort(
    (a, b) => a.account.number - b.account.number
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'generated' | 'empty' | 'edited'>('all');
  const [selectedTrait, setSelectedTrait] = useState<string>('all');
  
  // Batch generation state
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchProgressText, setBatchProgressText] = useState('');
  const [batchError, setBatchError] = useState<string | null>(null);

  // Inline editing state: Record<studentId, string>
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [editTrait, setEditTrait] = useState<string>('');

  // Copied state indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  // Single student regenerating state
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  // Metrics
  const totalStudents = students.length;
  const generatedCount = students.filter(s => Boolean(s.remark?.evaluationText)).length;
  const editedCount = students.filter(s => s.remark?.isEditedByUser).length;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const lines = students
      .filter(s => s.remark?.evaluationText)
      .map(s => `[${s.account.number}번 ${s.account.name}]\n${s.remark!.evaluationText}\n`)
      .join('\n');
    
    if (!lines) {
      alert('생성된 평어가 없습니다. 먼저 AI 평어를 생성해 주세요.');
      return;
    }

    navigator.clipboard.writeText(lines);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2500);
  };

  const handleStartEdit = (student: StudentData) => {
    setEditingId(student.account.id);
    setEditText(student.remark?.evaluationText || '');
    setEditTrait(student.remark?.dominantTrait || '성실 탐구형');
  };

  const handleSaveEdit = (studentId: string) => {
    const student = studentsMap[studentId];
    if (!student) return;

    const updatedRemark: StudentRemark = {
      evaluationText: editText.trim(),
      dominantTrait: editTrait.trim() || '성실 탐구형',
      keyStrengths: student.remark?.keyStrengths || ['계산 원리 이해', '학습 태도'],
      generatedAt: student.remark?.generatedAt || new Date().toISOString(),
      isEditedByUser: true,
    };

    DataService.updateStudentRemark(studentId, updatedRemark);
    setEditingId(null);
    onRefresh();
  };

  // Single student AI generation
  const handleGenerateSingle = async (student: StudentData) => {
    setRegeneratingId(student.account.id);
    try {
      const res = await GeminiService.generateStudentRemark(
        student,
        student.remark?.evaluationText
      );

      if (res.success && res.remark) {
        const newRemark: StudentRemark = {
          evaluationText: res.remark,
          dominantTrait: res.dominantTrait || '성실 탐구형',
          keyStrengths: res.keyStrengths || ['계산 원리 숙달'],
          generatedAt: new Date().toISOString(),
          isEditedByUser: false,
        };
        DataService.updateStudentRemark(student.account.id, newRemark);
        onRefresh();
      } else {
        alert(res.error || '평어 생성에 실패했습니다.');
      }
    } catch (err: any) {
      alert(err.message || '평어 생성 중 오류가 발생했습니다.');
    } finally {
      setRegeneratingId(null);
    }
  };

  // Batch class-wide AI generation
  const handleBatchGenerate = async () => {
    if (students.length === 0) return;
    
    setIsBatchGenerating(true);
    setBatchProgressText('Gemini 3.7 Flash로 15명 학생의 종합 학습 데이터를 다각도로 분석 중입니다...');
    setBatchError(null);

    try {
      const res = await GeminiService.generateClassRemarks(students);

      if (res.success && Array.isArray(res.remarks)) {
        const remarksMap: Record<string, StudentRemark> = {};
        const now = new Date().toISOString();

        res.remarks.forEach((item) => {
          if (item.studentId) {
            remarksMap[item.studentId] = {
              evaluationText: item.remark,
              dominantTrait: item.dominantTrait || '성실 탐구형',
              keyStrengths: item.keyStrengths || ['기본 원리 이해'],
              generatedAt: now,
              isEditedByUser: false,
            };
          }
        });

        DataService.updateAllStudentRemarks(remarksMap);
        triggerConfetti('medium');
        onRefresh();
      } else {
        setBatchError(res.error || '학급 일괄 평어 생성에 실패했습니다.');
      }
    } catch (err: any) {
      setBatchError(err.message || '일괄 생성 중 오류가 발생했습니다.');
    } finally {
      setIsBatchGenerating(false);
      setBatchProgressText('');
    }
  };

  const handleExportCsv = () => {
    DataService.exportRemarksToCsv(studentsMap);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    // Search
    const matchSearch =
      s.account.name.includes(searchQuery) ||
      s.account.id.includes(searchQuery) ||
      String(s.account.number) === searchQuery ||
      (s.remark?.dominantTrait && s.remark.dominantTrait.includes(searchQuery));

    if (!matchSearch) return false;

    // Status filter
    if (filterStatus === 'generated' && !s.remark?.evaluationText) return false;
    if (filterStatus === 'empty' && s.remark?.evaluationText) return false;
    if (filterStatus === 'edited' && !s.remark?.isEditedByUser) return false;

    // Trait filter
    if (selectedTrait !== 'all' && s.remark?.dominantTrait !== selectedTrait) return false;

    return true;
  });

  const availableTraits = Array.from(
    new Set(students.map(s => s.remark?.dominantTrait).filter(Boolean))
  ) as string[];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-indigo-300" />
                Gemini 3.7 Flash AI 수석교사 평가 엔진
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-xs font-bold">
                초등 1학년 생활기록부 맞춤
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI 수학 평어 자동 생성 & 관리
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              정답률, 오답 유형, 오류 수정 과정(재도전), 힌트 의존도, 심화/보스 문제 해결력 등 실제 학습 데이터를 입체적으로 분석하여,
              <strong> 중복 표현 없이 차별화된 1~2문장 학교생활기록부 교과학습발달상황 수학 평어</strong>를 생성합니다.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={isBatchGenerating}
              onClick={handleBatchGenerate}
              className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
                isBatchGenerating
                  ? 'bg-indigo-400 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 hover:shadow-amber-500/20 active:scale-95'
              }`}
            >
              {isBatchGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-white" />
                  <span>학급 전체 AI 분석 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>학급 전체 AI 평어 일괄 생성 ({totalStudents}명)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyAll}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95"
            >
              {allCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-300" />}
              <span>{allCopied ? '전체 복사됨!' : '전체 평어 복사'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>생활기록부 CSV 다운로드</span>
            </button>
          </div>
        </div>

        {/* Batch Processing Notice Banner */}
        {isBatchGenerating && (
          <div className="mt-4 p-3.5 bg-indigo-950/60 border border-indigo-400/40 rounded-xl text-xs font-semibold flex items-center gap-3 text-indigo-100 animate-pulse">
            <Bot className="w-5 h-5 text-amber-400 animate-bounce" />
            <span>{batchProgressText}</span>
          </div>
        )}

        {batchError && (
          <div className="mt-4 p-3.5 bg-rose-950/80 border border-rose-400/50 rounded-xl text-xs font-semibold flex items-center gap-2 text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{batchError}</span>
          </div>
        )}
      </div>

      {/* Progress & Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">평어 작성 완료율</p>
            <p className="text-xl font-extrabold text-indigo-700 mt-1">
              {generatedCount} <span className="text-xs font-medium text-slate-500">/ {totalStudents}명</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {Math.round((generatedCount / (totalStudents || 1)) * 100)}% 완료
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">교사 직접 수정</p>
            <p className="text-xl font-extrabold text-amber-700 mt-1">
              {editedCount} <span className="text-xs font-medium text-slate-500">명</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">최종 검토 및 다듬기 완료</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Edit3 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">평어 문체 기준</p>
            <p className="text-sm font-extrabold text-slate-800 mt-1">초등 교과학습발달상황</p>
            <p className="text-[11px] text-slate-500 mt-0.5">1~2문장 표준 종결(~함, ~보임)</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">평어 생성 원칙</p>
            <p className="text-sm font-extrabold text-slate-800 mt-1">중복 표현 엄격 배제</p>
            <p className="text-[11px] text-slate-500 mt-0.5">오류극복·개념추론·성실탐구 등</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="학생 이름, 번호, 학습 특성 검색..."
            className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterStatus === 'all' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              전체 ({totalStudents})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('generated')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterStatus === 'generated' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              생성 완료 ({generatedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('empty')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterStatus === 'empty' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              미생성 ({totalStudents - generatedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('edited')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterStatus === 'edited' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              직접 수정됨 ({editedCount})
            </button>
          </div>

          {availableTraits.length > 0 && (
            <select
              value={selectedTrait}
              onChange={(e) => setSelectedTrait(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">모든 학습 특성</option>
              {availableTraits.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Remarks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">번호</th>
                <th className="py-3 px-4 w-36">학생 정보</th>
                <th className="py-3 px-4 w-32">주요 학습 특성</th>
                <th className="py-3 px-4">AI 수학 평어 (학교생활기록부 / 과정중심평가)</th>
                <th className="py-3 px-4 w-44 text-center">관리 & 조작</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <HelpCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-sm text-slate-600">조건에 맞는 학생이 없습니다.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const totalSolved = student.totalCorrect + student.totalWrong;
                  const acc = totalSolved > 0 ? Math.round((student.totalCorrect / totalSolved) * 100) : 0;
                  const remark = student.remark;
                  const isEditing = editingId === student.account.id;
                  const isRegenerating = regeneratingId === student.account.id;
                  const isCopied = copiedId === student.account.id;

                  return (
                    <tr
                      key={student.account.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isEditing ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      {/* Number */}
                      <td className="py-3 px-4 text-center font-extrabold text-slate-600">
                        {student.account.number}
                      </td>

                      {/* Student Info */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => onSelectStudent(student)}
                          className="text-left group"
                        >
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                            <span>{student.account.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                              Lv.{student.character.level}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <span>정답률 {acc}%</span>
                            <span>·</span>
                            <span>{student.character.job}</span>
                          </div>
                        </button>
                      </td>

                      {/* Dominant Trait */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTrait}
                            onChange={(e) => setEditTrait(e.target.value)}
                            placeholder="특성 요약 (예: 오류극복형)"
                            className="w-full text-xs font-bold px-2 py-1 border border-indigo-300 rounded bg-white focus:outline-none"
                          />
                        ) : remark?.dominantTrait ? (
                          <div>
                            <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {remark.dominantTrait}
                            </span>
                            {remark.keyStrengths && remark.keyStrengths.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {remark.keyStrengths.slice(0, 2).map((st, i) => (
                                  <span
                                    key={i}
                                    className="text-[9px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
                                  >
                                    #{st}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">미생성</span>
                        )}
                      </td>

                      {/* Remark Text */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="space-y-1.5">
                            <textarea
                              rows={3}
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              placeholder="초등학교 생활기록부 양식으로 수학 평어를 입력하세요..."
                              className="w-full text-xs p-2.5 border-2 border-indigo-400 rounded-lg bg-white focus:outline-none leading-relaxed text-slate-800"
                            />
                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                              <span>글자수: {editText.length}자 (권장: 100~180자)</span>
                              <span className="text-indigo-600 font-semibold">
                                * 교사가 수정한 평어는 영구 보존됩니다.
                              </span>
                            </div>
                          </div>
                        ) : isRegenerating ? (
                          <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold py-2">
                            <RotateCw className="w-4 h-4 animate-spin" />
                            <span>Gemini가 새로운 문장과 어휘로 평어를 재구성하고 있습니다...</span>
                          </div>
                        ) : remark?.evaluationText ? (
                          <div className="space-y-1">
                            <p className="text-xs text-slate-800 leading-relaxed font-medium">
                              {remark.evaluationText}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              {remark.isEditedByUser ? (
                                <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                  선생님 직접 수정본
                                </span>
                              ) : (
                                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  AI 자동 생성본
                                </span>
                              )}
                              <span>{remark.generatedAt ? remark.generatedAt.slice(0, 10) : ''}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-400 text-xs italic py-2 flex items-center gap-2">
                            <span>아직 생성된 평어가 없습니다. [AI 평어 생성] 버튼을 눌러주세요.</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(student.account.id)}
                                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors"
                                title="저장"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>저장</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[11px] font-semibold transition-colors"
                              >
                                취소
                              </button>
                            </>
                          ) : (
                            <>
                              {remark?.evaluationText && (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(remark.evaluationText, student.account.id)}
                                  className={`p-1.5 rounded-md border transition-colors ${
                                    isCopied
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                                  title="클립보드 복사"
                                >
                                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleStartEdit(student)}
                                className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                title="직접 수정"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                disabled={isRegenerating}
                                onClick={() => handleGenerateSingle(student)}
                                className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                                  remark?.evaluationText
                                    ? 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                                }`}
                                title={remark?.evaluationText ? '다시 생성' : 'AI 평어 생성'}
                              >
                                {isRegenerating ? (
                                  <RotateCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Sparkles className="w-3 h-3 text-amber-500" />
                                )}
                                <span>{remark?.evaluationText ? '다시생성' : '평어생성'}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructional Pedagogical Footer Note */}
      <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Bot className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-800">교사용 생활기록부 나이스(NEIS) 연계 안내</p>
          <p className="leading-relaxed">
            AI가 생성한 평어는 초등학교 교육과정 평가 기준 및 과정중심평가 문체(~함, ~임)를 준수합니다.
            교사는 각 학생의 평어를 검토 후 [수정하기]를 통해 세부 내용을 보완할 수 있으며,
            [생활기록부 CSV 다운로드] 또는 [복사하기] 버튼을 눌러 나이스(NEIS) 교과학습발달상황 입력창에 바로 활용할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};
