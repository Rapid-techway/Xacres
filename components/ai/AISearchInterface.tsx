'use client';

import { useChat } from '@ai-sdk/react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { DefaultChatTransport } from 'ai';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function AISearchInterface() {
  const [input, setInput] = useState('');
  const [isTTSMuted, setIsTTSMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/ai/chat' }),
  });

  const isSearching = status === 'submitted' || status === 'streaming';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  // TTS Output using ElevenLabs
  useEffect(() => {
    if (isTTSMuted) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && status !== 'streaming') {
      const textParts = lastMessage.parts
        .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map((p) => p.text)
        .join(' ');

      if (textParts) {
        handleSpeech(textParts);
      }
    }
  }, [messages, status, isTTSMuted]);

  const handleSpeech = async (text: string) => {
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
        console.error('TTS API failure:', errorData);
        throw new Error(`TTS failed: ${errorData.message || response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();
    } catch (err) {
      console.error("TTS error:", err);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSearching) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden relative font-sans">

      {/* Minimal Top Navigation */}
      <div className="flex justify-between items-center px-4 py-3 z-30 sticky top-0">
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="font-semibold text-[15px] text-slate-500 hover:text-slate-900 transition-colors">Xacres AI <span className="text-slate-300">1.0</span></span>
        </div>
        <button
          onClick={() => {
            setIsTTSMuted(!isTTSMuted);
            if (audioRef.current) {
              audioRef.current.pause();
            }
          }}
          className={`p-2 rounded-lg transition-all duration-300 ${isTTSMuted
              ? 'text-slate-300 hover:text-slate-500'
              : 'text-green-500 hover:bg-green-50'
            }`}
          title={isTTSMuted ? "Enable Voice Output" : "Mute Voice Output"}
        >
          {isTTSMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide relative z-10 flex flex-col">
        <div className="max-w-[48rem] mx-auto w-full px-4 flex-1 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center mt-[-10vh]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-sm mb-6"
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>
            </div>
          ) : (
            <div className="space-y-6 pt-2 pb-32">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </AnimatePresence>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* ChatGPT-style Bottom Fixed Input area */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-white via-white to-transparent pt-10">
        <div className="max-w-[48rem] mx-auto px-4 pb-2 md:pb-4 flex flex-col gap-2">

          {/* Suggestions - Only show when empty */}
          {messages.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full mb-2">
              {[
                "2 acre land in Hisar under 1 crore",
                "Agricultural land near Rohtak",
                "Show me properties in Jind",
                "Highway access land in Sonipat"
              ].map((suggestion, i) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-3 text-left rounded-xl bg-white border border-[#e5e5e5] text-[#666666] hover:bg-[#f9f9f9] transition-all text-[13px] font-medium"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          )}

          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={onSubmit}
            isSearching={isSearching}
          />
        </div>
      </div>
    </div>
  );
}
