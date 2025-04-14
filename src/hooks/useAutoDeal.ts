import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export const useAutoDeal = () => {
  const dealNextCard = useGameStore(state => state.dealNextCard);
  const cards = useGameStore(state => state.cards);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = cards.filter(c => c.location === 'deck').length;
      if (remaining > 0) {
        dealNextCard();
      } else {
        clearInterval(interval);
      }
    }, 1000); // 1秒おき

    return () => clearInterval(interval);
  }, [cards]);
};
