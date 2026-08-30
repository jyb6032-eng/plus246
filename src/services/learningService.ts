// Learning Service: Rule-based problem generation, answer grading, error diagnosis, and adaptive hint engine
// Tailored for 1st Grade Semester 2 Math: Addition & Subtraction (Units 2, 4, 6)

import { Problem, ProblemType, StageMastery, WrongQuestionRecord } from '../types';
import { getBaseProblemsForStage, STAGES_CONFIG } from './curriculumData';

export interface GradingResult {
  isCorrect: boolean;
  correctAnswer: number;
  studentAnswer: number;
  errorType?: string;
  feedbackMessage: string;
  hintForNextAttempt?: string;
  shouldOfferRemedial?: boolean;
}

export const LearningService = {
  // Get base curated 15 problems for a given stage
  getStageProblems(stageId: number): Problem[] {
    return getBaseProblemsForStage(stageId);
  },

  // Infinite Rule-Based Problem Generator for 1st Grade (No external API needed)
  generateDynamicProblem(stageId: number, type: ProblemType = 'challenge', counter = 1): Problem {
    const id = `s${stageId}_dyn_${Date.now()}_${counter}`;

    let num1 = 5;
    let num2 = 3;
    let num3: number | undefined = undefined;
    let operator: Problem['operator'] = '+';
    let format: Problem['format'] = 'horizontal';
    let questionText = '';
    let context = '';
    let errorType = '연산 오류';
    const stepHints: string[] = [];
    let answer = 0;
    let visualAid: Problem['visualAid'] = undefined;

    switch (stageId) {
      case 1: { // 1차시: 모으기와 가르기
        const n1 = Math.floor(Math.random() * 4) + 2; // 2~5
        const n2 = Math.floor(Math.random() * 4) + 1; // 1~4
        num1 = n1;
        num2 = n2;
        operator = '+';
        answer = n1 + n2;
        format = 'split_join';
        questionText = `${n1}과 ${n2}를 모으면 얼마가 될까요?`;
        stepHints.push(`${n1} 다음에 ${n2}개를 이어서 세어보세요.`);
        stepHints.push(`${n1} + ${n2} = ${answer} 입니다.`);
        errorType = '모으기 오류';
        visualAid = { type: 'apples', count1: n1, count2: n2, target: answer };
        break;
      }

      case 2: { // 2차시: 세 수의 덧셈
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 1;
        const c = Math.floor(Math.random() * 3) + 1;
        num1 = a;
        num2 = b;
        num3 = c;
        operator = 'three_add';
        format = 'three_add';
        answer = a + b + c;
        questionText = `${a} + ${b} + ${c} 를 차례대로 계산하세요.`;
        stepHints.push(`1단계: ${a} + ${b} = ${a + b}`);
        stepHints.push(`2단계: ${a + b} + ${c} = ${answer}`);
        errorType = '세 수 계산 순서 오류';
        break;
      }

      case 3: { // 3차시: 세 수의 뺄셈
        const total = Math.floor(Math.random() * 4) + 6; // 6~9
        const sub1 = Math.floor(Math.random() * 2) + 1; // 1~2
        const sub2 = Math.floor(Math.random() * 2) + 1; // 1~2
        num1 = total;
        num2 = sub1;
        num3 = sub2;
        operator = 'three_sub';
        format = 'three_sub';
        answer = total - sub1 - sub2;
        questionText = `${total} - ${sub1} - ${sub2} 를 순서대로 계산하세요.`;
        stepHints.push(`1단계: ${total} - ${sub1} = ${total - sub1}`);
        stepHints.push(`2단계: ${total - sub1} - ${sub2} = ${answer}`);
        errorType = '세 수 뺄셈 순서 오류';
        break;
      }

      case 4: { // 4차시: 10이 되는 더하기
        const k = Math.floor(Math.random() * 8) + 1; // 1~9
        const partner = 10 - k;
        num1 = k;
        num2 = partner;
        operator = '+';
        format = 'puzzle';
        answer = partner;
        questionText = `${k} + [  ] = 10 마법 상자를 채우는 짝꿍 수는?`;
        stepHints.push(`10에서 ${k}를 빼면 얼마가 남을까요?`);
        stepHints.push(`${k}와 ${partner}를 모으면 10이 됩니다. 정답은 ${partner}입니다.`);
        errorType = '10의 보수 오류';
        visualAid = { type: 'ten_frame', count1: k, count2: partner, target: 10 };
        break;
      }

      case 5: { // 5차시: 10에서 빼기
        const sub = Math.floor(Math.random() * 8) + 1; // 1~9
        num1 = 10;
        num2 = sub;
        operator = '-';
        answer = 10 - sub;
        format = 'horizontal';
        questionText = `10 - ${sub} 의 값을 구하세요.`;
        stepHints.push(`10개에서 ${sub}개를 덜어내면 몇 개가 남을까요?`);
        stepHints.push(`${sub} + ${answer} = 10 이므로 10 - ${sub} = ${answer} 입니다.`);
        errorType = '10에서 빼기 오류';
        break;
      }

      case 6: { // 6차시: 10을 만들어 세 수 더하기
        const pairs = [[1, 9], [2, 8], [3, 7], [4, 6], [5, 5]];
        const chosen = pairs[Math.floor(Math.random() * pairs.length)];
        const third = Math.floor(Math.random() * 6) + 2; // 2~7
        num1 = chosen[0];
        num2 = chosen[1];
        num3 = third;
        operator = 'three_add';
        format = 'three_add';
        answer = 10 + third;
        questionText = `${num1} + ${num2} + ${third} 에서 10이 되는 두 수를 먼저 묶고 계산하세요.`;
        stepHints.push(`${num1} + ${num2} = 10 입니다.`);
        stepHints.push(`10 + ${third} = ${answer} 입니다.`);
        errorType = '10 묶어 더하기 오류';
        break;
      }

      case 7: { // 7차시: 받아올림 (몇)+(몇)=십몇
        const a = Math.floor(Math.random() * 4) + 6; // 6~9
        const b = Math.floor(Math.random() * 5) + (11 - a); // so a+b >= 11
        num1 = a;
        num2 = b;
        operator = '+';
        answer = a + b;
        format = 'horizontal';
        questionText = `${a} + ${b} 를 계산하세요. (10을 만들어 더해보세요)`;
        const need = 10 - a;
        stepHints.push(`${b}를 ${need}와 ${b - need}로 가릅니다.`);
        stepHints.push(`${a} + ${need} = 10, 10 + ${b - need} = ${answer}`);
        errorType = '받아올림 10 만들기 오류';
        break;
      }

      case 8: { // 8차시: 여러 가지 덧셈 전략
        const doubles = [5, 6, 7, 8, 9];
        const base = doubles[Math.floor(Math.random() * doubles.length)];
        num1 = base;
        num2 = base + 1;
        operator = '+';
        answer = base + (base + 1);
        format = 'horizontal';
        questionText = `${base} + ${base} = ${base * 2} 를 이용하여 ${base} + ${base + 1} 의 값을 구하세요.`;
        stepHints.push(`${base * 2}보다 1 큰 수입니다.`);
        stepHints.push(`정답은 ${answer} 입니다.`);
        errorType = '덧셈 관계 추론 오류';
        break;
      }

      case 9: { // 9차시: 받아내림 (십몇)-(몇)
        const tenPlus = Math.floor(Math.random() * 7) + 11; // 11~17
        const ones = tenPlus % 10;
        const sub = Math.floor(Math.random() * (9 - ones)) + (ones + 1); // sub > ones
        num1 = tenPlus;
        num2 = sub;
        operator = '-';
        answer = tenPlus - sub;
        format = 'horizontal';
        questionText = `${tenPlus} - ${sub} 의 값을 구하세요.`;
        stepHints.push(`10에서 ${sub}를 먼저 빼면 ${10 - sub}가 남습니다.`);
        stepHints.push(`${10 - sub}에 낱개 ${ones}를 더하면 ${answer} 입니다.`);
        errorType = '받아내림 10에서 빼기 오류';
        break;
      }

      case 10: { // 10차시: 여러 가지 뺄셈 전략 (차가 9가 되는 식 등)
        const sub = Math.floor(Math.random() * 8) + 2; // 2~9
        const top = 9 + sub;
        num1 = top;
        num2 = sub;
        operator = '-';
        format = 'puzzle';
        answer = sub;
        questionText = `${top} - [  ] = 9 차가 9가 되도록 빈칸에 알맞은 수를 쓰세요.`;
        stepHints.push(`${top}에서 9를 빼보세요: ${top} - 9 = ${sub}`);
        stepHints.push(`${top} - ${sub} = 9 입니다. 정답은 ${sub}입니다.`);
        errorType = '방정식 추론 오류';
        break;
      }

      case 11: { // 11차시: 두 자리 수의 덧셈
        const t1 = Math.floor(Math.random() * 3) + 1; // 1~3
        const o1 = Math.floor(Math.random() * 4) + 1; // 1~4
        const t2 = Math.floor(Math.random() * 2) + 1; // 1~2
        const o2 = Math.floor(Math.random() * 4) + 1; // 1~4 (no carry)
        num1 = t1 * 10 + o1;
        num2 = t2 * 10 + o2;
        operator = '+';
        answer = num1 + num2;
        format = 'horizontal';
        questionText = `${num1} + ${num2} 를 계산하세요.`;
        stepHints.push(`일의 자리: ${o1} + ${o2} = ${o1 + o2}`);
        stepHints.push(`십의 자리: ${t1} + ${t2} = ${t1 + t2}`);
        stepHints.push(`정답은 ${answer} 입니다.`);
        errorType = '두 자리 덧셈 오류';
        break;
      }

      case 12: // 12차시: 두 자리 수의 뺄셈 & 마스터
      default: {
        const t1 = Math.floor(Math.random() * 4) + 3; // 3~6
        const o1 = Math.floor(Math.random() * 4) + 5; // 5~8
        const t2 = Math.floor(Math.random() * 2) + 1; // 1~2
        const o2 = Math.floor(Math.random() * 4) + 1; // 1~4 (no borrow)
        num1 = t1 * 10 + o1;
        num2 = t2 * 10 + o2;
        operator = '-';
        answer = num1 - num2;
        format = 'horizontal';
        questionText = `[마스터 도전] ${num1} - ${num2} 의 값을 계산하세요!`;
        stepHints.push(`일의 자리: ${o1} - ${o2} = ${o1 - o2}`);
        stepHints.push(`십의 자리: ${t1} - ${t2} = ${t1 - t2}`);
        stepHints.push(`정답은 ${answer} 입니다.`);
        errorType = '두 자리 뺄셈 오류';
        break;
      }
    }

    return {
      id,
      stageId,
      type,
      questionText,
      num1,
      num2,
      num3,
      operator,
      answer,
      format,
      stepHints,
      errorType,
      context,
      visualAid,
      multiplicand: num1, // backwards compatibility
      multiplier: num2,   // backwards compatibility
    };
  },

  // Rule-based error diagnostic engine for 1st Grade Math
  diagnoseError(problem: Problem, studentAns: number): string {
    const correct = problem.answer;
    const diff = Math.abs(studentAns - correct);

    // 1. 10 complement mistake
    if (problem.operator === '+' && (problem.num1 + studentAns === 10 || studentAns + problem.num2 === 10)) {
      return '10의 보수 오류';
    }

    // 2. Off by 10 (place value or missed 10 in make-10)
    if (diff === 10) {
      return '10 묶음 처리 오류';
    }

    // 3. Off by 1 or 2 (counting error)
    if (diff === 1 || diff === 2) {
      return '단순 세기 오류';
    }

    // 4. Operation swap error (did addition instead of subtraction or vice-versa)
    if (problem.operator === '-' && studentAns === problem.num1 + problem.num2) {
      return '연산 기호 혼동 (뺄셈 대신 덧셈)';
    }
    if (problem.operator === '+' && studentAns === Math.abs(problem.num1 - problem.num2)) {
      return '연산 기호 혼동 (덧셈 대신 뺄셈)';
    }

    return problem.errorType || '기초 연산 오류';
  },

  // Grade an answer with detailed feedback
  evaluateAnswer(problem: Problem, studentInput: string, attemptCount: number): GradingResult {
    const trimmed = studentInput.trim();
    const studentAns = parseInt(trimmed, 10);

    if (isNaN(studentAns)) {
      return {
        isCorrect: false,
        correctAnswer: problem.answer,
        studentAnswer: 0,
        errorType: '입력 형식 오류',
        feedbackMessage: '숫자를 정확히 입력해 주세요!',
      };
    }

    const isCorrect = studentAns === problem.answer;

    if (isCorrect) {
      const messages = [
        '정답입니다! 완벽하게 계산했어요! ⭐',
        '훌륭해요! 수학 실력이 쑥쑥 자라나고 있어요! 👏',
        '멋져요! 10 만들기 원리를 완벽히 파악했습니다! 🚀',
        '대단해요! 정답을 맞혀 콤보가 증가합니다! 🔥',
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      return {
        isCorrect: true,
        correctAnswer: problem.answer,
        studentAnswer: studentAns,
        feedbackMessage: msg,
      };
    }

    const diagnosed = this.diagnoseError(problem, studentAns);
    let hintMsg = '';
    if (attemptCount <= problem.stepHints.length) {
      hintMsg = problem.stepHints[attemptCount - 1] || '차근차근 묶음과 낱개를 세어보세요!';
    } else {
      hintMsg = `정답은 ${problem.answer} 입니다. 다음 단계로 넘어가서 다시 도전해 보세요!`;
    }

    return {
      isCorrect: false,
      correctAnswer: problem.answer,
      studentAnswer: studentAns,
      errorType: diagnosed,
      feedbackMessage: `아쉬워요! [${diagnosed}] 부분을 다시 한번 확인해 볼까요?`,
      hintForNextAttempt: hintMsg,
      shouldOfferRemedial: attemptCount >= 2,
    };
  },

  // Calculate stage mastery level based on correct count and hints
  calculateMastery(correctCount: number, totalQuestions: number, hintCount: number): StageMastery {
    const ratio = correctCount / totalQuestions;
    if (ratio >= 0.95 && hintCount <= 2) return '완전정복';
    if (ratio >= 0.8) return '심화';
    if (ratio >= 0.6) return '기본';
    return '보충';
  },

  determineStageMastery(correctCount: number, totalQuestions: number, hintCount: number): StageMastery {
    return this.calculateMastery(correctCount, totalQuestions, hintCount);
  },
};
