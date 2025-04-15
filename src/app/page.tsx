'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import GameLayout from '@/components/GameLayout';

export default function HomePage() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      useGameStore.getState().startGame('auto'); // 'instant' に変えれば即配布
      initialized.current = true;
    }
  }, []);

  return <GameLayout />;
}
