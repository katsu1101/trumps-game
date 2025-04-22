'use client';

import ParticipantArea from "@/components/ParticipantArea";

export default function PlayerArea() {
  return (
    <div className="flex justify-between items-center h-full">
      <div className="flex flex-col items-center gap-1 landscape:w-[20vw]"/>
      <ParticipantArea key={"player"} playerId={"player"} label="🧑 プレイヤー"/>
      <div className="flex flex-col items-center gap-1 landscape:w-[20vw]"/>
    </div>
  );
}
