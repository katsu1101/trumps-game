'use client';

import {useGameStore}                         from "@/stores/gameStore";
import type {Card as CardType}                from '@/types/card';
import {clsx}                                 from "clsx";
import {AnimatePresence}                      from 'framer-motion';
import {useEffect, useMemo, useRef, useState} from 'react';
import Card                                   from './Card';

const maxAngle = 3; // 左右に最大15度傾ける
const radius = 3;   // カードが上下にずれる量（ピクセル）

type Props = {
  cards: CardType[];
  label?: string;
  isCompact: boolean
  isActive: boolean;
  isPlayer: boolean;
  cardWidth?: number;
  maxWidth?: number;
  message?: string; // ✅ 追加
  passCount?: number;   // 👈 追加
  passLimit?: number;   // 👈 追加
  onCardClick?: (cardId: string) => void;
  onPassClick?: () => void;
};

export default function OverlappedCardRow(
  {
    cards, label, isCompact = false, isActive = false, isPlayer = false,
    cardWidth = 60, message = "", passCount, passLimit,
    onCardClick, onPassClick
  }: Props) {

  const phaseSub = useGameStore(state => state.phaseSub);
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
    const totalWidth = cards.length * (isCompact ? cardWidth / 2 : cardWidth);
    if (totalWidth <= containerWidth) return isCompact ? cardWidth / 2 : cardWidth;

    const maxOverlap = (containerWidth - (isCompact ? cardWidth / 2 : cardWidth) - 5) / (cards.length - 1);
    return Math.max(maxOverlap, 10); // 最小重なり幅
  }, [cards.length, isCompact, cardWidth, containerWidth]);

  return (
    <div className={
      clsx(
        "relative flex flex-col items-center h-full w-full border border-dashed pt-3 pl-3",
        isActive ? "border-yellow-400 shadow-yellow-400 shadow-md" : "border-dashed border-white/30"
      )}
    >
      {label && (
        <div className="absolute z-50 bg-black/60 top-0 left-0 text-xs text-white px-1">
          {label}
        </div>
      )}
      {isActive && isPlayer && phaseSub === 'waitingInput' && (
        <div className="absolute flex mt-2 z-50 top-8 left-0 gap-2 text-xs">
          <button
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            onClick={() => onPassClick?.()}
          >
            パス
          </button>
        </div>
      )}

      {/* コイン表示：ラベルの1行下（ラベル下部から4px下へ） */}
      {typeof passCount === 'number' && typeof passLimit === 'number' && (
        <div className="absolute z-40 top-[18px] left-0 px-1 flex gap-[1px] text-xs pointer-events-none">
          {Array.from({length: passLimit}).map((_, i) => (
            <span
              key={i}
              className={clsx(
                i < passLimit - passCount ? "opacity-100" : "opacity-30"
              )}
            >
            🪙
          </span>
          ))}
        </div>
      )}
      {/* メッセージ表示（中央上部） */}
      {message && (
        <div
          className="text-nowrap absolute z-40 left-1/2 -translate-x-1/2 text-sm text-white bg-red-500/80 px-2 py-1 rounded shadow">
          {message}
        </div>
      )}

      <div
        className={clsx("relative overflow-hidden w-full", isCompact ? "h-[55px]" : "h-[85px]")}
        style={{
          width: '100%',              // NPC領域いっぱいに広げる
          maxWidth: '100%',           // 親に収まるよう制限
        }}
        ref={containerRef}
      >
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => {

            const ratio = cards.length > 1 ? index / (cards.length - 1) : 0.5; // 0〜1
            const angle = (ratio - 0.5) * 2 * maxAngle;                        // -15〜+15

            const normalized = Math.abs((ratio - 0.5) * 2); // 0～1に正規化（中心=0）
            const offsetY = -Math.pow(normalized, 2) * radius; // 放物線に近いカーブ

            // const offsetY = Math.abs(index - centerIndex) * 2; // 上下のズレ
            return <Card
              key={card.id}
              card={card}
              className={clsx(
                "absolute top-0", isCompact ? "scale-55" : "",
                onCardClick && card.isPlayable && card.isFaceUp && isActive ? "cursor-pointer" : ""  // ✅ ここで判定
              )}
              style={{
                left: `${(containerWidth > cards.length * overlapStep) ? index * overlapStep + (containerWidth - cards.length * overlapStep) / 2 : 0}px`,
                top: `${(card.isPlayable && card.isFaceUp ? 0 : 10) - offsetY - (isCompact ? 15 : 0)}px`,  // ✅ 出せるカードは上にずらす
                zIndex: index,
              }}
              animate={{rotate: angle}}
              onClick={() => onCardClick?.(card.id)}
            />
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
