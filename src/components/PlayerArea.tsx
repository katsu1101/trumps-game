'use client';

import ParticipantArea from "@/components/ParticipantArea";

export default function PlayerArea() {
  return (
    <div className="flex justify-between items-center h-full">
      <div className="flex flex-col items-center gap-1 landscape:w-[20vw]"/>
      <ParticipantArea key={"player"} playerId={"player"}/>
      <div className="flex flex-col items-center gap-1 landscape:w-[20vw]"/>
    </div>
  );
}
