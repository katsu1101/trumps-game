'use client';

import {useAutoDeal} from '@/hooks/useAutoDeal';
import CenterArea    from './CenterArea';
import NPCArea       from './NPCArea';
import PlayerArea    from './PlayerArea';

export default function GameLayout() {
  useAutoDeal();
  return (
    <main className="flex-col h-screen bg-green-900 text-white">
      <section
        className="landscape:h-[21vh] portrait:h-[20vh]">
        <NPCArea/>
      </section>

      <section
        className="landscape:h-[58vh] portrait:h-[42vh]">
        <CenterArea/>
      </section>

      <section
        className="landscape:h-[21vh] portrait:h-[15vh]">
        <PlayerArea/>
      </section>
    </main>
  );
}
