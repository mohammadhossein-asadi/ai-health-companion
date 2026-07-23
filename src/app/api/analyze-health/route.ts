import { NextRequest, NextResponse } from 'next/server';
import { analyzeHealthData } from '@/lib/ai-analysis';
import { HealthAppState } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userData } = body as { userData: HealthAppState };

    if (!userData) {
      return NextResponse.json(
        {
          success: false,
          error: 'userData is required in request body',
        },
        { status: 400 }
      );
    }

    const result = await analyzeHealthData(userData);

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    model: 'z-ai/glm-5.2',
    endpoint: '/api/analyze-health',
    method: 'POST',
    body: '{ userData: HealthAppState }',
  });
}
