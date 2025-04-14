"use client"

import { useGameStore } from '@/stores/gameStore';
import {AnimatePresence} from "framer-motion";
import {useMemo}        from "react";
import Card from './Card';

export default function PlayerArea() {
  const allCards = useGameStore(state => state.cards);
  const playerCards = useMemo(
    () => allCards.filter(card => card.location === 'player'),
    [allCards]
  );

  return (
    <div className="flex flex-col items-center h-full border border-dashed border-white rounded">
      <p className="text-lg mb-2">🧑 プレイヤー</p>
      <div className="flex gap-2 flex-wrap justify-center">
        <AnimatePresence mode="popLayout">
        {playerCards.map(card => (
          <Card key={card.id} card={card} />
        ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
