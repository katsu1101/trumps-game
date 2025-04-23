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

  useEffect(() => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
      document.body.classList.add('android');
    }
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/trumps-game/service-worker.js');
    }
  }, []);

  return <GameLayout/>;
}
