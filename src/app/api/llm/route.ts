import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LLMResponse } from '@/types';

// This would typically use OpenAI or another LLM service
async function analyzeMemo(content: string): Promise<LLMResponse> {
  // TODO: Replace with actual OpenAI API call
  // For now, return mock data based on content
  const keywords = content
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 4)
    .slice(0, 5);

  return {
    summary: `Analysis of memo containing ${content.length} characters.`,
    keywords: keywords,
    suggestions: [
      'Consider expanding on key concepts',
      'Add relevant examples or use cases',
      'Link to related topics or resources',
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeMemo(content);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('LLM API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
