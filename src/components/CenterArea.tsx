import Card              from "@/components/Card";
import {useGameStore}    from "@/stores/gameStore";
import {useWindowWidth}  from "@/utils/useWindowSize";
import {clsx}            from "clsx";
import {AnimatePresence} from "framer-motion";

const rankToX = (rank: string): number => {
  switch (rank) {
    case "A":
      return 0;
    case "J":
      return 10;
    case "Q":
      return 11;
    case "K":
      return 12;
    default:
      return parseInt(rank, 10) - 1;
  }
}
const SuitToY = (suit: string): number => {
  switch (suit) {
    case 'spade':
      return 0
    case 'heart':
      return 1
    case 'diamond':
      return 2
    case 'club':
      return 3
    default:
      return 0
  }
}
export default function CenterArea() {
  const cards = useGameStore(state => state.cards);

  const deckCards = cards.filter(card => card.location === 'deck');
  const fieldCards = cards.filter(card => card.location === 'field');
  const width = useWindowWidth();
  const isCompact = width < 640; // 小さい画面と判定

  const cardWidth = isCompact ? 24 : 48;
  const cardHeight = isCompact ? 36 : 72;
  const cardGap = isCompact ? 2 : 4;
  return (
    <div className="flex h-full w-full flex-row landscape:flex-row portrait:flex-col
      items-center justify-center gap-4">
      {/* 山札 */}
      <div className="relative flex flex-col items-center gap-1 w-20 portrait:h-[6vh]">
        <div className="relative w-16 h-24">
          <AnimatePresence mode="popLayout">
            {deckCards.map((card, index) => (
              <div
                key={card.id}
                className={clsx("absolute", isCompact ? "scale-50" : "")}
                style={{top: -index * 0.25, left: -index * 0.1, zIndex: 100 + index}}
              >
                <Card card={card}/>
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 場：13x4 */}
      <div className="flex flex-col items-center flex-1 landscape:h-[55vh] portrait:h-[24vh]">
        {/*<p className="text-sm">🏞️ 場（13×4）</p>*/}
        <div
          className="relative h-full grid grid-cols-13 gap-[2px] p-2 rounded overflow-hidden border text-black"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(13, ${cardWidth}px)`,
            gap: `${cardGap}px`,                    // ギャップ固定
            justifyContent: 'center'                  // 余白を中央に
          }}
        >
          <AnimatePresence mode="popLayout">
            {fieldCards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                className={clsx("absolute", isCompact ? "scale-50" : "")}
                style={{
                  left: `${rankToX(card.rank) * (cardWidth + cardGap)}px`,
                  top: `${SuitToY(card.suit) * (cardHeight + cardGap)}px`,
                  zIndex: index,
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 川 */}
      <div className="flex flex-col items-center gap-1">
        {/*<p className="text-sm">🌊 川</p>*/}
        {/*<div className="w-16 h-24 bg-blue-800 rounded border"/>*/}
      </div>
    </div>
  );
}
