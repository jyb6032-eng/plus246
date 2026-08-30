// Data Service: Encapsulates all data persistence (LocalStorage currently, Google Spreadsheet via Apps Script in Phase 2)
// UI and learning logic MUST NOT access localStorage directly!

import {
  StudentAccount,
  StudentData,
  TeacherSettings,
  StageRecord,
  WrongQuestionRecord,
  JobType,
} from '../types';
import { SKILLS_LIST } from './gameData';

const STORAGE_KEYS = {
  STUDENTS: 'math_rpg_students_v1',
  TEACHER_SETTINGS: 'math_rpg_teacher_settings_v1',
  CURRENT_STUDENT_SESSION: 'math_rpg_current_session_id',
  TEACHER_SESSION: 'math_rpg_teacher_session',
};

const CURRENT_SCHEMA_VERSION = 1;

// Default Teacher Settings
const DEFAULT_TEACHER_SETTINGS: TeacherSettings = {
  passwordHash: '0000', // default password
  defaultGrade: 1,
  defaultClassNo: 1,
  soundEffects: true,
  bgmEnabled: true,
  updatedAt: new Date().toISOString(),
};

// Safe parse helper
function safeParse<T>(jsonStr: string | null, fallback: T): T {
  if (!jsonStr) return fallback;
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error('Failed to parse JSON storage item', e);
    return fallback;
  }
}

// Data Migration & Normalization
export function migrateStudentData(raw: any): StudentData {
  const now = new Date().toISOString();
  
  const grade = Number(raw?.account?.grade) || 1;
  const classNo = Number(raw?.account?.classNo) || 4;
  const number = Number(raw?.account?.number) || 1;
  const padNum = String(number).padStart(2, '0');
  // Format ID as 1401 (grade + classNo + 2-digit number)
  const standardId = `${grade}${classNo}${padNum}`;
  const rawId = raw?.account?.id ? String(raw.account.id).trim() : '';
  const finalId = /^\d{4}$/.test(rawId) ? rawId : standardId;

  // Student name should only be number-based (e.g., '1번 학생') for privacy
  const studentDisplayName = `${number}번 학생`;
  
  // Base structure safety
  const student: StudentData = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    account: {
      id: finalId,
      password: raw?.account?.password || '1234',
      grade,
      classNo,
      number,
      name: studentDisplayName,
      createdAt: raw?.account?.createdAt || now,
      updatedAt: raw?.account?.updatedAt || now,
    },
    character: {
      nickname: studentDisplayName,
      job: (['warrior', 'wizard', 'healer', 'explorer'].includes(raw?.character?.job)
        ? raw.character.job
        : 'warrior') as JobType,
      level: Number(raw?.character?.level) || 1,
      exp: Number(raw?.character?.exp) || 0,
      gold: Number(raw?.character?.gold) || 50,
      appearance: {
        base: raw?.character?.appearance?.base || 'boy1',
        hairStyle: raw?.character?.appearance?.hairStyle || 'short',
        hairColor: raw?.character?.appearance?.hairColor || 'black',
        outfit: raw?.character?.appearance?.outfit || 'adventurer',
        skinTone: raw?.character?.appearance?.skinTone || 'fair',
      },
      inventory: Array.isArray(raw?.character?.inventory) ? raw.character.inventory : [],
      equipment: {
        weapon: raw?.character?.equipment?.weapon || null,
        armor: raw?.character?.equipment?.armor || null,
        head: raw?.character?.equipment?.head || null,
        accessory: raw?.character?.equipment?.accessory || null,
        background: raw?.character?.equipment?.background || null,
        badge: raw?.character?.equipment?.badge || null,
      },
      skills: Array.isArray(raw?.character?.skills) ? raw.character.skills : [],
      mathMonsters: Array.isArray(raw?.character?.mathMonsters) ? raw.character.mathMonsters : [],
      titles: Array.isArray(raw?.character?.titles) ? raw.character.titles : ['초보 모험가'],
      activeTitle: raw?.character?.activeTitle || '초보 모험가',
    },
    stages: {},
    totalCorrect: Number(raw?.totalCorrect) || 0,
    totalWrong: Number(raw?.totalWrong) || 0,
    totalHints: Number(raw?.totalHints) || 0,
    totalRetries: Number(raw?.totalRetries) || 0,
    comboStreak: Number(raw?.comboStreak) || 0,
    maxCombo: Number(raw?.maxCombo) || 0,
    remark: raw?.remark
      ? {
          evaluationText: raw.remark.evaluationText || '',
          dominantTrait: raw.remark.dominantTrait || '성실 탐구형',
          keyStrengths: Array.isArray(raw.remark.keyStrengths) ? raw.remark.keyStrengths : [],
          generatedAt: raw.remark.generatedAt || now,
          isEditedByUser: Boolean(raw.remark.isEditedByUser),
        }
      : undefined,
    lastLearningAt: raw?.lastLearningAt,
    createdAt: raw?.createdAt || now,
    updatedAt: now,
  };

  // Migrate skills if missing
  if (student.character.skills.length === 0) {
    const jobSkills = SKILLS_LIST.filter(s => s.job === student.character.job && s.unlockLevel <= student.character.level);
    student.character.skills = jobSkills.map(s => s.id);
  }

  // Ensure default initial weapon if empty
  if (student.character.inventory.length === 0) {
    const defaultWeapons: Record<JobType, string> = {
      warrior: 'w_sword_1',
      wizard: 'm_staff_1',
      healer: 'h_staff_1',
      explorer: 'e_bow_1',
    };
    const initWep = defaultWeapons[student.character.job];
    student.character.inventory.push(initWep);
    if (!student.character.equipment.weapon) {
      student.character.equipment.weapon = initWep;
    }
  }

  // Normalize stages 1~12
  if (raw?.stages && typeof raw.stages === 'object') {
    for (let s = 1; s <= 12; s++) {
      const st = raw.stages[s] || raw.stages[String(s)];
      if (st) {
        student.stages[s] = {
          stageId: s,
          completed: Boolean(st.completed),
          mastery: st.mastery || (st.completed ? '기본' : '보충'),
          score: Number(st.score) || 0,
          correctCount: Number(st.correctCount) || 0,
          wrongCount: Number(st.wrongCount) || 0,
          tryCount: Number(st.tryCount) || 0,
          hintCount: Number(st.hintCount) || 0,
          basicSolved: Number(st.basicSolved) || 0,
          advancedSolved: Number(st.advancedSolved) || 0,
          challengeSolved: Number(st.challengeSolved) || 0,
          applicationSolved: Number(st.applicationSolved) || 0,
          createdProblems: Number(st.createdProblems) || 0,
          wrongQuestions: Array.isArray(st.wrongQuestions) ? st.wrongQuestions : [],
          updatedAt: st.updatedAt || now,
        };
      }
    }
  }

  return student;
}

// -------------------------------------------------------------
// Core DataService Implementation
// -------------------------------------------------------------
export const DataService = {
  // --- Student Accounts & Data ---
  getAllStudents(): Record<string, StudentData> {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const map = safeParse<Record<string, any>>(raw, {});
    const result: Record<string, StudentData> = {};
    for (const [id, data] of Object.entries(map)) {
      result[id] = migrateStudentData(data);
    }
    return result;
  },

  getStudentData(studentId: string): StudentData | null {
    if (!studentId) return null;
    const all: Record<string, StudentData> = this.getAllStudents();
    const cleanId = studentId.trim();

    // 1. Direct match
    if (all[cleanId]) return all[cleanId];

    // 2. Match without hyphens / spaces (e.g. "1-4-01" -> "1401")
    const numOnlyId = cleanId.replace(/[^0-9]/g, '');
    if (numOnlyId && all[numOnlyId]) return all[numOnlyId];

    // 3. Match by student list iteration
    const list: StudentData[] = Object.values(all);
    for (const student of list) {
      if (student.account.id === cleanId || student.account.id === numOnlyId) {
        return student;
      }
      if (student.account.id.replace(/[^0-9]/g, '') === numOnlyId) {
        return student;
      }
      // If user typed just number e.g. "1" or "01"
      if (String(student.account.number) === cleanId || String(student.account.number).padStart(2, '0') === cleanId) {
        return student;
      }
    }

    return null;
  },

  getStudentAccount(studentId: string): StudentAccount | null {
    const data = this.getStudentData(studentId);
    return data ? data.account : null;
  },

  saveStudentData(studentData: StudentData): void {
    const all = this.getAllStudents();
    const migrated = migrateStudentData(studentData);
    all[migrated.account.id] = migrated;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(all));
  },

  updateStudentData(studentId: string, updates: Partial<StudentData>): StudentData | null {
    const existing = this.getStudentData(studentId);
    if (!existing) return null;
    const merged = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveStudentData(merged);
    return merged;
  },

  saveAllStudents(students: Record<string, StudentData>): void {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  createStudentAccount(params: {
    grade: number;
    classNo: number;
    number: number;
    name?: string;
    password?: string;
  }): StudentData {
    const padNum = String(params.number).padStart(2, '0');
    const id = `${params.grade}${params.classNo}${padNum}`;
    const displayName = `${params.number}번 학생`;
    const now = new Date().toISOString();
    
    // Initial student data
    const newStudent: StudentData = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      account: {
        id,
        password: params.password || '1234',
        grade: params.grade,
        classNo: params.classNo,
        number: params.number,
        name: displayName,
        createdAt: now,
        updatedAt: now,
      },
      character: {
        nickname: displayName,
        job: 'warrior',
        level: 1,
        exp: 0,
        gold: 50,
        appearance: {
          base: 'boy1',
          hairStyle: 'short',
          hairColor: 'black',
          outfit: 'adventurer',
          skinTone: 'fair',
        },
        inventory: ['w_sword_1'],
        equipment: {
          weapon: 'w_sword_1',
          armor: null,
          head: null,
          accessory: null,
          background: null,
          badge: null,
        },
        skills: ['warrior_focus_sword'],
        mathMonsters: [],
        titles: ['초보 모험가'],
        activeTitle: '초보 모험가',
      },
      stages: {},
      totalCorrect: 0,
      totalWrong: 0,
      totalHints: 0,
      totalRetries: 0,
      comboStreak: 0,
      maxCombo: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.saveStudentData(newStudent);
    return newStudent;
  },

  updateStudentAccount(account: StudentAccount): boolean {
    const data = this.getStudentData(account.id);
    if (!data) return false;
    data.account = { ...account, updatedAt: new Date().toISOString() };
    this.saveStudentData(data);
    return true;
  },

  deleteStudentAccount(studentId: string): boolean {
    const all = this.getAllStudents();
    if (!all[studentId]) return false;
    delete all[studentId];
    this.saveAllStudents(all);
    return true;
  },

  resetStudentProgress(studentId: string): boolean {
    const student = this.getStudentData(studentId);
    if (!student) return false;

    const defaultSkills: Record<JobType, string[]> = {
      warrior: ['warrior_focus_sword'],
      wizard: ['wizard_magic_circle'],
      healer: ['healer_light'],
      explorer: ['explorer_eye'],
    };

    const defaultWeapons: Record<JobType, string> = {
      warrior: 'w_sword_1',
      wizard: 'm_staff_1',
      healer: 'h_staff_1',
      explorer: 'e_bow_1',
    };

    student.character.level = 1;
    student.character.exp = 0;
    student.character.gold = 100;
    student.character.skills = defaultSkills[student.character.job] || ['warrior_focus_sword'];
    student.character.equipment = {
      weapon: defaultWeapons[student.character.job] || 'w_sword_1',
      armor: null,
      head: null,
      accessory: null,
      background: null,
      badge: null,
    };
    student.character.inventory = [defaultWeapons[student.character.job] || 'w_sword_1'];
    student.character.mathMonsters = [];
    student.character.titles = ['초보 모험가'];
    student.character.activeTitle = '초보 모험가';

    student.stages = {};
    student.totalCorrect = 0;
    student.totalWrong = 0;
    student.totalHints = 0;
    student.totalRetries = 0;
    student.comboStreak = 0;
    student.maxCombo = 0;
    student.remark = undefined;
    student.lastLearningAt = undefined;
    student.updatedAt = new Date().toISOString();

    this.saveStudentData(student);
    return true;
  },

  resetStudentPassword(studentId: string, newPass = '1234'): boolean {
    const student = this.getStudentData(studentId);
    if (!student) return false;
    student.account.password = newPass;
    student.account.updatedAt = new Date().toISOString();
    this.saveStudentData(student);
    return true;
  },

  resetAllPasswords(newPass = '1234'): void {
    const all = this.getAllStudents();
    for (const id of Object.keys(all)) {
      all[id].account.password = newPass;
      all[id].account.updatedAt = new Date().toISOString();
    }
    this.saveAllStudents(all);
  },

  // --- Stage Progress Handling ---
  getStageProgress(studentId: string, stageId: number): StageRecord {
    const student = this.getStudentData(studentId);
    if (student && student.stages[stageId]) {
      return student.stages[stageId];
    }
    return {
      stageId,
      completed: false,
      mastery: '보충',
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      tryCount: 0,
      hintCount: 0,
      basicSolved: 0,
      advancedSolved: 0,
      challengeSolved: 0,
      applicationSolved: 0,
      createdProblems: 0,
      wrongQuestions: [],
      updatedAt: new Date().toISOString(),
    };
  },

  updateStageProgress(studentId: string, stageId: number, progressUpdates: Partial<StageRecord>): StudentData | null {
    const student = this.getStudentData(studentId);
    if (!student) return null;

    const currentStage = student.stages[stageId] || {
      stageId,
      completed: false,
      mastery: '보충',
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      tryCount: 0,
      hintCount: 0,
      basicSolved: 0,
      advancedSolved: 0,
      challengeSolved: 0,
      applicationSolved: 0,
      createdProblems: 0,
      wrongQuestions: [],
      updatedAt: new Date().toISOString(),
    };

    const updatedStage: StageRecord = {
      ...currentStage,
      ...progressUpdates,
      updatedAt: new Date().toISOString(),
    };

    student.stages[stageId] = updatedStage;
    student.lastLearningAt = new Date().toISOString();
    this.saveStudentData(student);
    return student;
  },

  recordWrongQuestion(studentId: string, stageId: number, wrongRecord: WrongQuestionRecord): void {
    const student = this.getStudentData(studentId);
    if (!student) return;

    const stage = student.stages[stageId] || this.getStageProgress(studentId, stageId);
    const existingIndex = stage.wrongQuestions.findIndex(q => q.problemId === wrongRecord.problemId);
    
    if (existingIndex >= 0) {
      stage.wrongQuestions[existingIndex] = {
        ...stage.wrongQuestions[existingIndex],
        ...wrongRecord,
        retryCount: (stage.wrongQuestions[existingIndex].retryCount || 0) + 1,
      };
    } else {
      stage.wrongQuestions.push(wrongRecord);
    }

    student.stages[stageId] = stage;
    this.saveStudentData(student);
  },

  // --- Reset Operations ---
  resetStudentLearningData(studentId: string): boolean {
    const student = this.getStudentData(studentId);
    if (!student) return false;

    student.stages = {};
    student.totalCorrect = 0;
    student.totalWrong = 0;
    student.totalHints = 0;
    student.totalRetries = 0;
    student.comboStreak = 0;
    student.maxCombo = 0;
    student.character.exp = 0;
    student.character.level = 1;
    student.character.mathMonsters = [];
    student.lastLearningAt = undefined;
    student.updatedAt = new Date().toISOString();

    this.saveStudentData(student);
    return true;
  },

  resetClassLearningData(): void {
    const all = this.getAllStudents();
    for (const id of Object.keys(all)) {
      const st = all[id];
      st.stages = {};
      st.totalCorrect = 0;
      st.totalWrong = 0;
      st.totalHints = 0;
      st.totalRetries = 0;
      st.comboStreak = 0;
      st.maxCombo = 0;
      st.character.exp = 0;
      st.character.level = 1;
      st.character.mathMonsters = [];
      st.lastLearningAt = undefined;
      st.updatedAt = new Date().toISOString();
    }
    this.saveAllStudents(all);
  },

  resetAllClassData(): void {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  },

  // --- Teacher Settings ---
  getTeacherSettings(): TeacherSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHER_SETTINGS);
    return safeParse<TeacherSettings>(raw, DEFAULT_TEACHER_SETTINGS);
  },

  saveTeacherSettings(settings: TeacherSettings): void {
    localStorage.setItem(STORAGE_KEYS.TEACHER_SETTINGS, JSON.stringify(settings));
  },

  getTeacherPassword(): string {
    return this.getTeacherSettings().passwordHash || '0000';
  },

  setTeacherPassword(newPass: string): void {
    const settings = this.getTeacherSettings();
    settings.passwordHash = newPass;
    settings.updatedAt = new Date().toISOString();
    this.saveTeacherSettings(settings);
  },

  updateTeacherPassword(oldPass: string, newPass: string): { success: boolean; message: string } {
    const settings = this.getTeacherSettings();
    if (settings.passwordHash !== oldPass) {
      return { success: false, message: '현재 비밀번호가 일치하지 않습니다.' };
    }
    if (!newPass || newPass.length < 4) {
      return { success: false, message: '새 비밀번호는 4자리 이상이어야 합니다.' };
    }
    settings.passwordHash = newPass;
    settings.updatedAt = new Date().toISOString();
    this.saveTeacherSettings(settings);
    return { success: true, message: '교사 비밀번호가 성공적으로 변경되었습니다.' };
  },

  seedDemoDataIfEmpty(): void {
    const all = this.getAllStudents();
    if (Object.keys(all).length === 0) {
      this.generateDemoClass();
    }
  },

  resetAndGenerateDemo(): void {
    this.resetAllClassData();
    this.generateDemoClass();
  },

  // --- Session Management ---
  getCurrentStudentSession(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT_SESSION);
  },

  setCurrentStudentSession(studentId: string | null): void {
    if (studentId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT_SESSION, studentId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT_SESSION);
    }
  },

  isTeacherAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.TEACHER_SESSION) === 'true';
  },

  setTeacherAuthenticated(auth: boolean): void {
    if (auth) {
      localStorage.setItem(STORAGE_KEYS.TEACHER_SESSION, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.TEACHER_SESSION);
    }
  },

  // --- Demo Class Generator (15 realistic students with diverse profiles) ---
  generateDemoClass(): void {
    const demoStudentsConfig = [
      { num: 1, job: 'warrior', level: 12, exp: 450, gold: 380, stagesDone: 10, mastery: '심화', isSos: false },
      { num: 2, job: 'wizard', level: 15, exp: 780, gold: 520, stagesDone: 12, mastery: '완전정복', isSos: false },
      { num: 3, job: 'healer', level: 6, exp: 180, gold: 120, stagesDone: 4, mastery: '보충', isSos: true, errorType: '10의 보수 오류' },
      { num: 4, job: 'explorer', level: 9, exp: 320, gold: 240, stagesDone: 7, mastery: '기본', isSos: false },
      { num: 5, job: 'warrior', level: 11, exp: 620, gold: 410, stagesDone: 9, mastery: '심화', isSos: false },
      { num: 6, job: 'wizard', level: 8, exp: 290, gold: 190, stagesDone: 6, mastery: '기본', isSos: false },
      { num: 7, job: 'healer', level: 5, exp: 140, gold: 90, stagesDone: 3, mastery: '보충', isSos: true, errorType: '가르기 오류' },
      { num: 8, job: 'explorer', level: 13, exp: 850, gold: 600, stagesDone: 11, mastery: '완전정복', isSos: false },
      { num: 9, job: 'warrior', level: 7, exp: 210, gold: 150, stagesDone: 5, mastery: '기본', isSos: false },
      { num: 10, job: 'wizard', level: 4, exp: 90, gold: 70, stagesDone: 2, mastery: '보충', isSos: true, errorType: '세 수 계산 순서 오류' },
      { num: 11, job: 'healer', level: 10, exp: 510, gold: 340, stagesDone: 8, mastery: '심화', isSos: false },
      { num: 12, job: 'explorer', level: 14, exp: 920, gold: 680, stagesDone: 12, mastery: '완전정복', isSos: false },
      { num: 13, job: 'warrior', level: 3, exp: 60, gold: 50, stagesDone: 2, mastery: '보충', isSos: true, errorType: '받아올림 10 만들기 오류' },
      { num: 14, job: 'wizard', level: 8, exp: 380, gold: 260, stagesDone: 7, mastery: '기본', isSos: false },
      { num: 15, job: 'healer', level: 9, exp: 420, gold: 290, stagesDone: 8, mastery: '심화', isSos: false },
    ];

    const allData: Record<string, StudentData> = {};
    const now = new Date();

    demoStudentsConfig.forEach((cfg) => {
      const studentId = `14${String(cfg.num).padStart(2, '0')}`;
      const studentName = `${cfg.num}번 학생`;
      const stages: Record<number, StageRecord> = {};
      let totalCorrect = 0;
      let totalWrong = 0;
      let totalHints = 0;
      let totalRetries = 0;

      const monsterList: string[] = [];
      for (let s = 1; s <= cfg.stagesDone; s++) {
        monsterList.push(`monster_${s}`);
        const isVulnerableStage = s === 7 || s === 9 || s === 4;
        const correctCount = cfg.isSos
          ? (isVulnerableStage ? 8 : 11)
          : (cfg.mastery === '완전정복' ? 15 : (cfg.mastery === '심화' ? 14 : 12));
        const wrongCount = 15 - correctCount;
        const hintCount = cfg.isSos ? Math.floor(Math.random() * 6) + 4 : Math.floor(Math.random() * 2);
        const tryCount = 15 + wrongCount;

        totalCorrect += correctCount;
        totalWrong += wrongCount;
        totalHints += hintCount;
        totalRetries += (wrongCount * 2);

        const wrongQuestions: WrongQuestionRecord[] = [];
        if (wrongCount > 0) {
          const sampleProblems = [
            { q: '8 + 3', c: '11', w: '10', e: '받아올림 10 만들기 오류' },
            { q: '14 - 6', c: '8', w: '9', e: '받아내림 10에서 빼기 오류' },
            { q: '3 + [ ] = 10', c: '7', w: '8', e: '10의 보수 오류' },
            { q: '2 + 1 + 3', c: '6', w: '5', e: '세 수 계산 순서 오류' },
          ];
          const sp = sampleProblems[(s - 1) % sampleProblems.length];
          wrongQuestions.push({
            problemId: `s${s}_p${wrongCount}`,
            stageId: s,
            problem: sp.q,
            studentAns: sp.w,
            correctAns: sp.c,
            errorType: cfg.errorType || sp.e,
            retryCount: cfg.isSos ? 3 : 1,
            hintLevel: cfg.isSos ? 3 : 1,
            createdAt: new Date(now.getTime() - (13 - s) * 86400000).toISOString(),
          });
        }

        stages[s] = {
          stageId: s,
          completed: true,
          mastery: cfg.mastery as any,
          score: correctCount * 10,
          correctCount,
          wrongCount,
          tryCount,
          hintCount,
          basicSolved: Math.min(correctCount, 8),
          advancedSolved: cfg.mastery === '심화' || cfg.mastery === '완전정복' ? 3 : 1,
          challengeSolved: cfg.mastery === '완전정복' ? 2 : (cfg.mastery === '심화' ? 1 : 0),
          applicationSolved: 2,
          createdProblems: cfg.mastery === '완전정복' ? 1 : 0,
          wrongQuestions,
          updatedAt: new Date(now.getTime() - (13 - s) * 3600000).toISOString(),
        };
      }

      const weapons: Record<JobType, string> = {
        warrior: cfg.level >= 8 ? 'w_sword_3' : (cfg.level >= 4 ? 'w_sword_2' : 'w_sword_1'),
        wizard: cfg.level >= 4 ? 'm_staff_2' : 'm_staff_1',
        healer: cfg.level >= 3 ? 'h_staff_1' : 'h_staff_1',
        explorer: cfg.level >= 4 ? 'e_bow_1' : 'e_bow_1',
      };

      const inventory = [weapons[cfg.job as JobType]];
      if (cfg.gold > 200) inventory.push('c_glasses_smart');
      if (cfg.level >= 10) inventory.push('c_hat_crown');

      allData[studentId] = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        account: {
          id: studentId,
          password: '1234',
          grade: 1,
          classNo: 4,
          number: cfg.num,
          name: studentName,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        character: {
          nickname: studentName,
          job: cfg.job as JobType,
          level: cfg.level,
          exp: cfg.exp,
          gold: cfg.gold,
          appearance: {
            base: cfg.num % 2 === 0 ? 'girl1' : 'boy1',
            hairStyle: cfg.num % 2 === 0 ? 'twin' : 'short',
            hairColor: cfg.num % 3 === 0 ? 'brown' : 'black',
            outfit: cfg.job === 'wizard' ? 'robe' : 'adventurer',
            skinTone: 'fair',
          },
          inventory,
          equipment: {
            weapon: weapons[cfg.job as JobType],
            armor: null,
            head: cfg.level >= 10 ? 'c_hat_crown' : null,
            accessory: cfg.gold > 200 ? 'c_glasses_smart' : null,
            background: null,
            badge: null,
          },
          skills: SKILLS_LIST.filter(s => s.job === cfg.job && s.unlockLevel <= cfg.level).map(s => s.id),
          mathMonsters: monsterList,
          titles: cfg.level >= 10 ? ['전문 모험가', '초보 모험가'] : ['초보 모험가'],
          activeTitle: cfg.level >= 10 ? '전문 모험가' : '초보 모험가',
        },
        stages,
        totalCorrect,
        totalWrong,
        totalHints,
        totalRetries,
        comboStreak: cfg.isSos ? 1 : 5,
        maxCombo: cfg.isSos ? 2 : 12,
        lastLearningAt: new Date(now.getTime() - Math.floor(Math.random() * 24) * 3600000).toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
    });

    this.saveAllStudents(allData);
  },

  // --- Student Remark (생활기록부 수학 평어) Operations ---
  updateStudentRemark(studentId: string, remark: import('../types').StudentRemark): boolean {
    const student = this.getStudentData(studentId);
    if (!student) return false;
    student.remark = remark;
    student.updatedAt = new Date().toISOString();
    this.saveStudentData(student);
    return true;
  },

  updateAllStudentRemarks(remarksMap: Record<string, import('../types').StudentRemark>): void {
    const all = this.getAllStudents();
    const now = new Date().toISOString();
    for (const [id, remark] of Object.entries(remarksMap)) {
      if (all[id]) {
        all[id].remark = remark;
        all[id].updatedAt = now;
      }
    }
    this.saveAllStudents(all);
  },

  exportRemarksToCsv(studentsMap: Record<string, StudentData>): void {
    const students = Object.values(studentsMap).sort((a, b) => a.account.number - b.account.number);
    let csvContent = '\uFEFF번호,이름,학생 아이디,직업,레벨,정답률(%),주요 학습 특성,AI 수학 평어 (생활기록부/과정중심평가용),수정여부,생성일시\n';

    students.forEach((s) => {
      const totalSolved = s.totalCorrect + s.totalWrong;
      const acc = totalSolved > 0 ? Math.round((s.totalCorrect / totalSolved) * 100) : 0;
      const trait = s.remark?.dominantTrait || '미생성';
      const text = (s.remark?.evaluationText || '평어 미생성 상태입니다.').replace(/"/g, '""');
      const isEdited = s.remark?.isEditedByUser ? '교사 직접 수정됨' : (s.remark ? 'AI 자동 생성' : '-');
      const genDate = s.remark?.generatedAt ? s.remark.generatedAt.slice(0, 10) : '-';

      const row = [
        s.account.number,
        `"${s.account.name}"`,
        s.account.id,
        `"${s.character.job}"`,
        s.character.level,
        acc,
        `"${trait}"`,
        `"${text}"`,
        `"${isEdited}"`,
        `"${genDate}"`,
      ].join(',');
      csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `초등1학년_수학평어_생활기록부_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
