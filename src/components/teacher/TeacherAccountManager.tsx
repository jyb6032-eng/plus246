import React, { useState } from 'react';
import { StudentData, JobType } from '../../types';
import { DataService } from '../../services/dataService';
import { AnalysisService } from '../../services/analysisService';
import {
  UserPlus,
  Users,
  KeyRound,
  Download,
  Printer,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Search,
  CheckSquare,
  Square,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface Props {
  studentsMap: Record<string, StudentData>;
  onRefresh: () => void;
  onOpenPrintCards: () => void;
}

type ConfirmModalType = 'delete_single' | 'reset_single' | 'delete_bulk' | 'reset_bulk' | 'password_bulk' | null;

export const TeacherAccountManager: React.FC<Props> = ({
  studentsMap,
  onRefresh,
  onOpenPrintCards,
}) => {
  const [mode, setMode] = useState<'list' | 'single' | 'bulk'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal confirmation states
  const [confirmModal, setConfirmModal] = useState<{
    type: ConfirmModalType;
    student?: StudentData;
    ids?: string[];
  } | null>(null);

  // Single student form
  const [singleName, setSingleName] = useState('');
  const [singleGrade, setSingleGrade] = useState(1);
  const [singleClass, setSingleClass] = useState(4);
  const [singleNumber, setSingleNumber] = useState(16);
  const [singleJob, setSingleJob] = useState<JobType>('warrior');

  // Bulk creation form
  const [bulkGrade, setBulkGrade] = useState(1);
  const [bulkClass, setBulkClass] = useState(4);
  const [bulkStartNo, setBulkStartNo] = useState(1);
  const [bulkEndNo, setBulkEndNo] = useState(20);

  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const allStudents: StudentData[] = (Object.values(studentsMap) as StudentData[]).sort(
    (a, b) => a.account.number - b.account.number
  );

  const filteredStudents = allStudents.filter(
    (s) =>
      s.account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.account.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.account.number).includes(searchTerm)
  );

  // Select all / Deselect all
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.account.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Single student create submit
  const handleSingleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    const studentName = singleName.trim() || `${singleNumber}번 학생`;
    const padNo = String(singleNumber).padStart(2, '0');
    const id = `${singleGrade}${singleClass}${padNo}`;

    if (studentsMap[id]) {
      setNotice({ type: 'error', message: `이미 존재하는 학생 아이디입니다: ${id}` });
      return;
    }

    const defaultSkills: Record<JobType, string[]> = {
      warrior: ['warrior_focus_sword'],
      wizard: ['wizard_magic_circle'],
      healer: ['healer_light'],
      explorer: ['explorer_eye'],
    };

    const newStudent: StudentData = {
      schemaVersion: 1,
      account: {
        id,
        name: studentName,
        grade: singleGrade,
        classNo: singleClass,
        number: singleNumber,
        password: '1234',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      character: {
        nickname: studentName,
        job: singleJob,
        level: 1,
        exp: 0,
        gold: 100,
        appearance: {
          base: 'boy1',
          hairStyle: 'short',
          hairColor: 'black',
          outfit: 'adventurer',
        },
        equipment: { weapon: null, armor: null, head: null, accessory: null, background: null, badge: null },
        inventory: [],
        skills: defaultSkills[singleJob] || ['warrior_focus_sword'],
        titles: ['초보 모험가'],
        activeTitle: '초보 모험가',
        mathMonsters: [],
      },
      stages: {},
      totalCorrect: 0,
      totalWrong: 0,
      totalHints: 0,
      totalRetries: 0,
      comboStreak: 0,
      maxCombo: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DataService.saveStudentData(newStudent);
    setNotice({ type: 'success', message: `${studentName} 계정(${id})이 성공적으로 생성되었습니다!` });
    setSingleName('');
    setSingleNumber((prev) => prev + 1);
    onRefresh();
  };

  // Bulk creation
  const handleBulkCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (bulkStartNo > bulkEndNo) {
      setNotice({ type: 'error', message: '시작 번호가 끝 번호보다 클 수 없습니다.' });
      return;
    }

    const jobs: JobType[] = ['warrior', 'wizard', 'healer', 'explorer'];
    const defaultSkills: Record<JobType, string[]> = {
      warrior: ['warrior_focus_sword'],
      wizard: ['wizard_magic_circle'],
      healer: ['healer_light'],
      explorer: ['explorer_eye'],
    };

    let createdCount = 0;

    for (let no = bulkStartNo; no <= bulkEndNo; no++) {
      const padNo = String(no).padStart(2, '0');
      const id = `${bulkGrade}${bulkClass}${padNo}`;
      const name = `${no}번 학생`;
      const job = jobs[(no - 1) % jobs.length];

      if (!studentsMap[id]) {
        const student: StudentData = {
          schemaVersion: 1,
          account: {
            id,
            name,
            grade: bulkGrade,
            classNo: bulkClass,
            number: no,
            password: '1234',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          character: {
            nickname: name,
            job,
            level: 1,
            exp: 0,
            gold: 100,
            appearance: { base: 'boy1', hairStyle: 'short', hairColor: 'black', outfit: 'adventurer' },
            equipment: { weapon: null, armor: null, head: null, accessory: null, background: null, badge: null },
            inventory: [],
            skills: defaultSkills[job] || ['warrior_focus_sword'],
            titles: ['초보 모험가'],
            activeTitle: '초보 모험가',
            mathMonsters: [],
          },
          stages: {},
          totalCorrect: 0,
          totalWrong: 0,
          totalHints: 0,
          totalRetries: 0,
          comboStreak: 0,
          maxCombo: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        DataService.saveStudentData(student);
        createdCount++;
      }
    }

    setNotice({
      type: 'success',
      message: `${createdCount}명의 학생 번호 계정(${bulkGrade}${bulkClass}${String(bulkStartNo).padStart(2, '0')} ~ ${bulkGrade}${bulkClass}${String(bulkEndNo).padStart(2, '0')})이 성공적으로 일괄 생성되었습니다!`,
    });
    onRefresh();
    setMode('list');
  };

  // Perform confirmed action
  const handleExecuteModalAction = () => {
    if (!confirmModal) return;

    if (confirmModal.type === 'delete_single' && confirmModal.student) {
      const { id, name } = confirmModal.student.account;
      DataService.deleteStudentAccount(id);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      setNotice({ type: 'success', message: `${name} 학생 계정(${id})이 완전히 삭제되었습니다.` });
    } else if (confirmModal.type === 'reset_single' && confirmModal.student) {
      const { id, name } = confirmModal.student.account;
      DataService.resetStudentProgress(id);
      setNotice({
        type: 'success',
        message: `${name} 학생(${id})의 모든 학습 진행도 및 캐릭터 데이터가 초기화되었습니다. (비밀번호 유지)`,
      });
    } else if (confirmModal.type === 'delete_bulk' && confirmModal.ids) {
      let count = 0;
      confirmModal.ids.forEach((id) => {
        if (DataService.deleteStudentAccount(id)) count++;
      });
      setSelectedIds([]);
      setNotice({ type: 'success', message: `선택한 ${count}명의 학생 계정이 완전히 삭제되었습니다.` });
    } else if (confirmModal.type === 'reset_bulk' && confirmModal.ids) {
      let count = 0;
      confirmModal.ids.forEach((id) => {
        if (DataService.resetStudentProgress(id)) count++;
      });
      setNotice({
        type: 'success',
        message: `선택한 ${count}명의 학생 학습 데이터가 초기화되었습니다. (비밀번호 유지)`,
      });
    } else if (confirmModal.type === 'password_bulk' && confirmModal.ids) {
      let count = 0;
      confirmModal.ids.forEach((id) => {
        if (DataService.resetStudentPassword(id, '1234')) count++;
      });
      setNotice({ type: 'success', message: `${count}명 학생의 비밀번호가 1234로 초기화되었습니다.` });
    }

    setConfirmModal(null);
    onRefresh();
  };

  const handleExportAccountsCsv = () => {
    AnalysisService.exportAccountsToCsv(studentsMap);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-base font-bold font-jua text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" />
            <span>학생 계정 및 데이터 관리 ({allStudents.length}명)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            학생 개별/일괄 등록, 학생별 학습 데이터 초기화, 개별 계정 영구 삭제, 비밀번호 초기화 및 A4 카드 인쇄를 지원합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setMode('list')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'list' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            계정 목록 ({allStudents.length})
          </button>
          <button
            onClick={() => setMode('single')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'single' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> 개별 등록
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'bulk' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> 일괄 등록
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2 shadow-sm ${
            notice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
            <span>{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-xs opacity-60 hover:opacity-100 font-normal">
            닫기
          </button>
        </div>
      )}

      {/* Mode 1: Accounts Table */}
      {mode === 'list' && (
        <div className="space-y-4">
          {/* Top Actions & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="이름, 번호, 아이디 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Print & CSV Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onOpenPrintCards}
                className="rpg-btn px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>A4 로그인 카드 인쇄</span>
              </button>

              <button
                onClick={handleExportAccountsCsv}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV 명단 다운로드</span>
              </button>
            </div>
          </div>

          {/* Bulk Selection Action Bar */}
          {selectedIds.length > 0 && (
            <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl flex items-center justify-between flex-wrap gap-2 animate-fadeIn">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <span>선택된 학생: {selectedIds.length}명</span>
              </span>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setConfirmModal({ type: 'reset_bulk', ids: selectedIds })}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>선택 학생 학습 데이터 초기화</span>
                </button>
                <button
                  onClick={() => setConfirmModal({ type: 'password_bulk', ids: selectedIds })}
                  className="px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>비밀번호 1234로 초기화</span>
                </button>
                <button
                  onClick={() => setConfirmModal({ type: 'delete_bulk', ids: selectedIds })}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>선택 학생 계정 삭제</span>
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-inner">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">
                    <button
                      onClick={handleToggleSelectAll}
                      className="text-slate-500 hover:text-slate-800 p-0.5"
                      title="전체 선택/해제"
                    >
                      {selectedIds.length > 0 && selectedIds.length === filteredStudents.length ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 px-3">번호</th>
                  <th className="py-2.5 px-3">이름</th>
                  <th className="py-2.5 px-3">아이디</th>
                  <th className="py-2.5 px-3">비밀번호</th>
                  <th className="py-2.5 px-3">직업 / 레벨</th>
                  <th className="py-2.5 px-3">완료 차시</th>
                  <th className="py-2.5 px-3 text-center">학습 초기화</th>
                  <th className="py-2.5 px-3 text-center">비번 초기화</th>
                  <th className="py-2.5 px-3 text-right">개별 삭제</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400 font-bold">
                      {searchTerm ? '검색 조건에 맞는 학생이 없습니다.' : '등록된 학생이 없습니다.'}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const isSelected = selectedIds.includes(s.account.id);
                    const completedStagesCount = Object.values(s.stages).filter((st) => st.completed).length;

                    return (
                      <tr
                        key={s.account.id}
                        className={`transition-colors ${isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50'}`}
                      >
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleToggleSelect(s.account.id)}
                            className="text-slate-400 hover:text-indigo-600 p-0.5"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-700">{s.account.number}번</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{s.account.name}</td>
                        <td className="py-2.5 px-3 font-mono text-sky-700 font-semibold">{s.account.id}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{s.account.password}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                            {s.character.job === 'warrior' && '⚔️ 전사'}
                            {s.character.job === 'wizard' && '🔮 마법사'}
                            {s.character.job === 'healer' && '🌿 힐러'}
                            {s.character.job === 'explorer' && '🏹 탐험가'}
                            <span className="text-[11px] px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-mono font-bold ml-1">
                              Lv.{s.character.level}
                            </span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-600">
                          <span className={completedStagesCount > 0 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                            {completedStagesCount} / 12차시
                          </span>
                        </td>
                        {/* Action 1: Reset Progress */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => setConfirmModal({ type: 'reset_single', student: s })}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-[11px] font-bold transition-colors"
                            title="모든 스테이지 진행도 및 캐릭터 데이터 초기화"
                          >
                            <RotateCcw className="w-3 h-3 text-amber-600" />
                            <span>데이터 초기화</span>
                          </button>
                        </td>
                        {/* Action 2: Reset Password */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              DataService.resetStudentPassword(s.account.id, '1234');
                              setNotice({
                                type: 'success',
                                message: `${s.account.name} 학생의 비밀번호가 1234로 초기화되었습니다.`,
                              });
                              onRefresh();
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-bold transition-colors"
                            title="비밀번호 1234로 초기화"
                          >
                            <KeyRound className="w-3 h-3 text-slate-600" />
                            <span>1234 설정</span>
                          </button>
                        </td>
                        {/* Action 3: Delete Individual Account */}
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setConfirmModal({ type: 'delete_single', student: s })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-[11px] font-bold transition-colors"
                            title="학생 계정 영구 삭제"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" />
                            <span>삭제</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Summary Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>총 {allStudents.length}명의 학생 등록됨</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>데이터 초기화: 진행도/레벨/보물 초기화 (계정 보존)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>삭제: 학생 계정 영구 삭제</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Single Student Create */}
      {mode === 'single' && (
        <form onSubmit={handleSingleCreate} className="max-w-md space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
            <UserPlus className="w-4 h-4 text-sky-600" />
            <h4 className="font-bold text-sm text-slate-800">새로운 학생 개별 등록</h4>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">학년</label>
              <input
                type="number"
                value={singleGrade}
                onChange={(e) => setSingleGrade(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white font-bold"
                min={1}
                max={6}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">반</label>
              <input
                type="number"
                value={singleClass}
                onChange={(e) => setSingleClass(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white font-bold"
                min={1}
                max={20}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">번호</label>
              <input
                type="number"
                value={singleNumber}
                onChange={(e) => setSingleNumber(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white font-bold"
                min={1}
                max={50}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              학생 표시 이름 <span className="text-slate-400 font-normal">(개인정보 보호 기본: 번호 학생)</span>
            </label>
            <input
              type="text"
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
              placeholder={`예: ${singleNumber}번 학생`}
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">초기 직업 선택</label>
            <select
              value={singleJob}
              onChange={(e) => setSingleJob(e.target.value as JobType)}
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white font-bold text-slate-800"
            >
              <option value="warrior">⚔️ 전사 (콤보 강화, 기본 무기 지급)</option>
              <option value="wizard">🔮 마법사 (계산 격자 및 퍼즐 강화)</option>
              <option value="healer">🌿 힐러 (10칸 상자 및 수 모형 힌트 강화)</option>
              <option value="explorer">🏹 탐험가 (정답 범위 감지)</option>
            </select>
          </div>

          <div className="p-3 bg-sky-50 text-sky-800 text-xs rounded-xl border border-sky-200">
            <span>💡 생성 시 학생 아이디는 <strong>{singleGrade}{singleClass}{String(singleNumber).padStart(2, '0')}</strong> 형태로 자동 지정되며, 초기 비밀번호는 <strong>1234</strong> 입니다. (개인정보 보호 번호 계정)</span>
          </div>

          <button
            type="submit"
            className="rpg-btn w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow transition-all"
          >
            학생 계정 생성 완료
          </button>
        </form>
      )}

      {/* Mode 3: Bulk Create */}
      {mode === 'bulk' && (
        <form onSubmit={handleBulkCreate} className="max-w-md space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
            <Users className="w-4 h-4 text-sky-600" />
            <h4 className="font-bold text-sm text-slate-800">학급 번호 범위 일괄 계정 생성</h4>
          </div>
          <p className="text-xs text-slate-500">
            시작 번호부터 끝 번호까지 개인정보 보호를 위한 번호 계정(아이디: {bulkGrade}{bulkClass}{String(bulkStartNo).padStart(2, '0')}~)과 직업을 자동으로 배정하여 일괄 생성합니다. (기존 번호는 보존됩니다)
          </p>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">학년</label>
              <input
                type="number"
                value={bulkGrade}
                onChange={(e) => setBulkGrade(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white font-bold"
                min={1}
                max={6}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">반</label>
              <input
                type="number"
                value={bulkClass}
                onChange={(e) => setBulkClass(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white font-bold"
                min={1}
                max={20}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">시작 번호</label>
              <input
                type="number"
                value={bulkStartNo}
                onChange={(e) => setBulkStartNo(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white font-bold"
                min={1}
                max={50}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">끝 번호</label>
              <input
                type="number"
                value={bulkEndNo}
                onChange={(e) => setBulkEndNo(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white font-bold"
                min={1}
                max={50}
              />
            </div>
          </div>

          <div className="p-3 bg-sky-50 text-sky-800 text-xs rounded-xl border border-sky-200">
            <span>💡 생성될 계정 수: <strong>{Math.max(0, bulkEndNo - bulkStartNo + 1)}명</strong> (초기 비밀번호 1234)</span>
          </div>

          <button
            type="submit"
            className="rpg-btn w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow transition-all"
          >
            {bulkEndNo - bulkStartNo + 1}명 일괄 생성 실행
          </button>
        </form>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-scaleUp">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  confirmModal.type?.includes('delete')
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-amber-100 text-amber-600'
                }`}
              >
                {confirmModal.type?.includes('delete') ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : (
                  <RotateCcw className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="font-bold font-jua text-base text-slate-900">
                  {confirmModal.type === 'delete_single' && '학생 계정 개별 삭제 확인'}
                  {confirmModal.type === 'reset_single' && '학생 학습 데이터 초기화 확인'}
                  {confirmModal.type === 'delete_bulk' && '선택 학생 계정 일괄 삭제 확인'}
                  {confirmModal.type === 'reset_bulk' && '선택 학생 학습 데이터 일괄 초기화'}
                  {confirmModal.type === 'password_bulk' && '선택 학생 비밀번호 일괄 초기화'}
                </h4>
                <p className="text-xs text-slate-500">
                  {confirmModal.type?.includes('delete')
                    ? '삭제된 계정은 복구할 수 없습니다.'
                    : '학습 진행 기록이 초기화됩니다.'}
                </p>
              </div>
            </div>

            {/* Target Description */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              {confirmModal.student && (
                <div>
                  <div className="font-bold text-slate-800 text-sm">
                    {confirmModal.student.account.number}번 {confirmModal.student.account.name} (
                    <span className="font-mono text-sky-700">{confirmModal.student.account.id}</span>)
                  </div>
                  <div className="text-slate-600 mt-1 flex gap-3">
                    <span>레벨: <strong>Lv.{confirmModal.student.character.level}</strong></span>
                    <span>완료 차시: <strong>{(Object.values(confirmModal.student.stages) as import('../../types').StageRecord[]).filter(s => s.completed).length}개</strong></span>
                    <span>골드: <strong>{confirmModal.student.character.gold}G</strong></span>
                  </div>
                </div>
              )}

              {confirmModal.ids && (
                <div>
                  <span className="font-bold text-slate-800">
                    선택된 총 {confirmModal.ids.length}명의 학생 계정 대상
                  </span>
                  <div className="text-slate-500 text-[11px] mt-1 line-clamp-2">
                    {confirmModal.ids.join(', ')}
                  </div>
                </div>
              )}

              <div
                className={`p-2.5 rounded-lg font-medium text-xs ${
                  confirmModal.type?.includes('delete')
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}
              >
                {confirmModal.type === 'delete_single' &&
                  '⚠️ 학생 계정, 로그인 자격 증명, 캐릭터 및 모든 학습 데이터가 영구히 제거됩니다.'}
                {confirmModal.type === 'reset_single' &&
                  '🔄 계정 아이디와 비밀번호는 그대로 유지되며, 스테이지 클리어 기록, 오답 노트, 캐릭터 레벨/장비만 처음 상태(1레벨, 100G)로 초기화됩니다.'}
                {confirmModal.type === 'delete_bulk' &&
                  `⚠️ 선택한 ${confirmModal.ids?.length}명의 모든 학생 계정이 영구 삭제됩니다.`}
                {confirmModal.type === 'reset_bulk' &&
                  `🔄 선택한 ${confirmModal.ids?.length}명의 학생 학습 진행도와 캐릭터가 처음 상태로 초기화됩니다. (계정/비밀번호 유지)`}
                {confirmModal.type === 'password_bulk' &&
                  `🔑 선택한 ${confirmModal.ids?.length}명의 비밀번호가 [1234]로 변경됩니다.`}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleExecuteModalAction}
                className={`rpg-btn px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 ${
                  confirmModal.type?.includes('delete')
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {confirmModal.type?.includes('delete') ? (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>영구 삭제 실행</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>초기화 실행</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
