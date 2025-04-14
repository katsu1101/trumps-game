'use client';

import { motion } from 'framer-motion';
import { Card as CardType } from '@/types/card';

type Props = {
  card: CardType;
};

export default function Card({ card }: Props) {
  const suitMap = {
    spade: '♠',
    heart: '♥',
    diamond: '♦',
    club: '♣',
  };
  const isRed = card.suit === 'heart' || card.suit === 'diamond';
  const color = isRed ? 'text-red-500' : 'text-black';

  return (
    <motion.div
      layout
      layoutId={card.id}
      className="w-12 h-16 border rounded flex items-center justify-center text-sm bg-white"
    >
      {card.isFaceUp ? (
        <span className={color}>
          {suitMap[card.suit]}{card.rank}
        </span>
      ) : (
        <div className="bg-blue-900 w-full h-full rounded" />
      )}
    </motion.div>
  );
}
