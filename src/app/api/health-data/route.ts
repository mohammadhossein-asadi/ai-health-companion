import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET: Fetch user's health data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const data = await prisma.healthData.findUnique({ where: { userId } });

    if (!data) {
      return NextResponse.json({ error: 'No health data found' }, { status: 404 });
    }

    const safeJson = (str: string, fallback: any = []) => {
      try { return JSON.parse(str); } catch { return fallback; }
    };

    return NextResponse.json({
      sleep: safeJson(data.sleepJson),
      exercise: safeJson(data.exerciseJson),
      skin: safeJson(data.skinJson),
      hair: safeJson(data.hairJson),
      nutrition: safeJson(data.nutritionJson),
      supplements: safeJson(data.supplementsJson, {}),
      water: safeJson(data.waterJson),
      bloodTest: safeJson(data.bloodTestJson),
      bmi: safeJson(data.bmiJson),
      calories: safeJson(data.caloriesJson),
      lastInsight: safeJson(data.lastInsightJson, {}),
      profile: {
        name: data.profileName,
        age: data.profileAge,
        gender: data.profileGender,
        dateOfBirth: data.profileDob,
      },
      settings: {
        language: data.language,
        theme: data.theme,
        sleepGoalHours: data.sleepGoalHours,
        exerciseStepGoal: data.exerciseStepGoal,
        exerciseWorkoutGoal: data.exerciseWorkoutGoal,
        waterDailyTargetMl: data.waterDailyTargetMl,
        nutritionCalorieTarget: data.nutritionCalorieTarget,
        dailyCalorieTarget: data.dailyCalorieTarget,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update user's health data
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    const updateData: Record<string, any> = {};

    if (body.sleep !== undefined) updateData.sleepJson = JSON.stringify(body.sleep);
    if (body.exercise !== undefined) updateData.exerciseJson = JSON.stringify(body.exercise);
    if (body.skin !== undefined) updateData.skinJson = JSON.stringify(body.skin);
    if (body.hair !== undefined) updateData.hairJson = JSON.stringify(body.hair);
    if (body.nutrition !== undefined) updateData.nutritionJson = JSON.stringify(body.nutrition);
    if (body.supplements !== undefined) updateData.supplementsJson = JSON.stringify(body.supplements);
    if (body.water !== undefined) updateData.waterJson = JSON.stringify(body.water);
    if (body.bloodTest !== undefined) updateData.bloodTestJson = JSON.stringify(body.bloodTest);
    if (body.bmi !== undefined) updateData.bmiJson = JSON.stringify(body.bmi);
    if (body.calories !== undefined) updateData.caloriesJson = JSON.stringify(body.calories);
    if (body.lastInsight !== undefined) updateData.lastInsightJson = JSON.stringify(body.lastInsight);

    if (body.profile) {
      if (body.profile.name !== undefined) updateData.profileName = body.profile.name;
      if (body.profile.age !== undefined) updateData.profileAge = body.profile.age;
      if (body.profile.gender !== undefined) updateData.profileGender = body.profile.gender;
      if (body.profile.dateOfBirth !== undefined) updateData.profileDob = body.profile.dateOfBirth;
    }

    if (body.settings) {
      if (body.settings.language !== undefined) updateData.language = body.settings.language;
      if (body.settings.theme !== undefined) updateData.theme = body.settings.theme;
      if (body.settings.sleepGoalHours !== undefined) updateData.sleepGoalHours = body.settings.sleepGoalHours;
      if (body.settings.exerciseStepGoal !== undefined) updateData.exerciseStepGoal = body.settings.exerciseStepGoal;
      if (body.settings.exerciseWorkoutGoal !== undefined) updateData.exerciseWorkoutGoal = body.settings.exerciseWorkoutGoal;
      if (body.settings.waterDailyTargetMl !== undefined) updateData.waterDailyTargetMl = body.settings.waterDailyTargetMl;
      if (body.settings.nutritionCalorieTarget !== undefined) updateData.nutritionCalorieTarget = body.settings.nutritionCalorieTarget;
      if (body.settings.dailyCalorieTarget !== undefined) updateData.dailyCalorieTarget = body.settings.dailyCalorieTarget;
    }

    const updated = await prisma.healthData.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData,
      },
    });

    return NextResponse.json({ success: true, updatedAt: updated.updatedAt });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Partial update
export async function PATCH(request: NextRequest) {
  return PUT(request);
}
