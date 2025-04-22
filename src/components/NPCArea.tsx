'use client';

import ParticipantArea from "@/components/ParticipantArea";
import {useGameStore}  from '@/stores/gameStore';

export default function NPCArea() {
  const npcCount = useGameStore(state => state.npcCount);

  const npcComponents = Array.from({length: npcCount}, (_, i) => {
    const id = `npc${i}`;
    return <ParticipantArea key={id} playerId={id} label={`NPC ${i + 1}`}/>;
  });

  const portraitLayoutClass = (() => {
    switch (npcCount) {
      case 2:
        return 'portrait:grid portrait:grid-cols-2 portrait:grid-rows-1';
      case 3:
        return 'portrait:grid portrait:grid-cols-2 portrait:grid-rows-2 portrait:[&>div:nth-child(1)]:col-span-2 portrait:[&>div:nth-child(1)]:justify-center';
      case 4:
        return 'portrait:grid portrait:grid-cols-2 portrait:grid-rows-2';
      default:
        return 'portrait:flex portrait:flex-row';
    }
  })();

  return (
    <div className={`w-full landscape:flex landscape:flex-row gap-1 ${portraitLayoutClass}`}>
      {npcComponents}
    </div>
  );
}
