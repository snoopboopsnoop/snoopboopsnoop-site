import { useState } from "react";
import type { Brew } from "../types/brew";

type BrewCardProps = {
  brew: Brew;
};

export default function BrewCard({ brew }: BrewCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className="brewCard">
      <button
        className="brewCardButton"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="brewCardMain">
          <div>
            <p className="brewDate">{brew.date}</p>
            <h2>{brew.coffeeName}</h2>
            <p className="brewMeta">
              {brew.roaster} · {brew.method}
            </p>
          </div>

          <div className="brewRating">
            <span>{brew.rating}</span>
            <small>/10</small>
          </div>
        </div>

        <p className="brewRecipe">{brew.recipe}</p>
        <p className="brewPreview">{brew.notes}</p>

        <span className="brewExpandLabel">
          {isOpen ? "Hide details" : "Show details"}
        </span>
      </button>

      {isOpen && (
        <div className="brewDetails">
          <dl>
            <div>
              <dt>Dose</dt>
              <dd>{brew.details.dose}</dd>
            </div>

            <div>
              <dt>Water</dt>
              <dd>{brew.details.water}</dd>
            </div>

            <div>
              <dt>Grind</dt>
              <dd>{brew.details.grind}</dd>
            </div>

            <div>
              <dt>Temperature</dt>
              <dd>{brew.details.temperature}</dd>
            </div>

            <div>
              <dt>Time</dt>
              <dd>{brew.details.time}</dd>
            </div>
          </dl>

          <div className="tastingNotes">
            {brew.details.tastingNotes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}