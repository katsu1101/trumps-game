export type StrategyType = {
  type: 'random' | 'first' | 'center' | 'edge',
  passChance: number,  // パスする確率
  // aggressiveLevel: number, // 積極性
};

export type LinesType = Partial<{
  start: string[];
  playCard: string[];
  pass: string[];
  giveUp: string[];
  win: string[];
}>;

export type ParticipantType = {
  id: string;
  name: string;
  strategy: StrategyType;
  img: string;
  colors: { background: string; text: string; border: string; }
  lines: LinesType;
};

export type ParticipantsList = ParticipantType[];
