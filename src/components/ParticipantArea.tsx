'use client';

import {useGameStore}    from '@/stores/gameStore';
import {useWindowWidth}  from '@/utils/useWindowSize';
import {useEffect}       from "react";
import OverlappedCardRow from './OverlappedCardRow';

type Props = {
  playerId: string;
  label: string;
};

export default function ParticipantArea({playerId, label}: Props) {
  const cards = useGameStore(state => state.cards);
  const lastPassPlayer = useGameStore(state => state.lastPassPlayer);
  const passCountMap = useGameStore(state => state.passCountMap);
  const finishedPlayers = useGameStore(state => state.finishedPlayers);
  const currentTurnIndex = useGameStore(state => state.currentTurnIndex); // ✅ 追加

  const width = useWindowWidth();
  const isCompact = width < 640;

  const isActive = (() => {
    if (playerId === 'player') return currentTurnIndex === 0;
    const match = playerId.match(/^npc(\d+)$/);
    return match ? currentTurnIndex === parseInt(match[1], 10) + 1 : false;
  })();

  const playerCards = cards.filter(c => c.location === playerId);
  const handlePass = useGameStore(state => state.handlePass);
  const playerResult = finishedPlayers.find(fp => fp.player === playerId);
  const isGiveUp = playerResult?.reason === 'giveUp';
  const isWin = playerResult?.reason === 'win';
  const isPassed = lastPassPlayer?.player === playerId && lastPassPlayer.type === 'pass';

  const playUserCard = useGameStore(state => state.playUserCard);

  let message: string | undefined = undefined;

  if (isGiveUp || isWin) {
    const suffix = playerResult!.rank === 1
      ? '🥇'
      : playerResult!.rank === 2
        ? '🥈'
        : playerResult!.rank === 3
          ? '🥉'
          : `${playerResult!.rank}位`;
    message = isWin ? `上がり！ (${suffix})` : `ギブアップ (${suffix})`;
  } else if (isPassed) {
    message = 'パスしました';
  }

  useEffect(() => {
    if (!lastPassPlayer) return;
    if (lastPassPlayer.player !== playerId) return;

    const timer = setTimeout(() => {
      useGameStore.getState().setLastPassPlayer();
    }, 1500);

    return () => clearTimeout(timer);
  }, [lastPassPlayer, playerId]);

  return (
    <div className={"flex-1 flex-col items-center justify-center"}>
      <OverlappedCardRow
        cards={playerCards}
        label={label}
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
