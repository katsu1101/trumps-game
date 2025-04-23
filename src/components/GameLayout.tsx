'use client';

import DemoNotice     from "@/components/DemoNotice";
import ResultScreen   from "@/components/ResultScreen";
import TitleScreen    from "@/components/TitleScreen";
import {useAutoDeal}  from '@/hooks/useAutoDeal';
import {useGameStore} from "@/stores/gameStore";
import CenterArea     from './CenterArea';
import NPCArea        from './NPCArea';
import PlayerArea     from './PlayerArea';

function MainGame() {
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

      {/* デモ中の案内 */}
      <DemoNotice/>
    </main>
  );
}

export default function GameLayout() {
  const phase = useGameStore(state => state.phase);
  const phaseSub = useGameStore(state => state.phaseSub);
  useAutoDeal();

  if (phase === 'title') return <TitleScreen/>;
  return <>
    <MainGame/>
    {phaseSub === 'result' && <ResultScreen/>} {/* ✅ オーバーレイ */}
  </>;

}
