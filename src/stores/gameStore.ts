import {Card, CardLocation, Rank, Suit} from '@/types/card';
import {create}                         from 'zustand';

// 定数定義
const suits: Suit[] = ['spade', 'heart', 'diamond', 'club'];
const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

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

const shuffle = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5); // シンプルなシャッフル
};

const assignInitialCards = (shuffledDeck: Card[]) => {
  const {npcCount, setCardLocation} = useGameStore.getState();
  const totalPlayers = 1 + npcCount;

  // 各プレイヤーの手札用の配列を準備
  const hands: Card[][] = Array.from({length: totalPlayers}, () => []);

  // 順番にカードを配る
  shuffledDeck.forEach((card, i) => {
    const playerIndex = i % totalPlayers;
    hands[playerIndex].push(card);
  });

  // 配布先にセット（プレイヤー: 表 / NPC: 裏）
  hands.forEach((hand, index) => {
    const location: CardLocation = index === 0 ? 'player' : `npc${index - 1}`;
    const isFaceUp = index === 0;

    hand.forEach(card => {
      setCardLocation(card.id, location, isFaceUp);
    });
  });
};


type GamePhase = "auto" | 'dealing' | 'ready' | `demo${number}`;

type GameState = {
  phase: GamePhase;
  npcCount: number;
  cards: Card[];
  turnIndex: number, // player = 0, npc1 = 1, npc2 = 2...

  setNpcCount: (count: number) => void;
  setCardLocation: (id: string, location: Card['location'], faceUp?: boolean) => void;
  dealCards: () => void;
  dealNextCard: () => void;
  sortPlayerHand: () => void,
  playNext7ToField: () => void,
  playNextToField: () => void,
  playNextToDeck: () => void,
  drawCard: () => void;
  startGame: (mode: 'auto' | 'instant' | `demo${number}`) => void;
  playRandomToField: () => void,
  collectFieldToDeck: () => void,
};
export const useGameStore = create<GameState>((set, get) => ({
  npcCount: 4,
  cards: [],
  phase: 'dealing',
  turnIndex: 0,

  setNpcCount: (count) => {
    if (count >= 2 && count <= 4) set({npcCount: count});
  },

  setCardLocation: (id, location, faceUp = false) =>
    set(state => ({
      cards: state.cards.map(card =>
        card.id === id ? {...card, location, isFaceUp: faceUp} : card
      )
    })),

  dealCards: () => {
    const npcCount = get().npcCount;
    const totalPlayers = 1 + npcCount;
    const shuffled = createDeck().sort(() => Math.random() - 0.5);
    const hands: Card[][] = Array.from({length: totalPlayers}, () => []);

    shuffled.forEach((card, i) => {
      const index = i % totalPlayers;
      hands[index].push(card);
    });

    const cards = hands.flatMap((hand, index) => {
      const location: CardLocation = index === 0 ? 'player' : `npc${index - 1}` as const;
      const isFaceUp = index === 0;
      return hand.map(card => ({...card, location, isFaceUp}));
    });

    set({cards});
  },
  playRandomToField: () => {
    const cards = [...get().cards];

    // 場に出せるカード（まだ手札にあるもの）
    const handCards = cards.filter(c => c.location.startsWith('npc') || c.location === 'player');

    if (handCards.length === 0) return;

    const randomIndex = Math.floor(Math.random() * handCards.length);
    const selectedCard = handCards[randomIndex];

    const field: CardLocation = "field"
    // location を 'field' に変更
    const updatedCards = cards.map(card =>
      card === selectedCard ? {...card, location: field, isFaceUp: true} : card
    );

    set({cards: updatedCards});
  },

  collectFieldToDeck: () => {
    const cards = get().cards;

    const deck: CardLocation = "deck"
    const updatedCards = cards.map(card =>
      card.location === 'field'
        ? {...card, location: deck, isFaceUp: false}
        : card
    );

    set({cards: updatedCards});
  },

  dealNextCard: () => {
    const state = get();
    const {cards, npcCount} = state;
    const totalPlayers = 1 + npcCount;
    const nextCard = cards.findLast(c => c.location === 'deck');
    if (!nextCard) return;

    const alreadyDealt = cards.length - cards.filter(c => c.location === 'deck').length;
    const currentIndex = alreadyDealt % totalPlayers;
    const location = currentIndex === 0 ? 'player' : `npc${currentIndex - 1}` as const;
    const isFaceUp = location === 'player';

    set({
      cards: cards.map(c =>
        c.id === nextCard.id
          ? {...c, location, isFaceUp}
          : c
      )
    });
  },

  drawCard: () => {
    const state = get();
    const card = state.cards.find(c => c.location === 'deck');
    if (!card) return;

    set({
      cards: state.cards.map(c =>
        c.id === card.id
          ? {...c, location: 'player', isFaceUp: true}
          : c
      )
    });
  },

  startGame: (mode) => {
    const deck = shuffle(createDeck());
    set({cards: deck, phase: mode === 'auto' ? 'dealing' : 'ready'});

    if (mode === 'instant') {
      assignInitialCards(deck); // 即配布
    }
  },
  sortPlayerHand: () => set(state => {
    const order = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    // プレイヤーのカードだけを抽出してソート
    const sortedPlayerCards = state.cards
      .filter(c => c.location === 'player')
      .sort((a, b) => {
        if (a.suit !== b.suit) return a.suit.localeCompare(b.suit); // スート順
        return order.indexOf(a.rank) - order.indexOf(b.rank);       // ランク順
      });

    // プレイヤー以外のカードはそのまま
    const otherCards = state.cards.filter(c => c.location !== 'player');

    return {
      cards: [...sortedPlayerCards, ...otherCards]
    };
  }),

  playNext7ToField: () => set(state =>{
    const updatedCards: Card[] = state.cards.map(c =>
      c.rank === "7" ? { ...c, location: 'field', isFaceUp: true } : c
    );
    return {
      cards: updatedCards
    }
  }),
  playNextToField: () => set(state => {
    const totalPlayers = 1 + state.npcCount;
    const currentIndex = state.turnIndex % totalPlayers;
    const currentLocation = currentIndex === 0 ? 'player' : (`npc${currentIndex - 1}` as const);

    const hand = state.cards.filter(c => c.location === currentLocation);
    if (hand.length === 0) {
      return {
        turnIndex: (state.turnIndex + 1) % totalPlayers
      };
    }

    const cardToPlay = hand[0];
    const updatedCards: Card[] = state.cards.map(c =>
      c.id === cardToPlay.id ? { ...c, location: 'field', isFaceUp: true } : c
    );

      return {
      cards: updatedCards,
      turnIndex: (state.turnIndex + 1) % totalPlayers
    } as Partial<typeof state>; // ✅ ここがポイント
  }),

  playNextToDeck: () => set(state => {
    const updatedCards: Card[] = state.cards.map(c => {
        return {...c, location: 'deck', isFaceUp: false} as Card
      }
    );
    return {
      cards: updatedCards,
    }
  }),

}));
