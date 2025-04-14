import {useAutoDeal} from "@/hooks/useAutoDeal";
import NPCArea       from './NPCArea';
import CenterArea    from './CenterArea';
import PlayerArea    from './PlayerArea';

export default function GameLayout() {
  useAutoDeal(); // ← 自動配布を開始
  return (
    <main className="flex flex-col h-screen bg-green-900 text-white">
      <section className="flex-[1] border-b border-white p-2">
        <NPCArea />
      </section>

      <section className="flex-[4] border-b border-white p-2">
        <CenterArea />
      </section>

      <section className="flex-[1.5] p-2">
        <PlayerArea />
      </section>
    </main>
  );
}
