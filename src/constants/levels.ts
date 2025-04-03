export type LoreLevel = {
    id: string;
    lore: (playerName: string) => string;
    nextScreen: string;
  };
  
  export const LEVELS: LoreLevel[] = [
    {
      id: 'intro',
      lore: (name) => `${name} was a track runner from a small town with limited resources...`,
      nextScreen: 'LevelOne',
    },
    {
      id: 'won-round-1',
      lore: (name) => `${name} came in first place! Moving on to the next round...`,
      nextScreen: 'LevelTwo',
    },
    {
      id: 'final-win',
      lore: (name) => `${name}'s perseverance paid off...`,
      nextScreen: 'Results',
    },
    {
      id: 'loss',
      lore: (name) => `So close! ${name} couldn't quite cut it. Better luck next time.`,
      nextScreen: 'Results',
    },
  ];
  