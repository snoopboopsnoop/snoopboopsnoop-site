import type { WaterRecipe } from "../types/water";
import { calculateWater, calibrationLabel, mineralLabels } from "../lib/water";
import "../styles/water.css";

export default function WaterRecipeSummary({ recipe }: { recipe: WaterRecipe }) {
  const result = calculateWater(recipe);
  if (!result) return <p className="waterHint">Water recipe has an invalid volume or calibration.</p>;
  return <div className="waterSummary">
    <p className="waterSummaryTitle">{recipe.stage === "pre" ? "Pre-brew water" : "Post-brew additions"} · {recipe.volumeMl} mL{recipe.source ? ` · ${recipe.source}` : ""}</p>
    <div className="waterMetrics">
      <div><span>{result.gh === undefined ? "Added GH" : "Estimated GH"}</span><strong>{(result.gh ?? result.addedGh).toFixed(1)} <small>ppm</small></strong></div>
      <div><span>{result.kh === undefined ? "Added KH / alkalinity" : "Estimated KH / alkalinity"}</span><strong>{(result.kh ?? result.addedKh).toFixed(1)} <small>ppm</small></strong></div>
    </div>
    <p className="waterHint">All values as CaCO₃. {recipe.stage === "post"
      ? "These are mineral additions per cup volume, not measured final coffee GH/KH; extraction and buffering reactions are not modeled."
      : `Additions: GH ${result.addedGh.toFixed(1)}, KH ${result.addedKh.toFixed(1)} ppm. Base GH: ${recipe.baseGh ?? "unknown"}; base KH: ${recipe.baseKh ?? "unknown"}. Estimates describe the mixed water before heating or extraction.`}</p>
    <ul className="waterDoseList">{recipe.additions.map(({ concentrate, drops }) => <li key={concentrate.mineral}>
      <strong>{mineralLabels[concentrate.mineral]}: {drops} drops</strong> · {concentrate.name}
      <span>{calibrationLabel(concentrate)}</span>
    </li>)}</ul>
  </div>;
}
