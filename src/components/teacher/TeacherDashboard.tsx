import React, { useState } from 'react';
import { StudentData } from '../../types';
import { DataService } from '../../services/dataService';
import { GoogleSheetService } from '../../services/googleSheetService';
import { TeacherOverview } from './TeacherOverview';
import { TeacherStageAnalysis } from './TeacherStageAnalysis';
import { TeacherStudentList } from './TeacherStudentList';
import { TeacherSosFilter } from './TeacherSosFilter';
import { TeacherAccountManager } from './TeacherAccountManager';
import { TeacherDataSettings } from './TeacherDataSettings';
import { TeacherRemarksManager } from './TeacherRemarksManager';
import { TeacherStudentDetailModal } from './TeacherStudentDetailModal';
import { PrintableStudentCards } from './PrintableStudentCards';
import {
  LayoutDashboard,
  BarChart2,
  Users,
  ShieldAlert,
  UserCheck,
  Settings,
  LogOut,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  Sheet,
} from 'lucide-react';

interface Props {
  onLogout: () => void;
  onSwitchToStudentView: () => void;
}

export const TeacherDashboard: React.FC<Props> = ({ onLogout, onSwitchToStudentView }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stages' | 'students' | 'sos' | 'remarks' | 'accounts' | 'settings'>('overview');
  const [studentsMap, setStudentsMap] = useState<Record<string, StudentData>>(() => DataService.getAllStudents());
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentData | null>(null);
  const [showPrintCards, setShowPrintCards] = useState<boolean>(false);

  const refreshData = () => {
    setStudentsMap(DataService.getAllStudents());
    if (selectedStudentForModal) {
      const updated = DataService.getStudentData(selectedStudentForModal.account.id);
      if (updated) setSelectedStudentForModal(updated);
    }
  };

  const tabs: { id: typeof activeTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: '학급 현황', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'stages', label: '차시별 분석', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'students', label: '학생별 성장', icon: <Users className="w-4 h-4" /> },
    { id: 'sos', label: 'SOS 학생 진단', icon: <ShieldAlert className="w-4 h-4 text-rose-500" /> },
    { id: 'remarks', label: 'AI 수학 평어 관리', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { id: 'accounts', label: '학생 계정 관리', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'settings', label: '데이터 설정', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans flex flex-col select-none">
      {/* Top Professional Navigation Bar */}
      <nav className="flex items-center justify-between px-6 sm:px-8 py-3.5 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 font-sans">
                  MathRPG Pro
                </span>
                <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-wider">
                  Teacher Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                초등 1학년 2학기 덧셈과 뺄셈 맞춤형 학습 진단 & 분석 시스템
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'text-indigo-600 bg-indigo-50/80 font-bold border-b-2 border-indigo-600'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right User & Actions */}
        <div className="flex items-center gap-3">
          {/* Google Sheets Status Pill */}
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
              GoogleSheetService.isConfigured()
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            title="구글 스프레드시트 연동 설정 바로가기"
          >
            <Sheet className={`w-3.5 h-3.5 ${GoogleSheetService.isConfigured() ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{GoogleSheetService.isConfigured() ? '시트 연동중' : '시트 미연동'}</span>
          </button>

          <button
            type="button"
            onClick={onSwitchToStudentView}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">학생 원정대 화면</span>
          </button>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-slate-900">1학년 4반 담임교사</span>
            <span className="text-[10px] text-slate-500 font-medium">Class Admin</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs">
            TC
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
            title="로그아웃"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Subnav for Mobile/Tablet */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex gap-2 overflow-x-auto shadow-sm sticky top-[61px] z-20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-md ${
              activeTab === tab.id
                ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'overview' && (
          <TeacherOverview
            studentsMap={studentsMap}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
            onOpenPrintCards={() => setShowPrintCards(true)}
          />
        )}

        {activeTab === 'stages' && (
          <TeacherStageAnalysis studentsMap={studentsMap} />
        )}

        {activeTab === 'students' && (
          <TeacherStudentList
            studentsMap={studentsMap}
            onSelectStudent={(st) => setSelectedStudentForModal(st)}
          />
        )}

        {activeTab === 'sos' && (
          <TeacherSosFilter
            studentsMap={studentsMap}
            onSelectStudent={(st) => setSelectedStudentForModal(st)}
          />
        )}

        {activeTab === 'remarks' && (
          <TeacherRemarksManager
            studentsMap={studentsMap}
            onRefresh={refreshData}
            onSelectStudent={(st) => setSelectedStudentForModal(st)}
          />
        )}

        {activeTab === 'accounts' && (
          <TeacherAccountManager
            studentsMap={studentsMap}
            onRefresh={refreshData}
            onOpenPrintCards={() => setShowPrintCards(true)}
          />
        )}

        {activeTab === 'settings' && (
          <TeacherDataSettings onRefresh={refreshData} />
        )}
      </main>

      {/* Modals */}
      {selectedStudentForModal && (
        <TeacherStudentDetailModal
          student={selectedStudentForModal}
          onClose={() => setSelectedStudentForModal(null)}
          onUpdate={refreshData}
        />
      )}

      {showPrintCards && (
        <PrintableStudentCards
          students={Object.values(studentsMap)}
          onClose={() => setShowPrintCards(false)}
        />
      )}
    </div>
  );
};
