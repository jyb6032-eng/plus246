// Analysis Service: Rule-based learning analytics, stage statistics, error type breakdown, SOS student detection, and CSV export

import { StudentData, StageRecord, WrongQuestionRecord } from '../types';
import { STAGES_CONFIG } from './curriculumData';

export interface ClassOverviewMetrics {
  totalStudents: number;
  activeStudents: number;
  averageProgressRate: number; // 0~100%
  averageAccuracy: number; // 0~100%
  averageExp: number;
  averageGold: number;
  averageLevel: number;
  levelDistribution: {
    advanced: number;
    basic: number;
    remedial: number;
  };
  jobDistribution: {
    warrior: number;
    wizard: number;
    healer: number;
    explorer: number;
  };
  monsterCollectionRate: number; // 0~100%
}

export interface StageStatSummary {
  stageId: number;
  title: string;
  locationName: string;
  completedStudentsCount: number;
  averageAccuracy: number;
  averageErrorRate: number;
  averageRetries: number;
  averageHints: number;
  remedialCount: number;
  advancedCount: number;
  dominantError: string;
}

export interface VulnerableStageInsight {
  stageId: number;
  title: string;
  locationName: string;
  errorRate: number;
  affectedStudentsCount: number;
  dominantError: string;
  pedagogicalSuggestion: string;
}

export interface SosStudentInsight {
  student: StudentData;
  reasons: string[];
  vulnerableStages: number[];
  dominantErrorType: string;
  urgencyLevel: 'high' | 'medium';
}

export const AnalysisService = {
  // Compute overall class overview
  computeClassOverview(studentsMap: Record<string, StudentData>): ClassOverviewMetrics {
    const students = Object.values(studentsMap);
    const totalStudents = students.length;

    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        activeStudents: 0,
        averageProgressRate: 0,
        averageAccuracy: 0,
        averageExp: 0,
        averageGold: 0,
        averageLevel: 1,
        levelDistribution: { advanced: 0, basic: 0, remedial: 0 },
        jobDistribution: { warrior: 0, wizard: 0, healer: 0, explorer: 0 },
        monsterCollectionRate: 0,
      };
    }

    let activeCount = 0;
    let totalCompletedStagesSum = 0;
    let totalCorrectSum = 0;
    let totalQuestionsSum = 0;
    let totalExpSum = 0;
    let totalGoldSum = 0;
    let totalLevelSum = 0;
    let totalMonstersSum = 0;

    const levelDist = { advanced: 0, basic: 0, remedial: 0 };
    const jobDist = { warrior: 0, wizard: 0, healer: 0, explorer: 0 };

    students.forEach((s) => {
      const completedCount = Object.values(s.stages).filter(st => st.completed).length;
      if (completedCount > 0 || s.totalCorrect > 0 || s.character.exp > 0) {
        activeCount++;
      }
      totalCompletedStagesSum += completedCount;

      const totalSolved = s.totalCorrect + s.totalWrong;
      totalCorrectSum += s.totalCorrect;
      totalQuestionsSum += totalSolved;

      totalExpSum += s.character.exp;
      totalGoldSum += s.character.gold;
      totalLevelSum += s.character.level;
      totalMonstersSum += s.character.mathMonsters.length;

      // Classify overall student mastery level
      const overallAccuracy = totalSolved > 0 ? s.totalCorrect / totalSolved : 0;
      if (overallAccuracy >= 0.8 || completedCount >= 10) {
        levelDist.advanced++;
      } else if (overallAccuracy >= 0.6 || completedCount >= 5) {
        levelDist.basic++;
      } else {
        levelDist.remedial++;
      }

      // Jobs
      const job = s.character.job;
      if (job in jobDist) {
        jobDist[job]++;
      }
    });

    const avgProgressRate = Math.round((totalCompletedStagesSum / (totalStudents * 12)) * 100);
    const avgAccuracy = totalQuestionsSum > 0 ? Math.round((totalCorrectSum / totalQuestionsSum) * 100) : 0;
    const avgMonsters = Math.round((totalMonstersSum / (totalStudents * 12)) * 100);

    return {
      totalStudents,
      activeStudents: activeCount,
      averageProgressRate: Math.min(avgProgressRate, 100),
      averageAccuracy: Math.min(avgAccuracy, 100),
      averageExp: Math.round(totalExpSum / totalStudents),
      averageGold: Math.round(totalGoldSum / totalStudents),
      averageLevel: Number((totalLevelSum / totalStudents).toFixed(1)),
      levelDistribution: levelDist,
      jobDistribution: jobDist,
      monsterCollectionRate: Math.min(avgMonsters, 100),
    };
  },

  // Compute 1~12 Stage-by-stage Statistics
  computeStageStats(studentsMap: Record<string, StudentData>): StageStatSummary[] {
    const students = Object.values(studentsMap);
    const totalStudents = students.length;

    return STAGES_CONFIG.map((cfg) => {
      let completedCount = 0;
      let totalCorrect = 0;
      let totalWrong = 0;
      let totalRetries = 0;
      let totalHints = 0;
      let remedialCount = 0;
      let advancedCount = 0;
      const errorTypeCounts: Record<string, number> = {};

      students.forEach((s) => {
        const stage = s.stages[cfg.id];
        if (stage && (stage.completed || stage.tryCount > 0)) {
          if (stage.completed) completedCount++;
          totalCorrect += stage.correctCount;
          totalWrong += stage.wrongCount;
          totalRetries += stage.tryCount - stage.correctCount;
          totalHints += stage.hintCount;

          if (stage.mastery === '심화' || stage.mastery === '완전정복') {
            advancedCount++;
          } else if (stage.mastery === '보충') {
            remedialCount++;
          }

          stage.wrongQuestions.forEach((wq) => {
            if (wq.errorType) {
              errorTypeCounts[wq.errorType] = (errorTypeCounts[wq.errorType] || 0) + 1;
            }
          });
        }
      });

      const totalAttempts = totalCorrect + totalWrong;
      const avgAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
      const avgErrorRate = 100 - avgAccuracy;
      const avgRetries = completedCount > 0 ? Number((totalRetries / completedCount).toFixed(1)) : 0;
      const avgHints = completedCount > 0 ? Number((totalHints / completedCount).toFixed(1)) : 0;

      // Find dominant error
      let dominantError = '자릿값 오류';
      let maxErrCount = 0;
      for (const [err, count] of Object.entries(errorTypeCounts)) {
        if (count > maxErrCount) {
          maxErrCount = count;
          dominantError = err;
        }
      }

      return {
        stageId: cfg.id,
        title: cfg.title,
        locationName: cfg.mapLocationName,
        completedStudentsCount: completedCount,
        averageAccuracy: avgAccuracy,
        averageErrorRate: avgErrorRate,
        averageRetries: avgRetries,
        averageHints: avgHints,
        remedialCount,
        advancedCount,
        dominantError,
      };
    });
  },

  // Get Top 3 Vulnerable Stages with pedagogical tips
  getTop3VulnerableStages(studentsMap: Record<string, StudentData>): VulnerableStageInsight[] {
    const stageStats = this.computeStageStats(studentsMap);
    
    // Sort by error rate descending
    const sorted = [...stageStats]
      .filter(s => s.completedStudentsCount > 0 || s.remedialCount > 0)
      .sort((a, b) => b.averageErrorRate - a.averageErrorRate)
      .slice(0, 3);

    const pedagogicalTips: Record<number, string> = {
      1: '10개씩 묶음 수 모형을 직접 조작해 보며 (몇십)과 0의 자릿값 확장 규칙을 복습하도록 지도해 주세요.',
      2: '백, 십, 일 모형을 각각 분해하여 (200×3)+(10×3)+(3×3)처럼 부분합을 시각화하여 확인하도록 안내해 주세요.',
      3: '일의 자리 곱셈에서 10이 넘을 때 십의 자리 윗부분에 올림수를 작게 표기하고 반드시 더하는 습관을 강조해 주세요.',
      4: '십의 자리와 백의 자리에서 연속으로 올림이 생길 때 자릿수가 밀리지 않도록 세로셈 줄눈 격자 노트를 활용해 주세요.',
      5: '0의 개수를 먼저 세어놓고 앞의 한 자리 수 곱셈을 먼저 진행하는 10배 규칙 카드를 활용해 보세요.',
      6: '(두 자리 수)×(일의 자리)와 (두 자리 수)×(몇십)을 윗줄과 아랫줄로 나누어 적는 부분곱 개념을 직관적으로 시각화해 주세요.',
      7: '두 번째 줄((두 자리 수)×(몇십))을 적을 때 일의 자리가 0으로 비어있거나 한 칸 왼쪽으로 당겨 적는 자릿값 정렬을 지도해 주세요.',
      8: '각 줄마다 생기는 올림수가 겹쳐서 헷갈리지 않도록 단계별로 지우거나 색깔 펜으로 구분하여 적도록 지도해 주세요.',
      9: '문장제에서 구하고자 하는 조건에 밑줄을 긋고, 대략 몇백 몇천쯤 될지 먼저 어림셈 범위를 잡은 후 계산하도록 유도해 주세요.',
      10: '가장 큰 곱을 만들 때는 큰 숫자를 가장 높은 자리에 배치하는 자릿값 원리 탐색 활동을 짝과 함께 진행해 보세요.',
      11: '시간 압박으로 인한 연산 실수를 방지하기 위해 구구단 기본 연산의 정확성을 먼저 확인한 후 타이머 도전을 권장합니다.',
      12: '단원 종합 평가에서 자주 틀린 3개 차시를 개별 오답 노트로 선별하여 맞춤형 복습을 제공해 주세요.',
    };

    return sorted.map((s) => {
      const affectedCount = s.remedialCount + Math.round(s.completedStudentsCount * (s.averageErrorRate / 100));
      return {
        stageId: s.stageId,
        title: s.title,
        locationName: s.locationName,
        errorRate: s.averageErrorRate,
        affectedStudentsCount: Math.max(affectedCount, 1),
        dominantError: s.dominantError,
        pedagogicalSuggestion: pedagogicalTips[s.stageId] || '세로셈 격자 도구와 수 모형을 활용하여 단계별로 검산하도록 지도합니다.',
      };
    });
  },

  // Breakdown of calculation error types across the class
  computeErrorTypeBreakdown(studentsMap: Record<string, StudentData>): { type: string; count: number; percent: number }[] {
    const errorCounts: Record<string, number> = {
      '올림 누락': 0,
      '자릿값 오류': 0,
      '두 자리 수 곱셈 자리 정렬 오류': 0,
      '구구단 오류': 0,
      '중간 계산 오류': 0,
      '일의 자리 계산 오류': 0,
      '덧셈 오류': 0,
      '어림 판단 오류': 0,
    };

    let total = 0;
    Object.values(studentsMap).forEach((s) => {
      Object.values(s.stages).forEach((stage) => {
        stage.wrongQuestions.forEach((wq) => {
          if (wq.errorType) {
            errorCounts[wq.errorType] = (errorCounts[wq.errorType] || 0) + 1;
            total++;
          }
        });
      });
    });

    if (total === 0) {
      // Default baseline weights for display
      return Object.keys(errorCounts).map(type => ({ type, count: 0, percent: 0 }));
    }

    return Object.entries(errorCounts)
      .map(([type, count]) => ({
        type,
        count,
        percent: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  },

  // Detect SOS Students (Students needing immediate intervention)
  detectSosStudents(studentsMap: Record<string, StudentData>): SosStudentInsight[] {
    const students = Object.values(studentsMap);
    const classOverview = this.computeClassOverview(studentsMap);
    const avgAcc = classOverview.averageAccuracy;

    const sosList: SosStudentInsight[] = [];

    students.forEach((student) => {
      const reasons: string[] = [];
      const vulnerableStages: number[] = [];
      const errTypeCount: Record<string, number> = {};

      const totalSolved = student.totalCorrect + student.totalWrong;
      const studentAcc = totalSolved > 0 ? (student.totalCorrect / totalSolved) * 100 : 100;

      // Check 1: Accuracy significantly below class average
      if (totalSolved >= 10 && studentAcc < avgAcc - 15) {
        reasons.push(`학급 평균 정답률(${avgAcc}%) 대비 현저히 낮음 (${Math.round(studentAcc)}%)`);
      }

      // Check 2: Lingering in remedial stage / multiple wrong questions
      let remedialStageCount = 0;
      Object.values(student.stages).forEach((st) => {
        if (st.mastery === '보충' || (st.tryCount > 0 && st.wrongCount >= 4)) {
          remedialStageCount++;
          vulnerableStages.push(st.stageId);
        }
        st.wrongQuestions.forEach((wq) => {
          if (wq.retryCount >= 2) {
            reasons.push(`${st.stageId}차시 동일 문제 ${wq.retryCount}회 이상 반복 오답`);
          }
          if (wq.errorType) {
            errTypeCount[wq.errorType] = (errTypeCount[wq.errorType] || 0) + 1;
          }
        });
      });

      if (remedialStageCount >= 2) {
        reasons.push(`보충 학습 단계에 2개 이상 차시가 정체됨`);
      }

      // Check 3: High hint reliance
      if (student.totalHints >= 8) {
        reasons.push(`단계별 힌트 의존도 높음 (총 ${student.totalHints}회 사용)`);
      }

      // Check 4: Repeated specific error
      let dominantErrorType = '올림 누락';
      let maxErr = 0;
      for (const [err, cnt] of Object.entries(errTypeCount)) {
        if (cnt > maxErr) {
          maxErr = cnt;
          dominantErrorType = err;
        }
      }
      if (maxErr >= 3) {
        reasons.push(`'${dominantErrorType}' 유형 오류가 ${maxErr}회 이상 지속 반복됨`);
      }

      if (reasons.length > 0 || vulnerableStages.length > 0) {
        sosList.push({
          student,
          reasons: Array.from(new Set(reasons)),
          vulnerableStages: Array.from(new Set(vulnerableStages)),
          dominantErrorType,
          urgencyLevel: reasons.length >= 3 || studentAcc < 60 ? 'high' : 'medium',
        });
      }
    });

    return sosList.sort((a, b) => b.reasons.length - a.reasons.length);
  },

  // Export Student Accounts to CSV format with UTF-8 BOM
  exportAccountsToCsv(studentsMap: Record<string, StudentData>): void {
    const students = Object.values(studentsMap).sort((a, b) => a.account.number - b.account.number);
    let csvContent = '\uFEFF번호,이름,학생 아이디,초기 비밀번호,직업,레벨\n';

    students.forEach((s) => {
      const row = [
        s.account.number,
        `"${s.account.name}"`,
        s.account.id,
        s.account.password,
        `"${s.character.job}"`,
        s.character.level,
      ].join(',');
      csvContent += row + '\n';
    });

    downloadCsvBlob(csvContent, `수학_RPG_학생계정목록_${new Date().toISOString().slice(0, 10)}.csv`);
  },

  // Export Complete Learning Analytics to CSV format with UTF-8 BOM
  exportLearningAnalyticsToCsv(studentsMap: Record<string, StudentData>): void {
    const students = Object.values(studentsMap).sort((a, b) => a.account.number - b.account.number);
    let header = '\uFEFF번호,이름,아이디,직업,레벨,EXP,Gold,전체정답수,전체오답수,정답률(%),총힌트사용';

    for (let s = 1; s <= 12; s++) {
      header += `,${s}차시_정답률(%),${s}차시_달성수준`;
    }
    header += ',수학몬수집수,최근학습일시\n';

    let csvContent = header;

    students.forEach((s) => {
      const totalSolved = s.totalCorrect + s.totalWrong;
      const acc = totalSolved > 0 ? Math.round((s.totalCorrect / totalSolved) * 100) : 0;

      let row = [
        s.account.number,
        `"${s.account.name}"`,
        s.account.id,
        s.character.job,
        s.character.level,
        s.character.exp,
        s.character.gold,
        s.totalCorrect,
        s.totalWrong,
        acc,
        s.totalHints,
      ].join(',');

      for (let stageId = 1; stageId <= 12; stageId++) {
        const st = s.stages[stageId];
        if (st) {
          const stTotal = st.correctCount + st.wrongCount;
          const stAcc = stTotal > 0 ? Math.round((st.correctCount / stTotal) * 100) : 0;
          row += `,${stAcc},${st.mastery}`;
        } else {
          row += `,-,미완료`;
        }
      }

      row += `,${s.character.mathMonsters.length},"${s.lastLearningAt || '기록 없음'}"\n`;
      csvContent += row;
    });

    downloadCsvBlob(csvContent, `수학_RPG_학습분석종합_${new Date().toISOString().slice(0, 10)}.csv`);
  },
};

// Safe CSV Blob Downloader
function downloadCsvBlob(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
