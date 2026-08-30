import React, { useState } from 'react';
import { StudentData, JobType } from '../../types';
import { CharacterAvatar } from '../character/CharacterAvatar';
import {
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Shield,
  Wand2,
  HeartHandshake,
  Compass,
  Star,
  Coins,
} from 'lucide-react';

interface Props {
  studentsMap: Record<string, StudentData>;
  onSelectStudent: (student: StudentData) => void;
}

export const TeacherStudentList: React.FC<Props> = ({ studentsMap, onSelectStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'number' | 'name' | 'level' | 'accuracy' | 'exp' | 'gold'>('number');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const students: StudentData[] = Object.values(studentsMap);

  const filtered = students.filter((s) => {
    const matchSearch =
      s.account.name.includes(searchTerm) ||
      s.account.id.includes(searchTerm) ||
      String(s.account.number).includes(searchTerm) ||
      s.character.nickname.includes(searchTerm);

    const matchJob = jobFilter === 'all' || s.character.job === jobFilter;
    return matchSearch && matchJob;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'number') {
      cmp = a.account.number - b.account.number;
    } else if (sortBy === 'name') {
      cmp = a.account.name.localeCompare(b.account.name);
    } else if (sortBy === 'level') {
      cmp = a.character.level - b.character.level;
    } else if (sortBy === 'accuracy') {
      const aTotal = a.totalCorrect + a.totalWrong;
      const bTotal = b.totalCorrect + b.totalWrong;
      const aAcc = aTotal > 0 ? a.totalCorrect / aTotal : 0;
      const bAcc = bTotal > 0 ? b.totalCorrect / bTotal : 0;
      cmp = aAcc - bAcc;
    } else if (sortBy === 'exp') {
      cmp = a.character.exp - b.character.exp;
    } else if (sortBy === 'gold') {
      cmp = a.character.gold - b.character.gold;
    }
    return sortAsc ? cmp : -cmp;
  });

  const toggleSort = (type: typeof sortBy) => {
    if (sortBy === type) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(type);
      setSortAsc(true);
    }
  };

  const jobBadges: Record<JobType, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    warrior: { label: '전사', bg: 'bg-amber-100', text: 'text-amber-800', icon: <Shield className="w-3.5 h-3.5" /> },
    wizard: { label: '마법사', bg: 'bg-purple-100', text: 'text-purple-800', icon: <Wand2 className="w-3.5 h-3.5" /> },
    healer: { label: '힐러', bg: 'bg-emerald-100', text: 'text-emerald-800', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
    explorer: { label: '탐험가', bg: 'bg-sky-100', text: 'text-sky-800', icon: <Compass className="w-3.5 h-3.5" /> },
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-5">
      {/* Search & Filter Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="학생 이름, 번호, 아이디 검색..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none bg-slate-50 text-slate-800"
          />
        </div>

        {/* Job Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> 직업:
          </span>
          {['all', 'warrior', 'wizard', 'healer', 'explorer'].map((j) => (
            <button
              key={j}
              onClick={() => setJobFilter(j)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                jobFilter === j
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {j === 'all' ? '전체' : j === 'warrior' ? '전사' : j === 'wizard' ? '마법사' : j === 'healer' ? '힐러' : '탐험가'}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-400 border-b border-slate-200 select-none">
            <tr>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('number')}>
                <div className="flex items-center gap-1">
                  <span>번호</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">캐릭터</th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1">
                  <span>이름 / 아이디</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">직업</th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('level')}>
                <div className="flex items-center gap-1">
                  <span>레벨</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('accuracy')}>
                <div className="flex items-center gap-1">
                  <span>정답률</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">차시 완수</th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('gold')}>
                <div className="flex items-center gap-1">
                  <span>골드 / EXP</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">상세 관리</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {sorted.map((s) => {
              const totalSolved = s.totalCorrect + s.totalWrong;
              const acc = totalSolved > 0 ? Math.round((s.totalCorrect / totalSolved) * 100) : 0;
              const completedStages = Object.values(s.stages).filter(st => st.completed).length;
              const jb = jobBadges[s.character.job] || jobBadges.warrior;

              return (
                <tr key={s.account.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{s.account.number}번</td>
                  <td className="py-3.5 px-4">
                    <CharacterAvatar character={s.character} size="sm" showBadge={false} />
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900">{s.account.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{s.account.id}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${jb.bg} ${jb.text}`}>
                      {jb.icon}
                      <span>{jb.label}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">
                      Lv.{s.character.level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${acc >= 80 ? 'text-emerald-600' : acc >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {acc}%
                      </span>
                      <span className="text-[11px] text-slate-400">({s.totalCorrect}/{totalSolved})</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-indigo-600 text-xs">{completedStages}/12 차시</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-slate-800 font-semibold text-xs">
                      <Coins className="w-3 h-3 text-amber-500" />
                      <span>{s.character.gold} G</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{s.character.exp} EXP</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectStudent(s)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs inline-flex items-center gap-1 transition-colors border border-indigo-200/60 shadow-2xs"
                    >
                      <span>분석 / 보상</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
