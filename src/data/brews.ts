import type { Brew } from "../types/brew";

export const brews: Brew[] = [
  {
    id: "brew-001",
    date: "2026-06-16",
    coffeeName: "Ethiopia Guji",
    roaster: "Example Roaster",
    method: "V60",
    recipe: "15g coffee / 250g water / 4 pours",
    rating: 8,
    notes:
      "Bright and sweet. The cup opened up a lot as it cooled. Could maybe grind slightly finer next time.",
    details: {
      dose: "15g",
      water: "250g",
      grind: "Medium-fine",
      temperature: "94°C",
      time: "2:45",
      tastingNotes: ["peach", "black tea", "honey"],
    },
  },
  {
    id: "brew-002",
    date: "2026-06-15",
    coffeeName: "Colombia Huila",
    roaster: "Another Roaster",
    method: "AeroPress",
    recipe: "12g coffee / 200g water / inverted / 90 sec steep",
    rating: 7,
    notes:
      "Nice body and sweetness, but slightly muted. Try hotter water or a longer steep.",
    details: {
      dose: "12g",
      water: "200g",
      grind: "Medium",
      temperature: "96°C",
      time: "1:45",
      tastingNotes: ["caramel", "red apple", "milk chocolate"],
    },
  },
  {
    id: "brew-003",
    date: "2026-06-14",
    coffeeName: "Kenya Nyeri",
    roaster: "Snoop Test Roasts",
    method: "Origami",
    recipe: "16g coffee / 260g water / bloom + 3 pours",
    rating: 9,
    notes:
      "Really juicy and clear. Best cup so far. Keep this recipe around.",
    details: {
      dose: "16g",
      water: "260g",
      grind: "Medium-fine",
      temperature: "95°C",
      time: "3:05",
      tastingNotes: ["blackcurrant", "citrus", "brown sugar"],
    },
  },
  {
    id: "brew-004",
    date: "2026-06-14",
    coffeeName: "Kenya Nyeri",
    roaster: "Snoop Test Roasts",
    method: "Origami",
    recipe: "16g coffee / 260g water / bloom + 3 pours",
    rating: 9,
    notes:
      "Really juicy and clear. Best cup so far. Keep this recipe around.",
    details: {
      dose: "16g",
      water: "260g",
      grind: "Medium-fine",
      temperature: "95°C",
      time: "3:05",
      tastingNotes: ["blackcurrant", "citrus", "brown sugar"],
    },
  },
  {
    id: "brew-005",
    date: "2026-06-14",
    coffeeName: "Kenya Nyeri",
    roaster: "Snoop Test Roasts",
    method: "Origami",
    recipe: "16g coffee / 260g water / bloom + 3 pours",
    rating: 9,
    notes:
      "Really juicy and clear. Best cup so far. Keep this recipe around.",
    details: {
      dose: "16g",
      water: "260g",
      grind: "Medium-fine",
      temperature: "95°C",
      time: "3:05",
      tastingNotes: ["blackcurrant", "citrus", "brown sugar"],
    },
  },
];