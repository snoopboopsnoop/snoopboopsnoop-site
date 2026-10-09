export type Mineral = "magnesium-sulfate" | "calcium-chloride" | "sodium-bicarbonate";
export type ConcentrationBasis = "caco3" | "ion";

export type Concentrate = {
  id: string;
  name: string;
  mineral: Mineral;
  ppmPerDrop: number;
  referenceVolumeMl: number;
  basis: ConcentrationBasis;
  madeOn?: string;
  notes?: string;
  archived?: boolean;
};

export type WaterRecipe = {
  stage: "pre" | "post";
  volumeMl: number;
  source?: string;
  baseGh?: number;
  baseKh?: number;
  // Keep the batch calibration with the brew, independent of shelf edits.
  additions: { concentrate: Concentrate; drops: number }[];
};
