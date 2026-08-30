// Curriculum Data for 1st Grade Elementary Math: Addition & Subtraction (Semester 2, Units 2, 4, 6)
// 15 curated base problems per stage (180 total base problems) + Stage metadata

import { StageInfo, Problem } from '../types';

export const STAGES_CONFIG: StageInfo[] = [
  {
    id: 1,
    title: '1차시: 모으기와 가르기 & 한 자리 수의 합과 차',
    subtitle: '사과와 보석으로 수 모으기와 가르기',
    mapLocationName: '새싹 마을',
    description: '구체물 그림을 보며 두 수를 모으거나 한 수를 두 수로 가르는 기본 수 감각을 기릅니다.',
    icon: '🍎',
    themeColor: 'emerald',
    badge: '모으기·가르기',
  },
  {
    id: 2,
    title: '2차시: 세 수의 덧셈',
    subtitle: '세 수를 앞에서부터 차례대로 더하기',
    mapLocationName: '마카롱 동산',
    description: '마카롱, 구슬 그림을 보고 세 수를 앞에서부터 차례차례 더하는 계산 원리를 익힙니다.',
    icon: '🍡',
    themeColor: 'lime',
    badge: '세 수 덧셈',
  },
  {
    id: 3,
    title: '3차시: 세 수의 뺄셈',
    subtitle: '초콜릿과 바둑돌을 덜어내며 세 수 빼기',
    mapLocationName: '초콜릿 숲',
    description: '친구들에게 나누어 주고 남은 양을 구하며 세 수를 차례대로 빼는 원리를 익힙니다.',
    icon: '🍫',
    themeColor: 'green',
    badge: '세 수 뺄셈',
  },
  {
    id: 4,
    title: '4차시: 10이 되는 더하기 (10 가르기와 모으기)',
    subtitle: '10칸 상자 채우기와 10의 짝꿍 수 찾기',
    mapLocationName: '10칸 보물섬',
    description: '10칸 프레임과 주사위 눈을 활용하여 두 수를 더해 10이 되는 보수 개념을 마스터합니다.',
    icon: '🎁',
    themeColor: 'teal',
    badge: '10 만들기',
  },
  {
    id: 5,
    title: '5차시: 10에서 빼기',
    subtitle: '10개에서 덜어내고 남은 수 구하기',
    mapLocationName: '사과 과수원',
    description: '10개의 과일, 새, 볼링핀 중에서 몇 개를 빼고 남은 수를 뺄셈식으로 구합니다.',
    icon: '🧺',
    themeColor: 'amber',
    badge: '10에서 빼기',
  },
  {
    id: 6,
    title: '6차시: 10을 만들어 세 수 더하기',
    subtitle: '10이 되는 두 수를 먼저 묶어 더하기',
    mapLocationName: '도토리 오솔길',
    description: '세 수 중 더해서 10이 되는 두 수를 먼저 찾아 묶어 더한 뒤 남은 수를 쉽게 더합니다.',
    icon: '🐿️',
    themeColor: 'cyan',
    badge: '10 묶어 더하기',
  },
  {
    id: 7,
    title: '7차시: 받아올림 덧셈 (몇)+(몇)=십몇',
    subtitle: '10을 만들어 더하는 (몇)+(몇)',
    mapLocationName: '재활용 마을',
    description: '빈 병, 깡통을 모으는 상황에서 10을 채워 십몇을 만드는 받아올림 덧셈 원리를 배웁니다.',
    icon: '🍼',
    themeColor: 'blue',
    badge: '받아올림 덧셈',
  },
  {
    id: 8,
    title: '8차시: 여러 가지 덧셈 전략',
    subtitle: '덧셈의 규칙과 짝꿍 식 탐구',
    mapLocationName: '풍선 축제',
    description: '앞뒤를 바꾸어 더해도 같은 합, 6+6=12를 활용해 7+6=13을 구하는 등 유연한 덧셈을 배웁니다.',
    icon: '🎈',
    themeColor: 'rose',
    badge: '덧셈 탐구',
  },
  {
    id: 9,
    title: '9차시: 받아내림 뺄셈 (십몇)-(몇)',
    subtitle: '10에서 빼기와 낱개 먼저 빼기 전략',
    mapLocationName: '알뜰 시장',
    description: '14-6, 12-4와 같이 일의 자리에서 뺄 수 없을 때 10개 묶음에서 빼는 원리를 익힙니다.',
    icon: '🛍️',
    themeColor: 'indigo',
    badge: '받아내림 뺄셈',
  },
  {
    id: 10,
    title: '10차시: 여러 가지 뺄셈 전략 & 수 카드 차 구하기',
    subtitle: '차가 9인 뺄셈과 뺄셈 규칙 퍼즐',
    mapLocationName: '열기구 언덕',
    description: '11-2=9, 12-3=9 등 차가 같은 뺄셈식의 규칙을 찾고 수 카드로 식을 완성합니다.',
    icon: '🎈',
    themeColor: 'purple',
    badge: '뺄셈 탐구',
  },
  {
    id: 11,
    title: '11차시: 두 자리 수의 덧셈 (받아올림 없음)',
    subtitle: '(몇십몇)+(몇)과 (몇십몇)+(몇십몇)',
    mapLocationName: '전통놀이 마당',
    description: '10개씩 묶음과 낱개를 각각 더하여 받아올림 없는 두 자리 수 덧셈을 능숙하게 해결합니다.',
    icon: '🪁',
    themeColor: 'yellow',
    badge: '두 자리 덧셈',
  },
  {
    id: 12,
    title: '12차시: 두 자리 수의 뺄셈 & 덧셈뺄셈 마스터 대결',
    subtitle: '두 자리 수 뺄셈 및 1학년 2학기 총정리 보스전',
    mapLocationName: '덧셈뺄셈 왕국',
    description: '두 자리 수 뺄셈과 1~12차시 전 단원 종합 문제를 해결하고 덧셈뺄셈 마스터 왕관을 획득합니다.',
    icon: '👑',
    themeColor: 'violet',
    badge: '최종 마스터',
  },
];

// Helper to generate 15 structured base problems per stage
export function getBaseProblemsForStage(stageId: number): Problem[] {
  switch (stageId) {
    case 1: // 1차시: 모으기와 가르기 & 한 자리 수의 합과 차
      return [
        {
          id: 's1_p1', stageId: 1, type: 'basic', format: 'split_join',
          num1: 3, num2: 2, operator: 'split_join', answer: 5,
          questionText: '빨간 사과 3개와 초록 사과 2개를 모으면 모두 몇 개일까요?',
          stepHints: ['3과 2를 모으면 5가 됩니다.', '3 다음에 4, 5로 2개 더 세어보세요.', '3 + 2 = 5'],
          errorType: '모으기 오류',
          visualAid: { type: 'apples', count1: 3, count2: 2, target: 5 }
        },
        {
          id: 's1_p2', stageId: 1, type: 'basic', format: 'split_join',
          num1: 7, num2: 3, operator: 'split_join', answer: 4,
          questionText: '파란 보석 7개를 3개와 몇 개로 가를 수 있을까요? 빈칸에 알맞은 수를 구하세요.',
          stepHints: ['7에서 3을 빼면 얼마가 남을까요?', '3과 어떤 수를 모아야 7이 될까요?', '7을 가르면 3과 4가 됩니다.'],
          errorType: '가르기 오류',
          visualAid: { type: 'split_diagram', target: 7, count1: 3 }
        },
        {
          id: 's1_p3', stageId: 1, type: 'basic', format: 'horizontal',
          num1: 3, num2: 1, operator: '+', answer: 4,
          questionText: '3 + 1 을 계산해 보세요.',
          stepHints: ['3보다 1 큰 수를 찾아보세요.', '3 다음 수는 4입니다.', '정답은 4입니다.'],
          errorType: '한 자리 덧셈 오류'
        },
        {
          id: 's1_p4', stageId: 1, type: 'basic', format: 'horizontal',
          num1: 9, num2: 7, operator: '-', answer: 2,
          questionText: '9 - 7 을 계산해 보세요.',
          stepHints: ['9에서 7개를 거꾸로 세거나 빼보세요.', '7에 몇을 더하면 9가 될까요?', '9 - 7 = 2 입니다.'],
          errorType: '한 자리 뺄셈 오류'
        },
        {
          id: 's1_p5', stageId: 1, type: 'basic', format: 'horizontal',
          num1: 3, num2: 0, operator: '+', answer: 3,
          questionText: '3 + 0 은 얼마일까요?',
          stepHints: ['0을 더하면 수가 그대로 유지됩니다.', '3에 아무것도 더하지 않았어요.', '정답은 3입니다.'],
          errorType: '0의 성질 오류'
        },
        {
          id: 's1_p6', stageId: 1, type: 'basic', format: 'horizontal',
          num1: 4, num2: 2, operator: '+', answer: 6,
          questionText: '4 + 2 의 값을 계산하세요.',
          stepHints: ['4 다음에 5, 6으로 2개 더 세어보세요.', '4와 2를 모으면 6이 됩니다.', '정답은 6입니다.'],
          errorType: '한 자리 덧셈 오류'
        },
        {
          id: 's1_p7', stageId: 1, type: 'advanced', format: 'horizontal',
          num1: 7, num2: 3, operator: '-', answer: 4,
          questionText: '7 - 3 = ? (계산 결과가 같은 뺄셈식을 찾아보세요: 9-5)',
          stepHints: ['7 - 3 을 먼저 계산해보세요. 7에서 3을 빼면 4입니다.', '9 - 5 도 4입니다.', '정답은 4입니다.'],
          errorType: '한 자리 뺄셈 오류'
        },
        {
          id: 's1_p8', stageId: 1, type: 'advanced', format: 'horizontal',
          num1: 8, num2: 6, operator: '-', answer: 2,
          questionText: '8 - 6 의 계산 결과를 구하세요.',
          stepHints: ['8에서 6을 빼면 2가 남습니다.', '6 + 2 = 8 이므로 8 - 6 = 2 입니다.', '정답은 2입니다.'],
          errorType: '한 자리 뺄셈 오류'
        },
        {
          id: 's1_p9', stageId: 1, type: 'challenge', format: 'word',
          num1: 5, num2: 1, operator: '+', answer: 6,
          questionText: '합이 6이 되는 식을 찾으려고 합니다. 5 + 1 의 합은 얼마일까요?',
          stepHints: ['5에 1을 더하면 6이 됩니다.', '5와 1을 모으면 6입니다.', '정답은 6입니다.'],
          errorType: '한 자리 덧셈 오류'
        },
        {
          id: 's1_p10', stageId: 1, type: 'challenge', format: 'split_join',
          num1: 8, num2: 5, operator: 'split_join', answer: 3,
          questionText: '8을 5와 어떤 수로 가를 수 있을까요? 빈칸에 알맞은 수를 구하세요.',
          stepHints: ['5와 어떤 수를 모으면 8이 될까요?', '8 - 5 = 3 입니다.', '정답은 3입니다.'],
          errorType: '가르기 오류'
        },
        {
          id: 's1_p11', stageId: 1, type: 'remedial', format: 'horizontal',
          num1: 4, num2: 4, operator: '+', answer: 8,
          questionText: '4 + 4 를 계산해 보세요.',
          stepHints: ['4에 4를 더하면 8이 됩니다.', '4를 두 번 더해보세요.', '정답은 8입니다.'],
          errorType: '한 자리 덧셈 오류'
        },
        {
          id: 's1_p12', stageId: 1, type: 'remedial', format: 'horizontal',
          num1: 6, num2: 2, operator: '-', answer: 4,
          questionText: '6 - 2 를 계산해 보세요.',
          stepHints: ['6에서 2를 거꾸로 세어보세요: 5, 4.', '6 - 2 = 4 입니다.', '정답은 4입니다.'],
          errorType: '한 자리 뺄셈 오류'
        },
        {
          id: 's1_p13', stageId: 1, type: 'puzzle', format: 'puzzle',
          num1: 5, num2: 3, operator: '+', answer: 3,
          questionText: '합이 8이 되는 덧셈식을 완성하세요: 5 + [  ] = 8',
          stepHints: ['5에 몇을 더해야 8이 될까요?', '8 - 5 = 3 입니다.', '빈칸에 들어갈 수는 3입니다.'],
          errorType: '방정식 추론 오류'
        },
        {
          id: 's1_p14', stageId: 1, type: 'word', format: 'word',
          num1: 4, num2: 3, operator: '+', answer: 7,
          context: '놀이터 친구들',
          questionText: '놀이터에 친구가 4명 놀고 있었습니다. 3명이 더 오면 모두 몇 명일까요?',
          stepHints: ['처음 있던 4명에 3명을 더합니다.', '4 + 3 = 7', '정답은 7입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's1_p15', stageId: 1, type: 'boss', format: 'split_join',
          num1: 9, num2: 4, operator: 'split_join', answer: 5,
          questionText: '[새싹 마을 보스] 9를 4와 어떤 수로 가를 수 있을까요?',
          stepHints: ['4와 어떤 수를 모으면 9가 될까요?', '9 - 4 = 5 입니다.', '정답은 5입니다.'],
          errorType: '가르기 오류'
        },
      ];

    case 2: // 2차시: 세 수의 덧셈
      return [
        {
          id: 's2_p1', stageId: 2, type: 'basic', format: 'three_add',
          num1: 2, num2: 1, num3: 3, operator: 'three_add', answer: 6,
          questionText: '마카롱이 분홍색 2개, 주황색 1개, 연두색 3개 있습니다. 2 + 1 + 3 은 얼마일까요?',
          stepHints: ['먼저 2 + 1 = 3 을 계산합니다.', '그 다음 3 + 3 = 6 을 계산합니다.', '정답은 6입니다.'],
          errorType: '세 수 계산 순서 오류',
          visualAid: { type: 'items', count1: 2, count2: 1, count3: 3, itemName: '마카롱' }
        },
        {
          id: 's2_p2', stageId: 2, type: 'basic', format: 'three_add',
          num1: 3, num2: 1, num3: 5, operator: 'three_add', answer: 9,
          questionText: '3 + 1 + 5 를 순서대로 계산하세요.',
          stepHints: ['1단계: 3 + 1 = 4', '2단계: 4 + 5 = 9', '정답은 9입니다.'],
          errorType: '세 수 계산 순서 오류'
        },
        {
          id: 's2_p3', stageId: 2, type: 'basic', format: 'three_add',
          num1: 4, num2: 2, num3: 1, operator: 'three_add', answer: 7,
          questionText: '4 + 2 + 1 을 계산하세요.',
          stepHints: ['4 + 2 = 6', '6 + 1 = 7', '정답은 7입니다.'],
          errorType: '세 수 계산 순서 오류'
        },
        {
          id: 's2_p4', stageId: 2, type: 'basic', format: 'three_add',
          num1: 5, num2: 1, num3: 2, operator: 'three_add', answer: 8,
          questionText: '5 + 1 + 2 = ? (5+1을 먼저 계산하고 2를 더해보세요)',
          stepHints: ['5 + 1 = 6', '6 + 2 = 8', '정답은 8입니다.'],
          errorType: '세 수 계산 순서 오류'
        },
        {
          id: 's2_p5', stageId: 2, type: 'basic', format: 'three_add',
          num1: 2, num2: 3, num3: 4, operator: 'three_add', answer: 9,
          questionText: '2 + 3 + 4 를 계산하세요.',
          stepHints: ['2 + 3 = 5', '5 + 4 = 9', '정답은 9입니다.'],
          errorType: '세 수 계산 순서 오류'
        },
        {
          id: 's2_p6', stageId: 2, type: 'advanced', format: 'three_add',
          num1: 1, num2: 4, num3: 3, operator: 'three_add', answer: 8,
          questionText: '1 + 4 + 3 을 차례대로 계산하세요.',
          stepHints: ['1 + 4 = 5', '5 + 3 = 8', '정답은 8입니다.'],
          errorType: '세 수 계산 순서 오류'
        },
        {
          id: 's2_p7', stageId: 2, type: 'advanced', format: 'puzzle',
          num1: 1, num2: 2, num3: 5, operator: 'three_add', answer: 5,
          questionText: '수 카드 [2, 3, 4, 5] 중 2장을 골라 1 + [  ] + [  ] = 8 을 만듭니다. 1 + 2 + [ ? ] = 8 에서 빈칸의 수는?',
          stepHints: ['1 + 2 = 3 입니다.', '3에 몇을 더해야 8이 될까요? 8 - 3 = 5', '빈칸에 들어갈 수는 5입니다.'],
          errorType: '수 카드 추론 오류'
        },
        {
          id: 's2_p8', stageId: 2, type: 'advanced', format: 'three_add',
          num1: 3, num2: 3, num3: 3, operator: 'three_add', answer: 9,
          questionText: '3 + 3 + 3 을 계산하세요.',
          stepHints: ['3 + 3 = 6', '6 + 3 = 9', '정답은 9입니다.'],
          errorType: '세 수 계산 순서 오류'
        },
        {
          id: 's2_p9', stageId: 2, type: 'challenge', format: 'word',
          num1: 2, num2: 2, num3: 4, operator: 'three_add', answer: 8,
          context: '색연필 모으기',
          questionText: '빨간 색연필 2자루, 파란 색연필 2자루, 노란 색연필 4자루가 있습니다. 색연필은 모두 몇 자루일까요?',
          stepHints: ['식: 2 + 2 + 4', '2 + 2 = 4, 4 + 4 = 8', '정답은 8입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's2_p10', stageId: 2, type: 'challenge', format: 'three_add',
          num1: 4, num2: 1, num3: 4, operator: 'three_add', answer: 9,
          questionText: '4 + 1 + 4 의 값을 구하세요.',
          stepHints: ['4 + 1 = 5', '5 + 4 = 9', '정답은 9입니다.'],
          errorType: '세 수 계산 순서 오류'
        },
        {
          id: 's2_p11', stageId: 2, type: 'remedial', format: 'three_add',
          num1: 1, num2: 2, num3: 3, operator: 'three_add', answer: 6,
          questionText: '1 + 2 + 3 을 계산하세요.',
          stepHints: ['1 + 2 = 3', '3 + 3 = 6', '정답은 6입니다.'],
          errorType: '세 수 계산 순서 오류'
        },
        {
          id: 's2_p12', stageId: 2, type: 'remedial', format: 'three_add',
          num1: 2, num2: 2, num3: 2, operator: 'three_add', answer: 6,
          questionText: '2 + 2 + 2 를 계산하세요.',
          stepHints: ['2 + 2 = 4', '4 + 2 = 6', '정답은 6입니다.'],
          errorType: '세 수 계산 순서 오류'
        },
        {
          id: 's2_p13', stageId: 2, type: 'puzzle', format: 'puzzle',
          num1: 2, num2: 4, num3: 1, operator: 'three_add', answer: 4,
          questionText: '2 + [  ] + 1 = 7 입니다. 빈칸에 들어갈 수는 얼마일까요?',
          stepHints: ['2 + 1 = 3 입니다.', '3에 얼마를 더해야 7이 될까요?', '7 - 3 = 4 입니다.'],
          errorType: '방정식 추론 오류'
        },
        {
          id: 's2_p14', stageId: 2, type: 'word', format: 'word',
          num1: 3, num2: 2, num3: 4, operator: 'three_add', answer: 9,
          context: '도토리 줍기',
          questionText: '다람쥐가 아침에 3개, 점심에 2개, 저녁에 4개의 도토리를 주웠습니다. 모두 몇 개일까요?',
          stepHints: ['식: 3 + 2 + 4', '3 + 2 = 5, 5 + 4 = 9', '정답은 9개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's2_p15', stageId: 2, type: 'boss', format: 'three_add',
          num1: 3, num2: 4, num3: 2, operator: 'three_add', answer: 9,
          questionText: '[마카롱 동산 보스] 3 + 4 + 2 를 빠르고 정확하게 계산하세요!',
          stepHints: ['3 + 4 = 7', '7 + 2 = 9', '정답은 9입니다.'],
          errorType: '세 수 계산 순서 오류'
        },
      ];

    case 3: // 3차시: 세 수의 뺄셈
      return [
        {
          id: 's3_p1', stageId: 3, type: 'basic', format: 'three_sub',
          num1: 4, num2: 2, num3: 1, operator: 'three_sub', answer: 1,
          questionText: '초콜릿 4개 중 지우에게 2개, 유나에게 1개를 주면 몇 개가 남을까요? 4 - 2 - 1 = ?',
          stepHints: ['먼저 4 - 2 = 2 를 계산합니다.', '그 다음 2 - 1 = 1 을 계산합니다.', '정답은 1개입니다.'],
          errorType: '세 수 뺄셈 순서 오류',
          visualAid: { type: 'items', count1: 4, count2: 2, count3: 1, itemName: '초콜릿' }
        },
        {
          id: 's3_p2', stageId: 3, type: 'basic', format: 'three_sub',
          num1: 7, num2: 1, num3: 3, operator: 'three_sub', answer: 3,
          questionText: '바둑돌 7개 중 처음에 1개, 그다음에 3개를 빼면 몇 개가 남을까요? 7 - 1 - 3 = ?',
          stepHints: ['1단계: 7 - 1 = 6', '2단계: 6 - 3 = 3', '정답은 3개입니다.'],
          errorType: '세 수 뺄셈 순서 오류'
        },
        {
          id: 's3_p3', stageId: 3, type: 'basic', format: 'three_sub',
          num1: 5, num2: 1, num3: 2, operator: 'three_sub', answer: 2,
          questionText: '5 - 1 - 2 를 순서대로 계산하세요.',
          stepHints: ['5 - 1 = 4', '4 - 2 = 2', '정답은 2입니다.'],
          errorType: '세 수 뺄셈 순서 오류'
        },
        {
          id: 's3_p4', stageId: 3, type: 'basic', format: 'three_sub',
          num1: 9, num2: 2, num3: 3, operator: 'three_sub', answer: 4,
          questionText: '9 - 2 - 3 을 계산하세요.',
          stepHints: ['9 - 2 = 7', '7 - 3 = 4', '정답은 4입니다.'],
          errorType: '세 수 뺄셈 순서 오류'
        },
        {
          id: 's3_p5', stageId: 3, type: 'basic', format: 'three_sub',
          num1: 6, num2: 2, num3: 1, operator: 'three_sub', answer: 3,
          questionText: '찰흙 6덩어리 중 2덩어리로 자동차를 만들고, 1덩어리로 비행기를 만들었습니다. 남은 찰흙은 몇 덩어리일까요?',
          stepHints: ['식: 6 - 2 - 1', '6 - 2 = 4, 4 - 1 = 3', '정답은 3입니다.'],
          errorType: '세 수 뺄셈 순서 오류'
        },
        {
          id: 's3_p6', stageId: 3, type: 'advanced', format: 'three_sub',
          num1: 8, num2: 3, num3: 2, operator: 'three_sub', answer: 3,
          questionText: '8 - 3 - 2 를 계산하세요.',
          stepHints: ['8 - 3 = 5', '5 - 2 = 3', '정답은 3입니다.'],
          errorType: '세 수 뺄셈 순서 오류'
        },
        {
          id: 's3_p7', stageId: 3, type: 'advanced', format: 'puzzle',
          num1: 8, num2: 4, num3: 3, operator: 'three_sub', answer: 3,
          questionText: '수 카드 [5, 4, 3, 2] 중 2장을 골라 8 - [ 4 ] - [ ? ] = 1 을 완성할 때 빈칸의 수는 얼마일까요?',
          stepHints: ['8 - 4 = 4 입니다.', '4에서 몇을 빼야 1이 될까요? 4 - 3 = 1', '정답은 3입니다.'],
          errorType: '수 카드 추론 오류'
        },
        {
          id: 's3_p8', stageId: 3, type: 'advanced', format: 'three_sub',
          num1: 9, num2: 4, num3: 2, operator: 'three_sub', answer: 3,
          questionText: '9 - 4 - 2 를 계산하세요.',
          stepHints: ['9 - 4 = 5', '5 - 2 = 3', '정답은 3입니다.'],
          errorType: '세 수 뺄셈 순서 오류'
        },
        {
          id: 's3_p9', stageId: 3, type: 'challenge', format: 'word',
          num1: 7, num2: 2, num3: 2, operator: 'three_sub', answer: 3,
          context: '사탕 나눠먹기',
          questionText: '사탕 7개 중 동생에게 2개 주고, 내가 2개를 먹었습니다. 남은 사탕은 몇 개일까요?',
          stepHints: ['식: 7 - 2 - 2', '7 - 2 = 5, 5 - 2 = 3', '정답은 3개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's3_p10', stageId: 3, type: 'challenge', format: 'three_sub',
          num1: 8, num2: 2, num3: 4, operator: 'three_sub', answer: 2,
          questionText: '8 - 2 - 4 의 값을 계산하세요.',
          stepHints: ['8 - 2 = 6', '6 - 4 = 2', '정답은 2입니다.'],
          errorType: '세 수 뺄셈 순서 오류'
        },
        {
          id: 's3_p11', stageId: 3, type: 'remedial', format: 'three_sub',
          num1: 6, num2: 1, num3: 2, operator: 'three_sub', answer: 3,
          questionText: '6 - 1 - 2 를 계산하세요.',
          stepHints: ['6 - 1 = 5', '5 - 2 = 3', '정답은 3입니다.'],
          errorType: '세 수 뺄셈 순서 오류'
        },
        {
          id: 's3_p12', stageId: 3, type: 'remedial', format: 'three_sub',
          num1: 5, num2: 2, num3: 1, operator: 'three_sub', answer: 2,
          questionText: '5 - 2 - 1 을 계산하세요.',
          stepHints: ['5 - 2 = 3', '3 - 1 = 2', '정답은 2입니다.'],
          errorType: '세 수 뺄셈 순서 오류'
        },
        {
          id: 's3_p13', stageId: 3, type: 'puzzle', format: 'puzzle',
          num1: 7, num2: 3, num3: 2, operator: 'three_sub', answer: 3,
          questionText: '7 - [  ] - 2 = 2 입니다. 빈칸에 들어갈 수는 얼마일까요?',
          stepHints: ['7에서 2를 먼저 빼면 5가 됩니다.', '5에서 얼마를 빼야 2가 될까요? 5 - 3 = 2', '빈칸에 들어갈 수는 3입니다.'],
          errorType: '방정식 추론 오류'
        },
        {
          id: 's3_p14', stageId: 3, type: 'word', format: 'word',
          num1: 9, num2: 3, num3: 4, operator: 'three_sub', answer: 2,
          context: '스티커 선물',
          questionText: '스티커 9장 중 친구에게 3장, 동생에게 4장을 주었습니다. 남은 스티커는 몇 장일까요?',
          stepHints: ['식: 9 - 3 - 4', '9 - 3 = 6, 6 - 4 = 2', '정답은 2장입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's3_p15', stageId: 3, type: 'boss', format: 'three_sub',
          num1: 9, num2: 5, num3: 2, operator: 'three_sub', answer: 2,
          questionText: '[초콜릿 숲 보스] 9 - 5 - 2 를 빠르고 정확하게 계산하세요!',
          stepHints: ['9 - 5 = 4', '4 - 2 = 2', '정답은 2입니다.'],
          errorType: '세 수 뺄셈 순서 오류'
        },
      ];

    case 4: // 4차시: 10이 되는 더하기 (10 가르기와 모으기)
      return [
        {
          id: 's4_p1', stageId: 4, type: 'basic', format: 'horizontal',
          num1: 6, num2: 4, operator: '+', answer: 10,
          questionText: '검은 바둑돌 6개에 흰 바둑돌 4개를 더하면 몇 개가 될까요? 6 + 4 = ?',
          stepHints: ['6과 4를 모으면 10이 됩니다.', '10칸 상자를 가득 채우는 짝꿍 수입니다.', '정답은 10입니다.'],
          errorType: '10 만들기 오류',
          visualAid: { type: 'ten_frame', count1: 6, count2: 4, target: 10 }
        },
        {
          id: 's4_p2', stageId: 4, type: 'basic', format: 'horizontal',
          num1: 5, num2: 5, operator: '+', answer: 10,
          questionText: '기차에 탄 사람 5명과 타려는 사람 5명이 있습니다. 5 + 5 = ?',
          stepHints: ['5와 5를 더하면 10이 됩니다.', '손가락 다섯 개씩 두 손을 모아보세요.', '정답은 10입니다.'],
          errorType: '10 만들기 오류'
        },
        {
          id: 's4_p3', stageId: 4, type: 'basic', format: 'puzzle',
          num1: 2, num2: 8, operator: '+', answer: 8,
          questionText: '주사위 눈 2와 더해서 10이 되려면 빈칸에 얼마가 필요할까요? 2 + [  ] = 10',
          stepHints: ['10에서 2를 빼보세요: 10 - 2 = 8', '2의 10 짝꿍 수는 8입니다.', '정답은 8입니다.'],
          errorType: '10의 보수 오류'
        },
        {
          id: 's4_p4', stageId: 4, type: 'basic', format: 'puzzle',
          num1: 3, num2: 7, operator: '+', answer: 7,
          questionText: '3 + [  ] = 10 빈칸에 알맞은 수를 써넣으세요.',
          stepHints: ['3과 어떤 수를 모으면 10이 될까요?', '10 - 3 = 7', '정답은 7입니다.'],
          errorType: '10의 보수 오류'
        },
        {
          id: 's4_p5', stageId: 4, type: 'basic', format: 'puzzle',
          num1: 6, num2: 4, operator: '+', answer: 4,
          questionText: '[  ] + 6 = 10 빈칸에 알맞은 수는 얼마일까요?',
          stepHints: ['6과 더해서 10이 되는 수를 생각해보세요.', '10 - 6 = 4', '정답은 4입니다.'],
          errorType: '10의 보수 오류'
        },
        {
          id: 's4_p6', stageId: 4, type: 'advanced', format: 'puzzle',
          num1: 7, num2: 3, operator: '+', answer: 3,
          questionText: '7 + [  ] = 10 빈칸에 알맞은 수를 쓰세요.',
          stepHints: ['7의 10 짝꿍 수는 3입니다.', '7 + 3 = 10', '정답은 3입니다.'],
          errorType: '10의 보수 오류'
        },
        {
          id: 's4_p7', stageId: 4, type: 'advanced', format: 'puzzle',
          num1: 1, num2: 9, operator: '+', answer: 9,
          questionText: '1 + [  ] = 10 빈칸에 알맞은 수는 얼마일까요?',
          stepHints: ['1과 9를 모으면 10입니다.', '10 - 1 = 9', '정답은 9입니다.'],
          errorType: '10의 보수 오류'
        },
        {
          id: 's4_p8', stageId: 4, type: 'advanced', format: 'puzzle',
          num1: 4, num2: 6, operator: '+', answer: 6,
          questionText: '[  ] + 4 = 10 빈칸에 알맞은 수를 구하세요.',
          stepHints: ['4의 10 짝꿍 수는 6입니다.', '6 + 4 = 10', '정답은 6입니다.'],
          errorType: '10의 보수 오류'
        },
        {
          id: 's4_p9', stageId: 4, type: 'challenge', format: 'word',
          num1: 6, num2: 4, operator: '+', answer: 4,
          context: '연못 개구리',
          questionText: '연못에 연잎이 10장 있습니다. 개구리 6마리가 앉아있다면 빈 연잎은 몇 장일까요? (6 + [?] = 10)',
          stepHints: ['10에서 6을 뺍니다.', '6 + 4 = 10', '정답은 4입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's4_p10', stageId: 4, type: 'challenge', format: 'puzzle',
          num1: 8, num2: 2, operator: '+', answer: 2,
          questionText: '8 + [  ] = 10 빈칸에 들어갈 짝꿍 수는?',
          stepHints: ['8과 2를 모으면 10입니다.', '10 - 8 = 2', '정답은 2입니다.'],
          errorType: '10의 보수 오류'
        },
        {
          id: 's4_p11', stageId: 4, type: 'remedial', format: 'horizontal',
          num1: 9, num2: 1, operator: '+', answer: 10,
          questionText: '9 + 1 = ?',
          stepHints: ['9 바로 다음 수는 10입니다.', '9 + 1 = 10', '정답은 10입니다.'],
          errorType: '10 만들기 오류'
        },
        {
          id: 's4_p12', stageId: 4, type: 'remedial', format: 'horizontal',
          num1: 8, num2: 2, operator: '+', answer: 10,
          questionText: '8 + 2 = ?',
          stepHints: ['8 다음에 9, 10.', '8 + 2 = 10', '정답은 10입니다.'],
          errorType: '10 만들기 오류'
        },
        {
          id: 's4_p13', stageId: 4, type: 'puzzle', format: 'puzzle',
          num1: 5, num2: 5, operator: '+', answer: 5,
          questionText: '5 + [  ] = 10 빈칸에 알맞은 수를 써넣으세요.',
          stepHints: ['5와 5를 더하면 10입니다.', '정답은 5입니다.'],
          errorType: '10의 보수 오류'
        },
        {
          id: 's4_p14', stageId: 4, type: 'word', format: 'word',
          num1: 7, num2: 3, operator: '+', answer: 3,
          context: '풍선 장식',
          questionText: '교실을 풍선 10개로 꾸미려고 합니다. 지금 7개가 있다면 몇 개 더 불어야 할까요?',
          stepHints: ['7에 몇 개를 더해야 10개가 될까요?', '10 - 7 = 3', '정답은 3개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's4_p15', stageId: 4, type: 'boss', format: 'puzzle',
          num1: 4, num2: 6, operator: '+', answer: 6,
          questionText: '[10칸 보물섬 보스] 4 + [  ] = 10 마법 상자를 채우는 수는?',
          stepHints: ['4와 6을 모으면 10이 됩니다.', '정답은 6입니다.'],
          errorType: '10의 보수 오류'
        },
      ];

    case 5: // 5차시: 10에서 빼기
      return [
        {
          id: 's5_p1', stageId: 5, type: 'basic', format: 'horizontal',
          num1: 10, num2: 4, operator: '-', answer: 6,
          questionText: '사과 10개 중 4개를 먹으면 몇 개가 남을까요? 10 - 4 = ?',
          stepHints: ['10에서 4개를 덜어내보세요.', '4와 6을 모으면 10이므로 10 - 4 = 6 입니다.', '정답은 6입니다.'],
          errorType: '10에서 빼기 오류',
          visualAid: { type: 'apples', count1: 10, count2: 4, target: 6 }
        },
        {
          id: 's5_p2', stageId: 5, type: 'basic', format: 'horizontal',
          num1: 10, num2: 2, operator: '-', answer: 8,
          questionText: '나뭇가지에 앉은 새 10마리 중 2마리가 날아갔습니다. 남은 새는 몇 마리일까요? 10 - 2 = ?',
          stepHints: ['10에서 2를 빼면 8이 남습니다.', '2 + 8 = 10 이므로 10 - 2 = 8', '정답은 8입니다.'],
          errorType: '10에서 빼기 오류'
        },
        {
          id: 's5_p3', stageId: 5, type: 'basic', format: 'horizontal',
          num1: 10, num2: 6, operator: '-', answer: 4,
          questionText: '별 모양 10개에서 6개를 지웠습니다. 남은 별은 몇 개일까요? 10 - 6 = ?',
          stepHints: ['10에서 6을 빼면 4입니다.', '6 + 4 = 10', '정답은 4입니다.'],
          errorType: '10에서 빼기 오류'
        },
        {
          id: 's5_p4', stageId: 5, type: 'basic', format: 'horizontal',
          num1: 10, num2: 7, operator: '-', answer: 3,
          questionText: '10 - 7 을 계산하세요.',
          stepHints: ['7의 10 짝꿍 수는 3입니다.', '10 - 7 = 3', '정답은 3입니다.'],
          errorType: '10에서 빼기 오류'
        },
        {
          id: 's5_p5', stageId: 5, type: 'basic', format: 'horizontal',
          num1: 10, num2: 5, operator: '-', answer: 5,
          questionText: '종이컵 10개 중 5개를 넘어뜨렸습니다. 넘어지지 않은 컵은 몇 개일까요? 10 - 5 = ?',
          stepHints: ['10의 절반은 5입니다.', '10 - 5 = 5', '정답은 5입니다.'],
          errorType: '10에서 빼기 오류'
        },
        {
          id: 's5_p6', stageId: 5, type: 'advanced', format: 'horizontal',
          num1: 10, num2: 8, operator: '-', answer: 2,
          questionText: '10 - 8 의 값을 구하세요.',
          stepHints: ['10에서 8을 빼면 2가 남습니다.', '8 + 2 = 10', '정답은 2입니다.'],
          errorType: '10에서 빼기 오류'
        },
        {
          id: 's5_p7', stageId: 5, type: 'advanced', format: 'horizontal',
          num1: 10, num2: 3, operator: '-', answer: 7,
          questionText: '10 - 3 을 계산하세요.',
          stepHints: ['10에서 3을 빼면 7입니다.', '3 + 7 = 10', '정답은 7입니다.'],
          errorType: '10에서 빼기 오류'
        },
        {
          id: 's5_p8', stageId: 5, type: 'advanced', format: 'horizontal',
          num1: 10, num2: 1, operator: '-', answer: 9,
          questionText: '10 - 1 은 얼마일까요?',
          stepHints: ['10 바로 앞의 수는 9입니다.', '10 - 1 = 9', '정답은 9입니다.'],
          errorType: '10에서 빼기 오류'
        },
        {
          id: 's5_p9', stageId: 5, type: 'challenge', format: 'word',
          num1: 10, num2: 4, operator: '-', answer: 6,
          context: '바둑돌 숨기기',
          questionText: '바둑돌이 모두 10개 있습니다. 한 손에 4개를 쥐고 있다면 다른 손에는 몇 개가 있을까요?',
          stepHints: ['식: 10 - 4', '10 - 4 = 6', '정답은 6개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's5_p10', stageId: 5, type: 'challenge', format: 'horizontal',
          num1: 10, num2: 9, operator: '-', answer: 1,
          questionText: '10 - 9 의 값을 계산하세요.',
          stepHints: ['10에서 9를 빼면 1이 남습니다.', '정답은 1입니다.'],
          errorType: '10에서 빼기 오류'
        },
        {
          id: 's5_p11', stageId: 5, type: 'remedial', format: 'horizontal',
          num1: 10, num2: 5, operator: '-', answer: 5,
          questionText: '10 - 5 = ?',
          stepHints: ['5 + 5 = 10', '10 - 5 = 5', '정답은 5입니다.'],
          errorType: '10에서 빼기 오류'
        },
        {
          id: 's5_p12', stageId: 5, type: 'remedial', format: 'horizontal',
          num1: 10, num2: 2, operator: '-', answer: 8,
          questionText: '10 - 2 = ?',
          stepHints: ['10에서 2를 거꾸로 세어보세요: 9, 8', '정답은 8입니다.'],
          errorType: '10에서 빼기 오류'
        },
        {
          id: 's5_p13', stageId: 5, type: 'puzzle', format: 'puzzle',
          num1: 10, num2: 6, operator: '-', answer: 6,
          questionText: '10 - [  ] = 4 빈칸에 들어갈 알맞은 수는 얼마일까요?',
          stepHints: ['10에서 얼마를 빼야 4가 될까요? 10 - 4 = 6', '정답은 6입니다.'],
          errorType: '방정식 추론 오류'
        },
        {
          id: 's5_p14', stageId: 5, type: 'word', format: 'word',
          num1: 10, num2: 3, operator: '-', answer: 7,
          context: '쿠키 상자',
          questionText: '상자에 쿠키 10개가 들어있습니다. 친구들과 3개를 나누어 먹었다면 남은 쿠키는 몇 개일까요?',
          stepHints: ['식: 10 - 3', '10 - 3 = 7', '정답은 7개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's5_p15', stageId: 5, type: 'boss', format: 'horizontal',
          num1: 10, num2: 7, operator: '-', answer: 3,
          questionText: '[사과 과수원 보스] 10 - 7 의 값을 신속하게 계산하세요!',
          stepHints: ['10 - 7 = 3', '정답은 3입니다.'],
          errorType: '10에서 빼기 오류'
        },
      ];

    case 6: // 6차시: 10을 만들어 세 수 더하기
      return [
        {
          id: 's6_p1', stageId: 6, type: 'basic', format: 'three_add',
          num1: 1, num2: 9, num3: 3, operator: 'three_add', answer: 13,
          questionText: '1 + 9 + 3 에서 1과 9를 먼저 묶어 10을 만들고 3을 더해보세요. 1 + 9 + 3 = ?',
          stepHints: ['1단계: 1 + 9 = 10', '2단계: 10 + 3 = 13', '정답은 13입니다.'],
          errorType: '10 묶어 더하기 오류',
          visualAid: { type: 'blocks', count1: 1, count2: 9, count3: 3 }
        },
        {
          id: 's6_p2', stageId: 6, type: 'basic', format: 'three_add',
          num1: 2, num2: 8, num3: 4, operator: 'three_add', answer: 14,
          questionText: '2 + 8 + 4 에서 더하여 10이 되는 2와 8을 먼저 묶고 계산하세요.',
          stepHints: ['2 + 8 = 10', '10 + 4 = 14', '정답은 14입니다.'],
          errorType: '10 묶어 더하기 오류'
        },
        {
          id: 's6_p3', stageId: 6, type: 'basic', format: 'three_add',
          num1: 4, num2: 5, num3: 5, operator: 'three_add', answer: 14,
          questionText: '4 + 5 + 5 에서 5와 5를 먼저 더해 10을 만들고 4를 더하세요.',
          stepHints: ['5 + 5 = 10', '4 + 10 = 14', '정답은 14입니다.'],
          errorType: '10 묶어 더하기 오류'
        },
        {
          id: 's6_p4', stageId: 6, type: 'basic', format: 'three_add',
          num1: 2, num2: 4, num3: 6, operator: 'three_add', answer: 12,
          questionText: '2 + 4 + 6 에서 4와 6을 먼저 묶어 10을 만든 뒤 2를 더해보세요.',
          stepHints: ['4 + 6 = 10', '2 + 10 = 12', '정답은 12입니다.'],
          errorType: '10 묶어 더하기 오류'
        },
        {
          id: 's6_p5', stageId: 6, type: 'basic', format: 'three_add',
          num1: 3, num2: 7, num3: 2, operator: 'three_add', answer: 12,
          questionText: '3 + 7 + 2 = ? (3과 7을 먼저 묶어보세요)',
          stepHints: ['3 + 7 = 10', '10 + 2 = 12', '정답은 12입니다.'],
          errorType: '10 묶어 더하기 오류'
        },
        {
          id: 's6_p6', stageId: 6, type: 'advanced', format: 'three_add',
          num1: 3, num2: 7, num3: 4, operator: 'three_add', answer: 14,
          questionText: '길을 따라 도토리 3개, 7개, 4개를 주웠습니다. 3 + 7 + 4 = ?',
          stepHints: ['3 + 7 = 10', '10 + 4 = 14', '정답은 14개입니다.'],
          errorType: '10 묶어 더하기 오류'
        },
        {
          id: 's6_p7', stageId: 6, type: 'advanced', format: 'three_add',
          num1: 6, num2: 4, num3: 5, operator: 'three_add', answer: 15,
          questionText: '6 + 4 + 5 의 값을 계산하세요.',
          stepHints: ['6 + 4 = 10', '10 + 5 = 15', '정답은 15입니다.'],
          errorType: '10 묶어 더하기 오류'
        },
        {
          id: 's6_p8', stageId: 6, type: 'advanced', format: 'three_add',
          num1: 7, num2: 3, num3: 7, operator: 'three_add', answer: 17,
          questionText: '7 + 3 + 7 의 값을 계산하세요.',
          stepHints: ['7 + 3 = 10', '10 + 7 = 17', '정답은 17입니다.'],
          errorType: '10 묶어 더하기 오류'
        },
        {
          id: 's6_p9', stageId: 6, type: 'challenge', format: 'puzzle',
          num1: 2, num2: 8, num3: 3, operator: 'three_add', answer: 8,
          questionText: '수 카드 [2, 9, 8, 5] 중 2장을 골라 10을 만들어 [ 2 ] + [ ? ] + 3 = 13 을 완성하세요. 빈칸의 수는?',
          stepHints: ['2와 8을 더하면 10이 됩니다.', '10 + 3 = 13', '빈칸에 들어갈 수는 8입니다.'],
          errorType: '수 카드 추론 오류'
        },
        {
          id: 's6_p10', stageId: 6, type: 'challenge', format: 'word',
          num1: 8, num2: 2, num3: 5, operator: 'three_add', answer: 15,
          context: '고리 걸기 놀이',
          questionText: '고리 걸기 놀이에서 1모둠 8개, 2모둠 2개, 3모둠 5개를 걸었습니다. 걸린 고리는 모두 몇 개일까요?',
          stepHints: ['8 + 2 = 10', '10 + 5 = 15', '정답은 15개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's6_p11', stageId: 6, type: 'remedial', format: 'three_add',
          num1: 5, num2: 5, num3: 2, operator: 'three_add', answer: 12,
          questionText: '5 + 5 + 2 = ?',
          stepHints: ['5 + 5 = 10', '10 + 2 = 12', '정답은 12입니다.'],
          errorType: '10 묶어 더하기 오류'
        },
        {
          id: 's6_p12', stageId: 6, type: 'remedial', format: 'three_add',
          num1: 1, num2: 9, num3: 6, operator: 'three_add', answer: 16,
          questionText: '1 + 9 + 6 = ?',
          stepHints: ['1 + 9 = 10', '10 + 6 = 16', '정답은 16입니다.'],
          errorType: '10 묶어 더하기 오류'
        },
        {
          id: 's6_p13', stageId: 6, type: 'puzzle', format: 'puzzle',
          num1: 6, num2: 4, num3: 7, operator: 'three_add', answer: 17,
          questionText: '6 + 4 + 7 = [  ] 빈칸에 들어갈 수는 얼마일까요?',
          stepHints: ['6 + 4 = 10', '10 + 7 = 17', '정답은 17입니다.'],
          errorType: '10 묶어 더하기 오류'
        },
        {
          id: 's6_p14', stageId: 6, type: 'word', format: 'word',
          num1: 3, num2: 7, num3: 6, operator: 'three_add', answer: 16,
          context: '조개껍데기 줍기',
          questionText: '해변에서 윤아가 3개, 민수가 7개, 지아가 6개의 조개를 주웠습니다. 모두 몇 개일까요?',
          stepHints: ['3 + 7 = 10', '10 + 6 = 16', '정답은 16개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's6_p15', stageId: 6, type: 'boss', format: 'three_add',
          num1: 8, num2: 2, num3: 7, operator: 'three_add', answer: 17,
          questionText: '[도토리 오솔길 보스] 8 + 2 + 7 의 값을 계산하세요!',
          stepHints: ['8 + 2 = 10', '10 + 7 = 17', '정답은 17입니다.'],
          errorType: '10 묶어 더하기 오류'
        },
      ];

    case 7: // 7차시: 받아올림 덧셈 (몇)+(몇)=십몇
      return [
        {
          id: 's7_p1', stageId: 7, type: 'basic', format: 'horizontal',
          num1: 8, num2: 3, operator: '+', answer: 11,
          questionText: '빈 병을 8개 모았고, 3개를 더 가져왔습니다. 빈 병은 모두 몇 개일까요? 8 + 3 = ?',
          stepHints: ['3을 2와 1로 가릅니다.', '8 + 2 = 10을 만들고 남은 1을 더합니다.', '10 + 1 = 11'],
          errorType: '받아올림 10 만들기 오류',
          visualAid: { type: 'bottles', count1: 8, count2: 3, target: 11 }
        },
        {
          id: 's7_p2', stageId: 7, type: 'basic', format: 'horizontal',
          num1: 6, num2: 7, operator: '+', answer: 13,
          questionText: '토마토 통조림 6개와 옥수수 통조림 7개가 있습니다. 통조림은 모두 몇 개일까요? 6 + 7 = ?',
          stepHints: ['7을 4와 3으로 가르거나 6을 3과 3으로 갈라 10을 만듭니다.', '6 + 4 = 10, 10 + 3 = 13', '정답은 13개입니다.'],
          errorType: '받아올림 10 만들기 오류'
        },
        {
          id: 's7_p3', stageId: 7, type: 'basic', format: 'horizontal',
          num1: 9, num2: 4, operator: '+', answer: 13,
          questionText: '나뭇가지에 새가 9마리 있고 4마리가 더 날아왔습니다. 새는 모두 몇 마리일까요? 9 + 4 = ?',
          stepHints: ['4를 1과 3으로 가릅니다.', '9 + 1 = 10, 10 + 3 = 13', '정답은 13마리입니다.'],
          errorType: '받아올림 10 만들기 오류'
        },
        {
          id: 's7_p4', stageId: 7, type: 'basic', format: 'horizontal',
          num1: 9, num2: 7, operator: '+', answer: 16,
          questionText: '9 + 7 을 계산하세요. (9와 1을 더해 10을 만들어보세요)',
          stepHints: ['7을 1과 6으로 가릅니다.', '9 + 1 = 10', '10 + 6 = 16', '정답은 16입니다.'],
          errorType: '받아올림 10 만들기 오류'
        },
        {
          id: 's7_p5', stageId: 7, type: 'basic', format: 'horizontal',
          num1: 5, num2: 8, operator: '+', answer: 13,
          questionText: '5 + 8 을 계산하세요. (8과 2를 더해 10을 만들어보세요)',
          stepHints: ['5를 3과 2로 가릅니다.', '2 + 8 = 10', '3 + 10 = 13', '정답은 13입니다.'],
          errorType: '받아올림 10 만들기 오류'
        },
        {
          id: 's7_p6', stageId: 7, type: 'advanced', format: 'horizontal',
          num1: 6, num2: 5, operator: '+', answer: 11,
          questionText: '6 + 5 를 계산하세요.',
          stepHints: ['5를 4와 1로 가릅니다.', '6 + 4 = 10, 10 + 1 = 11', '정답은 11입니다.'],
          errorType: '받아올림 10 만들기 오류'
        },
        {
          id: 's7_p7', stageId: 7, type: 'advanced', format: 'horizontal',
          num1: 7, num2: 8, operator: '+', answer: 15,
          questionText: '7 + 8 의 값을 구하세요.',
          stepHints: ['8을 3과 5로 가르면: 7 + 3 = 10, 10 + 5 = 15', '정답은 15입니다.'],
          errorType: '받아올림 10 만들기 오류'
        },
        {
          id: 's7_p8', stageId: 7, type: 'advanced', format: 'horizontal',
          num1: 9, num2: 8, operator: '+', answer: 17,
          questionText: '9 + 8 을 계산하세요.',
          stepHints: ['8을 1과 7로 가릅니다.', '9 + 1 = 10, 10 + 7 = 17', '정답은 17입니다.'],
          errorType: '받아올림 10 만들기 오류'
        },
        {
          id: 's7_p9', stageId: 7, type: 'challenge', format: 'word',
          num1: 5, num2: 9, operator: '+', answer: 14,
          context: '인형 만들기',
          questionText: '인형을 5개 만들고 나서 9개를 더 만들었습니다. 인형은 모두 몇 개일까요?',
          stepHints: ['식: 5 + 9', '5를 4와 1로 가르면 1 + 9 = 10, 4 + 10 = 14', '정답은 14개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's7_p10', stageId: 7, type: 'challenge', format: 'word',
          num1: 8, num2: 4, operator: '+', answer: 12,
          context: '과자 상자',
          questionText: '딸기맛 과자 8개와 초코맛 과자 4개가 있습니다. 과자는 모두 몇 개일까요?',
          stepHints: ['식: 8 + 4', '4를 2와 2로 가르면: 8 + 2 = 10, 10 + 2 = 12', '정답은 12개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's7_p11', stageId: 7, type: 'remedial', format: 'horizontal',
          num1: 9, num2: 2, operator: '+', answer: 11,
          questionText: '9 + 2 = ?',
          stepHints: ['2를 1과 1로 가릅니다.', '9 + 1 = 10, 10 + 1 = 11', '정답은 11입니다.'],
          errorType: '받아올림 10 만들기 오류'
        },
        {
          id: 's7_p12', stageId: 7, type: 'remedial', format: 'horizontal',
          num1: 8, num2: 5, operator: '+', answer: 13,
          questionText: '8 + 5 = ?',
          stepHints: ['5를 2와 3으로 가릅니다.', '8 + 2 = 10, 10 + 3 = 13', '정답은 13입니다.'],
          errorType: '받아올림 10 만들기 오류'
        },
        {
          id: 's7_p13', stageId: 7, type: 'puzzle', format: 'puzzle',
          num1: 9, num2: 9, operator: '+', answer: 18,
          questionText: '9 + 9 = [  ] 빈칸에 알맞은 수를 계산하세요.',
          stepHints: ['9를 1과 8로 가릅니다.', '9 + 1 = 10, 10 + 8 = 18', '정답은 18입니다.'],
          errorType: '받아올림 10 만들기 오류'
        },
        {
          id: 's7_p14', stageId: 7, type: 'word', format: 'word',
          num1: 6, num2: 8, operator: '+', answer: 14,
          context: '블록 쌓기',
          questionText: '기차를 만드는 데 블록 6개, 나무를 만드는 데 블록 8개를 썼습니다. 모두 몇 개를 썼을까요?',
          stepHints: ['식: 6 + 8', '6을 4와 2로 가르면 8 + 2 = 10, 10 + 4 = 14', '정답은 14개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's7_p15', stageId: 7, type: 'boss', format: 'horizontal',
          num1: 7, num2: 9, operator: '+', answer: 16,
          questionText: '[재활용 마을 보스] 7 + 9 의 값을 계산하세요!',
          stepHints: ['7을 6과 1로 가르면: 1 + 9 = 10, 6 + 10 = 16', '정답은 16입니다.'],
          errorType: '받아올림 10 만들기 오류'
        },
      ];

    case 8: // 8차시: 여러 가지 덧셈 전략
      return [
        {
          id: 's8_p1', stageId: 8, type: 'basic', format: 'horizontal',
          num1: 5, num2: 7, operator: '+', answer: 12,
          questionText: '5 + 6 = 11 입니다. 그렇다면 5 + 7 은 얼마일까요?',
          stepHints: ['더하는 수가 6에서 7로 1 커졌습니다.', '합도 11에서 1 커진 12가 됩니다.', '정답은 12입니다.'],
          errorType: '덧셈 규칙 추론 오류'
        },
        {
          id: 's8_p2', stageId: 8, type: 'basic', format: 'horizontal',
          num1: 5, num2: 8, operator: '+', answer: 13,
          questionText: '5 + 7 = 12 입니다. 5 + 8 의 값을 구하세요.',
          stepHints: ['12보다 1 큰 수입니다.', '5 + 8 = 13', '정답은 13입니다.'],
          errorType: '덧셈 규칙 추론 오류'
        },
        {
          id: 's8_p3', stageId: 8, type: 'basic', format: 'horizontal',
          num1: 9, num2: 3, operator: '+', answer: 12,
          questionText: '9 + 3 = 12 입니다. 두 수의 순서를 바꾼 3 + 9 의 값은 얼마일까요?',
          stepHints: ['더하는 두 수의 순서를 바꾸어도 합은 같습니다.', '3 + 9 = 12', '정답은 12입니다.'],
          errorType: '덧셈 교환법칙 오류'
        },
        {
          id: 's8_p4', stageId: 8, type: 'basic', format: 'horizontal',
          num1: 8, num2: 4, operator: '+', answer: 12,
          questionText: '8 + 4 = 12 일 때 4 + [  ] = 12 빈칸의 수는?',
          stepHints: ['순서를 바꾸어도 합이 같습니다.', '4 + 8 = 12', '정답은 8입니다.'],
          errorType: '덧셈 교환법칙 오류'
        },
        {
          id: 's8_p5', stageId: 8, type: 'basic', format: 'puzzle',
          num1: 6, num2: 6, operator: '+', answer: 7,
          questionText: '6 + 6 = 12 를 이용하여 [  ] + 6 = 13 을 풀려고 합니다. 빈칸에 들어갈 수는?',
          stepHints: ['합이 12에서 13으로 1 커졌습니다.', '앞의 수도 6에서 1 큰 7이 됩니다.', '정답은 7입니다.'],
          errorType: '덧셈 관계 추론 오류'
        },
        {
          id: 's8_p6', stageId: 8, type: 'advanced', format: 'puzzle',
          num1: 8, num2: 8, operator: '+', answer: 9,
          questionText: '8 + 8 = 16 을 이용하여 8 + [  ] = 17 을 풀려고 합니다. 빈칸에 알맞은 수는?',
          stepHints: ['합이 16에서 17로 1 커졌습니다.', '뒤의 수도 8에서 1 큰 9가 됩니다.', '정답은 9입니다.'],
          errorType: '덧셈 관계 추론 오류'
        },
        {
          id: 's8_p7', stageId: 8, type: 'advanced', format: 'horizontal',
          num1: 7, num2: 8, operator: '+', answer: 15,
          questionText: '7 + 7 = 14 일 때, 7 + 8 의 값은 얼마일까요?',
          stepHints: ['7 + 7 = 14 보다 1 큰 수입니다.', '14 + 1 = 15', '정답은 15입니다.'],
          errorType: '덧셈 관계 추론 오류'
        },
        {
          id: 's8_p8', stageId: 8, type: 'advanced', format: 'horizontal',
          num1: 9, num2: 6, operator: '+', answer: 15,
          questionText: '9 + 6 과 합이 같은 식을 찾으려고 합니다. 6 + 9 의 합은 얼마일까요?',
          stepHints: ['9 + 6 = 15', '6 + 9 도 15입니다.', '정답은 15입니다.'],
          errorType: '덧셈 교환법칙 오류'
        },
        {
          id: 's8_p9', stageId: 8, type: 'challenge', format: 'horizontal',
          num1: 8, num2: 6, operator: '+', answer: 14,
          questionText: '8 + 6 = 14 와 합이 같은 식을 구하세요: 7 + 7 = ?',
          stepHints: ['8에서 1을 6에 주면 7 + 7 이 됩니다.', '7 + 7 = 14', '정답은 14입니다.'],
          errorType: '덧셈 변형 추론 오류'
        },
        {
          id: 's8_p10', stageId: 8, type: 'challenge', format: 'horizontal',
          num1: 7, num2: 6, operator: '+', answer: 13,
          questionText: '7 + 6 의 값을 계산하세요.',
          stepHints: ['6 + 6 = 12 보다 1 큰 수입니다.', '7 + 6 = 13', '정답은 13입니다.'],
          errorType: '덧셈 관계 추론 오류'
        },
        {
          id: 's8_p11', stageId: 8, type: 'remedial', format: 'horizontal',
          num1: 6, num2: 6, operator: '+', answer: 12,
          questionText: '6 + 6 = ?',
          stepHints: ['6을 두 번 더하면 12입니다.', '정답은 12입니다.'],
          errorType: '두 수 덧셈 오류'
        },
        {
          id: 's8_p12', stageId: 8, type: 'remedial', format: 'horizontal',
          num1: 8, num2: 8, operator: '+', answer: 16,
          questionText: '8 + 8 = ?',
          stepHints: ['8을 두 번 더하면 16입니다.', '정답은 16입니다.'],
          errorType: '두 수 덧셈 오류'
        },
        {
          id: 's8_p13', stageId: 8, type: 'puzzle', format: 'puzzle',
          num1: 4, num2: 9, operator: '+', answer: 13,
          questionText: '9 + 4 = 13 입니다. 4 + 9 = [  ] 빈칸의 수는?',
          stepHints: ['앞뒤를 바꾸어도 결과는 같습니다.', '정답은 13입니다.'],
          errorType: '덧셈 교환법칙 오류'
        },
        {
          id: 's8_p14', stageId: 8, type: 'word', format: 'word',
          num1: 6, num2: 8, operator: '+', answer: 14,
          context: '풍선 날리기',
          questionText: '주황 풍선 6개와 초록 풍선 8개가 있습니다. 풍선은 모두 몇 개일까요?',
          stepHints: ['식: 6 + 8', '8 + 6 = 14', '정답은 14개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's8_p15', stageId: 8, type: 'boss', format: 'horizontal',
          num1: 8, num2: 7, operator: '+', answer: 15,
          questionText: '[풍선 축제 보스] 8 + 8 = 16 보다 1 작은 8 + 7 의 값은?',
          stepHints: ['16 - 1 = 15', '정답은 15입니다.'],
          errorType: '덧셈 관계 추론 오류'
        },
      ];

    case 9: // 9차시: 받아내림 뺄셈 (십몇)-(몇)
      return [
        {
          id: 's9_p1', stageId: 9, type: 'basic', format: 'horizontal',
          num1: 14, num2: 6, operator: '-', answer: 8,
          questionText: '물병 14개 중 6개를 버리려고 합니다. 남은 물병은 몇 개일까요? 14 - 6 = ?',
          stepHints: ['14를 10과 4로 가릅니다.', '10에서 6을 먼저 빼면 4가 남습니다.', '남은 4와 4를 더하면 8입니다. (14 - 6 = 8)'],
          errorType: '받아내림 10에서 빼기 오류',
          visualAid: { type: 'bottles', count1: 14, count2: 6, target: 8 }
        },
        {
          id: 's9_p2', stageId: 9, type: 'basic', format: 'horizontal',
          num1: 12, num2: 4, operator: '-', answer: 8,
          questionText: '고구마가 12개 있었습니다. 4개를 먹었다면 남은 고구마는 몇 개일까요? 12 - 4 = ?',
          stepHints: ['12를 10과 2로 가릅니다.', '10 - 4 = 6', '6 + 2 = 8', '정답은 8개입니다.'],
          errorType: '받아내림 10에서 빼기 오류'
        },
        {
          id: 's9_p3', stageId: 9, type: 'basic', format: 'horizontal',
          num1: 13, num2: 3, operator: '-', answer: 10,
          questionText: '13 - 3 을 계산하세요.',
          stepHints: ['13에서 낱개 3개를 빼면 10개 묶음만 남습니다.', '13 - 3 = 10', '정답은 10입니다.'],
          errorType: '낱개 빼기 오류'
        },
        {
          id: 's9_p4', stageId: 9, type: 'basic', format: 'horizontal',
          num1: 16, num2: 6, operator: '-', answer: 10,
          questionText: '16 - 6 을 계산하세요.',
          stepHints: ['16에서 낱개 6개를 빼면 10이 남습니다.', '16 - 6 = 10', '정답은 10입니다.'],
          errorType: '낱개 빼기 오류'
        },
        {
          id: 's9_p5', stageId: 9, type: 'basic', format: 'horizontal',
          num1: 12, num2: 6, operator: '-', answer: 6,
          questionText: '12 - 6 을 계산하세요. (10에서 6을 빼고 2를 더해보세요)',
          stepHints: ['10 - 6 = 4', '4 + 2 = 6', '정답은 6입니다.'],
          errorType: '받아내림 10에서 빼기 오류'
        },
        {
          id: 's9_p6', stageId: 9, type: 'advanced', format: 'horizontal',
          num1: 18, num2: 9, operator: '-', answer: 9,
          questionText: '18 - 9 를 계산하세요. (낱개 8개를 먼저 빼고 1개를 더 빼보세요)',
          stepHints: ['18 - 8 = 10', '10 - 1 = 9', '정답은 9입니다.'],
          errorType: '낱개 먼저 빼기 오류'
        },
        {
          id: 's9_p7', stageId: 9, type: 'advanced', format: 'horizontal',
          num1: 12, num2: 7, operator: '-', answer: 5,
          questionText: '12 - 7 을 계산하세요.',
          stepHints: ['10 - 7 = 3', '3 + 2 = 5', '정답은 5입니다.'],
          errorType: '받아내림 10에서 빼기 오류'
        },
        {
          id: 's9_p8', stageId: 9, type: 'advanced', format: 'horizontal',
          num1: 15, num2: 6, operator: '-', answer: 9,
          questionText: '15 - 6 의 값을 구하세요.',
          stepHints: ['10 - 6 = 4', '4 + 5 = 9', '정답은 9입니다.'],
          errorType: '받아내림 10에서 빼기 오류'
        },
        {
          id: 's9_p9', stageId: 9, type: 'challenge', format: 'word',
          num1: 12, num2: 9, operator: '-', answer: 3,
          context: '알뜰 시장 책 팔기',
          questionText: '재이에게 책이 12권 있었습니다. 이 중 9권을 알뜰 시장에 팔았다면 남은 책은 몇 권일까요?',
          stepHints: ['식: 12 - 9', '10 - 9 = 1, 1 + 2 = 3', '정답은 3권입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's9_p10', stageId: 9, type: 'challenge', format: 'word',
          num1: 14, num2: 5, operator: '-', answer: 9,
          context: '연필 비교하기',
          questionText: '지아는 연필 14자루가 있고 슬기는 5자루가 있습니다. 지아는 슬기보다 연필이 몇 자루 더 많을까요?',
          stepHints: ['식: 14 - 5', '10 - 5 = 5, 5 + 4 = 9', '정답은 9자루입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's9_p11', stageId: 9, type: 'remedial', format: 'horizontal',
          num1: 15, num2: 5, operator: '-', answer: 10,
          questionText: '15 - 5 = ?',
          stepHints: ['15에서 낱개 5개를 빼면 10입니다.', '정답은 10입니다.'],
          errorType: '낱개 빼기 오류'
        },
        {
          id: 's9_p12', stageId: 9, type: 'remedial', format: 'horizontal',
          num1: 11, num2: 8, operator: '-', answer: 3,
          questionText: '11 - 8 = ?',
          stepHints: ['10 - 8 = 2', '2 + 1 = 3', '정답은 3입니다.'],
          errorType: '받아내림 10에서 빼기 오류'
        },
        {
          id: 's9_p13', stageId: 9, type: 'puzzle', format: 'horizontal',
          num1: 13, num2: 7, operator: '-', answer: 6,
          questionText: '13 - 7 의 계산 결과를 구하세요.',
          stepHints: ['10 - 7 = 3', '3 + 3 = 6', '정답은 6입니다.'],
          errorType: '받아내림 10에서 빼기 오류'
        },
        {
          id: 's9_p14', stageId: 9, type: 'word', format: 'word',
          num1: 16, num2: 9, operator: '-', answer: 7,
          context: '딸기 나눠먹기',
          questionText: '딸기가 16개 있었습니다. 동생에게 9개를 주면 몇 개가 남을까요?',
          stepHints: ['식: 16 - 9', '10 - 9 = 1, 1 + 6 = 7', '정답은 7개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's9_p15', stageId: 9, type: 'boss', format: 'horizontal',
          num1: 17, num2: 9, operator: '-', answer: 8,
          questionText: '[알뜰 시장 보스] 17 - 9 의 값을 계산하세요!',
          stepHints: ['10 - 9 = 1', '1 + 7 = 8', '정답은 8입니다.'],
          errorType: '받아내림 10에서 빼기 오류'
        },
      ];

    case 10: // 10차시: 여러 가지 뺄셈 전략 & 수 카드 차 구하기
      return [
        {
          id: 's10_p1', stageId: 10, type: 'basic', format: 'horizontal',
          num1: 14, num2: 6, operator: '-', answer: 8,
          questionText: '14 - 6 = 8 일 때, 13 - 6 의 값은 얼마일까요?',
          stepHints: ['빼지는 수가 14에서 13으로 1 작아졌습니다.', '차도 8에서 1 작아진 7이 됩니다.', '정답은 7입니다.'],
          errorType: '뺄셈 규칙 추론 오류'
        },
        {
          id: 's10_p2', stageId: 10, type: 'basic', format: 'horizontal',
          num1: 14, num2: 7, operator: '-', answer: 7,
          questionText: '14 - 6 = 8 일 때, 14 - 7 의 값은 얼마일까요?',
          stepHints: ['빼는 수가 6에서 7로 1 커지면, 남는 차는 1 작아집니다.', '8 - 1 = 7', '정답은 7입니다.'],
          errorType: '뺄셈 규칙 추론 오류'
        },
        {
          id: 's10_p3', stageId: 10, type: 'basic', format: 'horizontal',
          num1: 11, num2: 2, operator: '-', answer: 9,
          questionText: '11 - 2 = 9 입니다. 그렇다면 12 - 3 의 값은 얼마일까요?',
          stepHints: ['두 수가 모두 1씩 커졌으므로 차는 9로 같습니다.', '12 - 3 = 9', '정답은 9입니다.'],
          errorType: '차가 일정한 뺄셈 규칙 오류'
        },
        {
          id: 's10_p4', stageId: 10, type: 'basic', format: 'puzzle',
          num1: 14, num2: 5, operator: '-', answer: 5,
          questionText: '차가 9가 되도록 빈칸에 알맞은 수를 써넣으세요: 14 - [  ] = 9',
          stepHints: ['14에서 9를 빼보세요: 14 - 9 = 5', '14 - 5 = 9', '정답은 5입니다.'],
          errorType: '방정식 추론 오류'
        },
        {
          id: 's10_p5', stageId: 10, type: 'basic', format: 'puzzle',
          num1: 15, num2: 6, operator: '-', answer: 6,
          questionText: '차가 9가 되도록 빈칸을 채우세요: 15 - [  ] = 9',
          stepHints: ['15 - 9 = 6', '15 - 6 = 9', '정답은 6입니다.'],
          errorType: '방정식 추론 오류'
        },
        {
          id: 's10_p6', stageId: 10, type: 'advanced', format: 'puzzle',
          num1: 16, num2: 7, operator: '-', answer: 7,
          questionText: '16 - [  ] = 9 빈칸에 알맞은 수는 얼마일까요?',
          stepHints: ['16 - 9 = 7', '16 - 7 = 9', '정답은 7입니다.'],
          errorType: '방정식 추론 오류'
        },
        {
          id: 's10_p7', stageId: 10, type: 'advanced', format: 'puzzle',
          num1: 17, num2: 8, operator: '-', answer: 8,
          questionText: '17 - [  ] = 9 빈칸에 알맞은 수를 구하세요.',
          stepHints: ['17 - 9 = 8', '17 - 8 = 9', '정답은 8입니다.'],
          errorType: '방정식 추론 오류'
        },
        {
          id: 's10_p8', stageId: 10, type: 'advanced', format: 'puzzle',
          num1: 13, num2: 4, operator: '-', answer: 9,
          questionText: '수 카드 [4, 9] 를 사용하여 뺄셈식을 완성하세요: 13 - 4 = [ ? ]',
          stepHints: ['10 - 4 = 6, 6 + 3 = 9', '정답은 9입니다.'],
          errorType: '수 카드 추론 오류'
        },
        {
          id: 's10_p9', stageId: 10, type: 'challenge', format: 'puzzle',
          num1: 13, num2: 9, operator: '-', answer: 4,
          questionText: '수 카드 [4, 9] 를 사용하여 뺄셈식을 완성하세요: 13 - [ ? ] = 9',
          stepHints: ['13 - 9 = 4 이므로 13 - 4 = 9 입니다.', '빈칸에 들어갈 수는 4입니다.'],
          errorType: '수 카드 추론 오류'
        },
        {
          id: 's10_p10', stageId: 10, type: 'challenge', format: 'puzzle',
          num1: 17, num2: 8, operator: '-', answer: 9,
          questionText: '수 카드 [8, 9] 를 사용하여 뺄셈식을 완성하세요: 17 - 8 = [ ? ]',
          stepHints: ['10 - 8 = 2, 2 + 7 = 9', '정답은 9입니다.'],
          errorType: '수 카드 추론 오류'
        },
        {
          id: 's10_p11', stageId: 10, type: 'remedial', format: 'horizontal',
          num1: 14, num2: 8, operator: '-', answer: 6,
          questionText: '14 - 8 = ?',
          stepHints: ['10 - 8 = 2', '2 + 4 = 6', '정답은 6입니다.'],
          errorType: '받아내림 10에서 빼기 오류'
        },
        {
          id: 's10_p12', stageId: 10, type: 'remedial', format: 'horizontal',
          num1: 14, num2: 9, operator: '-', answer: 5,
          questionText: '14 - 9 = ?',
          stepHints: ['10 - 9 = 1', '1 + 4 = 5', '정답은 5입니다.'],
          errorType: '받아내림 10에서 빼기 오류'
        },
        {
          id: 's10_p13', stageId: 10, type: 'puzzle', format: 'puzzle',
          num1: 18, num2: 9, operator: '-', answer: 9,
          questionText: '18 - [  ] = 9 빈칸에 알맞은 수를 쓰세요.',
          stepHints: ['18 - 9 = 9', '정답은 9입니다.'],
          errorType: '방정식 추론 오류'
        },
        {
          id: 's10_p14', stageId: 10, type: 'word', format: 'word',
          num1: 15, num2: 8, operator: '-', answer: 7,
          context: '열기구 관람',
          questionText: '분홍 열기구 15번과 초록 열기구 8번이 있습니다. 두 수의 차는 얼마일까요?',
          stepHints: ['식: 15 - 8', '10 - 8 = 2, 2 + 5 = 7', '정답은 7입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's10_p15', stageId: 10, type: 'boss', format: 'horizontal',
          num1: 13, num2: 5, operator: '-', answer: 8,
          questionText: '[열기구 언덕 보스] 13 - 5 의 값을 신속하게 계산하세요!',
          stepHints: ['10 - 5 = 5', '5 + 3 = 8', '정답은 8입니다.'],
          errorType: '받아내림 10에서 빼기 오류'
        },
      ];

    case 11: // 11차시: 두 자리 수의 덧셈 (받아올림 없음)
      return [
        {
          id: 's11_p1', stageId: 11, type: 'basic', format: 'horizontal',
          num1: 30, num2: 6, operator: '+', answer: 36,
          questionText: '10개씩 3묶음(30개)과 낱개 6개가 있습니다. 30 + 6 = ?',
          stepHints: ['30에 6을 더하면 36이 됩니다.', '십의 자리는 3, 일의 자리는 6입니다.', '정답은 36입니다.'],
          errorType: '자릿값(몇십과 몇) 정렬 오류',
          visualAid: { type: 'blocks', count1: 30, count2: 6, target: 36 }
        },
        {
          id: 's11_p2', stageId: 11, type: 'basic', format: 'horizontal',
          num1: 20, num2: 18, operator: '+', answer: 38,
          questionText: '꽃잎 반 20명과 열매 반 18명이 체험학습을 갔습니다. 학생은 모두 몇 명일까요? 20 + 18 = ?',
          stepHints: ['십의 자리끼리 더하면: 20 + 10 = 30', '일의 자리끼리 더하면: 0 + 8 = 8', '30 + 8 = 38명입니다.'],
          errorType: '두 자리 덧셈 오류'
        },
        {
          id: 's11_p3', stageId: 11, type: 'basic', format: 'vertical',
          num1: 12, num2: 17, operator: '+', answer: 29,
          questionText: '수찬이 주머니에 구슬 12개가 있고, 17개를 더 담았습니다. 구슬은 모두 몇 개일까요?',
          stepHints: ['일의 자리: 2 + 7 = 9', '십의 자리: 1 + 1 = 2', '정답은 29개입니다.'],
          errorType: '두 자리 덧셈 오류'
        },
        {
          id: 's11_p4', stageId: 11, type: 'basic', format: 'horizontal',
          num1: 42, num2: 10, operator: '+', answer: 52,
          questionText: '42 + 10 을 계산하세요.',
          stepHints: ['십의 자리가 4에서 1 커져 5가 됩니다.', '일의 자리는 그대로 2입니다.', '정답은 52입니다.'],
          errorType: '자릿값(몇십과 몇) 정렬 오류'
        },
        {
          id: 's11_p5', stageId: 11, type: 'basic', format: 'horizontal',
          num1: 22, num2: 26, operator: '+', answer: 48,
          questionText: '22 + 26 을 계산하세요.',
          stepHints: ['일의 자리: 2 + 6 = 8', '십의 자리: 2 + 2 = 4', '정답은 48입니다.'],
          errorType: '두 자리 덧셈 오류'
        },
        {
          id: 's11_p6', stageId: 11, type: 'advanced', format: 'horizontal',
          num1: 15, num2: 24, operator: '+', answer: 39,
          questionText: '초록 제기 15개와 파란 제기 24개가 있습니다. 제기는 모두 몇 개인가요? 15 + 24 = ?',
          stepHints: ['일의 자리: 5 + 4 = 9', '십의 자리: 1 + 2 = 3', '정답은 39개입니다.'],
          errorType: '두 자리 덧셈 오류'
        },
        {
          id: 's11_p7', stageId: 11, type: 'advanced', format: 'horizontal',
          num1: 13, num2: 6, operator: '+', answer: 19,
          questionText: '딸기우유 13개와 흰 우유 6개가 있습니다. 우유는 모두 몇 개일까요? 13 + 6 = ?',
          stepHints: ['일의 자리: 3 + 6 = 9', '십의 자리는 1 그대로', '정답은 19개입니다.'],
          errorType: '자릿값(몇십과 몇) 정렬 오류'
        },
        {
          id: 's11_p8', stageId: 11, type: 'advanced', format: 'word',
          num1: 32, num2: 20, operator: '+', answer: 52,
          context: '다람쥐 도토리 모으기',
          questionText: '형 다람쥐가 32개, 동생 다람쥐가 20개의 도토리를 나무 속에 담았습니다. 도토리는 모두 몇 개일까요?',
          stepHints: ['식: 32 + 20', '30 + 20 = 50, 일의 자리는 2', '정답은 52개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's11_p9', stageId: 11, type: 'challenge', format: 'word',
          num1: 16, num2: 21, operator: '+', answer: 37,
          context: '땅속 도토리 저장',
          questionText: '다람쥐가 땅속에 도토리 16개와 21개를 넣어 두었습니다. 땅속 도토리는 모두 몇 개일까요?',
          stepHints: ['식: 16 + 21', '일의 자리: 6 + 1 = 7, 십의 자리: 1 + 2 = 3', '정답은 37개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's11_p10', stageId: 11, type: 'challenge', format: 'horizontal',
          num1: 31, num2: 17, operator: '+', answer: 48,
          questionText: '31 + 17 의 값을 계산하세요.',
          stepHints: ['일의 자리: 1 + 7 = 8', '십의 자리: 3 + 1 = 4', '정답은 48입니다.'],
          errorType: '두 자리 덧셈 오류'
        },
        {
          id: 's11_p11', stageId: 11, type: 'remedial', format: 'horizontal',
          num1: 20, num2: 7, operator: '+', answer: 27,
          questionText: '20 + 7 = ?',
          stepHints: ['20에 7을 더하면 27입니다.', '정답은 27입니다.'],
          errorType: '자릿값(몇십과 몇) 정렬 오류'
        },
        {
          id: 's11_p12', stageId: 11, type: 'remedial', format: 'horizontal',
          num1: 14, num2: 15, operator: '+', answer: 29,
          questionText: '14 + 15 = ?',
          stepHints: ['4 + 5 = 9, 1 + 1 = 2', '정답은 29입니다.'],
          errorType: '두 자리 덧셈 오류'
        },
        {
          id: 's11_p13', stageId: 11, type: 'puzzle', format: 'puzzle',
          num1: 24, num2: 10, operator: '+', answer: 34,
          questionText: '24에서 10만큼 더 큰 수는 얼마일까요?',
          stepHints: ['24 + 10 = 34', '정답은 34입니다.'],
          errorType: '자릿값(몇십과 몇) 정렬 오류'
        },
        {
          id: 's11_p14', stageId: 11, type: 'word', format: 'word',
          num1: 23, num2: 12, operator: '+', answer: 35,
          context: '운동장 놀이',
          questionText: '운동장에서 학생 23명이 놀고 있었는데 12명이 더 나왔습니다. 운동장의 학생은 모두 몇 명일까요?',
          stepHints: ['식: 23 + 12', '일의 자리: 3 + 2 = 5, 십의 자리: 2 + 1 = 3', '정답은 35명입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's11_p15', stageId: 11, type: 'boss', format: 'horizontal',
          num1: 34, num2: 25, operator: '+', answer: 59,
          questionText: '[전통놀이 마당 보스] 34 + 25 의 값을 계산하세요!',
          stepHints: ['일의 자리: 4 + 5 = 9', '십의 자리: 3 + 2 = 5', '정답은 59입니다.'],
          errorType: '두 자리 덧셈 오류'
        },
      ];

    case 12: // 12차시: 두 자리 수의 뺄셈 & 덧셈뺄셈 마스터 대결
    default:
      return [
        {
          id: 's12_p1', stageId: 12, type: 'basic', format: 'horizontal',
          num1: 29, num2: 7, operator: '-', answer: 22,
          questionText: '29명 중 7명이 다른 놀이를 하러 갔습니다. 남은 사람은 몇 명일까요? 29 - 7 = ?',
          stepHints: ['일의 자리: 9 - 7 = 2', '십의 자리는 2 그대로', '정답은 22명입니다.'],
          errorType: '두 자리 뺄셈 오류'
        },
        {
          id: 's12_p2', stageId: 12, type: 'basic', format: 'horizontal',
          num1: 50, num2: 20, operator: '-', answer: 30,
          questionText: '달걀 50개 중 20개를 요리했습니다. 남은 달걀은 몇 개일까요? 50 - 20 = ?',
          stepHints: ['50은 10개씩 5묶음, 20은 10개씩 2묶음입니다.', '5묶음 - 2묶음 = 3묶음(30개)', '정답은 30개입니다.'],
          errorType: '몇십의 뺄셈 오류'
        },
        {
          id: 's12_p3', stageId: 12, type: 'basic', format: 'horizontal',
          num1: 35, num2: 15, operator: '-', answer: 20,
          questionText: '재이는 색종이 35장, 연우는 15장을 가지고 있습니다. 재이는 연우보다 몇 장 더 많을까요? 35 - 15 = ?',
          stepHints: ['일의 자리: 5 - 5 = 0', '십의 자리: 3 - 1 = 2', '정답은 20장입니다.'],
          errorType: '두 자리 뺄셈 오류'
        },
        {
          id: 's12_p4', stageId: 12, type: 'basic', format: 'vertical',
          num1: 48, num2: 14, operator: '-', answer: 34,
          questionText: '팽이 48개 중 14개를 빌려주면 남는 팽이는 몇 개일까요? 48 - 14 = ?',
          stepHints: ['일의 자리: 8 - 4 = 4', '십의 자리: 4 - 1 = 3', '정답은 34개입니다.'],
          errorType: '두 자리 뺄셈 오류'
        },
        {
          id: 's12_p5', stageId: 12, type: 'basic', format: 'horizontal',
          num1: 47, num2: 12, operator: '-', answer: 35,
          questionText: '47 - 12 를 계산하세요.',
          stepHints: ['일의 자리: 7 - 2 = 5', '십의 자리: 4 - 1 = 3', '정답은 35입니다.'],
          errorType: '두 자리 뺄셈 오류'
        },
        {
          id: 's12_p6', stageId: 12, type: 'advanced', format: 'horizontal',
          num1: 62, num2: 21, operator: '-', answer: 41,
          questionText: '62 - 21 을 계산하세요.',
          stepHints: ['일의 자리: 2 - 1 = 1', '십의 자리: 6 - 2 = 4', '정답은 41입니다.'],
          errorType: '두 자리 뺄셈 오류'
        },
        {
          id: 's12_p7', stageId: 12, type: 'advanced', format: 'horizontal',
          num1: 58, num2: 23, operator: '-', answer: 35,
          questionText: '58 - 23 을 계산하세요.',
          stepHints: ['일의 자리: 8 - 3 = 5', '십의 자리: 5 - 2 = 3', '정답은 35입니다.'],
          errorType: '두 자리 뺄셈 오류'
        },
        {
          id: 's12_p8', stageId: 12, type: 'advanced', format: 'word',
          num1: 28, num2: 12, operator: '-', answer: 16,
          context: '제기차기 시합',
          questionText: '지아는 제기를 28번 찼고 슬기는 12번 찼습니다. 지아가 슬기보다 몇 번 더 찼을까요?',
          stepHints: ['식: 28 - 12', '일의 자리: 8 - 2 = 6, 십의 자리: 2 - 1 = 1', '정답은 16번입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's12_p9', stageId: 12, type: 'challenge', format: 'word',
          num1: 26, num2: 13, operator: '-', answer: 13,
          context: '투호 놀이',
          questionText: '재이는 투호 화살 26개를 넣었고 세미는 13개를 넣었습니다. 재이는 세미보다 몇 개 더 넣었을까요?',
          stepHints: ['식: 26 - 13', '일의 자리: 6 - 3 = 3, 십의 자리: 2 - 1 = 1', '정답은 13개입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's12_p10', stageId: 12, type: 'challenge', format: 'puzzle',
          num1: 27, num2: 15, operator: '-', answer: 12,
          questionText: '27보다 15만큼 더 작은 수는 얼마일까요?',
          stepHints: ['식: 27 - 15', '일의 자리: 7 - 5 = 2, 십의 자리: 2 - 1 = 1', '정답은 12입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's12_p11', stageId: 12, type: 'remedial', format: 'horizontal',
          num1: 40, num2: 20, operator: '-', answer: 20,
          questionText: '40 - 20 = ?',
          stepHints: ['4묶음에서 2묶음을 빼면 2묶음(20)입니다.', '정답은 20입니다.'],
          errorType: '몇십의 뺄셈 오류'
        },
        {
          id: 's12_p12', stageId: 12, type: 'remedial', format: 'horizontal',
          num1: 24, num2: 2, operator: '-', answer: 22,
          questionText: '24 - 2 = ?',
          stepHints: ['4 - 2 = 2, 십의 자리는 2 그대로', '정답은 22입니다.'],
          errorType: '두 자리 뺄셈 오류'
        },
        {
          id: 's12_p13', stageId: 12, type: 'word', format: 'word',
          num1: 37, num2: 14, operator: '-', answer: 23,
          context: '가을 단풍잎',
          questionText: '단풍잎 37장 중 14장이 바람에 떨어졌습니다. 나무에 남은 단풍잎은 몇 장일까요?',
          stepHints: ['식: 37 - 14', '일의 자리: 7 - 4 = 3, 십의 자리: 3 - 1 = 2', '정답은 23장입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's12_p14', stageId: 12, type: 'word', format: 'word',
          num1: 28, num2: 11, operator: '-', answer: 17,
          context: '노란 은행잎',
          questionText: '은행잎 28장 중 11장이 떨어졌습니다. 나무에 남은 은행잎은 몇 장일까요?',
          stepHints: ['식: 28 - 11', '일의 자리: 8 - 1 = 7, 십의 자리: 2 - 1 = 1', '정답은 17장입니다.'],
          errorType: '문장제 식 세우기 오류'
        },
        {
          id: 's12_p15', stageId: 12, type: 'boss', format: 'horizontal',
          num1: 56, num2: 23, operator: '-', answer: 33,
          questionText: '[덧셈뺄셈 왕국 최종 보스] 56 - 23 을 정확하게 해결하고 마스터 왕관을 차지하세요!',
          stepHints: ['일의 자리: 6 - 3 = 3', '십의 자리: 5 - 2 = 3', '정답은 33입니다.'],
          errorType: '두 자리 뺄셈 오류'
        },
      ];
  }
}
