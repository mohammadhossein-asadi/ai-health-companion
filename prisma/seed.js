const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const demoEmail = 'demo@health.app';
  const existing = await prisma.user.findUnique({ where: { email: demoEmail } });

  if (existing) {
    console.log('Demo user already exists, skipping seed.');
    return;
  }

  const passwordHash = await bcrypt.hash('demo123', 10);

  const user = await prisma.user.create({
    data: {
      email: demoEmail,
      name: 'Demo User',
      passwordHash,
      healthData: {
        create: {
          sleepJson: JSON.stringify([
            { id: 's1', date: '2026-07-09', sleepTime: '2026-07-09T23:15:00', wakeTime: '2026-07-10T07:00:00', durationMinutes: 465, quality: 4, remEstimateMinutes: 90, deepEstimateMinutes: 120, awakenings: 1, daytimeFatigue: 2 },
            { id: 's2', date: '2026-07-08', sleepTime: '2026-07-08T00:30:00', wakeTime: '2026-07-08T06:45:00', durationMinutes: 375, quality: 2, remEstimateMinutes: 60, deepEstimateMinutes: 80, awakenings: 3, daytimeFatigue: 4 },
          ]),
          exerciseJson: JSON.stringify([
            { id: 'e1', date: '2026-07-10', type: 'running', durationMinutes: 35, intensity: 'vigorous', caloriesBurned: 420, steps: 0, heartRateAvg: 155 },
          ]),
          skinJson: JSON.stringify([
            { id: 'sk1', date: '2026-07-10', skinType: 'combination', activeConcerns: ['acne'], routineFollowed: true, productsUsed: ['Cleanser'], climateCondition: 'humid' },
          ]),
          hairJson: JSON.stringify([
            { id: 'h1', date: '2026-07-10', hairType: 'wavy', scalpType: 'oily', hairLossCount: 'mild', washingFrequency: 3, productsUsed: ['Shampoo'] },
          ]),
          nutritionJson: JSON.stringify([
            { id: 'n1', date: '2026-07-10', mealType: 'breakfast', mealTime: '08:00', description: 'Oatmeal', calories: 350, macros: { proteinGrams: 12, carbsGrams: 55, fatGrams: 10, fiberGrams: 8 }, rating: 4 },
          ]),
          supplementsJson: JSON.stringify({ activeSupplements: [{ id: 'sup1', name: 'Vitamin D3', dosage: '2000 IU', frequency: 'daily', timeOfDay: 'morning', startDate: '2026-06-10' }], logs: [], adherenceRate: 83, supplementScore: 75 }),
          waterJson: JSON.stringify([{ id: 'w1', date: '2026-07-10', time: '07:30', amountMl: 500, type: 'water' }]),
          bloodTestJson: JSON.stringify([{ id: 'bt1', date: '2026-06-26', testType: 'Complete Blood Panel', biomarkers: [{ name: 'Vitamin D', value: 22, unit: 'ng/mL', normalRangeMin: 30, normalRangeMax: 100, status: 'low' }, { name: 'Ferritin', value: 25, unit: 'ng/mL', normalRangeMin: 30, normalRangeMax: 400, status: 'low' }] }]),
          bmiJson: JSON.stringify([{ id: 'bmi1', date: '2026-07-10', heightCm: 175, weightKg: 74, bmi: 24.2, category: 'normal' }]),
          caloriesJson: JSON.stringify([{ id: 'c1', date: '2026-07-10', bmr: 1720, activeCalories: 420, consumedCalories: 1470, netBalance: -670 }]),
          lastInsightJson: '{}',
          profileName: 'Demo User',
          profileAge: 28,
          profileGender: 'male',
          profileDob: '1998-05-15',
        },
      },
    },
    include: { healthData: true },
  });

  console.log(`Seeded demo user: ${user.email} (id: ${user.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
