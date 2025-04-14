"use client"

import GameLayout          from "@/components/GameLayout";
import {useGameStore}      from "@/stores/gameStore";
import {useEffect, useRef} from "react";

const assignInitialCards = () => {
  const {cards, setCardLocation} = useGameStore.getState();
  // 最初の5枚 → プレイヤー（表）
  cards.slice(0, 5).forEach(card =>
    setCardLocation(card.id, 'player', true)
  );
  // 次の5枚 → NPC1（裏）
  cards.slice(5, 10).forEach(card =>
    setCardLocation(card.id, 'npc1', false)
  );
};
export default function HomePage() {

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      assignInitialCards();
      initialized.current = true;
    }
  }, []);
  return <GameLayout/>;
}
