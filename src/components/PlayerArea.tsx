'use client';

import {useGameStore}    from '@/stores/gameStore';
import {useMemo}         from 'react';
import OverlappedCardRow from './OverlappedCardRow';

export default function PlayerArea() {
  const allCards = useGameStore(state => state.cards);
  const currentTurnIndex = useGameStore(state => state.currentTurnIndex); // ✅ 追加
  const passCountMap = useGameStore(state => state.passCountMap)
  const playerCards = useMemo(
    () => allCards.filter(card => card.location === 'player'),
    [allCards]
  );

  const isActive = currentTurnIndex === 0; // ✅ プレイヤーのターン判定

  return (
    <div className="flex justify-between items-center h-full">
      <div className="flex flex-col items-center gap-1 landscape:w-[20vw]"/>
      <OverlappedCardRow
        cards={playerCards} label="🧑 プレイヤー" isCompact={false} isActive={isActive}
        passCount={passCountMap['player'] ?? 0}
        passLimit={3}
      />
      <div className="flex flex-col items-center gap-1 landscape:w-[20vw]"/>
    </div>
  );
}
