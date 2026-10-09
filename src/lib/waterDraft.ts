import type { Concentrate, Mineral, WaterRecipe } from "../types/water";
import { calculateWater, minerals, mineralLabels } from "./water.ts";

export type WaterDraft = {
  enabled: boolean;
  stage: "pre" | "post";
  volume: string;
  source: string;
  baseGh: string;
  baseKh: string;
  additions: Record<Mineral, { concentrate?: Concentrate; drops: string }>;
};

export function createWaterDraft(recipe?: WaterRecipe): WaterDraft {
  return {
    enabled: !!recipe,
    stage: recipe?.stage ?? "pre",
    volume: recipe ? String(recipe.volumeMl) : "",
    source: recipe?.source ?? "",
    baseGh: recipe?.baseGh === undefined ? "" : String(recipe.baseGh),
    baseKh: recipe?.baseKh === undefined ? "" : String(recipe.baseKh),
    additions: Object.fromEntries(minerals.map((mineral) => {
      const saved = recipe?.additions.find((a) => a.concentrate.mineral === mineral);
      return [mineral, { concentrate: saved?.concentrate, drops: String(saved?.drops ?? 0) }];
    })) as WaterDraft["additions"],
  };
}

export function waterDraftToRecipe(draft: WaterDraft): WaterRecipe | undefined {
  if (!draft.enabled) return undefined;
  return {
    stage: draft.stage,
    volumeMl: Number(draft.volume),
    source: draft.source.trim() || undefined,
    baseGh: draft.stage === "pre" && draft.baseGh.trim() ? Number(draft.baseGh) : undefined,
    baseKh: draft.stage === "pre" && draft.baseKh.trim() ? Number(draft.baseKh) : undefined,
    additions: minerals.flatMap((mineral) => {
      const a = draft.additions[mineral];
      return a.concentrate ? [{ concentrate: { ...a.concentrate }, drops: Number(a.drops) }] : [];
    }),
  };
}

export function waterDraftError(draft: WaterDraft): string | undefined {
  if (!draft.enabled) return undefined;
  if (!draft.volume.trim() || !Number.isFinite(Number(draft.volume)) || Number(draft.volume) <= 0) return "Enter a positive water volume.";
  if (draft.stage === "pre" && [draft.baseGh, draft.baseKh].some((v) => v.trim() && (!Number.isFinite(Number(v)) || Number(v) < 0))) return "Base GH and KH must be non-negative numbers or left blank.";
  for (const mineral of minerals) {
    const a = draft.additions[mineral];
    if (!a.drops.trim() || !Number.isSafeInteger(Number(a.drops)) || Number(a.drops) < 0) return `Enter a whole, non-negative number of ${mineralLabels[mineral].toLowerCase()} drops.`;
    if (Number(a.drops) > 0 && !a.concentrate) return `Select a ${mineralLabels[mineral].toLowerCase()} concentrate.`;
  }
  const recipe = waterDraftToRecipe(draft)!;
  const result = calculateWater(recipe);
  if (!result || [result.gh, result.kh].some((v) => v !== undefined && !Number.isFinite(v))) return "Check the concentrate calibration and water volume; this recipe cannot be calculated.";
  return undefined;
}
