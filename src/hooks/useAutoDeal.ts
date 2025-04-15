import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export const useAutoDeal = () => {
  const dealNextCard = useGameStore(state => state.dealNextCard);
  const sortPlayerHand = useGameStore(state => state.sortPlayerHand);
  const phase = useGameStore(state => state.phase);
  const cards = useGameStore(state => state.cards);

  useEffect(() => {
    if (phase !== 'dealing') return; // ← ここで条件判定する

    const interval = setInterval(() => {
      const remaining = cards.filter(c => c.location === 'deck').length;
      if (remaining > 0) {
        dealNextCard();
      } else {
        clearInterval(interval);
        sortPlayerHand(); // ✅ ここで並べ替え
        useGameStore.setState({ phase: 'ready' }); // ✅ ← ココが追加
      }
    }, 100); // 1秒おき

    return () => clearInterval(interval);
  }, [dealNextCard, sortPlayerHand, phase, cards]);
};
