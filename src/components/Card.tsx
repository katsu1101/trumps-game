'use client';

import {Card as CardType} from '@/types/card';
import {suitLayouts}      from '@/utils/suitLayouts';
import {clsx}             from 'clsx';
import {motion}           from 'framer-motion';
import Image              from 'next/image';
import {CSSProperties}    from "react";

type Props = {
  card: CardType;
  className?: string;
  style?: CSSProperties;
  animate?: { rotate: number; };
};

export default function Card({card, className, style, animate}: Props) {
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
      className={clsx(
        "bg-white border rounded shadow-sm",
        "w-[15vw] aspect-[0.7] min-w-[30px] max-w-[50px]",
        "flex-shrink-0",
        className
      )}
      style={style}
      animate={animate}
    >
      {card.isFaceUp ? (
        <>
          {/* 背景画像 */}
          {(card.suit === 'diamond' || card.suit === 'heart')
            && ['A', 'J', 'Q', 'K'].includes(card.rank) && (
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/img/${card.suit}_${card.rank}.png`}
                alt=""
                width={100}
                height={100}
                className="absolute left-0 right-0 mx-auto h-auto max-h-full object-contain"
                style={{top: '50%', transform: 'translateY(-50%)'}}
              />
            )}

          {/* 左上マーク */}
          <div className={`absolute top-[5%] left-[5%] leading-none flex flex-col ${color}`}>
        <span
          className={clsx(
            "font-bold text-[0.8em]",
            card.rank === '10' && '-translate-x-[0.2em]'
          )}
        >
          {card.rank}
        </span>
            <span className="text-[0.7em]">{suitMap[card.suit]}</span>
          </div>

          {/* 右下・逆さマーク */}
          <div className={`absolute bottom-[5%] right-[5%] leading-none flex flex-col ${color} rotate-180`}>
        <span
          className={clsx(
            "font-bold text-[0.8em]",
            card.rank === '10' && '-translate-x-[0.2em]'
          )}
        >
          {card.rank}
        </span>
            <span className="text-[0.7em]">{suitMap[card.suit]}</span>
          </div>

          {/* 中央マーク（2〜10） */}
          {isNumberCard && suitLayouts[rankNumber] && (
            <div className="absolute inset-0">
              {suitLayouts[rankNumber].map((pos, i) => (
                <span
                  key={i}
                  className={clsx(
                    rankNumber === 1 ? "text-[1.8em]" : "text-[1.2em]",
                    `absolute ${color} card-font`,
                    "w-4 h-4 rounded-full bg-white/60",
                    "flex items-center justify-center",
                  )}
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
        <div className="bg-blue-900 w-full h-full rounded"/>
      )}
    </motion.div>
  );
}
