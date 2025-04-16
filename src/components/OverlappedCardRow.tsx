'use client';

import type {Card as CardType} from '@/types/card';
import {AnimatePresence}                      from 'framer-motion';
import {useEffect, useMemo, useRef, useState} from 'react';
import Card                                   from './Card';

type Props = {
  cards: CardType[];
  label?: string;
  cardWidth?: number;
  maxWidth?: number;
};

export default function OverlappedCardRow({cards, label, cardWidth = 80}: Props) {

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

    const maxOverlap = (containerWidth - cardWidth - 10) / (cards.length - 1);
    return Math.max(maxOverlap, 20); // 最小重なり幅
  }, [cards.length, cardWidth, containerWidth]);

  return (
    <div className="relative flex flex-col items-center h-full w-full border border-dashed pt-3 pl-3" ref={containerRef}>
      {label && (
        <div className="absolute z-50 bg-black/60 top-0 left-0 text-xs text-white px-1">
          {label}
        </div>
      )}
      <div
        className="relative h-[85px] overflow-hidden"
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
              className="absolute top-0"
              style={{
                left: `${index * overlapStep}px`,
                top: card.isPlayable && card.isFaceUp ? '0px' : '12px',  // ✅ 出せるカードは上にずらす
                zIndex: index,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
