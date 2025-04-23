'use client';

import {useGameStore}    from '@/stores/gameStore';
import {CardLocation}    from "@/types/card";
import {useWindowWidth}  from '@/utils/useWindowSize';
import {useEffect}       from "react";
import OverlappedCardRow from './OverlappedCardRow';

type Props = {
  playerId: CardLocation;
};

export default function ParticipantArea({playerId}: Props) {
  const cards = useGameStore(state => state.cards);
  const lastPassPlayer = useGameStore(state => state.lastPassPlayer);
  const passCountMap = useGameStore(state => state.passCountMap);
  const currentTurnIndex = useGameStore(state => state.currentTurnIndex); // ✅ 追加

  const characterLine = useGameStore(state => state.characterLines[playerId]);
  const message = characterLine?.text ?? undefined;

  const width = useWindowWidth();
  const isCompact = width < 640;

  const isActive = (() => {
    if (playerId === 'player') return currentTurnIndex === 0;
    const match = playerId.match(/^npc(\d+)$/);
    return match ? currentTurnIndex === parseInt(match[1], 10) + 1 : false;
  })();

  const playerCards = cards.filter(c => c.location === playerId);
  const handlePass = useGameStore(state => state.handlePass);

  const playUserCard = useGameStore(state => state.playUserCard);

  useEffect(() => {
    if (!lastPassPlayer) return;
    if (lastPassPlayer.player !== playerId) return;

    const timer = setTimeout(() => {
      useGameStore.getState().setLastPassPlayer();
    }, 1500);

    return () => clearTimeout(timer);
  }, [lastPassPlayer, playerId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const state = useGameStore.getState();
      const updatedLines = { ...state.characterLines };

      const now = Date.now();
      Object.entries(updatedLines).forEach(([playerId, line]) => {
        if (line && now - line.timestamp > 2000) { // 2秒表示
          updatedLines[playerId as CardLocation] = null;
        }
      });

      useGameStore.setState({ characterLines: updatedLines });
    }, 500); // 0.5秒ごとにチェック

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={"flex-1 flex-col items-center justify-center"}>
      <OverlappedCardRow
        playerId={playerId}
        cards={playerCards}
        isCompact={isCompact}
        isActive={isActive}
        isPlayer={playerId === 'player'}
        message={message}
        passCount={passCountMap[playerId] ?? 0}
        passLimit={3}
        onCardClick={(cardId: string) => {
          playUserCard(cardId);
        }}
        onPassClick={() => {
          handlePass('player')
        }}
      />
    </div>
  );
}
