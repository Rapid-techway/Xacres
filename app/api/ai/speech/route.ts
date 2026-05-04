import { experimental_generateSpeech as generateSpeech, APICallError } from 'ai';
import { elevenlabs } from '@ai-sdk/elevenlabs';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response('Text is required', { status: 400 });
    }

    const { audio } = await generateSpeech({
      model: elevenlabs.speech('eleven_multilingual_v2'),
      text,
      voice: 'JBFqnCBsd6RMkjVDRZzb', // George (Supports Hindi & Free Plan API)
    });

    // Convert to Buffer to avoid TS SharedArrayBuffer issues in some environments
    return new Response(Buffer.from(audio.uint8Array), {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('TTS API Error:', error);
    
    if (APICallError.isInstance(error)) {
      return new Response(JSON.stringify({ 
        error: 'AI SDK API Call Error', 
        message: error.message,
        statusCode: error.statusCode 
      }), { status: error.statusCode || 500 });
    }

    return new Response(JSON.stringify({ 
      error: 'Internal Server Error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }), { status: 500 });
  }
}
