import AISearchInterface from '@/components/ai/AISearchInterface';
import TTSDebugPanel from '@/components/ai/TTSDebugPanel';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Search | Xacres',
  description: 'Search land naturally in plain English.',
};

export default function AIPage() {
  return (
    <main className="min-h-screen bg-white">
      <AISearchInterface />
      <TTSDebugPanel />
    </main>
  );
}
