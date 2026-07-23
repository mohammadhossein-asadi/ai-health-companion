import { HealthAppState, AnalyzeHealthResponse } from '@/types';
import { API_CONFIG } from '@/constants';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

export function buildHealthAnalysisPrompt(state: HealthAppState): string {
  const { profile, sleep, exercise, skin, hair, nutrition, supplements, water, bloodTest, bmi, calories } = state;

  return `You are an expert AI Health Advisor with deep knowledge of cross-module health correlations. Analyze the following user's health data across 10 interconnected modules and provide a comprehensive health assessment.

## User Profile
- Name: ${profile.name || 'User'}
- Age: ${profile.age}
- Gender: ${profile.gender}
- BMI: ${bmi.currentBMI} (${bmi.bmiCategory})

## Module Data

### 1. Sleep (خواب)
- Recent records: ${JSON.stringify(sleep.records.slice(-7))}
- Average duration: ${sleep.averageDuration} min
- Average quality: ${sleep.averageQuality}/5
- Weekly goal: ${sleep.weeklyGoalHours} hours

### 2. Exercise (ورزش)
- Recent records: ${JSON.stringify(exercise.records.slice(-7))}
- Weekly steps total: ${exercise.weeklyStepsTotal}
- Daily step goal: ${exercise.dailyStepGoal}
- Weekly workout goal: ${exercise.weeklyWorkoutGoal} sessions

### 3. Skin (پوست)
- Skin type: ${skin.skinType}
- Recent records: ${JSON.stringify(skin.records.slice(-3))}
- Routine adherence: ${skin.routineAdherence}%

### 4. Hair (مو)
- Hair type: ${hair.hairType}
- Scalp type: ${hair.scalpType}
- Hair loss trend: ${hair.weeklyHairLossTrend}
- Recent records: ${JSON.stringify(hair.records.slice(-3))}

### 5. Nutrition (تغذیه)
- Daily calorie target: ${nutrition.dailyCalorieTarget}
- Recent meals: ${JSON.stringify(nutrition.records.slice(-9))}
- Meal timing consistency: ${nutrition.mealTimingConsistency}%

### 6. Supplements (مکمل)
- Active supplements: ${JSON.stringify(supplements.activeSupplements)}
- Adherence rate: ${supplements.adherenceRate}%
- Recent logs: ${JSON.stringify(supplements.logs.slice(-10))}

### 7. Water (آب)
- Daily target: ${water.dailyTargetMl}ml
- Today's intake: ${water.todayTotalMl}ml
- Hydration score: ${water.hydrationScore}/100

### 8. Blood Test (آزمایش خون)
- Latest test: ${bloodTest.latestTestDate || 'No tests recorded'}
- Biomarkers: ${JSON.stringify(bloodTest.records[0]?.biomarkers || [])}
- Critical flags: ${JSON.stringify(bloodTest.criticalFlags)}

### 9. BMI (شاخص توده بدنی)
- Current: ${bmi.currentBMI} (${bmi.bmiCategory})
- Height: ${bmi.currentHeight}cm, Weight: ${bmi.currentWeight}kg
- Trend: ${bmi.bmiTrend}

### 10. Calories (کالری)
- BMR: ${calories.bmr}
- TDEE: ${calories.tdee}
- Today's net balance: ${calories.todayNetBalance} kcal
- Weekly average balance: ${calories.weeklyAverageBalance} kcal

---

## Cross-Module Correlation Analysis Instructions

Perform the following cross-module correlations:
1. **Sleep ↔ Calories**: Does poor sleep correlate with higher calorie cravings?
2. **Blood Test ↔ Hair**: Do deficiencies (Iron, Ferritin, Vitamin D) correlate with hair loss?
3. **Blood Test ↔ Exercise**: Do low biomarkers affect exercise performance?
4. **Water ↔ Exercise**: Is hydration adequate for the exercise intensity?
5. **Nutrition ↔ BMI**: Does calorie intake align with BMI goals?
6. **Sleep ↔ Exercise**: Does sleep quality affect workout recovery?
7. **Supplements ↔ Blood Test**: Are supplements addressing identified deficiencies?

## Response Format

Return a JSON object with exactly this structure:
{
  "healthScore": <number 1-100>,
  "criticalAlerts": [
    {
      "severity": "critical" | "warning" | "info",
      "title": "<short title>",
      "description": "<detailed description>",
      "relatedModules": ["module1", "module2"],
      "recommendation": "<actionable recommendation>"
    }
  ],
  "moduleInsights": {
    "<moduleName>": {
      "score": <number 0-100>,
      "trend": "improving" | "stable" | "worsening",
      "summary": "<brief analysis>",
      "recommendations": ["<actionable tip 1>", "<actionable tip 2>"]
    }
  },
  "weeklyActionPlan": [
    {
      "priority": "high" | "medium" | "low",
      "module": "<module name>",
      "action": "<specific action to take>",
      "deadline": "<e.g. 'this week', 'daily'>"
    }
  ],
  "crossModuleCorrelations": [
    {
      "modules": ["module1", "module2"],
      "finding": "<what you discovered>",
      "impact": "positive" | "negative" | "neutral",
      "recommendation": "<what to do about it>"
    }
  ]
}

Be specific, evidence-based, and provide actionable recommendations. Focus on the most impactful improvements first.`;
}

export async function analyzeHealthData(
  state: HealthAppState
): Promise<AnalyzeHealthResponse> {
  if (!OPENROUTER_API_KEY) {
    return {
      success: false,
      healthScore: 0,
      criticalAlerts: [],
      moduleInsights: {},
      weeklyActionPlan: [],
      crossModuleCorrelations: [],
      error: 'OPENROUTER_API_KEY is not configured. Set it in .env.local',
    };
  }

  const systemPrompt = buildHealthAnalysisPrompt(state);

  try {
    const response = await fetch(
      `${API_CONFIG.openRouterBaseUrl}/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'AI Health Companion',
        },
        body: JSON.stringify({
          model: API_CONFIG.model,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert AI Health Advisor. Always respond with valid JSON only. No markdown, no extra text.',
            },
            {
              role: 'user',
              content: systemPrompt,
            },
          ],
          max_tokens: API_CONFIG.maxTokens,
          temperature: API_CONFIG.temperature,
          response_format: { type: 'json_object' },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        healthScore: 0,
        criticalAlerts: [],
        moduleInsights: {},
        weeklyActionPlan: [],
        crossModuleCorrelations: [],
        error: `API error ${response.status}: ${JSON.stringify(errorData)}`,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        healthScore: 0,
        criticalAlerts: [],
        moduleInsights: {},
        weeklyActionPlan: [],
        crossModuleCorrelations: [],
        error: 'No content in AI response',
      };
    }

    // Parse JSON from the response (handle potential markdown wrapping)
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    } catch {
      return {
        success: false,
        healthScore: 0,
        criticalAlerts: [],
        moduleInsights: {},
        weeklyActionPlan: [],
        crossModuleCorrelations: [],
        rawAIResponse: content,
        error: 'Failed to parse AI response as JSON',
      };
    }

    return {
      success: true,
      healthScore: parsed.healthScore || 50,
      criticalAlerts: parsed.criticalAlerts || [],
      moduleInsights: parsed.moduleInsights || {},
      weeklyActionPlan: parsed.weeklyActionPlan || [],
      crossModuleCorrelations: parsed.crossModuleCorrelations || [],
      rawAIResponse: content,
    };
  } catch (error) {
    return {
      success: false,
      healthScore: 0,
      criticalAlerts: [],
      moduleInsights: {},
      weeklyActionPlan: [],
      crossModuleCorrelations: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
