import {Card}                   from "@/types/card";
import {rankOrder, rankToIndex} from "@/utils/cardUtils";

export const chooseCardToPlay = (
  cards: Card[],
  who: Card['location'],
  strategy: 'first' | 'random' | 'edge' | 'center' = 'random'
): Card | undefined => {
  const playable = cards.filter(c => c.location === who && c.isPlayable);
  if (playable.length === 0) return undefined;

  switch (strategy) {
    case 'random':
      return playable[Math.floor(Math.random() * playable.length)];

    case 'edge': {
      // A, K に近いほどスコア高
      const scored = playable.map(card => {
        const idx = rankToIndex(card.rank);
        const score = Math.max(idx, rankOrder.length - 1 - idx); // A:12, K:12, 7:6
        return {card, score};
      });

      scored.sort((a, b) => b.score - a.score); // 降順（端が上）
      return scored[0].card;
    }

    case 'center': {
      // 7に近いほどスコア低（中心優先）
      const scored = playable.map(card => {
        const idx = rankToIndex(card.rank);
        const score = Math.abs(idx - 6); // 7:0, A/K:6
        return {card, score};
      });

      scored.sort((a, b) => a.score - b.score); // 昇順（中心が上）
      return scored[0].card;
    }

    default:
      return playable[0];
  }
}
