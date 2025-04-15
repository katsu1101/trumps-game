'use client';

import {useGameStore}    from '@/stores/gameStore';
import {useMemo}         from 'react';
import OverlappedCardRow from './OverlappedCardRow';

export default function PlayerArea() {
  const allCards = useGameStore(state => state.cards);
  const playerCards = useMemo(
    () => allCards.filter(card => card.location === 'player'),
    [allCards]
  );

  return (
    <div className="flex justify-between items-center h-full">
      <div className="flex flex-col items-center gap-1 w-100" />
      <OverlappedCardRow cards={playerCards} label="🧑 プレイヤー"/>
      <div className="flex flex-col items-center gap-1 w-100" />
    </div>
  );
}
