import { StudentData, StageRecord } from '../types';
import { DataService } from './dataService';

export interface SheetRecord {
  rowNumber?: number;
  제출시간?: string;
  학생ID?: string;
  이름?: string;
  학년?: number;
  반?: number;
  번호?: number;
  직업?: string;
  레벨?: number;
  차시?: number;
  차시명?: string;
  성취도?: string;
  점수?: number;
  맞힌문제수?: number;
  틀린문제수?: number;
  '정답률(%)'?: number;
  재시도횟수?: number;
  힌트사용수?: number;
  최대콤보?: number;
  주요오답유형?: string;
  오답상세기록?: string;
  SOS지도대상?: string;
  획득골드?: number;
  획득EXP?: number;
  [key: string]: any;
}

export interface SheetResponse {
  success: boolean;
  message?: string;
  error?: string;
  row?: number;
  totalCount?: number;
  records?: SheetRecord[];
}

export const GoogleSheetService = {
  getWebAppUrl(): string {
    const settings = DataService.getTeacherSettings();
    return (settings.googleWebAppUrl || '').trim();
  },

  setWebAppUrl(url: string): void {
    const settings = DataService.getTeacherSettings();
    settings.googleWebAppUrl = url.trim();
    settings.updatedAt = new Date().toISOString();
    DataService.saveTeacherSettings(settings);
  },

  isConfigured(): boolean {
    const url = this.getWebAppUrl();
    return url.startsWith('https://script.google.com/macros/s/');
  },

  /**
   * Test connection to Apps Script Web App
   */
  async testConnection(customUrl?: string): Promise<{ success: boolean; message: string; recordCount?: number }> {
    const url = (customUrl || this.getWebAppUrl()).trim();
    if (!url) {
      return { success: false, message: 'Google Apps Script 웹 앱 URL이 입력되지 않았습니다.' };
    }

    if (!url.startsWith('https://script.google.com/macros/s/')) {
      return {
        success: false,
        message: '올바른 Apps Script 웹 앱 URL 형식이 아닙니다. (https://script.google.com/macros/s/.../exec)',
      };
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          message: `서버 응답 오류 (HTTP ${response.status}). 배포 권한이 '모든 사용자(Anyone)'로 되어 있는지 확인해 주세요.`,
        };
      }

      const data: SheetResponse = await response.json();
      if (data.success) {
        return {
          success: true,
          message: `스프레드시트 연결 성공! (현재 저장된 응답: ${data.totalCount || 0}건)`,
          recordCount: data.totalCount || 0,
        };
      } else {
        return {
          success: false,
          message: `스프레드시트 오류: ${data.error || '알 수 없는 오류'}`,
        };
      }
    } catch (err: any) {
      console.warn('Direct fetch test failed, trying mode notice:', err);
      return {
        success: false,
        message: '연결 실패: Google Apps Script 배포 시 [액세스 권한: 모든 사용자(Anyone)]로 설정되었는지 확인해 주세요.',
      };
    }
  },

  /**
   * Send student's stage completion result to Google Sheet (POST)
   */
  async submitStageResult(params: {
    student: StudentData;
    stageRecord: StageRecord;
    stageTitle: string;
    dominantError?: string;
    isSos?: boolean;
    earnedGold?: number;
    earnedExp?: number;
  }): Promise<SheetResponse> {
    const url = this.getWebAppUrl();
    if (!url) {
      return { success: false, error: 'Google Apps Script URL이 설정되지 않았습니다.' };
    }

    const totalSolved = params.stageRecord.correctCount + params.stageRecord.wrongCount;
    const accuracy = totalSolved > 0 ? Math.round((params.stageRecord.correctCount / totalSolved) * 100) : 0;

    const payload = {
      timestamp: new Date().toISOString(),
      studentId: params.student.account.id,
      name: params.student.account.name,
      grade: params.student.account.grade,
      classNo: params.student.account.classNo,
      number: params.student.account.number,
      job: params.student.character.job,
      level: params.student.character.level,
      stageId: params.stageRecord.stageId,
      stageTitle: params.stageTitle,
      mastery: params.stageRecord.mastery,
      score: params.stageRecord.score,
      totalCorrect: params.stageRecord.correctCount,
      totalWrong: params.stageRecord.wrongCount,
      accuracy,
      retries: params.stageRecord.tryCount - totalSolved > 0 ? params.stageRecord.tryCount - totalSolved : 0,
      hintsUsed: params.stageRecord.hintCount,
      maxCombo: params.student.maxCombo || 0,
      dominantError: params.dominantError || (params.stageRecord.wrongQuestions.length > 0 ? params.stageRecord.wrongQuestions[0].errorType : '없음'),
      errorDetails: params.stageRecord.wrongQuestions,
      isSos: Boolean(params.isSos),
      earnedGold: params.earnedGold || 0,
      earnedExp: params.earnedExp || 0,
      mode: 'overwrite', // keep latest per stage
    };

    try {
      // 1st Attempt: Standard fetch with text/plain (avoids OPTIONS preflight)
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
        });

        const resText = await response.text();
        try {
          const json = JSON.parse(resText);
          return json;
        } catch {
          return { success: true, message: '스프레드시트에 저장되었습니다.' };
        }
      } catch (directErr) {
        // 2nd Attempt Fallback: Google Apps Script no-cors mode POST
        // Browser won't block 302 redirect in no-cors mode, ensuring doPost(e) executes on Google servers
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify(payload),
        });

        return {
          success: true,
          message: '스프레드시트에 전송 완료되었습니다. (no-cors 모드)',
        };
      }
    } catch (err: any) {
      console.error('Failed to submit to Google Sheet:', err);
      return { success: false, error: err.message || '네트워크 전송 오류' };
    }
  },

  /**
   * Fetch all records from Google Sheet (GET)
   */
  async fetchAllRecords(): Promise<{ success: boolean; records: SheetRecord[]; error?: string }> {
    const url = this.getWebAppUrl();
    if (!url) {
      return { success: false, records: [], error: 'Google Apps Script URL이 설정되지 않았습니다.' };
    }

    try {
      const response = await fetch(`${url}?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        return { success: false, records: [], error: `HTTP ${response.status}` };
      }

      const data: SheetResponse = await response.json();
      return {
        success: data.success,
        records: data.records || [],
        error: data.error,
      };
    } catch (err: any) {
      return { success: false, records: [], error: err.message || '데이터 불러오기 실패' };
    }
  },
};
