// Gemini Service: Client-side connector for server-side Gemini API remark generation

import { StudentData, StudentRemark, StageRecord } from '../types';
import { STAGES_CONFIG } from './curriculumData';

export interface RemarkGenerationResult {
  success: boolean;
  remark?: string;
  dominantTrait?: string;
  keyStrengths?: string[];
  isFallback?: boolean;
  note?: string;
  error?: string;
}

export interface ClassRemarksResult {
  success: boolean;
  remarks?: Array<{
    studentId: string;
    remark: string;
    dominantTrait: string;
    keyStrengths: string[];
  }>;
  isFallback?: boolean;
  note?: string;
  error?: string;
}

export const GeminiService = {
  // Check if server is running and Gemini is configured
  async checkHealth(): Promise<{ status: string; geminiReady: boolean }> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return { status: 'offline', geminiReady: false };
    }
  },

  // Package a student's full learning metrics into a rich analytical context
  formatStudentProfile(student: StudentData) {
    const totalSolved = student.totalCorrect + student.totalWrong;
    const accuracy = totalSolved > 0 ? Math.round((student.totalCorrect / totalSolved) * 100) : 0;
    const completedStages = Object.values(student.stages).filter(s => s.completed);

    // Extract dominant error types
    const errorTypeCounts: Record<string, number> = {};
    let totalRetries = student.totalRetries || 0;

    Object.values(student.stages).forEach(st => {
      st.wrongQuestions?.forEach(wq => {
        if (wq.errorType) {
          errorTypeCounts[wq.errorType] = (errorTypeCounts[wq.errorType] || 0) + 1;
        }
      });
    });

    const dominantErrorTypes = Object.entries(errorTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => `${type}(${count}회)`);

    // Advanced & boss challenge evaluation
    const advancedCount = completedStages.filter(s => s.mastery === '심화' || s.mastery === '완전정복').length;
    const remedialCount = completedStages.filter(s => s.mastery === '보충').length;

    let advancedPerformance = '기본 계산 숙달 중심';
    if (advancedCount >= 8) {
      advancedPerformance = '심화 및 보스 문제 해결 능력 최상위';
    } else if (advancedCount >= 4) {
      advancedPerformance = '심화 및 도전 과제 적극 해결';
    } else if (remedialCount >= 3) {
      advancedPerformance = '기초 연산 보충과 세로셈 반복 훈련 진행 중';
    }

    return {
      id: student.account.id,
      name: student.account.name,
      grade: student.account.grade,
      classNo: student.account.classNo,
      number: student.account.number,
      job: student.character.job,
      level: student.character.level,
      accuracy,
      totalCorrect: student.totalCorrect,
      totalWrong: student.totalWrong,
      completedStagesCount: completedStages.length,
      totalHints: student.totalHints,
      totalRetries,
      maxCombo: student.maxCombo,
      monstersCount: student.character.mathMonsters.length,
      dominantErrorTypes,
      advancedPerformance,
      retrySuccessRate: student.totalWrong > 0 ? `${Math.round((student.totalCorrect / (student.totalCorrect + student.totalWrong * 0.5)) * 100)}%` : '100%',
    };
  },

  // Package stage details with curriculum names
  formatStageRecords(student: StudentData) {
    return STAGES_CONFIG.map(cfg => {
      const rec = student.stages[cfg.id];
      if (!rec) {
        return {
          stageId: cfg.id,
          stageTitle: cfg.title,
          mastery: '미학습',
          correctCount: 0,
          wrongCount: 0,
          hintCount: 0,
          dominantError: '없음',
          creativeSolved: false,
        };
      }

      const dominantError = rec.wrongQuestions?.[0]?.errorType || '없음';
      return {
        stageId: cfg.id,
        stageTitle: cfg.title,
        mastery: rec.mastery,
        correctCount: rec.correctCount,
        wrongCount: rec.wrongCount,
        hintCount: rec.hintCount,
        dominantError,
        creativeSolved: (rec.createdProblems || 0) > 0 || (rec.challengeSolved || 0) > 0,
      };
    });
  },

  // Generate remark for an individual student
  async generateStudentRemark(student: StudentData, previousRemark?: string): Promise<RemarkGenerationResult> {
    try {
      const studentProfile = this.formatStudentProfile(student);
      const stageRecords = this.formatStageRecords(student);

      const response = await fetch('/api/gemini/generate-remark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile,
          stageRecords,
          previousRemark,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `서버 에러 (${response.status})`);
      }

      const data = await response.json();
      return {
        success: true,
        remark: data.remark,
        dominantTrait: data.dominantTrait || '성실 탐구형',
        keyStrengths: data.keyStrengths || ['계산 원리 습득', '꾸준한 참여'],
        isFallback: data.isFallback,
        note: data.note,
      };
    } catch (err: any) {
      console.error('Failed to call /api/gemini/generate-remark:', err);
      return {
        success: false,
        error: err.message || '평어 생성 중 통신 오류가 발생했습니다.',
      };
    }
  },

  // Generate remarks for the entire class at once
  async generateClassRemarks(students: StudentData[]): Promise<ClassRemarksResult> {
    try {
      const payload = students.map(student => ({
        profile: this.formatStudentProfile(student),
        stageRecords: this.formatStageRecords(student),
      }));

      const response = await fetch('/api/gemini/generate-class-remarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: payload }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `서버 에러 (${response.status})`);
      }

      const data = await response.json();
      return {
        success: true,
        remarks: data.remarks,
        isFallback: data.isFallback,
        note: data.note,
      };
    } catch (err: any) {
      console.error('Failed to call /api/gemini/generate-class-remarks:', err);
      return {
        success: false,
        error: err.message || '학급 일괄 평어 생성 중 통신 오류가 발생했습니다.',
      };
    }
  },
};
