import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Land } from '@/lib/types';
import LandCard from '@/components/common/LandCard';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'data';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parts: any[];
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full group`}
    >
      <div className={`flex gap-3 w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center mt-1 shadow-sm">
            <Sparkles size={14} className="text-[#0d0d0d]" />
          </div>
        )}

        <div className={`flex flex-col gap-2 ${isUser ? 'items-end max-w-[75%]' : 'max-w-[90%]'}`}>
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              return (
                <div
                  key={index}
                  className={`text-[16px] leading-[1.6] ${isUser
                      ? 'bg-[#f4f4f4] text-[#0d0d0d] px-5 py-2.5 rounded-[1.25rem]'
                      : 'text-[#0d0d0d] font-normal pt-1'
                    }`}
                >
                  {part.text}
                </div>
              );
            }

            if (part.type === 'tool-getLands') {
              if (part.state === 'input-streaming' || part.state === 'input-available') {
                return (
                  <div key={part.toolCallId} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 text-[12px] w-fit font-bold uppercase tracking-wider animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin text-green-500" />
                    <span>Analyzing Land Database...</span>
                  </div>
                );
              }

              if (part.state === 'output-available') {
                const toolResult = part.output as { success: boolean; lands: Land[] };
                return (
                  <div key={part.toolCallId} className="w-full pt-4 pb-6">
                    {toolResult?.success && toolResult.lands?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {toolResult.lands.map((land) => (
                          <motion.div
                            key={land.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <LandCard land={land} />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 italic text-sm">
                        No lands found matching your criteria. Try adjusting the filters.
                      </div>
                    )}
                  </div>
                );
              }
            }
            return null;
          })}
        </div>
      </div>
    </motion.div>
  );
}
