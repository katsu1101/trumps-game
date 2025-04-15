import Card              from "@/components/Card";
import {useGameStore}    from "@/stores/gameStore";
import {AnimatePresence} from "framer-motion";

export default function CenterArea() {
  const cards = useGameStore(state => state.cards);

  const deckCards = cards.filter(card => card.location === 'deck');
  return (
    <div className="flex justify-between items-center h-full p-4">
      {/* 山札 */}
      <div className="relative flex flex-col items-center gap-1 w-20">
        <div
          className="absolute z-50 bg-black/60 top-0 left-0 text-xs text-white px-1"
          style={{top: -52 * 0.5}}
        >
          🃏 山札
        </div>
        <div className="relative w-16 h-24">
          <AnimatePresence mode="popLayout">
            {deckCards.map((card, index) => (
              <div
                key={card.id}
                className="absolute"
                style={{top: -index * 0.5, left: -index * 0.2}}
              >
                <Card card={card}/>
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 場：13x4 */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {/*<p className="text-sm">🏞️ 場（13×4）</p>*/}
        <div
          className="grid grid-cols-13 gap-[2px] bg-white p-2 rounded overflow-hidden border text-black"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(13, 48px)`,  // カード幅固定
            gap: '4px',                               // ギャップ固定
            justifyContent: 'center'                  // 余白を中央に
          }}
        >
          {Array.from({length: 52}).map((_, i) => (
            <div key={i}
                 className="w-10 h-14 border rounded text-center text-xs flex items-center justify-center bg-green-100">
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* 川 */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm">🌊 川</p>
        <div className="w-16 h-24 bg-blue-800 rounded border"/>
      </div>
    </div>
  );
}
