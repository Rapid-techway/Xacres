'use client';

import { useState, useRef } from 'react';
import { Volume2, Play, Loader2, AlertCircle, X } from 'lucide-react';

export default function TTSDebugPanel() {
  const [text, setText] = useState('Hello, testing ElevenLabs voice output.');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTestTTS = async () => {
    if (!text.trim()) return;
    
    setStatus('loading');
    setErrorMessage('');

    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const response = await fetch('/api/ai/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || response.statusText || 'Failed to generate speech');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onended = () => setStatus('idle');
      audio.onerror = () => {
        setStatus('error');
        setErrorMessage('Audio playback error');
      };

      await audio.play();
      setStatus('success');
    } catch (err) {
      console.error("TTS Debug Error:", err);
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-all z-50 flex items-center gap-2 group"
      >
        <Volume2 className="w-5 h-5" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-sm font-medium">
          TTS Debug
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-slate-300" />
          <span className="text-white text-sm font-semibold">TTS Debugger</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Test Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
            placeholder="Type something to hear it..."
          />
        </div>

        {status === 'error' && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="text-xs text-red-600 leading-tight font-medium">{errorMessage}</span>
          </div>
        )}

        {status === 'success' && (
          <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-100 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[11px] text-green-700 font-bold uppercase tracking-wider">Playing Audio...</span>
          </div>
        )}

        <button
          onClick={handleTestTTS}
          disabled={status === 'loading' || !text.trim()}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-sm active:scale-95"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Play Test Audio</span>
            </>
          )}
        </button>
        
        <p className="text-[10px] text-slate-400 text-center px-2">
          This hits <code className="bg-slate-100 px-1 rounded">/api/ai/speech</code> directly using the configured ElevenLabs voice.
        </p>
      </div>
    </div>
  );
}
