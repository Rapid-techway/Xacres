import { useState, useRef } from 'react';
import { Send, Loader2, Mic, MicOff, AlertCircle } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSearching: boolean;
}

export default function ChatInput({ input, setInput, onSubmit, isSearching }: ChatInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await handleTranscribe(audioBlob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      setErrorMsg(null);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      setErrorMsg("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const handleTranscribe = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.wav');

      const response = await fetch('/api/ai/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Transcription failed');

      const data = await response.json();
      if (data.text) {
        setInput(data.text);
      }
    } catch (err) {
      console.error("Transcription error:", err);
      setErrorMsg("Failed to transcribe audio.");
    }
  };

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="bg-transparent">
      <form onSubmit={onSubmit} className="relative group">
        <div className={`relative flex items-center w-full min-h-[52px] rounded-[1.5rem] bg-[#f4f4f4] border transition-all duration-300 ${
          isListening 
            ? 'border-green-400 ring-2 ring-green-500/20' 
            : 'border-transparent focus-within:bg-white focus-within:border-[#e5e5e5] focus-within:shadow-[0_0_15px_rgba(0,0,0,0.05)]'
        }`}>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Message Xacres AI"}
            className="flex-1 bg-transparent pl-5 pr-2 py-3.5 text-[15px] outline-none text-slate-800 placeholder:text-slate-500"
          />
          
          <div className="flex items-center gap-1.5 pr-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-1.5 rounded-full transition-all duration-300 flex items-center justify-center w-8 h-8 ${
                isListening 
                  ? 'bg-green-500 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-[#e5e5e5]'
              }`}
              title="Voice Search"
            >
              {isListening ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            
            <button 
              type="submit"
              disabled={isSearching || !input.trim() || isListening}
              className={`p-1.5 rounded-full transition-all duration-300 flex items-center justify-center w-8 h-8 ${
                !input.trim() || isSearching || isListening
                  ? 'bg-[#e5e5e5] text-white opacity-60'
                  : 'bg-black text-white hover:opacity-80 shadow-sm'
              }`}
              title="Send"
            >
              {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} className="ml-0.5" />}
            </button>
          </div>
        </div>
        
        <div className="flex justify-center mt-1.5 px-4">
          {errorMsg ? (
            <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle size={12} /> {errorMsg}
            </p>
          ) : (
            <p className="text-[11px] text-[#666666]">
              Xacres AI can make mistakes. Consider verifying land details.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
