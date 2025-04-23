'use client';
import {participants} from "@/constants/participants";
import {useGameStore} from '@/stores/gameStore';

export default function ResultScreen() {
  const finishedPlayers = useGameStore(state => state.finishedPlayers);
  // IDから名前を取得する関数
  const getParticipantName = (id: string) => {
    const participant = participants.find(p => p.id === id);
    return participant ? participant.name : id;
  };
  return (
    <div className="absolute inset-0 z-99 bg-black/70 flex flex-col items-center justify-center text-white">
      <div className="bg-green-900 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl mb-4">ゲーム結果</h1>
        <ul>
          {finishedPlayers
            .sort((a, b) => a.rank! - b.rank!)
            .map((fp, i) => (
              <li key={i} className="text-lg mb-1">
                {fp.rank}位：{getParticipantName(fp.player)}{fp.reason === 'win' ? '' : '（ギブアップ）'}
              </li>
            ))}
        </ul>
        <button
          className="mt-6 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          onClick={() => {
            useGameStore.getState().setPhase('title'); // タイトルへ戻る
          }}
        >
          タイトルへ戻る
        </button>
      </div>
    </div>
  );
}
