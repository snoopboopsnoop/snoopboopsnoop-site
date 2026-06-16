export type Brew = {
  id: string;
  date: string;
  coffeeName: string;
  roaster: string;
  method: string;
  recipe: string;
  rating: number;
  notes: string;
  details: {
    dose: string;
    water: string;
    grind: string;
    temperature: string;
    time: string;
    tastingNotes: string[];
  };
};