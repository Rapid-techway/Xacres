'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Heart, List, MapPin, Download, X, Share, PlusSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { useMounted } from '@/hooks/useMounted';

interface FloatingTogglerProps {
  show?: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function FloatingToggler({ show = true }: FloatingTogglerProps) {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const mounted = useMounted();

  const isStandalone = useSyncExternalStore(
    () => () => {},
    () => window.matchMedia('(display-mode: standalone)').matches,
    () => false
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    } else {
      setShowInstructions(true);
    }
  };

  const isMapPage = pathname === '/';
  const isSavedPage = pathname === '/saved';

  const toggleHref = isMapPage ? '/lands' : '/';
  const toggleText = isMapPage ? 'Show list' : 'Show map';
  const ToggleIcon = isMapPage ? List : MapPin;

  if (!mounted) return null;

  return (
    <>
      {/* PWA Instruction Overlay */}
      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[28px] p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowInstructions(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 flex items-center justify-center text-stone-500 hover:text-stone-700 dark:text-stone-400 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Download size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-950 dark:text-white">Install Xacres App</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Get quick access and a full-screen experience on your device.
                  </p>
                </div>

                <div className="w-full text-left space-y-3.5 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-400 shrink-0">
                      1
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">
                      For <strong className="font-semibold text-stone-850 dark:text-white">iOS Safari</strong>, tap the{' '}
                      <span className="inline-flex items-center gap-0.5 font-semibold text-blue-600 dark:text-blue-400">
                        <Share size={12} className="inline" /> share
                      </span>{' '}
                      button at the bottom.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-400 shrink-0">
                      2
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">
                      Scroll down and tap{' '}
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                        <PlusSquare size={12} className="inline" /> Add to Home Screen
                      </span>.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 border-t border-stone-100 dark:border-stone-800/80 pt-3">
                    <div className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-400 shrink-0">
                      3
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">
                      For <strong className="font-semibold text-stone-850 dark:text-white">Chrome / Edge</strong>, click the browser menu (three dots) and select{' '}
                      <span className="font-semibold text-blue-600 dark:text-blue-400">Install app</span> or <span className="font-semibold text-blue-600 dark:text-blue-400">Add to home screen</span>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full bg-stone-900 hover:bg-black dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 py-3 rounded-2xl text-xs font-bold transition-all active:scale-98 shadow-md mt-2"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-4 left-1/2 z-40 select-none pointer-events-auto"
          >
            {/* Mobile Layout: Combined Pill Bar */}
            <div 
              className={`flex md:hidden items-center gap-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-stone-200/40 dark:border-stone-800 p-2 rounded-full shadow-[0_10px_32px_rgba(0,0,0,0.12)] transition-all duration-300 w-[92dvw] ${
                !isStandalone ? 'max-w-[330px]' : 'max-w-[240px]'
              }`}
            >
              {/* Main Map/List Toggle Button (Left side, takes maximum space as a black pill) */}
              <Link
                href={toggleHref}
                className="flex items-center justify-center gap-1.5 bg-stone-950 hover:bg-black dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 h-11 px-4.5 rounded-full shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] font-bold text-[13.5px] flex-[1.8] min-w-0"
              >
                <ToggleIcon size={15} className="shrink-0" />
                <span className="truncate">{toggleText}</span>
              </Link>

              {/* Saved Button (Middle, vertical layout) */}
              <Link
                href="/saved"
                className={`flex flex-col items-center justify-center gap-0.5 py-0.5 shrink-0 flex-1 transition-all active:scale-95 ${
                  isSavedPage
                    ? 'text-red-500'
                    : 'text-stone-500 hover:text-stone-850 dark:text-stone-400 dark:hover:text-stone-200'
                }`}
                title="Saved Properties"
              >
                <Heart size={18} className={isSavedPage ? 'fill-red-500 text-red-500' : ''} />
                <span className="text-[10px] font-bold tracking-tight">Saved</span>
              </Link>

              {/* PWA Download Button (Right side, vertical layout, conditionally visible) */}
              {!isStandalone && (
                <button
                  onClick={handleInstallClick}
                  className={`flex flex-col items-center justify-center gap-0.5 py-0.5 shrink-0 flex-1 transition-all active:scale-95 ${
                    isInstallable
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-stone-500 hover:text-stone-850 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                  title="Install App"
                >
                  <Download size={18} className={isInstallable ? 'animate-pulse' : ''} />
                  <span className="text-[10px] font-bold tracking-tight">App</span>
                </button>
              )}
            </div>

            {/* Desktop Layout: Simple Toggle Button */}
            <div className="hidden md:block">
              <Link
                href={toggleHref}
                className="flex items-center gap-2 bg-stone-900 hover:bg-black text-white px-5 py-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95 font-bold text-[14px] whitespace-nowrap"
              >
                <span>{toggleText}</span>
                <ToggleIcon size={18} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
