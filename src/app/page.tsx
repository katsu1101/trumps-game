'use client';

import GameLayout          from '@/components/GameLayout';
import {useGameStore}      from '@/stores/gameStore';
import {useEffect, useRef} from 'react';

export default function HomePage() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      useGameStore.getState().startGame(); // 'instant' に変えれば即配布
      initialized.current = true;
    }
  }, []);

  return <GameLayout/>;
}
