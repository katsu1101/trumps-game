import Card              from "@/components/Card";
import {useGameStore}    from "@/stores/gameStore";
import {Suit}            from "@/types/card";
import {AnimatePresence} from "framer-motion";

const rankToX = (rank: string): number => {
  switch (rank) {
    case "A": return 0;
    case "J": return 10;
    case "Q": return 11;
    case "K": return 12;
    default: return parseInt(rank, 10) - 1;
  }
}
const SuitToY = (suit: string): number => {
  switch (suit) {
    case 'spade': return 0
    case 'heart': return 1
    case 'diamond': return 2
    case 'club': return 3
    default: return 0
  }
}
export default function CenterArea() {
  const cards = useGameStore(state => state.cards);

  const deckCards = cards.filter(card => card.location === 'deck');
  const fieldCards = cards.filter(card => card.location === 'field');
  return (
    <div className="flex justify-between items-center h-full p-2">
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
                style={{top: -index * 0.25, left: -index * 0.1, zIndex: 100+index}}
              >
                <Card card={card}/>
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 場：13x4 */}
      <div className="flex h-full flex-col items-center gap-1 flex-1">
        {/*<p className="text-sm">🏞️ 場（13×4）</p>*/}
        <div
          className="relative h-full grid grid-cols-13 gap-[2px] bg-white p-2 rounded overflow-hidden border text-black"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(13, 48px)`,  // カード幅固定
            gap: '4px',                               // ギャップ固定
            justifyContent: 'center'                  // 余白を中央に
          }}
        >
          <AnimatePresence mode="popLayout">
          {fieldCards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              className="absolute"
              style={{
                left: `${rankToX(card.rank) * 53}px`,
                top: `${SuitToY(card.suit) * 74}px`,
                zIndex: index,
              }}
            />
          ))}
          </AnimatePresence>
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
