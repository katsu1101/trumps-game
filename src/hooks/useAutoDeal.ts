import {useGameStore} from '@/stores/gameStore';
import {useEffect}    from 'react';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useAutoDeal = () => {
  const dealNextCard = useGameStore(state => state.dealNextCard);
  const sortPlayerHand = useGameStore(state => state.sortPlayerHand);
  const playNextToField = useGameStore(state => state.playNextToField);
  const playNext7ToField = useGameStore(state => state.playNext7ToField);
  const playNextToDeck = useGameStore(state => state.playNextToDeck);
  const phase = useGameStore(state => state.phase);

  useEffect(() => {
    let cancelled = false;

    const runner = async () => {
      console.log("phase", phase)
      switch (phase) {
        case 'dealing':
          await delay(100);
          useGameStore.setState({phase: 'demo1'});
          break;

        case 'demo1':
          while (!cancelled) {
            const remaining = useGameStore.getState().cards.filter(c => c.location === 'deck').length;
            if (remaining > 0) {
              dealNextCard();
              await delay(100);
            } else {
              sortPlayerHand();
              await delay(500);
              useGameStore.setState({phase: 'demo2'});
              break;
            }
          }
          break;

        case 'demo2':
          playNext7ToField();
          await delay(500);
          useGameStore.setState({phase: 'demo3'});
          break;

        case 'demo3':
          while (!cancelled) {
            useGameStore.getState().updatePlayableFlags()
            const remaining = useGameStore.getState().cards.filter(c =>
              c.location === 'player' || c.location.startsWith('npc'));
            if (remaining.length > 0) {
              playNextToField();
              useGameStore.getState().updatePlayableFlags()
              await delay(1000);
            } else {
              await delay(5000);
              useGameStore.setState({phase: 'demo4'});
              break;
            }
          }
          break;

        case 'demo4':
          playNextToDeck();
          await delay(5000);
          useGameStore.setState({phase: 'demo1'});
          break;

        default:
          console.log(`phase: ${phase}`);
      }
    };

    runner();

    return () => {
      cancelled = true;
    };
  }, [
    phase,
    dealNextCard,
    sortPlayerHand,
    playNextToField,
    playNext7ToField,
    playNextToDeck,
  ]);
};
