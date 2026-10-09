import type { Concentrate, Mineral, WaterRecipe } from "../types/water";

export const minerals: Mineral[] = ["magnesium-sulfate", "calcium-chloride", "sodium-bicarbonate"];
export const mineralLabels: Record<Mineral, string> = {
  "magnesium-sulfate": "Magnesium sulfate",
  "calcium-chloride": "Calcium chloride",
  "sodium-bicarbonate": "Sodium bicarbonate",
};
export const ionLabels: Record<Mineral, string> = {
  "magnesium-sulfate": "Magnesium (Mg²⁺)",
  "calcium-chloride": "Calcium (Ca²⁺)",
  "sodium-bicarbonate": "Bicarbonate (HCO₃⁻)",
};

// Convert ion mg/L to CaCO3 equivalents. Bicarbonate uses one equivalent;
// calcium and magnesium use two. Whole-salt ppm is deliberately not accepted.
const ionFactors: Record<Mineral, number> = {
  "magnesium-sulfate": 4.118,
  "calcium-chloride": 2.497,
  "sodium-bicarbonate": 0.8202,
};

export function isConcentrate(value: unknown): value is Concentrate {
  if (!value || typeof value !== "object") return false;
  const c = value as Concentrate;
  return typeof c.id === "string" && !!c.id && typeof c.name === "string" && !!c.name.trim()
    && minerals.includes(c.mineral) && (c.basis === "caco3" || c.basis === "ion")
    && Number.isFinite(c.ppmPerDrop) && c.ppmPerDrop > 0
    && Number.isFinite(c.referenceVolumeMl) && c.referenceVolumeMl > 0
    && (c.madeOn === undefined || typeof c.madeOn === "string")
    && (c.notes === undefined || typeof c.notes === "string")
    && (c.archived === undefined || typeof c.archived === "boolean");
}

export function calculateWater(recipe: WaterRecipe) {
  if (!Number.isFinite(recipe.volumeMl) || recipe.volumeMl <= 0) return null;
  let addedGh = 0;
  let addedKh = 0;
  for (const { concentrate, drops } of recipe.additions) {
    if (!isConcentrate(concentrate) || !Number.isSafeInteger(drops) || drops < 0) return null;
    const ppm = concentrate.ppmPerDrop * drops * concentrate.referenceVolumeMl / recipe.volumeMl
      * (concentrate.basis === "ion" ? ionFactors[concentrate.mineral] : 1);
    if (concentrate.mineral === "sodium-bicarbonate") addedKh += ppm;
    else addedGh += ppm;
  }
  if (![addedGh, addedKh].every(Number.isFinite)) return null;
  const validBase = (value: number | undefined) => value !== undefined && Number.isFinite(value) && value >= 0;
  // In coffee, buffering reactions and extraction prevent a true final GH/KH
  // prediction. Post-brew values describe the mineral additions per cup volume.
  return {
    addedGh,
    addedKh,
    gh: recipe.stage === "pre" && validBase(recipe.baseGh) ? addedGh + recipe.baseGh! : undefined,
    kh: recipe.stage === "pre" && validBase(recipe.baseKh) ? addedKh + recipe.baseKh! : undefined,
  };
}

export function calibrationLabel(c: Concentrate) {
  return `${c.ppmPerDrop} ppm/drop in ${c.referenceVolumeMl} mL (${c.basis === "caco3" ? "as CaCO₃" : ionLabels[c.mineral]})`;
}
