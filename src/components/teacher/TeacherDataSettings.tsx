import React, { useState, useEffect } from 'react';
import { DataService } from '../../services/dataService';
import { GoogleSheetService, SheetRecord } from '../../services/googleSheetService';
import {
  Settings,
  RotateCcw,
  KeyRound,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Sheet,
  Link,
  RefreshCw,
  ExternalLink,
  Check,
} from 'lucide-react';

interface Props {
  onRefresh: () => void;
}

export const TeacherDataSettings: React.FC<Props> = ({ onRefresh }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Google Sheet Web App URL State
  const [webAppUrl, setWebAppUrl] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'not_connected' | 'testing'>('not_connected');

  useEffect(() => {
    const savedUrl = GoogleSheetService.getWebAppUrl();
    setWebAppUrl(savedUrl);
    if (savedUrl) {
      setConnectionStatus('connected');
    }
  }, []);

  const handleSaveAndTestUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    const trimmed = webAppUrl.trim();
    if (!trimmed) {
      GoogleSheetService.setWebAppUrl('');
      setConnectionStatus('not_connected');
      setNotice({ type: 'success', message: '스프레드시트 연동 URL이 초기화되었습니다.' });
      return;
    }

    setIsTesting(true);
    setConnectionStatus('testing');

    GoogleSheetService.setWebAppUrl(trimmed);
    const testResult = await GoogleSheetService.testConnection(trimmed);
    setIsTesting(false);

    if (testResult.success) {
      setConnectionStatus('connected');
      setNotice({ type: 'success', message: testResult.message });
    } else {
      setConnectionStatus('not_connected');
      setNotice({ type: 'error', message: testResult.message });
    }
  };

  const handleSyncFromSheet = async () => {
    if (!GoogleSheetService.isConfigured()) {
      setNotice({ type: 'error', message: '먼저 구글 스프레드시트 웹 앱 URL을 입력하고 저장해 주세요.' });
      return;
    }

    setIsSyncing(true);
    setNotice(null);

    const result = await GoogleSheetService.fetchAllRecords();
    setIsSyncing(false);

    if (result.success) {
      setNotice({
        type: 'success',
        message: `구글 스프레드시트에서 총 ${result.records.length}건의 실시간 학습 기록을 성공적으로 확인했습니다.`,
      });
      onRefresh();
    } else {
      setNotice({
        type: 'error',
        message: `스프레드시트 동기화 실패: ${result.error || '연결을 확인해 주세요.'}`,
      });
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!newPassword.trim()) {
      setNotice({ type: 'error', message: '새 비밀번호를 입력해 주세요.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setNotice({ type: 'error', message: '새 비밀번호와 확인 번호가 일치하지 않습니다.' });
      return;
    }

    DataService.setTeacherPassword(newPassword.trim());
    setNotice({ type: 'success', message: '선생님 관리자 비밀번호가 성공적으로 변경되었습니다.' });
    setNewPassword('');
    setConfirmPassword('');
  };

  // Reset only learning progress
  const handleResetLearningProgress = () => {
    if (window.confirm('모든 학생의 1~12차시 풀이 기록, 오답노트, 정답률만 초기화하시겠습니까? (캐릭터 레벨, 아이템, 계정 정보는 안전하게 유지됩니다)')) {
      const students = DataService.getAllStudents();
      Object.values(students).forEach((s) => {
        s.stages = {};
        s.totalCorrect = 0;
        s.totalWrong = 0;
        s.totalHints = 0;
        s.comboStreak = 0;
        DataService.saveStudentData(s);
      });
      setNotice({ type: 'success', message: '모든 학생의 학습 진행 기록이 초기화되었습니다.' });
      onRefresh();
    }
  };

  // Regenerate 15 Realistic Demo Students
  const handleRegenerateDemoClass = () => {
    if (window.confirm('현재 학급 데이터를 15명의 실전 데모 학생(다양한 직업, 레벨, 1~12차시 성취도, 오답 기록 포함)으로 새로고침하시겠습니까?')) {
      DataService.resetAndGenerateDemo();
      setNotice({ type: 'success', message: '15명의 덧셈과 뺄셈 탐험대 데모 학급이 성공적으로 생성되었습니다!' });
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Notice */}
      {notice && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-2xs ${
            notice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
          <span>{notice.message}</span>
        </div>
      )}

      {/* Top Banner: Google Spreadsheet Integration */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <Sheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span>구글 스프레드시트 실시간 연동 (Apps Script)</span>
                {connectionStatus === 'connected' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    연결됨
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                    미연결
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Apps Script 배포 완료 후 발급된 <strong>웹 앱 URL</strong>을 아래에 등록하면, 학생 제출 결과가 구글 스프레드시트 '응답결과' 시트에 실시간 자동 누적됩니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSyncFromSheet}
            disabled={isSyncing || !GoogleSheetService.isConfigured()}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? '동기화 확인 중...' : '스프레드시트 데이터 동기화'}</span>
          </button>
        </div>

        {/* URL Form */}
        <form onSubmit={handleSaveAndTestUrl} className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Link className="w-3.5 h-3.5 text-indigo-600" />
              <span>Google Apps Script 웹 앱 URL (Web App URL)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={webAppUrl}
                onChange={(e) => setWebAppUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 font-mono text-slate-900 focus:border-indigo-600 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isTesting}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>연결 검사 중...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>저장 및 연결 테스트</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">📌 간편 연동 3단계 가이드:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px] leading-relaxed text-slate-500">
              <li>구글 스프레드시트의 <strong>[확장 프로그램] &gt; [Apps Script]</strong>에 제공된 전체 스크립트를 붙여넣고 저장합니다.</li>
              <li>우측 상단 <strong>[배포] &gt; [새 배포]</strong> 클릭 후 <strong>액세스 권한: 모든 사용자(Anyone)</strong>로 설정하여 배포합니다.</li>
              <li>배포 완료 후 생성된 <strong>웹 앱 URL</strong>을 위 입력창에 붙여넣고 <strong>[저장 및 연결 테스트]</strong>를 누르면 연동이 완료됩니다.</li>
            </ol>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Data Reset & Demo Generation */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              학습 데이터 초기화 및 데모 재성성
            </h3>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <span>① 학습 기록만 초기화</span>
            </h4>
            <p className="text-xs text-slate-500">
              학생 계정과 캐릭터 장비는 유지하고, 1~12차시 풀이 기록과 오답 노트만 비워 새 학기나 새로운 단원 평가를 시작합니다.
            </p>
            <button
              type="button"
              onClick={handleResetLearningProgress}
              className="px-3 py-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-xs transition-colors"
            >
              학습 기록 초기화 실행
            </button>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>② 15명 실전 데모 학급 새로고침</span>
            </h4>
            <p className="text-xs text-slate-500">
              다양한 학습 수준(심화/기본/보충), 직업, 오답 유형이 골고루 반영된 15명 모범 데이터를 즉시 생성합니다.
            </p>
            <button
              type="button"
              onClick={handleRegenerateDemoClass}
              className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs transition-colors"
            >
              데모 학급 데이터 재부팅
            </button>
          </div>
        </div>

        {/* Card 2: Teacher Password Setting */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              선생님 관리자 비밀번호 변경
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            대시보드 접속에 사용되는 관리자 암호를 변경합니다. (기본값: 0000)
          </p>

          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">새 비밀번호</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 관리자 암호 입력"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-900 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 관리자 암호 다시 입력"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-900 font-semibold"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors"
            >
              선생님 비밀번호 변경 저장
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

