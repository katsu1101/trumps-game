'use client';

import {useGameStore}    from '@/stores/gameStore';
import {useWindowWidth}  from "@/utils/useWindowSize";
import OverlappedCardRow from './OverlappedCardRow';

export default function NPCArea() {
  const cards = useGameStore(state => state.cards);
  const npcCount = useGameStore(state => state.npcCount);
  const width = useWindowWidth();
  const isCompact = width < 640; // 小さい画面と判定

  const npcComponents = Array.from({length: npcCount}, (_, i) => {
    const npcCards = cards.filter(c => c.location === `npc${i}`);
    return (
      <div
        key={`npc${i}`}
        className="flex-1 flex-col items-center justify-center"
      >
        <OverlappedCardRow
          cards={npcCards}
          label={`NPC ${i + 1}`}
          isCompact={isCompact}
        />
      </div>
    );
  });

  // portrait向けのレイアウトクラスをNPC数に応じて切り替える
  const portraitLayoutClass = (() => {
    switch (npcCount) {
      case 2:
        return 'portrait:grid portrait:grid-cols-2 portrait:grid-rows-1';
      case 3:
        return 'portrait:grid portrait:grid-cols-2 portrait:grid-rows-2 portrait:[&>div:nth-child(1)]:col-span-2 portrait:[&>div:nth-child(1)]:justify-center';
      case 4:
        return 'portrait:grid portrait:grid-cols-2 portrait:grid-rows-2';
      default:
        return 'portrait:flex portrait:flex-row'; // fallback
    }
  })();

  return (
    <div className={`w-full landscape:flex landscape:flex-row gap-1 ${portraitLayoutClass}`}>
      {npcComponents}
    </div>
  );
}
