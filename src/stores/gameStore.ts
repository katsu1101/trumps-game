import { create } from 'zustand';
import { Card, Suit, Rank } from '@/types/card';

const suits: Suit[] = ['spade', 'heart', 'diamond', 'club'];
const ranks: Rank[] = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

const createDeck = (): Card[] => {
  return suits.flatMap(suit =>
    ranks.map(rank => ({
      id: `${suit}-${rank}`,
      suit,
      rank,
      location: 'deck',
      isFaceUp: false,
    }))
  );
};

type GameState = {
  cards: Card[];
  dealNextCard: () => void;
  drawCard: () => void;
  setCardLocation: (id: string, location: Card['location'], faceUp?: boolean) => void;
};

export const useGameStore = create<GameState>((set) => ({
  deck: [],     // 初期化後に山札が入る
  hand: [],
  field: [],
  cards: createDeck(),
  dealNextCard: () =>
    set(state => {
      const nextCard = state.cards.find(c => c.location === 'deck');
      if (!nextCard) return state;

      const assignedCount = state.cards.filter(
        c => c.location === 'player' || c.location === 'npc1'
      ).length;

      const toPlayer = assignedCount % 2 === 0; // 交互に配る
      return {
        cards: state.cards.map(card =>
          card.id === nextCard.id
            ? {
              ...card,
              location: toPlayer ? 'player' : 'npc1',
              isFaceUp: toPlayer,
            }
            : card
        )
      };
    }),
  setCardLocation: (id, location, faceUp = false) =>
    set(state => ({
      cards: state.cards.map(card =>
        card.id === id ? { ...card, location, isFaceUp: faceUp } : card
      )
    })),
  drawCard: () => set(state => {
    const deckCard = state.cards.find(c => c.location === 'deck');
    if (!deckCard) return state;
    return {
      cards: state.cards.map(card =>
        card.id === deckCard.id
          ? { ...card, location: 'player', isFaceUp: true }
          : card
      )
    };
  })
}));
