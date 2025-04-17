'use client';

import {useGameStore}    from '@/stores/gameStore';
import {AnimatePresence} from 'framer-motion';
import Card              from './Card';

export default function GameDemo() {
  const cards = useGameStore(state => state.cards);
  const drawCard = useGameStore(state => state.drawCard);

  const deckCard = cards.find(c => c.location === 'deck');
  const playerCards = cards.filter(c => c.location === 'player');

  return (
    <div className="flex flex-col gap-4 items-center h-screen bg-green-800 text-white p-4">
      <h1 className="text-xl font-bold">カード移動デモ</h1>

      {/* 山札 */}
      <div className="flex flex-col items-center gap-1">
        <p>山札</p>
        <div className="h-[70px]">
          <AnimatePresence mode="popLayout">
            {deckCard && <Card card={deckCard}/>}
          </AnimatePresence>
        </div>
      </div>

      {/* ボタン */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={drawCard}
      >
        山札から1枚引く
      </button>

      {/* プレイヤー手札 */}
      <div className="flex flex-col items-center gap-1">
        <p>プレイヤー手札</p>
        <div className="flex gap-2 min-h-[70px]">
          <AnimatePresence mode="popLayout">
            {playerCards.map(card => (
              <Card key={card.id} card={card}/>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
