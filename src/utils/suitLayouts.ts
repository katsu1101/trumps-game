// suitLayouts.ts
export type Position = { top: string; left: string };

export const suitLayouts: Record<number, Position[]> = {
  1: [
    {top: '50%', left: '50%'}
  ],
  2: [
    {top: '20%', left: '50%'},
    {top: '80%', left: '50%'},
  ],
  3: [
    {top: '20%', left: '50%'},
    {top: '50%', left: '50%'},
    {top: '80%', left: '50%'},
  ],
  4: [
    {top: '20%', left: '35%'},
    {top: '20%', left: '65%'},
    {top: '80%', left: '35%'},
    {top: '80%', left: '65%'},
  ],
  5: [
    {top: '20%', left: '35%'},
    {top: '20%', left: '65%'},
    {top: '50%', left: '50%'},
    {top: '80%', left: '35%'},
    {top: '80%', left: '65%'},
  ],
  6: [
    {top: '20%', left: '35%'},
    {top: '50%', left: '35%'},
    {top: '80%', left: '35%'},
    {top: '20%', left: '65%'},
    {top: '50%', left: '65%'},
    {top: '80%', left: '65%'},
  ],
  7: [
    {top: '20%', left: '35%'},
    {top: '50%', left: '35%'},
    {top: '80%', left: '35%'},
    {top: '20%', left: '65%'},
    {top: '50%', left: '65%'},
    {top: '80%', left: '65%'},
    {top: '35%', left: '50%'},
  ],
  8: [
    {top: '20%', left: '35%'},
    {top: '40%', left: '35%'},
    {top: '60%', left: '35%'},
    {top: '80%', left: '35%'},
    {top: '20%', left: '65%'},
    {top: '40%', left: '65%'},
    {top: '60%', left: '65%'},
    {top: '80%', left: '65%'},
  ],
  9: [
    {top: '20%', left: '35%'},
    {top: '40%', left: '35%'},
    {top: '60%', left: '35%'},
    {top: '80%', left: '35%'},
    {top: '20%', left: '65%'},
    {top: '40%', left: '65%'},
    {top: '60%', left: '65%'},
    {top: '80%', left: '65%'},
    {top: '50%', left: '50%'},
  ],
  10: [
    {top: '20%', left: '35%'},
    {top: '35%', left: '35%'},
    {top: '50%', left: '35%'},
    {top: '65%', left: '35%'},
    {top: '80%', left: '35%'},
    {top: '20%', left: '65%'},
    {top: '35%', left: '65%'},
    {top: '50%', left: '65%'},
    {top: '65%', left: '65%'},
    {top: '80%', left: '65%'},
  ],
};
