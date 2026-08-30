// Game Service: Leveling, EXP/Gold rewards, Shop, Inventory, Monster Encyclopedia, Job Skills, Equipment

import {
  StudentData,
  JobType,
  ItemCategory,
  ProblemType,
} from '../types';
import { DataService } from './dataService';
import {
  SHOP_ITEMS,
  MATH_MONSTERS,
  SKILLS_LIST,
  getExpNeededForLevel,
  getTitleForLevel,
} from './gameData';

export interface RewardResult {
  expGained: number;
  goldGained: number;
  isLevelUp: boolean;
  newLevel?: number;
  newMonsterUnlocked?: string;
  unlockedSkills?: string[];
  newTitleUnlocked?: string;
}

export const GameService = {
  // Calculate EXP & Gold based on activity, problem type, job bonus, and combo
  calculateReward(params: {
    student: StudentData;
    problemType: ProblemType;
    isCorrect: boolean;
    isRemedialFixed?: boolean;
    comboStreak: number;
    stageCompleted?: boolean;
    isFirstCompletion?: boolean;
    stageId?: number;
  }): RewardResult {
    const { student, problemType, isCorrect, isRemedialFixed, comboStreak, stageCompleted, isFirstCompletion, stageId } = params;

    if (!isCorrect) {
      return { expGained: 0, goldGained: 0, isLevelUp: false };
    }

    let baseExp = 4;
    let baseGold = 2;

    // Type adjustments
    switch (problemType) {
      case 'basic':
        baseExp = 4;
        baseGold = 2;
        break;
      case 'application':
        baseExp = 6;
        baseGold = 3;
        break;
      case 'advanced':
        baseExp = 8;
        baseGold = 4;
        break;
      case 'challenge':
        baseExp = 10;
        baseGold = 5;
        break;
      case 'puzzle':
        baseExp = 8;
        baseGold = 4;
        break;
      case 'speed':
        baseExp = 6;
        baseGold = 3;
        break;
      case 'boss':
        baseExp = 15;
        baseGold = 8;
        break;
      case 'remedial':
        baseExp = 5;
        baseGold = 2;
        break;
    }

    // Job Growth Bonus
    const job = student.character.job;
    if (job === 'warrior' && comboStreak >= 3) {
      baseExp += 2; // warrior combo bonus
      baseGold += 1;
    } else if (job === 'wizard' && (problemType === 'advanced' || problemType === 'challenge' || problemType === 'puzzle')) {
      baseExp += 3; // wizard deep problem bonus
    } else if (job === 'healer' && isRemedialFixed) {
      baseExp += 4; // healer retry fix bonus
      baseGold += 2;
    } else if (job === 'explorer' && isFirstCompletion) {
      baseExp += 5; // explorer exploration bonus
      baseGold += 3;
    }

    // Combo streak bonus
    if (comboStreak >= 10) {
      baseExp += 3;
      baseGold += 2;
    } else if (comboStreak >= 5) {
      baseExp += 2;
      baseGold += 1;
    } else if (comboStreak >= 3) {
      baseExp += 1;
    }

    // Stage completion bonus
    if (stageCompleted) {
      baseExp += 30;
      baseGold += 15;
    }

    // Check Level Up
    const currentExp = student.character.exp + baseExp;
    let currentLevel = student.character.level;
    let expThreshold = getExpNeededForLevel(currentLevel);
    let isLevelUp = false;

    while (currentExp >= expThreshold && currentLevel < 50) {
      currentLevel += 1;
      isLevelUp = true;
      expThreshold = getExpNeededForLevel(currentLevel);
    }

    // Unlock new job skills if level up
    const unlockedSkills: string[] = [];
    if (isLevelUp) {
      const eligibleSkills = SKILLS_LIST.filter(
        s => s.job === job && s.unlockLevel <= currentLevel && !student.character.skills.includes(s.id)
      );
      eligibleSkills.forEach(s => unlockedSkills.push(s.id));
    }

    // Unlock monster if stage completed
    let newMonsterUnlocked: string | undefined;
    if (stageCompleted && stageId) {
      const monster = MATH_MONSTERS.find(m => m.stageId === stageId);
      if (monster && !student.character.mathMonsters.includes(monster.id)) {
        newMonsterUnlocked = monster.id;
        baseExp += monster.bonusExp;
      }
    }

    // Check title unlock
    const currentTitle = getTitleForLevel(currentLevel);
    let newTitleUnlocked: string | undefined;
    if (!student.character.titles.includes(currentTitle)) {
      newTitleUnlocked = currentTitle;
    }

    return {
      expGained: baseExp,
      goldGained: baseGold,
      isLevelUp,
      newLevel: isLevelUp ? currentLevel : undefined,
      newMonsterUnlocked,
      unlockedSkills,
      newTitleUnlocked,
    };
  },

  // Apply rewards to student data and persist
  applyRewards(studentId: string, reward: RewardResult): StudentData | null {
    const student = DataService.getStudentData(studentId);
    if (!student) return null;

    student.character.exp += reward.expGained;
    student.character.gold += reward.goldGained;

    if (reward.isLevelUp && reward.newLevel) {
      student.character.level = reward.newLevel;
    }

    if (reward.newMonsterUnlocked && !student.character.mathMonsters.includes(reward.newMonsterUnlocked)) {
      student.character.mathMonsters.push(reward.newMonsterUnlocked);
    }

    if (reward.unlockedSkills && reward.unlockedSkills.length > 0) {
      reward.unlockedSkills.forEach(sk => {
        if (!student.character.skills.includes(sk)) {
          student.character.skills.push(sk);
        }
      });
    }

    if (reward.newTitleUnlocked && !student.character.titles.includes(reward.newTitleUnlocked)) {
      student.character.titles.push(reward.newTitleUnlocked);
      student.character.activeTitle = reward.newTitleUnlocked;
    }

    DataService.saveStudentData(student);
    return student;
  },

  // Purchase shop item with real Gold deduction
  purchaseItem(studentId: string, itemId: string): { success: boolean; message: string; student?: StudentData } {
    const student = DataService.getStudentData(studentId);
    if (!student) {
      return { success: false, message: '학생 데이터를 찾을 수 없습니다.' };
    }

    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) {
      return { success: false, message: '아이템을 찾을 수 없습니다.' };
    }

    if (student.character.inventory.includes(itemId)) {
      return { success: false, message: '이미 보유하고 있는 아이템입니다.' };
    }

    if (item.jobRequirement && item.jobRequirement !== 'all' && item.jobRequirement !== student.character.job) {
      return { success: false, message: '해당 직업 전용 아이템입니다.' };
    }

    if (item.requiredLevel && student.character.level < item.requiredLevel) {
      return { success: false, message: `레벨 Lv.${item.requiredLevel} 이상만 구매할 수 있습니다.` };
    }

    if (student.character.gold < item.price) {
      return { success: false, message: '골드가 부족합니다!' };
    }

    // Deduct gold & Add to inventory
    student.character.gold -= item.price;
    student.character.inventory.push(itemId);

    // Auto-equip if category slot is empty
    const cat = item.category as ItemCategory;
    if (!student.character.equipment[cat]) {
      student.character.equipment[cat] = itemId;
    }

    DataService.saveStudentData(student);
    return { success: true, message: `${item.name}을(를) 성공적으로 구매하였습니다!`, student };
  },

  // Equip an inventory item
  equipItem(studentId: string, itemId: string): { success: boolean; message: string; student?: StudentData } {
    const student = DataService.getStudentData(studentId);
    if (!student) return { success: false, message: '학생 데이터를 찾을 수 없습니다.' };

    if (!student.character.inventory.includes(itemId)) {
      return { success: false, message: '인벤토리에 없는 아이템입니다.' };
    }

    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return { success: false, message: '아이템 정보가 없습니다.' };

    const cat = item.category as ItemCategory;
    student.character.equipment[cat] = itemId;
    DataService.saveStudentData(student);

    return { success: true, message: `${item.name}을(를) 장착했습니다.`, student };
  },

  // Unequip item slot
  unequipItem(studentId: string, category: ItemCategory): { success: boolean; student?: StudentData } {
    const student = DataService.getStudentData(studentId);
    if (!student) return { success: false };

    student.character.equipment[category] = null;
    DataService.saveStudentData(student);
    return { success: true, student };
  },

  // Teacher Instant Reward Actions
  grantTeacherReward(studentId: string, rewardType: 'sticker' | 'exp50' | 'gold50' | 'special_item' | 'special_title'): {
    success: boolean;
    message: string;
    student?: StudentData;
  } {
    const student = DataService.getStudentData(studentId);
    if (!student) return { success: false, message: '학생을 찾을 수 없습니다.' };

    let msg = '';
    switch (rewardType) {
      case 'sticker':
        student.character.gold += 20;
        student.character.exp += 20;
        msg = '선생님의 반짝이는 칭찬 스티커(+20 EXP, +20 Gold)가 지급되었습니다!';
        break;
      case 'exp50':
        student.character.exp += 50;
        // check level
        while (student.character.exp >= getExpNeededForLevel(student.character.level) && student.character.level < 50) {
          student.character.level += 1;
        }
        msg = '선생님의 특별 학습 경험치 +50 EXP가 지급되었습니다!';
        break;
      case 'gold50':
        student.character.gold += 50;
        msg = '선생님의 격려 보상금 +50 Gold가 지급되었습니다!';
        break;
      case 'special_item': {
        const specialId = 'rare_legend_book';
        if (!student.character.inventory.includes(specialId)) {
          student.character.inventory.push(specialId);
          student.character.equipment.accessory = specialId;
        }
        msg = '선생님의 특별 하사품 [전설의 문제 해결책]이 지급되었습니다!';
        break;
      }
      case 'special_title': {
        const title = '선생님의 자랑스러운 수제자';
        if (!student.character.titles.includes(title)) {
          student.character.titles.push(title);
        }
        student.character.activeTitle = title;
        msg = `선생님 특별 칭호 [${title}]가 수여되었습니다!`;
        break;
      }
    }

    DataService.saveStudentData(student);
    return { success: true, message: msg, student };
  },
};
