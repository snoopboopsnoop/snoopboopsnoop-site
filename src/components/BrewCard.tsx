import { useState } from "react";
import type { Bean } from "../types/bean";
import type { Brew } from "../types/brew";

type BrewCardProps = {
  brew: Brew;
  bean: Bean;
  isLocal: boolean;
  onDelete: (brewId: string) => void;
};

export default function BrewCard({
  brew,
  bean,
  isLocal,
  onDelete,
}: BrewCardProps) {
  const [openSection, setOpenSection] = useState<
    "coffee" | "recipe" | "notes" | null
  >(null);

  function toggleSection(section: "coffee" | "recipe" | "notes") {
    setOpenSection((current) => (current === section ? null : section));
  }

  return (
    <article className="brewCard">
      <div className="brewCardContent">
        <div className="brewCardMain">
          <div>
            <p className="brewDate">{brew.date}</p>
            <h2>{bean.name}</h2>
            <p className="brewMeta">
              {bean.roaster} · {brew.recipe.method}
            </p>
          </div>

          {brew.rating !== undefined && (
            <div className="brewRating">
              <span>{brew.rating}</span>
              <small>/10</small>
            </div>
          )}
        </div>

        <p className="brewRecipeSummary">
          {brew.recipe.dose} coffee / {brew.recipe.totalWater} water
          {brew.recipe.totalTime ? ` / ${brew.recipe.totalTime}` : ""}
        </p>

        <p className="brewPreview">{brew.notes}</p>

        <div className="brewCardActions">
          <button
            className="brewSectionButton"
            type="button"
            onClick={() => toggleSection("coffee")}
            aria-expanded={openSection === "coffee"}
          >
            {openSection === "coffee" ? "Hide coffee" : "Coffee info"}
          </button>

          <button
            className="brewSectionButton"
            type="button"
            onClick={() => toggleSection("recipe")}
            aria-expanded={openSection === "recipe"}
          >
            {openSection === "recipe" ? "Hide recipe" : "Recipe"}
          </button>

          <button
            className="brewSectionButton"
            type="button"
            onClick={() => toggleSection("notes")}
            aria-expanded={openSection === "notes"}
          >
            {openSection === "notes" ? "Hide notes" : "Tasting"}
          </button>

          {isLocal && (
            <button
              className="brewDeleteButton"
              type="button"
              onClick={() => onDelete(brew.id)}
            >
              Delete brew
            </button>
          )}
        </div>
      </div>

      {openSection === "coffee" && (
        <div className="brewDetails">
          <dl className="coffeeInfoGrid">
            <InfoItem label="Origin" value={bean.origin} />
            <InfoItem label="Region" value={bean.region} />
            <InfoItem label="Farm" value={bean.farm} />
            <InfoItem label="Producer" value={bean.producer} />
            <InfoItem label="Altitude" value={bean.altitude} />
            <InfoItem label="Variety" value={bean.variety} />
            <InfoItem label="Process" value={bean.process} />
            <InfoItem label="Roast date" value={bean.roastDate} />
          </dl>
        </div>
      )}

      {openSection === "recipe" && (
        <div className="brewDetails">
          <dl className="recipeInfoGrid">
            <InfoItem label="Brewer" value={brew.recipe.brewer} />
            <InfoItem label="Filter" value={brew.recipe.filter} />
            <InfoItem label="Grinder" value={brew.recipe.grinder} />
            <InfoItem label="Grind" value={brew.recipe.grindSetting} />
            <InfoItem label="Dose" value={brew.recipe.dose} />
            <InfoItem label="Water" value={brew.recipe.totalWater} />
            <InfoItem
              label="Temperature"
              value={brew.recipe.waterTemperature}
            />
            <InfoItem label="Total time" value={brew.recipe.totalTime} />
          </dl>

          <ol className="recipeSteps">
            {brew.recipe.steps.map((step) => (
              <li key={`${step.time}-${step.water}-${step.action}`}>
                <span className="recipeStepTime">{step.time}</span>
                <span className="recipeStepWater">{step.water}</span>
                <span className="recipeStepAction">{step.action}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {openSection === "notes" && (
        <div className="brewDetails">
          {brew.ratings && (
            <div className="tastingRatings">
              <RatingBar label="Acidity" value={brew.ratings.acidity} />
              <RatingBar label="Sweetness" value={brew.ratings.sweetness} />
              <RatingBar label="Bitterness" value={brew.ratings.bitterness} />
              <RatingBar label="Body" value={brew.ratings.body} />
              <RatingBar label="Clarity" value={brew.ratings.clarity} />
              <RatingBar label="Balance" value={brew.ratings.balance} />
            </div>
          )}

          <p className="brewFullNotes">{brew.notes}</p>

          <div className="tastingNotes">
            {brew.tastingNotes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function RatingBar({
  label,
  value,
}: {
  label: string;
  value: number | undefined;
}) {
  if (value === undefined) {
    return null;
  }

  return (
    <div className="tastingRating">
      <div className="tastingRatingHeader">
        <span>{label}</span>
        <strong>{value}/5</strong>
      </div>

      <div className="tastingRatingTrack" aria-hidden="true">
        <div
          className="tastingRatingFill"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}