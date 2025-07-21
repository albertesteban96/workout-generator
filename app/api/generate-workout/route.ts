import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const prompt = messages[messages.length - 1].content;

  const result = await streamText({
    model: openai('gpt-4o'),
    system: 'You are a fitness expert creating personalized workout plans. Provide clear, concise, and safe workout routines in markdown format.',
    prompt,
  });

  return result.toUIMessageStreamResponse();
}
