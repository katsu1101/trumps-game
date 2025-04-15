'use client';

import { useAutoDeal } from '@/hooks/useAutoDeal';
import NPCArea from './NPCArea';
import CenterArea from './CenterArea';
import PlayerArea from './PlayerArea';

export default function GameLayout() {
  useAutoDeal();
  return (
    <main className="flex flex-col h-screen bg-green-900 text-white">
      <section className="flex-[1]">
        <NPCArea />
      </section>

      <section className="flex-[3]">
        <CenterArea />
      </section>

      <section className="flex-[1]">
        <PlayerArea />
      </section>
    </main>
  );
}
