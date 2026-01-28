import OpenAI from 'openai';

const apiKey = process.env.OPENROUTER_API_KEY;
// Fallback if key missing in dev
const mockMode = !apiKey;

const openai = apiKey ? new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Taqweem',
    },
}) : null;

// Comprehensive list of free models (OpenRouter)
// Only including models confirmed to exist (even if rate limited)
const MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "google/gemma-3-12b-it:free",
    "google/gemma-3-4b-it:free",
    "qwen/qwen-2.5-vl-7b-instruct:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "meta-llama/llama-3.1-405b-instruct:free",

    "google/gemini-2.0-flash-exp:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "tngtech/tng-r1t-chimera:free",
    "tngtech/deepseek-r1t2-chimera:free",
    "deepseek/deepseek-r1-0528:free",
    "tngtech/deepseek-r1t-chimera:free",
    "arcee-ai/trinity-mini:free",
    "openai/gpt-oss-120b:free",
    "openai/gpt-oss-20b:free",
    "z-ai/glm-4.5-air:free",
    "google/gemma-3-27b-it:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
    "meta-llama/llama-3.1-405b-instruct:free",
    "upstage/solar-pro-3:free",
    "nvidia/nemotron-nano-12b-v2-vl:free",
    "nvidia/nemotron-nano-9b-v2:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "qwen/qwen3-4b:free",
    "allenai/molmo-2-8b:free",
    "liquid/lfm-2.5-1.2b-thinking:free",
    "liquid/lfm-2.5-1.2b-instruct:free",
    "moonshotai/kimi-k2:free",
    "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
    "google/gemma-3-4b-it:free",
    "google/gemma-3-12b-it:free",
    "qwen/qwen-2.5-vl-7b-instruct:free",
    "google/gemma-3n-e2b-it:free",
    "google/gemma-3n-e4b-it:free"
];

export async function generateQuestionsAI(subject: string, skill: string, count: number = 3, difficulty: string = 'medium') {
    if (mockMode) {
        console.log('Mocking AI Response');
        return [
            {
                text: `سؤال تجريبي عن ${skill} في مادة ${subject}؟`,
                options: ['أ', 'ب', 'ج', 'د'],
                correctAnswer: 'أ',
                type: 'multiple_choice',
                subject, skill, difficulty
            }
        ];
    }

    const prompt = `
    Create ${count} multiple-choice questions for the subject "${subject}" testing the skill "${skill}" at "${difficulty}" level.
    Return ONLY a raw JSON array. No markdown. No explanations.
    JSON Format: [{"text": "Question in Arabic", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "type": "multiple_choice"}]
  `;

    let lastError = null;

    for (const model of MODELS) {
        try {
            console.log(`Trying AI Model: ${model}...`);
            const completion = await openai!.chat.completions.create({
                model: model,
                messages: [{ role: 'user', content: prompt }],
            });

            if (!completion || !completion.choices || !completion.choices[0]) {
                console.warn(`Model ${model} returned empty response`);
                continue;
            }

            const content = completion.choices[0].message?.content || '[]';
            const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
            const questions = JSON.parse(jsonStr);

            if (Array.isArray(questions) && questions.length > 0) {
                return questions;
            }
        } catch (error: any) {
            console.warn(`Model ${model} failed:`, error.message);
            lastError = error;
            // Immediate fail for auth errors, otherwise try next model
            if (error.status === 401) break;
        }
    }

    console.error('All AI models failed');
    throw lastError || new Error('Failed to generate questions. Please try again later.');
}

export async function generateLearningPlan(score: number, maxScore: number, weaknesses: string[]) {
    const percentage = (score / maxScore) * 100;
    const isEnrichment = percentage >= 85;

    // Mock response for testing/dev without key
    if (mockMode) {
        return {
            type: isEnrichment ? 'enrichment' : 'remedial',
            title: isEnrichment ? 'خطة إثرائية: تحديات العباقرة 🚀' : 'خطة علاجية: تعزيز المهارات 🛠️',
            content: isEnrichment
                ? 'أداء ممتاز! استمر في التميز. إليك تحديات لمستوى متقدم.'
                : 'لا بأس، يمكننا تحسين الأداء بالتركيز على النقاط التالية.',
            exercises: [
                {
                    text: isEnrichment ? 'سؤال تفكير ناقد متقدم؟' : 'سؤال مراجعة بسيط للمفهوم؟',
                    options: ['خيـار 1', 'خيـار 2'],
                    correctAnswer: 'خيـار 1'
                }
            ]
        };
    }

    const prompt = `
    Analyze the student performance: Score ${score}/${maxScore} (${Math.round(percentage)}%).
    Weaknesses found: ${weaknesses.join(', ') || 'None detailed'}.
    
    Task: Create a personalized learning plan.
    - If score >= 85%, create an "Enrichment Plan" (Advanced challenge, fun fact).
    - If score < 85%, create a "Remedial Plan" (Explain weak concepts simply, build confidence).

    Return ONLY raw JSON. No markdown.
    JSON Format:
    {
        "type": "enrichment" OR "remedial",
        "title": "Arabic Title",
        "content": "Arabic text explaining the feedback",
        "exercises": [
            {
                "text": "Arabic Question",
                "options": ["Option1", "Option2", "Option3", "Option4"],
                "correctAnswer": "Option1" 
            }
        ]
    }
    IMPORTANT: "correctAnswer" MUST be the EXACT string copy of one of the options. Do NOT use "A", "B", "1", or "2".
    `;

    for (const model of MODELS) {
        try {
            const completion = await openai!.chat.completions.create({
                model: model,
                messages: [{ role: 'user', content: prompt }],
            });

            if (!completion || !completion.choices || !completion.choices[0]) continue;

            const content = completion.choices[0].message?.content || '{}';
            const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
            const plan = JSON.parse(jsonStr);

            if (plan.title && plan.content) {
                return plan;
            }
        } catch (error: any) {
            console.warn(`Model ${model} failed for plan:`, error.message);
            if (error.status === 401) break;
        }
    }

    // Fallback if all fail
    return {
        type: isEnrichment ? 'enrichment' : 'remedial',
        title: isEnrichment ? 'خطة إثرائية' : 'خطة علاجية',
        content: 'نأسف، لم نتمكن من توليد الخطة تلقائياً في الوقت الحالي.',
        exercises: []
    };
}
