'use client'

import Card                from "@/components/Card";
import {useGameStore}      from '@/stores/gameStore';
import {Card as CardType}  from "@/types/card";
import {motion}            from 'framer-motion';
import {useEffect, useRef} from 'react';

const demoCards: CardType[] = [
  {suit: 'diamond', rank: 'A', isFaceUp: true, id: 'diamond-A', location: 'deck'},
  {suit: 'heart', rank: 'A', isFaceUp: true, id: 'heart-A', location: 'deck'},
  {suit: 'diamond', rank: 'Q', isFaceUp: true, id: 'diamond-Q', location: 'deck'},
  {suit: 'heart', rank: 'Q', isFaceUp: true, id: 'heart-Q', location: 'deck'},
  {suit: 'heart', rank: 'J', isFaceUp: true, id: 'heart-J', location: 'deck'},
  {suit: 'diamond', rank: 'K', isFaceUp: true, id: 'diamond-K', location: 'deck'},
  {suit: 'heart', rank: 'K', isFaceUp: true, id: 'heart-K', location: 'deck'},
];

export default function TitleScreen() {
  const setPhase = useGameStore(state => state.setPhase);
  const playNextToDeck = useGameStore(state => state.playNextToDeck);
  const transitioned = useRef(false);

  useEffect(() => {
    const handleUserAction = () => {
      if (!transitioned.current) {
        transitioned.current = true;
        playNextToDeck()
        // ✅ パス回数リセット
        useGameStore.getState().resetPassCounts();

        setPhase('playing', 'dealing');
      }
    };

    const timeout = setTimeout(() => {
      if (!transitioned.current) {
        transitioned.current = true;
        // ✅ パス回数リセット
        useGameStore.getState().resetPassCounts();

        setPhase('demo', 'dealing');
      }
    }, 6000);

    window.addEventListener('keydown', handleUserAction);
    window.addEventListener('mousedown', handleUserAction);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('keydown', handleUserAction);
      window.removeEventListener('mousedown', handleUserAction);
    };
  }, [playNextToDeck, setPhase]);

  return (
    <div
      className="text-nowrap flex flex-col items-center justify-center h-screen bg-gradient-to-b from-rose-50 via-rose-100 to-rose-200 text-rose-900">
      {/* タイトル */}
      <motion.h1
        initial={{opacity: 0, y: -20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.8}}
        className="text-4xl font-bold mb-4 drop-shadow-md"
      >
        ♥ とじょりん 7ならべ ♥
      </motion.h1>

      <div className="flex justify-center items-end gap-6 mt-8">
        {demoCards.map((card, index) => (
          <motion.div
            key={card.id}
            animate={{
              rotate: [-5, 5, -5],
              y: [0, -4, 0],
            }}
            transition={{
              duration: 2 + index * 0.01,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Card card={card} className="scale-150"/>
          </motion.div>
        ))}
      </div>

      {/* スタート促し文言 */}
      <p className="mt-10 text-base animate-pulse bg-white/30 text-rose-900 px-4 py-2 rounded shadow-sm">
        クリックまたはキーを押すと開始します
      </p>
    </div>
  );
}
