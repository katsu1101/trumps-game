'use client';

import {participants}                         from "@/constants/participants";
import {useGameStore}                         from "@/stores/gameStore";
import type {Card as CardType}                from '@/types/card';
import {clsx}                                 from "clsx";
import {AnimatePresence}                      from 'framer-motion';
import Image                                  from 'next/image';
import {useEffect, useMemo, useRef, useState} from 'react';
import Card                                   from './Card';

const maxAngle = 3; // 左右に最大15度傾ける
const radius = 3;   // カードが上下にずれる量（ピクセル）

type Props = {
  playerId: string;
  cards: CardType[];
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
    playerId, cards, isCompact = false, isActive = false, isPlayer = false,
    cardWidth = 60, message = "", passCount, passLimit,
    onCardClick, onPassClick
  }: Props) {
  const participant = participants.find(p => p.id === playerId);

  const displayName = participant ? participant.name : playerId; // 👈 デフォルト fallback
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
      {/* 画像（左上に配置） */}
      {participant?.img && (
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/img/${participant.img}.png`}
          alt={participant.name}
          className="absolute bottom-0 left-0 w-10 h-10"
          width={100}
          height={100}
          style={{width: 50, height: "auto", top: -10, left: -10, transform: 'translate(30%, 70%)'}}
        />
      )}

      {displayName && (
        <div className="absolute z-50 bg-black/60 top-0 left-0 text-xs text-white px-1">
          {displayName}

          {message && isPlayer && (
            <div className="absolute left-0 bottom-full mb-2 z-40 flex items-center gap-2">
              <div className="relative bg-red-500/80 text-white text-lg px-2 py-1 rounded shadow whitespace-nowrap"
                   style={{
                     backgroundColor: participant?.colors.background,
                     color: participant?.colors.text,
                     borderColor: participant?.colors.border,
                     borderWidth: '2px',  // 👈 枠線を足す場合
                   }}
              >
                {message}
                <div
                  className="absolute left-4 top-full w-0 h-0"
                  style={{
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: `8px solid ${participant?.colors.background}`, // 👈 上向き
                  }}
                />
              </div>
            </div>
          )}
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
      {/* メッセージ表示（NPC用、エリア左下から下方向） */}
      {message && !isPlayer && (
        <div className="absolute left-0 bottom-0 translate-y-full z-40 flex items-center gap-2">
          <div
            className="relative text-lg px-2 py-1 rounded shadow whitespace-nowrap"
            style={{
              backgroundColor: participant?.colors.background,
              color: participant?.colors.text,
              borderColor: participant?.colors.border,
            }}
          >
            {message}
            {/* 吹き出し三角形の枠 */}
            <div className="absolute left-4 bottom-full w-0 h-0"
                 style={{
                   borderLeft: '10px solid transparent',
                   borderRight: '10px solid transparent',
                   borderBottom: `10px solid ${participant?.colors.border}`,  // 外側の枠
                 }}
            />
            {/* 吹き出し三角形の内側 */}
            <div className="absolute left-[18px] bottom-full w-0 h-0"
                 style={{
                   borderLeft: '8px solid transparent',
                   borderRight: '8px solid transparent',
                   borderBottom: `8px solid ${participant?.colors.background}`,  // 内側の色
                 }}
            />
          </div>
        </div>
      )}


      <div
        className={clsx("ml-10 relative overflow-hidden w-full", isCompact ? "h-[55px]" : "h-[85px]")}
        style={{
          width: '95%',              // NPC領域いっぱいに広げる
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
