'use client';

import { useAutoDeal } from '@/hooks/useAutoDeal';
import NPCArea from './NPCArea';
import CenterArea from './CenterArea';
import PlayerArea from './PlayerArea';

export default function GameLayout() {
  useAutoDeal();
  return (
    <main className="flex flex-col h-screen bg-green-900 text-white">
      <section className="h-[120px]">
        <NPCArea />
      </section>

      <section className="h-[320px]">
        <CenterArea />
      </section>

      <section className="h-[120px]">
        <PlayerArea />
      </section>
    </main>
  );
}
