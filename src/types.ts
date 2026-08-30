// Student & System Data Types for Math RPG Learning WebApp

export type JobType = 'warrior' | 'wizard' | 'healer' | 'explorer';

export type StageMastery = '보충' | '기본' | '심화' | '완전정복';

export type ProblemType = 'basic' | 'advanced' | 'challenge' | 'application' | 'remedial' | 'speed' | 'boss' | 'puzzle' | 'word';

export interface JobInfo {
  name: string;
  badge: string;
  icon: string;
  themeColor: string;
  bgColor: string;
  borderColor: string;
  growthBonus: string;
  description: string;
}

export type ProblemFormat = 'horizontal' | 'vertical' | 'word' | 'puzzle' | 'estimate' | 'split_join' | 'three_add' | 'three_sub';

export type ItemCategory = 'weapon' | 'armor' | 'head' | 'accessory' | 'background' | 'badge';

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface StudentAccount {
  id: string; // e.g. "3-3-01"
  password: string;
  grade: number;
  classNo: number;
  number: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterAppearance {
  base: string; // avatar style (e.g. 'boy1', 'boy2', 'girl1', 'girl2')
  hairStyle: string; // 'short', 'twin', 'curly', 'wild'
  hairColor: string; // 'black', 'brown', 'blonde', 'blue', 'pink'
  outfit: string; // 'adventurer', 'formal', 'sporty', 'robe'
  skinTone?: string;
}

export interface CharacterData {
  nickname: string;
  job: JobType;
  level: number;
  exp: number;
  gold: number;
  appearance: CharacterAppearance;
  inventory: string[]; // item IDs
  equipment: Record<ItemCategory, string | null>;
  skills: string[]; // skill IDs
  mathMonsters: string[]; // monster IDs
  titles: string[]; // earned titles
  activeTitle?: string;
}

export interface WrongQuestionRecord {
  problemId: string;
  stageId: number;
  problem: string;
  studentAns: string;
  correctAns: string;
  errorType?: string;
  retryCount: number;
  hintLevel: number;
  createdAt: string;
}

export interface StageRecord {
  stageId: number;
  completed: boolean;
  mastery: StageMastery;
  score: number;
  correctCount: number;
  wrongCount: number;
  tryCount: number;
  hintCount: number;
  basicSolved: number;
  advancedSolved: number;
  challengeSolved: number;
  applicationSolved: number;
  createdProblems: number;
  wrongQuestions: WrongQuestionRecord[];
  updatedAt: string;
}

export interface StudentRemark {
  evaluationText: string;
  dominantTrait: string;
  keyStrengths: string[];
  generatedAt: string;
  isEditedByUser?: boolean;
}

export interface StudentData {
  schemaVersion: number;
  account: StudentAccount;
  character: CharacterData;
  stages: Record<number, StageRecord>;
  totalCorrect: number;
  totalWrong: number;
  totalHints: number;
  totalRetries: number;
  comboStreak: number;
  maxCombo: number;
  remark?: StudentRemark;
  lastLearningAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherSettings {
  passwordHash: string; // stored hashed or plain for local demo
  defaultGrade: number;
  defaultClassNo: number;
  soundEffects: boolean;
  bgmEnabled: boolean;
  googleWebAppUrl?: string; // Google Apps Script Web App Deployment URL
  updatedAt: string;
}

export interface Problem {
  id: string;
  stageId: number;
  type: ProblemType;
  questionText: string;
  num1: number;
  num2: number;
  num3?: number;
  operator: '+' | '-' | 'split_join' | 'three_add' | 'three_sub';
  multiplicand?: number; // legacy alias
  multiplier?: number; // legacy alias
  answer: number;
  format: ProblemFormat;
  stepHints: string[];
  errorType: string;
  context?: string; // word problem backstory
  choices?: number[]; // for multiple-choice / estimate puzzles
  visualAid?: {
    type: 'apples' | 'ten_frame' | 'split_diagram' | 'blocks' | 'balloons' | 'bottles' | 'acorns' | 'cards' | 'items';
    count1?: number;
    count2?: number;
    count3?: number;
    target?: number;
    subType?: string;
    itemName?: string;
  };
  puzzleDetails?: {
    blankPos?: string;
    cards?: number[];
  };
}

export interface ShopItem {
  id: string;
  name: string;
  category: ItemCategory;
  jobRequirement?: JobType | 'all';
  price: number;
  icon: string;
  description: string;
  statDescription: string;
  rarity: ItemRarity;
  isSpecialDrop?: boolean;
  requiredLevel?: number;
}

export interface MathMonster {
  id: string;
  stageId: number;
  name: string;
  icon: string;
  description: string;
  element: 'fire' | 'water' | 'nature' | 'light' | 'dark' | 'thunder';
  bonusExp: number;
  rarity: 'common' | 'rare' | 'boss';
  quote: string;
}

export interface SkillInfo {
  id: string;
  name: string;
  job: JobType;
  unlockLevel: number;
  icon: string;
  description: string;
  effectType: 'highlight_digits' | 'retry_shield' | 'combo_boost' | 'show_grid' | 'reduce_difficulty' | 'bonus_exp' | 'show_range';
}

export interface StageInfo {
  id: number;
  title: string;
  subtitle: string;
  mapLocationName: string;
  description: string;
  icon: string;
  themeColor: string;
  badge: string;
}
