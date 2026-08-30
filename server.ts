import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini Client initialization
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check route
app.get("/api/health", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({ status: "ok", geminiReady: hasKey });
});

// Single Student Remark Generation Route
app.post("/api/gemini/generate-remark", async (req, res) => {
  try {
    const { studentProfile, stageRecords, previousRemark, instructionOptions } = req.body;

    if (!studentProfile) {
      return res.status(400).json({ success: false, error: "학생 학습 데이터(studentProfile)가 필요합니다." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback rule-based generation if API key is not yet set
      const fallback = generateRuleBasedRemark(studentProfile, stageRecords);
      return res.json({
        success: true,
        remark: fallback.remark,
        dominantTrait: fallback.dominantTrait,
        keyStrengths: fallback.keyStrengths,
        isFallback: true,
        note: "Gemini API 키가 아직 설정되지 않아 기본 분석 엔진으로 생성되었습니다. Settings > Secrets에서 키를 등록하면 AI 심층 분석이 활성화됩니다.",
      });
    }

    const prompt = `
당신은 대한민국 초등학교 1학년 수학 교육과정 및 학교생활기록부(교과학습발달상황 세부능력 및 특기사항/과정중심평가) 전문 수석교사입니다.
다음 학생의 1학년 2학기 '덧셈과 뺄셈' 단원 종합 학습 데이터를 정밀 분석하여, 생활기록부에 바로 기재할 수 있는 완성도 높은 **수학 평어(1~2문장)**를 작성해 주세요.

[학생 기본 정보]
- 이름: ${studentProfile.name} (${studentProfile.grade}학년 ${studentProfile.classNo}반 ${studentProfile.number}번)
- 캐릭터 직업 및 레벨: ${studentProfile.job} (Lv.${studentProfile.level})
- 전체 정답률: ${studentProfile.accuracy}% (총 맞힌 문제: ${studentProfile.totalCorrect}, 틀린 문제: ${studentProfile.totalWrong})
- 완료 차시 수: ${studentProfile.completedStagesCount}/12차시
- 총 힌트 사용 횟수: ${studentProfile.totalHints}회
- 총 재도전 횟수: ${studentProfile.totalRetries || 0}회
- 최대 콤보(연속 정답): ${studentProfile.maxCombo || 0}회
- 수집한 수학몬: ${studentProfile.monstersCount || 0}/12마리

[차시별 세부 학습 현황]
${(stageRecords || [])
  .map(
    (st: any) =>
      `* ${st.stageId}차시(${st.stageTitle}): 도달수준=${st.mastery}, 정답=${st.correctCount}/오답=${st.wrongCount}, 힌트=${st.hintCount}회, 주요오답=${st.dominantError || '없음'}, 문제만들기/퍼즐=${st.creativeSolved ? '참여' : '기본'}`
  )
  .join("\n")}

[오답 및 오류 수정 특징]
- 주요 반복 오답 유형: ${studentProfile.dominantErrorTypes?.join(", ") || "오답 적음"}
- 오답 후 재시도 성공률: ${studentProfile.retrySuccessRate || "높음"}
- 심화 및 보스 문제 해결: ${studentProfile.advancedPerformance || "우수"}

${previousRemark ? `[참고: 이전에 생성되었던 평어]\n"${previousRemark}"\n※ 이전 평어와 표현, 문장 구조, 어휘를 최대한 다르게 변형하되 학생의 핵심 특성은 살려주세요.` : ""}

[평어 작성 원칙 및 가이드라인]
1. **문체 및 분량**: 초등학교 1학년 생활기록부 표준 문체(~함, ~임, ~보임 등 명사형 또는 간결한 서술 종결)로 1~2문장 (90~160자 내외)으로 자연스럽게 작성합니다.
2. **긍정적 성장 중심**: 단순히 "수학을 잘함", "열심히 함" 같은 상투적 표현을 배제하고, 수 모으기와 가르기, 10의 보수(10 만들기), 세 수의 덧셈·뺄셈 순서, 받아올림/받아내림 원리, 10칸 상자 및 수 모형 조작, 실생활 스토리 문제 해결, 오류 자기 수정 등 구체적 수학 행동을 근거로 기술합니다.
3. **학생 특성 맞춤 차별화**:
   - 정답률 및 심화도가 높은 학생: 10을 이용한 모으기와 가르기 개념이 탄탄하며, 받아올림/받아내림 원리를 능숙하게 조작하고 수학 퍼즐 및 문제 만들기 활동에서 창의적 사고를 보임
   - 오답 후 스스로 극복한 학생: 10의 보수나 뺄셈 과정에서 발생한 실수를 10칸 상자 도구와 힌트를 통해 스스로 점검하고 바로잡는 끈기 있는 태도 강조
   - 기본 학습을 충실히 수행한 학생: 덧셈과 뺄셈의 기본 개념과 계산 절차를 성실하게 익히며, 수 모으기와 가르기 활동에 적극 참여하여 기초 연산력을 다짐
   - 다양한 문제 만들기나 수학 퍼즐에 강점: 수학적 호기심과 상상력이 풍부하여 수 놀이와 퍼즐 해결에 흥미를 느끼고 적극적으로 탐구함
4. 반드시 JSON 형식으로만 응답해야 합니다.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            remark: {
              type: Type.STRING,
              description: "초등학교 생활기록부용 1~2문장 수학 평어",
            },
            dominantTrait: {
              type: Type.STRING,
              description: "주요 학습 특성 요약 (예: 개념추론형, 오류극복형, 성실탐구형, 창의응용형, 원리이해형 등 4~8자)",
            },
            keyStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "핵심 강점 키워드 2~3개 (예: ['올림 계산 숙달', '오류 자기수정', '어림셈 전략'])",
            },
          },
          required: ["remark", "dominantTrait", "keyStrengths"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      success: true,
      remark: parsed.remark,
      dominantTrait: parsed.dominantTrait,
      keyStrengths: parsed.keyStrengths,
    });
  } catch (error: any) {
    console.error("Error generating single remark:", error);
    res.status(500).json({
      success: false,
      error: error.message || "평어 생성 중 오류가 발생했습니다.",
    });
  }
});

// Class-wide Batch Remarks Generation Route
app.post("/api/gemini/generate-class-remarks", async (req, res) => {
  try {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, error: "학생 목록 데이터(students)가 필요합니다." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback for all students if API key not present
      const fallbackResults = students.map((s) => {
        const fb = generateRuleBasedRemark(s.profile, s.stageRecords);
        return {
          studentId: s.profile.id,
          remark: fb.remark,
          dominantTrait: fb.dominantTrait,
          keyStrengths: fb.keyStrengths,
        };
      });

      return res.json({
        success: true,
        remarks: fallbackResults,
        isFallback: true,
        note: "Gemini API 키가 아직 설정되지 않아 기본 분석 엔진으로 일괄 생성되었습니다.",
      });
    }

    const prompt = `
당신은 대한민국 초등학교 1학년 수학 교육과정 및 학교생활기록부 교과학습발달상황 작성 전문 수석교사입니다.
다음 학급의 학생 ${students.length}명의 1학년 2학기 '덧셈과 뺄셈' 단원 학습 데이터를 각각 정밀 분석하여, 학생별 맞춤형 **수학 평어**를 작성해 주세요.

[★ 절대 원칙 - 중복 표현 엄격 금지 ★]
1. 학생들마다 서로 다른 문장 구조, 다채로운 어휘, 각자의 실제 데이터에 기반한 고유한 학습 행동(모으기와 가르기, 10의 보수, 세 수 계산, 받아올림/받아내림, 10칸 상자 활용 등)을 기술해야 합니다.
2. 동일하거나 유사한 문장 템플릿을 복사 붙여넣기식으로 반복해서는 절대 안 됩니다.
3. 각 학생당 1~2문장(90~160자 내외), 종결어미(~함, ~임, ~보임 등)를 갖춘 초등 생활기록부 표준 문체로 작성합니다.

[학급 전체 학생 데이터]
${students
  .map(
    (s: any, idx: number) => `
[학생 ${idx + 1}] ID: ${s.profile.id} / 번호: ${s.profile.number} / 이름: ${s.profile.name} / 직업: ${s.profile.job}
- 성취 수준: 정답률 ${s.profile.accuracy}% (${s.profile.totalCorrect}정답/${s.profile.totalWrong}오답), 완료: ${s.profile.completedStagesCount}/12차시
- 특성 지표: 힌트사용 ${s.profile.totalHints}회, 재도전 ${s.profile.totalRetries || 0}회, 연속콤보 ${s.profile.maxCombo || 0}
- 주요 오답 유형: ${s.profile.dominantErrorTypes?.join(", ") || "거의 없음"}
- 차시별 주요 도달도: ${(s.stageRecords || []).map((st: any) => `${st.stageId}차시(${st.mastery})`).join(", ")}
`
  )
  .join("\n")}

각 학생(studentId 일치)별로 분석된 remark, dominantTrait, keyStrengths를 JSON 배열로 반환하세요.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              studentId: { type: Type.STRING },
              remark: { type: Type.STRING },
              dominantTrait: { type: Type.STRING },
              keyStrengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["studentId", "remark", "dominantTrait", "keyStrengths"],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    res.json({
      success: true,
      remarks: parsed,
    });
  } catch (error: any) {
    console.error("Error generating class remarks:", error);
    res.status(500).json({
      success: false,
      error: error.message || "학급 전체 평어 일괄 생성 중 오류가 발생했습니다.",
    });
  }
});

// Fallback Rule-based Remark Generator for local/offline cases
function generateRuleBasedRemark(profile: any, stageRecords: any[] = []) {
  const accuracy = profile.accuracy || 0;
  const completed = profile.completedStagesCount || 0;
  const hints = profile.totalHints || 0;
  const errorTypes = profile.dominantErrorTypes || [];

  if (accuracy >= 85 && completed >= 8) {
    const traits = ["수 개념 우수형", "원리 탐구형", "수학적 사고형", "창의 응용형"];
    const trait = traits[profile.number % traits.length];
    const remarks = [
      "10을 이용한 수 모으기와 가르기 및 받아올림·받아내림의 계산 원리를 명확히 이해하고, 실생활 문제 상황에 유연하게 적용하며 수학 퍼즐과 문제 만들기 활동에 창의적이고 적극적으로 참여함.",
      "10의 보수 관계와 세 수의 덧셈·뺄셈 계산 순서를 정확히 파악하여 두 자리 수의 덧셈과 뺄셈을 신속하고 정확하게 해결하며, 수학적 추론 능력이 매우 우수함.",
      "수 모형과 10칸 상자 도구를 활용한 덧셈·뺄셈 원리를 깊이 있게 이해하고 있으며, 복잡한 문제 상황에서도 스스로 해결 전략을 찾아 논리적으로 해결함.",
    ];
    return {
      remark: remarks[profile.number % remarks.length],
      dominantTrait: trait,
      keyStrengths: ["10 만들기 원리 숙달", "받아올림/내림 응용력", "수학적 창의력"],
    };
  } else if (profile.totalRetries > 3 || hints > 5 || errorTypes.length > 0) {
    const traits = ["오류 극복형", "자기 수정형", "끈기 도전형", "성장 발전형"];
    const trait = traits[profile.number % traits.length];
    const remarks = [
      "10을 이용한 덧셈과 뺄셈 과정에서 나타난 계산 실수를 10칸 상자 힌트와 재도전을 통해 스스로 바로잡는 끈기 있는 학습 태도가 돋보이며, 점차 계산 정확도가 크게 향상됨.",
      "받아올림과 받아내림 10 만들기 오류를 확인한 후 차근차근 수 분해 과정을 점검하여 해결하려는 자기주도적 수정 능력이 꾸준히 발전하고 있음.",
      "어려운 뺄셈 문제 앞에서도 포기하지 않고 교구 및 힌트를 활용하여 끝까지 해결하려는 자세를 보이며, 반복적인 연습을 통해 기초 연산 기능이 착실히 성장하고 있음.",
    ];
    return {
      remark: remarks[profile.number % remarks.length],
      dominantTrait: trait,
      keyStrengths: ["오류 자기 수정 능력", "끈기 있는 도전 태도", "연산 정확도 향상"],
    };
  } else {
    const traits = ["성실 탐구형", "기본 정착형", "꾸준 실천형", "원리 습득형"];
    const trait = traits[profile.number % traits.length];
    const remarks = [
      "1학년 2학기 덧셈과 뺄셈 단원의 기본 개념을 성실하게 학습하며, 10칸 상자와 수 카드를 활용한 기초 연산 활동에 모범적이고 진지한 태도로 참여함.",
      "한 자리 수의 모으기와 가르기부터 차근차근 원리를 익혀 나가며, 주어진 덧셈과 뺄셈 과제를 끝까지 책임감 있게 완수하는 학습 태도를 지님.",
      "수학 활동에 높은 흥미와 관심을 보이며, 교사의 발문과 피드백을 바르게 수용하여 기초 덧셈·뺄셈을 정확하게 수행하려는 노력이 돋보임.",
    ];
    return {
      remark: remarks[profile.number % remarks.length],
      dominantTrait: trait,
      keyStrengths: ["기본 개념 충실", "성실한 학습 태도", "기초 연산 정착"],
    };
  }
}

// Vite middleware or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
