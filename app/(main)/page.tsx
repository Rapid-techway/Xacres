import MapView from '@/components/map/MapView';
import FloatingToggler from '@/components/common/FloatingToggler';

export default function Home() {
  return (
    <main className="w-full h-[100dvh] overflow-hidden relative">
      <MapView />
      
      {/* Floating Action / View Switcher */}
      <FloatingToggler />
    </main>
  );
}
