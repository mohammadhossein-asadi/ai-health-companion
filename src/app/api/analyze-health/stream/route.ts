import { NextRequest } from 'next/server';
import { buildHealthAnalysisPrompt } from '@/lib/ai-analysis';
import { HealthAppState } from '@/types';
import { API_CONFIG } from '@/constants';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

export async function POST(request: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({ success: false, error: 'OPENROUTER_API_KEY not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const body = await request.json();
  const { userData } = body as { userData: HealthAppState };

  if (!userData) {
    return new Response(
      JSON.stringify({ success: false, error: 'userData is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const prompt = buildHealthAnalysisPrompt(userData);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch(`${API_CONFIG.openRouterBaseUrl}/chat/completions`, {
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
                content: 'You are an expert AI Health Advisor. Always respond with valid JSON only. No markdown, no extra text.',
              },
              { role: 'user', content: prompt },
            ],
            max_tokens: API_CONFIG.maxTokens,
            temperature: API_CONFIG.temperature,
            stream: true,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ success: false, error: `API ${response.status}: ${errText}` })}\n\n`));
          controller.close();
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ success: false, error: 'No response body' })}\n\n`));
          controller.close();
          return;
        }

        let fullContent = '';
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                fullContent += delta;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: delta })}\n\n`));
              }
            } catch {
              // skip malformed chunks
            }
          }
        }

        // Parse final JSON result
        let result;
        try {
          const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
          result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(fullContent);
        } catch {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'Failed to parse AI response' })}\n\n`));
          controller.close();
          return;
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'complete',
          success: true,
          healthScore: result.healthScore || 50,
          criticalAlerts: result.criticalAlerts || [],
          moduleInsights: result.moduleInsights || {},
          weeklyActionPlan: result.weeklyActionPlan || [],
          crossModuleCorrelations: result.crossModuleCorrelations || [],
        })}\n\n`));

        controller.close();
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: err instanceof Error ? err.message : 'Unknown error' })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
