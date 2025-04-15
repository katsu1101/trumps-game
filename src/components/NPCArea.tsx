'use client';

import {useGameStore}    from '@/stores/gameStore';
import OverlappedCardRow from './OverlappedCardRow';

export default function NPCArea() {
  const cards = useGameStore(state => state.cards);
  const npcCount = useGameStore(state => state.npcCount);

  return (
    <div className="flex w-full">
      {Array.from({length: npcCount}, (_, i) => {
        const npcCards = cards.filter(c => c.location === `npc${i}`);
        return (
          <div
            key={`npc${i}`}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <OverlappedCardRow
              key={`npc${i}`}
              cards={npcCards}
              label={`NPC ${i + 1}`}
            />
          </div>
        );
      })}
    </div>
  );
}
