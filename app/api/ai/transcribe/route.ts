import { experimental_transcribe as transcribe } from 'ai';
import { elevenlabs } from '@ai-sdk/elevenlabs';

export async function POST(req: Request) {
  const formData = await req.formData();
  const audioFile = formData.get('audio') as File;

  if (!audioFile) {
    return new Response('No audio file provided', { status: 400 });
  }

  const arrayBuffer = await audioFile.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // Transcribe using ElevenLabs
  const { text } = await transcribe({
    model: elevenlabs.transcription('scribe_v1'),
    audio: uint8Array,
  });

  return Response.json({ text });
}
