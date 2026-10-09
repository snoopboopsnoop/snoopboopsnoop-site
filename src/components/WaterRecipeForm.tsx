import { useState } from "react";
import type { Mineral } from "../types/water";
import { calibrationLabel, minerals, mineralLabels } from "../lib/water";
import { waterDraftError, waterDraftToRecipe } from "../lib/waterDraft";
import type { WaterDraft } from "../lib/waterDraft";
import { loadConcentrates } from "../lib/waterStorage";
import WaterRecipeSummary from "./WaterRecipeSummary";
import "../styles/water.css";

export default function WaterRecipeForm({ value, onChange }: {
  value: WaterDraft;
  onChange: (value: WaterDraft) => void;
}) {
  const [concentrates, setConcentrates] = useState(loadConcentrates);
  const [refreshed, setRefreshed] = useState(false);
  function updateAddition(mineral: Mineral, changes: Partial<WaterDraft["additions"][Mineral]>) {
    onChange({ ...value, additions: { ...value.additions, [mineral]: { ...value.additions[mineral], ...changes } } });
  }
  const preview = waterDraftToRecipe(value);
  const previewValid = preview && !waterDraftError(value);

  return <section className="brewFormSection waterRecipeSection">
    <div className="brewFormSectionHeading">
      <h2>Water recipe</h2>
      <a className="brewFormSecondaryButton" href="/coffee/water" target="_blank" rel="noreferrer">Manage concentrates ↗</a>
    </div>
    <label className="waterToggle">
      <input type="checkbox" checked={value.enabled} onChange={(e) => onChange({ ...value, enabled: e.target.checked })} />
      Log a water recipe for this brew
    </label>
    {value.enabled && <>
      <div className="brewFormGrid waterFields">
        <label>Minerals added
          <select value={value.stage} onChange={(e) => onChange({ ...value, stage: e.target.value as WaterDraft["stage"] })}>
            <option value="pre">Pre-brew · into water</option>
            <option value="post">Post-brew · into cup</option>
          </select>
        </label>
        <label>{value.stage === "pre" ? "Water mineralized in kettle (mL)" : "Final cup yield (mL)"}
          <input type="number" min="0.01" step="any" required value={value.volume} onChange={(e) => onChange({ ...value, volume: e.target.value })} placeholder="300" />
        </label>
      </div>
      <p className="waterHint">{value.stage === "pre"
        ? "Use the full volume you added drops to, including water left in the kettle. Total water poured is recorded separately above."
        : "Use the cup volume receiving the drops, not total water poured. Cup weight in grams is a practical approximation of mL."}</p>
      <label className="brewFormFullWidth">Base water / source
        <input value={value.source} onChange={(e) => onChange({ ...value, source: e.target.value })} placeholder="Distilled, RO, filtered tap…" />
      </label>
      {value.stage === "pre" && <>
        <div className="brewFormGrid waterFields">
          <label>Base water GH (ppm as CaCO₃)
            <input type="number" min="0" step="any" value={value.baseGh} onChange={(e) => onChange({ ...value, baseGh: e.target.value })} placeholder="Unknown" />
          </label>
          <label>Base water KH / alkalinity (ppm as CaCO₃)
            <input type="number" min="0" step="any" value={value.baseKh} onChange={(e) => onChange({ ...value, baseKh: e.target.value })} placeholder="Unknown" />
          </label>
        </div>
        <p className="waterHint">Enter 0 for a demineralized base, or measured values for other water. Leave unknown values blank to see additions only.</p>
      </>}
      <div className="waterShelfRefresh">
        <span>Choose a batch for each mineral.</span>
        <button type="button" className="brewFormSecondaryButton" onClick={() => { setConcentrates(loadConcentrates()); setRefreshed(true); }}>Refresh shelf</button>
      </div>
      <span className="waterHint" role="status">{refreshed ? "Shelf refreshed. Selected calibrations are preserved; select a batch again to use an updated calibration." : ""}</span>
      {minerals.map((mineral) => {
        const addition = value.additions[mineral];
        const available = concentrates.filter((c) => c.mineral === mineral && !c.archived);
        const exact = available.find((c) => JSON.stringify(c) === JSON.stringify(addition.concentrate));
        const selected = addition.concentrate ? exact?.id ?? "recorded" : "";
        return <div className="waterAdditionRow" key={mineral}>
          <label>{mineralLabels[mineral]} concentrate
            <select value={selected} required={Number(addition.drops) > 0} onChange={(e) => updateAddition(mineral, { concentrate: available.find((c) => c.id === e.target.value) })}>
              <option value="">Select concentrate</option>
              {selected === "recorded" && <option value="recorded">{addition.concentrate?.name} · saved calibration</option>}
              {available.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label>{mineralLabels[mineral]} drops
            <input type="number" min="0" max={Number.MAX_SAFE_INTEGER} step="1" required value={addition.drops} onChange={(e) => updateAddition(mineral, { drops: e.target.value })} />
          </label>
          <p className="waterHint waterCalibration">{addition.concentrate ? calibrationLabel(addition.concentrate) : available.length ? "Select the batch you used." : "No active batches. Add one on the Water shelf, then refresh here."}</p>
        </div>;
      })}
      {previewValid ? <div aria-live="polite"><WaterRecipeSummary recipe={preview} /></div> : <p className="waterHint" role="status">Enter a positive volume and select a concentrate for every mineral with drops to preview GH/KH.</p>}
    </>}
  </section>;
}
