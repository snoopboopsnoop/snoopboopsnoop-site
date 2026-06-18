export type RecipeStep = {
  time: string;
  water: string;
  action: string;
};

export type BrewRecipe = {
  method: string;
  brewer?: string;
  filter?: string;
  grinder?: string;
  grindSetting?: string;
  dose: string;
  totalWater: string;
  waterTemperature?: string;
  totalTime?: string;
  steps: RecipeStep[];
};

export type TastingRatings = {
  acidity?: number;
  sweetness?: number;
  bitterness?: number;
  body?: number;
  clarity?: number;
  balance?: number;
};

export type Brew = {
  id: string;
  date: string;
  beanId: string;
  recipe: BrewRecipe;
  rating?: number;
  ratings?: TastingRatings;
  notes: string;
  tastingNotes: string[];
};