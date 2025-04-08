import { getPlayerHometown } from "../utils/playerStorage"; // Import if needed directly here, or pass hometown value

// Define the type for a lore level entry
export type LoreLevel = {
  id: string;
  // Lore can now potentially use hometown if provided
  lore: (playerName: string, playerHometown: string) => string;
  nextScreen: string; // The screen key to navigate to next
};

// Expanded list of lore levels
export const LEVELS: LoreLevel[] = [
  {
    id: 'intro',
    // Updated signature to accept hometown, provide default if empty
    lore: (name, hometown) => `In the quiet streets of ${hometown}, ${name} discovered a gift: speed. With worn-out shoes and an unyielding spirit, ${name} trained relentlessly, dreaming of the roar of the stadium crowd. Limited resources were just another hurdle to overcome on the path to glory...`,
    nextScreen: 'CharacterCreator', // Or maybe 'FirstRacePrep'
  },
  {
    id: 'first_race_prep',
    lore: (name) => `The day of the first qualifying round dawns. The air buzzes with nervous energy. ${name} takes a deep breath, remembering the endless miles run on dusty tracks back home. This is the first step. Focus is key.`,
    nextScreen: 'LevelOne', // Assume LevelOne is the first race screen
  },
  {
    id: 'won_round_1',
    lore: (name) => `A stunning performance! ${name} blazed past the competition, securing first place! The crowd noticed. Confidence surges, but the next round will be even tougher. Onwards!`,
    nextScreen: 'LevelTwoPrep', // Navigate to prep for the next level
  },
  {
    id: 'loss_round_1', // Specific loss for round 1
    lore: (name) => `A tough break. ${name} gave it everything, but just missed qualifying. Disappointment stings, but the experience gained is invaluable. Time to analyze, retrain, and come back stronger.`,
    nextScreen: 'MainMenu', // Or 'TrainingMenu'
  },
  {
    id: 'rival_encounter', // Mid-story event
    lore: (name) => `On the warm-up track, ${name} locks eyes with Alex "The Comet" Johnson, the reigning champion. A brief nod is exchanged – a silent acknowledgment of the challenge ahead. The pressure mounts.`,
    nextScreen: 'LevelTwo', // Or 'FinalRacePrep'
  },
  {
    id: 'training_montage', // Could be shown between levels
    lore: (name, hometown) => `Sunrise sprints, grueling hill climbs, endless drills under the watchful eye of Coach Miller. ${name} pushes past exhaustion, fueled by memories of ${hometown || 'home'} and the dream of gold. Each drop of sweat is an investment in speed.`,
    nextScreen: 'NextLevelPrep', // Generic transition
  },
  {
    id: 'injury_scare', // Mid-story challenge
    lore: (name) => `A sharp twinge in the ankle during practice sends a jolt of fear through ${name}. Is it serious? Coach Miller advises caution. Rest or risk it all? The decision weighs heavily.`,
    nextScreen: 'DecisionPoint', // Could lead to a choice or just next race
  },
  {
    id: 'final_prep',
    lore: (name, hometown) => `This is it. The final race. The culmination of years of effort. ${name} thinks of everyone back in ${hometown || 'town'}, their hopes carried on every stride. One last race. Leave nothing on the track.`,
    nextScreen: 'FinalRace',
  },
  {
    id: 'final_win', // Existing final win
    lore: (name, hometown) => `${name}'s perseverance paid off! Crossing the finish line, arms raised high, the roar is deafening. From the dusty tracks of ${hometown || 'a small town'} to champion! A legend is born.`,
    nextScreen: 'Results', // Navigate to results/credits
  },
  {
    id: 'loss', // Generic loss, maybe used for final loss
    lore: (name) => `So close! ${name} ran with heart, pushing to the absolute limit, but it wasn't quite enough today. The dream slips away... for now. Hold your head high.`,
    nextScreen: 'Results', // Navigate to results/credits
  },
];

// Helper function to potentially get lore text, handling missing IDs
export const getLoreText = async (id: string): Promise<string> => {
    const level = LEVELS.find((lvl) => lvl.id === id);
    if (!level) {
        console.warn(`Lore ID "${id}" not found in LEVELS.`);
        return "An unknown chapter unfolds...";
    }

    // Check if lore function needs hometown and retrieve it if necessary
    // NOTE: This adds complexity here. It might be better to pass hometown
    // explicitly when navigating to LoreScreen if needed by that specific lore ID.
    // For simplicity now, we assume LoreScreen fetches name, and we pass it here.
    // If a specific lore needs hometown, LoreScreen would need modification
    // or the calling screen (GameScreen) needs to fetch and pass it.

    // Assuming LoreScreen fetches name:
    // const name = await getPlayerName(); // LoreScreen already does this
    // For lore functions needing hometown:
    // const hometown = await getPlayerHometown();
    // return level.lore(name, hometown);

    // Let's stick to the current LoreScreen setup which only fetches name:
    // const name = await getPlayerName(); // Done inside LoreScreen
    // return level.lore(name); // LoreScreen will call this
    // So, this helper might not be the best place for async name retrieval.
    // Instead, ensure the lore functions handle potentially undefined hometown.

    // Simpler helper (if needed elsewhere, doesn't fetch name):
    // return (name: string, hometown?: string) => level.lore(name, hometown);

    // Let's assume this helper isn't strictly needed, as LoreScreen handles fetching.
    // Just ensure the LEVELS array is correct.
    return "Helper function placeholder"; // Placeholder return
}
