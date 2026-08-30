// Game data definitions: Jobs, Skills, Shop Items, MathMonsters, Levels

import { JobInfo, ShopItem, MathMonster, SkillInfo, JobType } from '../types';

export const JOB_INFO_LIST: Record<JobType, {
  id: JobType;
  name: string;
  badge: string;
  icon: string;
  title: string;
  description: string;
  growthBonus: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  warrior: {
    id: 'warrior',
    name: '전사',
    badge: '용맹의 검사',
    icon: '⚔️',
    title: '연속 정답과 쾌속 연산의 수호자',
    description: '빠르고 정확한 연속 계산으로 폭발적인 경험치와 골드를 획득합니다.',
    growthBonus: '연속 정답 콤보 및 스피드 퀴즈 시 추가 보너스!',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-400',
  },
  wizard: {
    id: 'wizard',
    name: '마법사',
    badge: '신비의 현자',
    icon: '🔮',
    title: '심화·응용·추론 퍼즐의 지혜',
    description: '심화 문제와 카드 추론 문제, 오류 찾기에서 비범한 마법 보너스를 발휘합니다.',
    growthBonus: '심화·도전·퍼즐 문제 해결 시 대량 EXP 획득!',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-400',
  },
  healer: {
    id: 'healer',
    name: '힐러',
    badge: '치유의 성자',
    icon: '🌿',
    title: '오답 복습과 역전의 치유자',
    description: '실수를 두려워하지 않고 오답을 끝까지 바르게 고쳐 성장하는 따뜻한 치유사입니다.',
    growthBonus: '오답 수정 및 보충 문제 정복 시 2배 EXP 보너스!',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-400',
  },
  explorer: {
    id: 'explorer',
    name: '탐험가',
    badge: '미지의 개척자',
    icon: '🏹',
    title: '다양한 유형과 새로운 차시 탐험가',
    description: '처음 만나는 신유형과 보스 몬스터에 주저 없이 도전하는 모험가입니다.',
    growthBonus: '새로운 차시 첫 도전 및 신유형 클리어 시 특별 보상!',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-400',
  },
};

export const SKILLS_LIST: SkillInfo[] = [
  // Warrior Skills
  {
    id: 'warrior_focus_sword',
    name: '집중의 검',
    job: 'warrior',
    unlockLevel: 1,
    icon: '🗡️',
    description: '문제의 핵심 숫자와 자릿값을 빛나게 강조합니다.',
    effectType: 'highlight_digits',
  },
  {
    id: 'warrior_shield',
    name: '계산 방패',
    job: 'warrior',
    unlockLevel: 3,
    icon: '🛡️',
    description: '오답 시 콤보가 끊기지 않고 재도전 기회를 1회 보호합니다.',
    effectType: 'retry_shield',
  },
  {
    id: 'warrior_slash',
    name: '연속 베기',
    job: 'warrior',
    unlockLevel: 5,
    icon: '⚡',
    description: '연속 정답 3회 달성 시 추가 EXP +20을 획득합니다.',
    effectType: 'combo_boost',
  },

  // Wizard Skills
  {
    id: 'wizard_detect',
    name: '숫자 탐색',
    job: 'wizard',
    unlockLevel: 1,
    icon: '🔍',
    description: '문장제나 복잡한 식에서 필요한 핵심 조건만 돋보기로 표시합니다.',
    effectType: 'highlight_digits',
  },
  {
    id: 'wizard_magic_circle',
    name: '연산 마법진',
    job: 'wizard',
    unlockLevel: 3,
    icon: '✨',
    description: '세로셈 계산 시 자릿값 안내선과 부분 계산 격자를 표시합니다.',
    effectType: 'show_grid',
  },
  {
    id: 'wizard_accel',
    name: '지혜의 가속',
    job: 'wizard',
    unlockLevel: 5,
    icon: '🌟',
    description: '심화·도전 문제 해결 시 획득 EXP가 1.5배 증가합니다.',
    effectType: 'bonus_exp',
  },

  // Healer Skills
  {
    id: 'healer_light',
    name: '회복의 빛',
    job: 'healer',
    unlockLevel: 1,
    icon: '💫',
    description: '막막할 때 수 모형 분해 시각화를 즉시 소환합니다.',
    effectType: 'reduce_difficulty',
  },
  {
    id: 'healer_retry',
    name: '다시 도전의 온기',
    job: 'healer',
    unlockLevel: 3,
    icon: '💖',
    description: '오답을 스스로 수정해 맞히면 골드 +10을 추가 지급합니다.',
    effectType: 'bonus_exp',
  },
  {
    id: 'healer_focus_heal',
    name: '집중 회복',
    job: 'healer',
    unlockLevel: 5,
    icon: '🌸',
    description: '연속 2회 오답 발생 시 가장 쉬운 선수 개념 힌트를 밝혀줍니다.',
    effectType: 'reduce_difficulty',
  },

  // Explorer Skills
  {
    id: 'explorer_eye',
    name: '도전자의 눈',
    job: 'explorer',
    unlockLevel: 1,
    icon: '👁️',
    description: '어림셈 문제나 함정 보기를 한눈에 감별할 수 있는 범위를 제시합니다.',
    effectType: 'show_range',
  },
  {
    id: 'explorer_weakpoint',
    name: '약점 탐색',
    job: 'explorer',
    unlockLevel: 3,
    icon: '🧭',
    description: '내가 가장 자주 헷갈렸던 오류 유형(올림 누락, 자리정렬 등)을 미리 경고합니다.',
    effectType: 'highlight_digits',
  },
  {
    id: 'explorer_trail',
    name: '모험가의 나침반',
    job: 'explorer',
    unlockLevel: 5,
    icon: '🗺️',
    description: '새로운 유형의 문제를 최초 정복할 때 EXP +30을 받습니다.',
    effectType: 'bonus_exp',
  },
];

export const SHOP_ITEMS: ShopItem[] = [
  // Warrior Equipment
  {
    id: 'w_sword_1',
    name: '수련용 나무검',
    category: 'weapon',
    jobRequirement: 'warrior',
    price: 30,
    icon: '🗡️',
    description: '초보 전사를 위한 가볍고 단단한 참나무 검입니다.',
    statDescription: '기본 연산 집중력 향상',
    rarity: 'common',
    requiredLevel: 1,
  },
  {
    id: 'w_sword_2',
    name: '강철 기사검',
    category: 'weapon',
    jobRequirement: 'warrior',
    price: 90,
    icon: '⚔️',
    description: '제련된 강철로 만들어진 날카로운 기사의 명검입니다.',
    statDescription: '연속 정답 콤보 보너스 +5 EXP',
    rarity: 'rare',
    requiredLevel: 4,
  },
  {
    id: 'w_sword_3',
    name: '황금빛 드래곤 슬레이어',
    category: 'weapon',
    jobRequirement: 'warrior',
    price: 250,
    icon: '🔱',
    description: '곱셈 드래곤의 비늘을 가르는 전설의 대검입니다.',
    statDescription: '스피드 연산 시간 +5초 & 화려한 이펙트',
    rarity: 'epic',
    requiredLevel: 8,
  },
  {
    id: 'w_shield_1',
    name: '나무 방패',
    category: 'accessory',
    jobRequirement: 'warrior',
    price: 40,
    icon: '🛡️',
    description: '계산 실수를 든든하게 막아주는 가벼운 방패입니다.',
    statDescription: '오답 시 데미지 보호',
    rarity: 'common',
    requiredLevel: 2,
  },
  {
    id: 'w_armor_1',
    name: '전사의 강철 갑옷',
    category: 'armor',
    jobRequirement: 'warrior',
    price: 120,
    icon: '🥋',
    description: '어떤 어려운 문제 앞에서도 굴하지 않는 튼튼한 갑옷입니다.',
    statDescription: '정답 시 골드 +2 추가 획득',
    rarity: 'rare',
    requiredLevel: 5,
  },

  // Wizard Equipment
  {
    id: 'm_staff_1',
    name: '초보 마법봉',
    category: 'weapon',
    jobRequirement: 'wizard',
    price: 30,
    icon: '🪄',
    description: '마나를 모아 숫자의 비밀을 밝히는 기본 지팡이입니다.',
    statDescription: '자릿값 탐색 속도 증가',
    rarity: 'common',
    requiredLevel: 1,
  },
  {
    id: 'm_staff_2',
    name: '별빛 크리스탈 지팡이',
    category: 'weapon',
    jobRequirement: 'wizard',
    price: 95,
    icon: '🔮',
    description: '밤하늘의 은하수를 머금은 신비로운 마법 지팡이입니다.',
    statDescription: '심화 문제 성공 시 +8 EXP',
    rarity: 'rare',
    requiredLevel: 4,
  },
  {
    id: 'm_book_1',
    name: '고대 곱셈 마법서',
    category: 'accessory',
    jobRequirement: 'wizard',
    price: 130,
    icon: '📖',
    description: '자릿값의 비밀과 부분곱의 원리가 적힌 신비한 고서입니다.',
    statDescription: '추론 문제 풀이 시 힌트 게이지 보존',
    rarity: 'epic',
    requiredLevel: 6,
  },
  {
    id: 'm_robe_1',
    name: '성운의 마법 로브',
    category: 'armor',
    jobRequirement: 'wizard',
    price: 110,
    icon: '🌌',
    description: '푸른 별빛으로 짠 부드럽고 신비로운 마법사의 옷입니다.',
    statDescription: '문제 클리어 시 반짝이는 별가루 연출',
    rarity: 'rare',
    requiredLevel: 5,
  },

  // Healer Equipment
  {
    id: 'h_staff_1',
    name: '새싹 치유 지팡이',
    category: 'weapon',
    jobRequirement: 'healer',
    price: 30,
    icon: '🌱',
    description: '작은 새싹의 싱그러운 생명력이 깃든 회복 지팡이입니다.',
    statDescription: '오답 복습 시 응원 메시지 활성화',
    rarity: 'common',
    requiredLevel: 1,
  },
  {
    id: 'h_orb_1',
    name: '빛의 구슬',
    category: 'accessory',
    jobRequirement: 'healer',
    price: 85,
    icon: '💫',
    description: '환한 빛으로 틀린 부분의 위치를 따뜻하게 비춰줍니다.',
    statDescription: '오답 수정 성공 시 +10 EXP',
    rarity: 'rare',
    requiredLevel: 3,
  },
  {
    id: 'h_robe_1',
    name: '성스러운 치유 망토',
    category: 'armor',
    jobRequirement: 'healer',
    price: 115,
    icon: '🥼',
    description: '마음의 부담을 덜어주고 끝까지 완주할 힘을 주는 망토입니다.',
    statDescription: '보충학습 완료 시 골드 +15 보너스',
    rarity: 'rare',
    requiredLevel: 5,
  },

  // Explorer Equipment
  {
    id: 'e_bow_1',
    name: '모험가의 나무활',
    category: 'weapon',
    jobRequirement: 'explorer',
    price: 30,
    icon: '🏹',
    description: '표적을 정확히 맞히는 가볍고 탄력 있는 활입니다.',
    statDescription: '정답 입력 시 빠른 타격감 제공',
    rarity: 'common',
    requiredLevel: 1,
  },
  {
    id: 'e_scope_1',
    name: '황금 망원경',
    category: 'accessory',
    jobRequirement: 'explorer',
    price: 90,
    icon: '🔭',
    description: '멀리 있는 정답의 크기를 미리 어림해볼 수 있는 망원경입니다.',
    statDescription: '어림셈 문제 시 정답 범위 가이드',
    rarity: 'rare',
    requiredLevel: 4,
  },
  {
    id: 'e_armor_1',
    name: '바람의 탐험 조끼',
    category: 'armor',
    jobRequirement: 'explorer',
    price: 110,
    icon: '🧥',
    description: '활동하기 편하고 주머니가 많은 모험가 전용 조끼입니다.',
    statDescription: '새로운 차시 클리어 시 탐험가 깃발 표시',
    rarity: 'rare',
    requiredLevel: 5,
  },

  // Common Cosmetic Items (All Jobs)
  {
    id: 'c_hat_crown',
    name: '황금빛 수학 모험가 왕관',
    category: 'head',
    jobRequirement: 'all',
    price: 200,
    icon: '👑',
    description: '곱셈의 기본을 마스터한 자랑스러운 꼬마 용사에게 어울리는 왕관입니다.',
    statDescription: '프로필에 황금 왕관 테두리 장식',
    rarity: 'epic',
    requiredLevel: 7,
  },
  {
    id: 'c_hat_cat',
    name: '귀여운 고양이 귀 모자',
    category: 'head',
    jobRequirement: 'all',
    price: 50,
    icon: '🐱',
    description: '폭신폭신하고 깜찍한 고양이 귀 모양 털모자입니다.',
    statDescription: '깜찍한 모험가 룩 완성!',
    rarity: 'common',
    requiredLevel: 1,
  },
  {
    id: 'c_glasses_smart',
    name: '수학 천재 둥근 안경',
    category: 'accessory',
    jobRequirement: 'all',
    price: 45,
    icon: '👓',
    description: '쓰기만 해도 자릿값이 또렷하게 보일 것 같은 금테 안경입니다.',
    statDescription: '학구적인 학자 분위기 연출',
    rarity: 'common',
    requiredLevel: 2,
  },
  {
    id: 'c_pet_dragon',
    name: '아기 파랑 드래곤 펫',
    category: 'accessory',
    jobRequirement: 'all',
    price: 180,
    icon: '🐲',
    description: '어려운 문제가 나올 때마다 옆에서 불꽃을 뿜으며 응원해 줍니다.',
    statDescription: '학습 화면 캐릭터 옆에 아기 드래곤 동행',
    rarity: 'epic',
    requiredLevel: 6,
  },
  {
    id: 'c_bg_castle',
    name: '마법의 수학 도서관 배경',
    category: 'background',
    jobRequirement: 'all',
    price: 70,
    icon: '🏰',
    description: '신비로운 책들이 공중에 떠다니는 따뜻한 분위기의 도서관 배경입니다.',
    statDescription: '캐릭터 카드 배경 변경',
    rarity: 'rare',
    requiredLevel: 3,
  },
  {
    id: 'c_bg_galaxy',
    name: '은하수 우주 배경',
    category: 'background',
    jobRequirement: 'all',
    price: 150,
    icon: '🌌',
    description: '수많은 별들과 행성이 반짝이는 신비한 우주 배경입니다.',
    statDescription: '캐릭터 카드 신비 우주 배경',
    rarity: 'epic',
    requiredLevel: 8,
  },

  // Rare Hidden Drops (Earned through special achievements)
  {
    id: 'rare_gold_sword',
    name: '황금 계산검',
    category: 'weapon',
    jobRequirement: 'all',
    price: 0,
    icon: '🗡️✨',
    description: '모든 오답을 완벽하게 수정하여 획득한 전설의 황금 계산검입니다.',
    statDescription: '특별 업적 달성자 전용 외형',
    rarity: 'legendary',
    isSpecialDrop: true,
  },
  {
    id: 'rare_star_wand',
    name: '별빛 마법봉',
    category: 'weapon',
    jobRequirement: 'all',
    price: 0,
    icon: '🌟🪄',
    description: '심화·도전 문제를 10문항 이상 해결하여 얻은 찬란한 별빛 마법봉입니다.',
    statDescription: '특별 업적 달성자 전용 외형',
    rarity: 'legendary',
    isSpecialDrop: true,
  },
  {
    id: 'rare_rainbow_shield',
    name: '무지개 방패',
    category: 'accessory',
    jobRequirement: 'all',
    price: 0,
    icon: '🌈🛡️',
    description: '차시 완전 정복(별 3개)을 달성한 진정한 마스터의 방패입니다.',
    statDescription: '캐릭터 둘레에 무지개 오라 발생',
    rarity: 'legendary',
    isSpecialDrop: true,
  },
  {
    id: 'rare_legend_book',
    name: '전설의 문제 해결책',
    category: 'accessory',
    jobRequirement: 'all',
    price: 0,
    icon: '📚✨',
    description: '스스로 수학 문제를 만들고 정복한 창의력 대장에게 주어지는 비책입니다.',
    statDescription: '선생님 특별 칭찬 인증 아이템',
    rarity: 'legendary',
    isSpecialDrop: true,
  },
];

export const MATH_MONSTERS: MathMonster[] = [
  {
    id: 'monster_1',
    stageId: 1,
    name: '모으기 가르기 요정몬',
    icon: '🌱',
    element: 'nature',
    bonusExp: 15,
    rarity: 'common',
    description: '수를 둘로 가르고 하나로 모으는 숲속 연산의 귀여운 새싹 정령입니다.',
    quote: '수를 모으고 가르면 어떤 계산도 마법처럼 쉬워져!',
  },
  {
    id: 'monster_2',
    stageId: 2,
    name: '세친구 마카롱몬',
    icon: '🍡',
    element: 'nature',
    bonusExp: 15,
    rarity: 'common',
    description: '세 수의 덧셈을 앞에서부터 차례차례 달콤하게 계산하는 디저트 요정입니다.',
    quote: '앞의 두 수를 먼저 쏙 더하고, 남은 하나를 얹으면 완성!',
  },
  {
    id: 'monster_3',
    stageId: 3,
    name: '쪼꼬 뺄셈몬',
    icon: '🍫',
    element: 'nature',
    bonusExp: 15,
    rarity: 'common',
    description: '초콜릿을 한 조각씩 나누어 먹으며 세 수의 뺄셈을 순서대로 척척 해내는 요정입니다.',
    quote: '앞에서부터 차근차근 빼면 초콜릿처럼 깔끔한 답이 나와!',
  },
  {
    id: 'monster_4',
    stageId: 4,
    name: '10 완성 요정몬',
    icon: '🎁',
    element: 'light',
    bonusExp: 20,
    rarity: 'common',
    description: '10칸 상자의 빈칸을 찾아 10을 쏙 완성해 주는 짝꿍 수 수호신입니다.',
    quote: '7에는 3, 6에는 4! 10이 되는 짝꿍 수를 찾아봐!',
  },
  {
    id: 'monster_5',
    stageId: 5,
    name: '10빼기 물방울몬',
    icon: '💧',
    element: 'nature',
    bonusExp: 20,
    rarity: 'common',
    description: '10개의 물방울에서 원하는 만큼 퐁퐁 빼내는 맑은 호수의 요정입니다.',
    quote: '10에서 뺄 때는 10의 짝꿍 수를 생각하면 바로 풀려!',
  },
  {
    id: 'monster_6',
    stageId: 6,
    name: '10 더하기 신전몬',
    icon: '☀️',
    element: 'light',
    bonusExp: 20,
    rarity: 'common',
    description: '10에 몇을 더해 십몇을 눈 깜짝할 사이에 만들어 내는 태양의 정령입니다.',
    quote: '10에 5를 더하면 15! 십의 자리 1과 일의 자리 수가 척척!',
  },
  {
    id: 'monster_7',
    stageId: 7,
    name: '올림 날개몬',
    icon: '🪽',
    element: 'thunder',
    bonusExp: 25,
    rarity: 'common',
    description: '한 자리 수끼리 더해 10이 넘으면 10을 묶어 하늘로 날아오르는 날개 요정입니다.',
    quote: '8 + 5는 8에 2를 주어 10을 만들고 3이 남아 13!',
  },
  {
    id: 'monster_8',
    stageId: 8,
    name: '전략 부엉몬',
    icon: '🦉',
    element: 'light',
    bonusExp: 25,
    rarity: 'common',
    description: '가르기와 모으기 등 여러 가지 똑똑한 방법으로 덧셈을 푸는 지혜로운 부엉이입니다.',
    quote: '앞 수를 가를까, 뒤 수를 가를까? 편한 방법을 골라봐!',
  },
  {
    id: 'monster_9',
    stageId: 9,
    name: '10묶음 뺄셈몬',
    icon: '💎',
    element: 'dark',
    bonusExp: 25,
    rarity: 'common',
    description: '십몇에서 몇을 뺄 때 10 묶음에서 먼저 쏙 빼는 동굴의 보석 수호자입니다.',
    quote: '13 - 9는 10에서 9를 빼서 1을 얻고, 원래 있던 3과 더해 4!',
  },
  {
    id: 'monster_10',
    stageId: 10,
    name: '뺄셈 해결몬',
    icon: '🧩',
    element: 'dark',
    bonusExp: 25,
    rarity: 'common',
    description: '10을 만들어 빼기와 10에서 먼저 빼기 전략을 자유자재로 다루는 마스터입니다.',
    quote: '어떤 뺄셈 전략을 쓸지 생각하고 풀면 연산 속도가 두 배!',
  },
  {
    id: 'monster_11',
    stageId: 11,
    name: '두자리 놀이몬',
    icon: '🪅',
    element: 'fire',
    bonusExp: 30,
    rarity: 'common',
    description: '십의 자리는 십의 자리끼리, 일의 자리는 일의 자리끼리 짝을 맞춰 연산하는 놀이꾼입니다.',
    quote: '24 + 13은 십의 자리 20+10=30, 일의 자리 4+3=7 합쳐서 37!',
  },
  {
    id: 'monster_12',
    stageId: 12,
    name: '덧셈·뺄셈 마스터몬',
    icon: '👑',
    element: 'light',
    bonusExp: 40,
    rarity: 'boss',
    description: '1~11차시의 모든 연산 원리를 완벽하게 마스터한 1학년 수학 탐험대의 최고 수호신입니다.',
    quote: '축하한다! 너는 이제 1학년 2학기 덧셈과 뺄셈을 완벽히 정복한 진정한 수학 용사다!',
  },
];

export const LEVEL_TITLES: { minLevel: number; title: string; badge: string }[] = [
  { minLevel: 1, title: '초보 모험가', badge: '🌱 Lv.1~2' },
  { minLevel: 3, title: '성장하는 용사', badge: '⚔️ Lv.3~4' },
  { minLevel: 5, title: '숙련 모험가', badge: '🏅 Lv.5~7' },
  { minLevel: 8, title: '연산 마법사', badge: '🔮 Lv.8~10' },
  { minLevel: 11, title: '수학 탐험 대장', badge: '🧭 Lv.11~14' },
  { minLevel: 15, title: '전설의 수학 마스터', badge: '👑 Lv.15+' },
];

/**
 * Cumulative EXP required to reach a specific level.
 * Level 1: 0 EXP
 * Level 2: 120 EXP (requires 120 EXP from Lv1)
 * Level 3: 260 EXP (+140 EXP)
 * Level 4: 420 EXP (+160 EXP)
 * Level 5: 600 EXP (+180 EXP)
 * Level 6: 800 EXP (+200 EXP)
 * Level 7: 1020 EXP (+220 EXP)
 * Level 8: 1260 EXP (+240 EXP)
 * Level 9: 1520 EXP (+260 EXP)
 * Level 10: 1800 EXP (+280 EXP)
 * Level 11: 2100 EXP (+300 EXP)
 * Level 12: 2420 EXP (+320 EXP)
 * Level 13+: scaling
 */
export function getTotalExpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 10 * (level - 1) * (level + 10);
}

export function getExpNeededForLevel(currentLevel: number): number {
  return getTotalExpForLevel(currentLevel + 1);
}

export function getLevelProgress(exp: number, level: number): {
  currentLevelExp: number;
  neededInLevel: number;
  percent: number;
  totalExpForNext: number;
} {
  const base = getTotalExpForLevel(level);
  const target = getTotalExpForLevel(level + 1);
  const neededInLevel = Math.max(1, target - base);
  const currentLevelExp = Math.max(0, exp - base);
  const percent = Math.min(100, Math.max(0, Math.round((currentLevelExp / neededInLevel) * 100)));
  return {
    currentLevelExp,
    neededInLevel,
    percent,
    totalExpForNext: target,
  };
}

export function getTitleForLevel(level: number): string {
  const found = [...LEVEL_TITLES].reverse().find(t => level >= t.minLevel);
  return found ? found.title : '초보 모험가';
}
