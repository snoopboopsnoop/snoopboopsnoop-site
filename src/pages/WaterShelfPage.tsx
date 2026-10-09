import { useState } from "react";
import type { Concentrate, ConcentrationBasis, Mineral } from "../types/water";
import { calibrationLabel, ionLabels, minerals, mineralLabels } from "../lib/water";
import { loadConcentrates, saveConcentrates } from "../lib/waterStorage";
import "../styles/coffee.css";
import "../styles/brewForm.css";
import "../styles/water.css";

const examples: Record<Mineral, string> = { "magnesium-sulfate": "4.74", "calcium-chloride": "4.10", "sodium-bicarbonate": "1.25" };
const emptyForm = { name: "", mineral: "magnesium-sulfate" as Mineral, ppm: "", volume: "300", basis: "caco3" as ConcentrationBasis, madeOn: "", notes: "" };

export default function WaterShelfPage() {
  const [concentrates, setConcentrates] = useState(loadConcentrates);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string>();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  function persist(next: Concentrate[], message: string) {
    try {
      saveConcentrates(next);
      setConcentrates(next);
      setError("");
      setStatus(message);
      return true;
    } catch {
      setError("Could not save concentrates. Check that browser storage is available and has space.");
      return false;
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !form.basis || !Number.isFinite(Number(form.ppm)) || Number(form.ppm) <= 0 || !Number.isFinite(Number(form.volume)) || Number(form.volume) <= 0) {
      setError("Enter a name, positive calibration and reference volume, and choose what your ppm measures.");
      return;
    }
    const saved: Concentrate = {
      id: editingId ?? globalThis.crypto.randomUUID(),
      name: form.name.trim(), mineral: form.mineral,
      ppmPerDrop: Number(form.ppm), referenceVolumeMl: Number(form.volume), basis: form.basis,
      madeOn: form.madeOn || undefined, notes: form.notes.trim() || undefined,
      archived: concentrates.find((c) => c.id === editingId)?.archived,
    };
    // Re-read so other open tabs' saved batches aren't overwritten.
    const latest = loadConcentrates();
    const next = editingId ? latest.map((c) => c.id === editingId ? saved : c) : [...latest, saved];
    if (persist(next, `${saved.name} saved locally.`)) {
      setForm(emptyForm);
      setEditingId(undefined);
    }
  }

  function edit(c: Concentrate) {
    setEditingId(c.id);
    setForm({ name: c.name, mineral: c.mineral, ppm: String(c.ppmPerDrop), volume: String(c.referenceVolumeMl), basis: c.basis, madeOn: c.madeOn ?? "", notes: c.notes ?? "" });
    setStatus("");
    document.getElementById("concentrate-form")?.scrollIntoView({ behavior: "smooth" });
  }

  return <main className="coffeePage brewFormPage">
    <section className="brewFormShell">
      <header className="brewFormHeader">
        <div><p className="coffeeEyebrow">snoopboopsnoop coffee</p><h1>Water shelf</h1><p>Your mineral concentrate batches, ready for the next brew. Saved only in this browser.</p></div>
        <a className="coffeeButton" href="/coffee">Back to coffee</a>
      </header>
      <p className="waterHint">Name each batch or bottle separately. Archive a finished batch to hide it from new recipes. Existing brews keep the calibration you recorded, even when you edit or archive a batch.</p>
      <div role="status" className="waterHint">{status}</div>
      {error && <p role="alert" className="waterError">{error}</p>}
      <div className="waterShelfList">
        {concentrates.length === 0 && <section className="brewFormSection"><h2>No concentrates yet</h2><p className="waterHint">Add your magnesium sulfate, calcium chloride, and sodium bicarbonate bottles below. You can keep multiple batches of each.</p></section>}
        {concentrates.map((c) => <article className={`brewFormSection ${c.archived ? "waterArchived" : ""}`} key={c.id}>
          <div className="waterBatchHeader">
            <div><h2>{c.name}</h2><p className="waterHint">{mineralLabels[c.mineral]}{c.archived ? " · Archived" : ""}</p></div>
            <div className="waterBatchActions">
              <button type="button" className="brewFormSecondaryButton" onClick={() => edit(c)}>Edit</button>
              <button type="button" className="brewFormSecondaryButton" onClick={() => persist(loadConcentrates().map((batch) => batch.id === c.id ? { ...batch, archived: !batch.archived } : batch), `${c.name} ${c.archived ? "restored" : "archived"}.`)}>{c.archived ? "Restore" : "Archive"}</button>
            </div>
          </div>
          <p>{calibrationLabel(c)}</p>
          {c.madeOn && <p className="waterHint">Made on {c.madeOn}</p>}
          {c.notes && <p className="waterHint">{c.notes}</p>}
        </article>)}
      </div>
      <form className="brewForm" id="concentrate-form" onSubmit={handleSubmit}>
        <section className="brewFormSection">
          <h2>{editingId ? "Edit concentrate" : "Add concentrate"}</h2>
          <div className="brewFormGrid">
            <label>Batch / bottle name<input required maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Magnesium · October batch" /></label>
            <label>Mineral<select value={form.mineral} onChange={(e) => setForm({ ...form, mineral: e.target.value as Mineral })}>{minerals.map((m) => <option value={m} key={m}>{mineralLabels[m]}</option>)}</select></label>
            <label>Concentration per drop (ppm)<input type="number" min="0.000001" step="any" required value={form.ppm} onChange={(e) => setForm({ ...form, ppm: e.target.value })} placeholder={examples[form.mineral]} /></label>
            <label>Reference water volume (mL)<input type="number" min="0.01" step="any" required value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} /></label>
            <label>What does your ppm measure?<select required value={form.basis} onChange={(e) => setForm({ ...form, basis: e.target.value as ConcentrationBasis })}>
              <option value="caco3">{form.mineral === "sodium-bicarbonate" ? "KH / alkalinity" : "GH / hardness"} as CaCO₃</option>
              <option value="ion">{ionLabels[form.mineral]} ion concentration</option>
            </select></label>
            <label>Date made (optional)<input type="date" value={form.madeOn} onChange={(e) => setForm({ ...form, madeOn: e.target.value })} /></label>
          </div>
          <p className="waterHint">Calibration means the ppm added by one drop in the reference volume, not the ppm inside the concentrate bottle. Your calibrations in 300 mL are magnesium sulfate: 4.74 GH, calcium chloride: 4.10 GH, and sodium bicarbonate: 1.25 KH ppm/drop, all as CaCO₃. This basis is selected by default; use ion concentration only for batches calibrated in ion ppm.</p>
          <label className="brewFormFullWidth">Batch notes (optional)<textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Salt form, grams dissolved, stock volume, dropper calibration…" /></label>
          <div className="brewFormActions waterFields">
            {editingId && <button type="button" className="brewFormSecondaryButton" onClick={() => { setForm(emptyForm); setEditingId(undefined); }}>Cancel edit</button>}
            <button className="coffeeButton" type="submit">Save concentrate</button>
          </div>
        </section>
      </form>
      <section className="brewFormSection waterFields waterSources">
        <h2>How the water estimate works</h2>
        <p className="waterHint">Each addition scales as ppm per drop × drops × reference volume ÷ dosed volume. Ion ppm converts to CaCO₃ equivalents: magnesium × 4.118, calcium × 2.497, bicarbonate × 0.8202. GH adds calcium and magnesium; KH here means alkalinity, as in a typical KH drop test.</p>
        <p className="waterHint">Post-brew calculations show added mineral equivalents per cup volume. They do not predict the finished coffee’s measured hardness or alkalinity.</p>
        <p className="waterHint">References: <a href="https://www.baristahustle.com/water-hardness/" target="_blank" rel="noreferrer">GH and KH explained</a> · <a href="https://pubs.usgs.gov/publication/sir20215119/full" target="_blank" rel="noreferrer">USGS hardness calculation</a> · <a href="https://pubs.usgs.gov/wri/wri024045/htms/table6.htm" target="_blank" rel="noreferrer">USGS bicarbonate equivalents</a></p>
      </section>
    </section>
  </main>;
}
