'use client';

import {CSSProperties} from "react";
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

import { Card as CardType } from '@/types/card';
import { suitLayouts } from '@/utils/suitLayouts';

type Props = {
  card: CardType;
  className?: string;
  style?: CSSProperties;
};

export default function Card({ card, className, style }: Props) {
  const suitMap = {
    spade: '♠',
    heart: '♥',
    diamond: '♦',
    club: '♣',
  };

  const isRed = card.suit === 'heart' || card.suit === 'diamond';
  const color = isRed ? 'text-red-500' : 'text-black';

  const rankNumber = (card.rank == 'A') ? 1 : parseInt(card.rank); // '2'～'10'の数値として扱う
  const isNumberCard = !isNaN(rankNumber) && rankNumber >= 1 && rankNumber <= 10;

  return (
    <motion.div
      layout
      layoutId={card.id}
      className={
        clsx(
          "w-12 h-[72px] border rounded bg-white shadow-sm",
          className
        )
      }
      style={style}
    >
      {card.isFaceUp ? (
        <>
          {/* 背景画像（spade Q のときだけ） */}
          {(card.suit === 'diamond' || card.suit === 'heart') &&
            (card.rank === 'A' || card.rank === 'J' || card.rank === 'Q' || card.rank === 'K') && <img

            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/img/${card.suit}_${card.rank}.png`}
            alt=""
            className="absolute left-0 right-0 mx-auto h-auto max-h-full object-contain"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          />}

          {/* 左上マーク */}
          <div className={`absolute top-1 left-1 leading-none flex flex-col ${color}`}>
            <span
              className={`font-bold text-[13px] ${
                card.rank === '10' ? '-translate-x-[5px]' : ''
              }`}
            >
              {card.rank}
            </span>
            <span className="text-[12px]">{suitMap[card.suit]}</span>
          </div>

          {/* 右下・逆さマーク */}
          <div className={`absolute bottom-1 right-1 leading-none flex flex-col ${color} rotate-180`}>
            <span
              className={`font-bold text-[13px] ${
                card.rank === '10' ? '-translate-x-[5px]' : ''
              }`}
            >
              {card.rank}
            </span>
            <span className="text-[12px]">{suitMap[card.suit]}</span>
          </div>

          {/* 中央：2～10のみマークを複数配置 */}
          {isNumberCard && suitLayouts[rankNumber] && (
            <div className="absolute inset-0">
              {suitLayouts[rankNumber].map((pos, i) => (
                <span
                  key={i}
                  className={
                    clsx(rankNumber == 1 ? "text-[28px]" : "text-[15px]",
                      `absolute ${color}`)}
                  style={{
                    top: pos.top,
                    left: pos.left,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {suitMap[card.suit]}
                </span>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-blue-900 w-full h-full rounded" />
      )}
    </motion.div>
  );
}
