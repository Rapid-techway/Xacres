import React from 'react';
import { Sparkles } from 'lucide-react';
import { aiService } from '@/services/ai.service';

interface CopyAiPromptButtonProps {
  getLandData: () => Record<string, unknown>;
  onSuccess: (message: string) => void;
}

export default function CopyAiPromptButton({ getLandData, onSuccess }: CopyAiPromptButtonProps) {
  const handleCopy = async () => {
    try {
      const landData = getLandData();
      const prompt = aiService.buildDescriptionPrompt(landData);
      
      await navigator.clipboard.writeText(prompt);
      onSuccess("AI description prompt copied to clipboard");
    } catch (err) {
      console.error("Failed to copy AI prompt to clipboard:", err);
      alert("Failed to copy to clipboard. Please select the prompt manually.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-full transition-all shadow-sm uppercase tracking-wider h-8 select-none cursor-pointer"
    >
      <Sparkles size={11} className="text-amber-500 fill-amber-500 animate-pulse" />
      <span>Copy AI Prompt</span>
    </button>
  );
}
