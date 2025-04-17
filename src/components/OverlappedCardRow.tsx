'use client';

import type {Card as CardType}                from '@/types/card';
import {clsx}                                 from "clsx";
import {AnimatePresence}                      from 'framer-motion';
import {useEffect, useMemo, useRef, useState} from 'react';
import Card                                   from './Card';

type Props = {
  cards: CardType[];
  label?: string;
  isCompact: boolean
  cardWidth?: number;
  maxWidth?: number;
};

export default function OverlappedCardRow({cards, label, isCompact = false, cardWidth = 80}: Props) {

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600); // 初期仮値

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth(); // 初期実行

    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const overlapStep = useMemo(() => {
    const totalWidth = cards.length * cardWidth;
    if (totalWidth <= containerWidth) return cardWidth;

    const maxOverlap = (containerWidth - cardWidth - 5) / (cards.length - 1);
    return Math.max(maxOverlap, 10); // 最小重なり幅
  }, [cards.length, cardWidth, containerWidth]);

  return (
    <div className="relative flex flex-col items-center h-full w-full border border-dashed pt-3 pl-3"
         ref={containerRef}>
      {label && (
        <div className="absolute z-50 bg-black/60 top-0 left-0 text-xs text-white px-1">
          {label}
        </div>
      )}
      <div
        className={clsx("relative overflow-hidden w-full", isCompact ? "h-[55px]" : "h-[85px]")}
        style={{
          width: '100%',              // NPC領域いっぱいに広げる
          maxWidth: '100%',           // 親に収まるよう制限
        }}
      >
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              className={clsx("absolute top-0", isCompact ? "scale-50" : "")}
              style={{
                left: `${index * overlapStep}px`,
                top: card.isPlayable && card.isFaceUp ? '0px' : isCompact ? '-10px' : '12px',  // ✅ 出せるカードは上にずらす
                zIndex: index,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
