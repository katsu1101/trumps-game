// components/DemoNotice.tsx
'use client'

import {useGameStore} from '@/stores/gameStore';
import {useEffect}    from 'react';

export default function DemoNotice() {
  const phase = useGameStore(state => state.phase);
  const setPhase = useGameStore(state => state.setPhase);

  useEffect(() => {
    if (phase !== 'demo') return;

    const handleUserAction = () => setPhase('title', null);

    window.addEventListener('keydown', handleUserAction);
    window.addEventListener('mousedown', handleUserAction);

    return () => {
      window.removeEventListener('keydown', handleUserAction);
      window.removeEventListener('mousedown', handleUserAction);
    };
  }, [phase, setPhase]);

  if (phase !== 'demo') return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-50">
      <div className="text-white text-xl text-center animate-pulse bg-black/50 px-4 py-2 rounded shadow-md">
        デモ中です（キーを押すとタイトルへ戻ります）
      </div>
    </div>
  );
}
