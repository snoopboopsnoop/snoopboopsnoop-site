import { useState } from "react";
import { beans } from "../data/beans";
import { loadLocalBeans } from "../lib/beanStorage";
import { loadLocalBrews, updateLocalBrew } from "../lib/brewStorage";
import type { Brew, RecipeStep, TastingRatings } from "../types/brew";
import "../styles/coffee.css";
import "../styles/brewForm.css";

const ratingKeys = [
  "acidity",
  "sweetness",
  "bitterness",
  "body",
  "clarity",
  "balance",
] as const;

type RatingKey = (typeof ratingKeys)[number];

function getBrewIdFromPath() {
  return window.location.pathname.split("/").pop() ?? "";
}

function removeUnit(value: string | undefined, unit: string) {
  if (!value) {
    return "";
  }

  return value.replace(unit, "").trim();
}

export default function EditBrewPage() {
  const brewId = getBrewIdFromPath();

  const brew = loadLocalBrews().find(
    (currentBrew) => currentBrew.id === brewId,
  );

  if (!brew) {
    return (
      <main className="coffeePage brewFormPage">
        <section className="brewFormShell">
          <h1>Brew not found</h1>
          <a className="coffeeButton" href="/coffee/journal">
            Back to journal
          </a>
        </section>
      </main>
    );
  }

  return <EditBrewForm brew={brew} />;
}

function EditBrewForm({ brew }: { brew: Brew }) {
  const allBeans = [...loadLocalBeans(), ...beans];
  const currentBeans = allBeans.filter((bean) => bean.status === "current");

  const [beanId, setBeanId] = useState(brew.beanId);
  const [date, setDate] = useState(brew.date);

  const [method, setMethod] = useState(brew.recipe.method);
  const [brewer, setBrewer] = useState(brew.recipe.brewer ?? "");
  const [filter, setFilter] = useState(brew.recipe.filter ?? "");
  const [grinder, setGrinder] = useState(brew.recipe.grinder ?? "");
  const [grindSetting, setGrindSetting] = useState(
    brew.recipe.grindSetting ?? "",
  );

  const [dose, setDose] = useState(removeUnit(brew.recipe.dose, "g"));
  const [totalWater, setTotalWater] = useState(
    removeUnit(brew.recipe.totalWater, "g"),
  );
  const [waterTemperature, setWaterTemperature] = useState(
    removeUnit(brew.recipe.waterTemperature, "°C"),
  );
  const [totalTime, setTotalTime] = useState(brew.recipe.totalTime ?? "");

  const [rating, setRating] = useState(
    brew.rating !== undefined ? String(brew.rating) : "",
  );
  const [notes, setNotes] = useState(brew.notes);
  const [tastingNotes, setTastingNotes] = useState(
    brew.tastingNotes.join(", "),
  );

  const [ratings, setRatings] = useState<Record<RatingKey, string>>({
    acidity: String(brew.ratings?.acidity ?? 0),
    sweetness: String(brew.ratings?.sweetness ?? 0),
    bitterness: String(brew.ratings?.bitterness ?? 0),
    body: String(brew.ratings?.body ?? 0),
    clarity: String(brew.ratings?.clarity ?? 0),
    balance: String(brew.ratings?.balance ?? 0),
  });

  const [steps, setSteps] = useState<RecipeStep[]>(
    brew.recipe.steps.map((step) => ({
      ...step,
      water: removeUnit(step.water, "g"),
    })),
  );

  function withUnit(value: string, unit: string) {
    const trimmed = value.trim();
    return trimmed ? `${trimmed}${unit}` : undefined;
  }

  function updateStep(
    index: number,
    field: keyof RecipeStep,
    value: string,
  ) {
    setSteps((currentSteps) =>
      currentSteps.map((step, stepIndex) =>
        stepIndex === index ? { ...step, [field]: value } : step,
      ),
    );
  }

  function addStep() {
    setSteps((currentSteps) => [
      ...currentSteps,
      {
        time: "",
        water: "",
        action: `Pour ${currentSteps.length}`,
      },
    ]);
  }

  function removeStep(index: number) {
    setSteps((currentSteps) =>
      currentSteps.filter((_, stepIndex) => stepIndex !== index),
    );
  }

  function updateRating(key: RatingKey, value: string) {
    setRatings((currentRatings) => ({
      ...currentRatings,
      [key]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const tastingRatings: TastingRatings = {};

    for (const key of ratingKeys) {
      const value = Number(ratings[key]);

      if (value >= 0 && value <= 5) {
        tastingRatings[key] = value;
      }
    }

    updateLocalBrew({
      ...brew,
      date,
      beanId,
      recipe: {
        method,
        brewer: brewer || undefined,
        filter: filter || undefined,
        grinder: grinder || undefined,
        grindSetting: grindSetting || undefined,
        dose: withUnit(dose, "g") ?? "",
        totalWater: withUnit(totalWater, "g") ?? "",
        waterTemperature: withUnit(waterTemperature, "°C"),
        totalTime: totalTime || undefined,
        steps: steps.map((step) => ({
          ...step,
          water: withUnit(step.water, "g") ?? "",
        })),
      },
      rating: rating ? Number(rating) : undefined,
      ratings: tastingRatings,
      notes,
      tastingNotes: tastingNotes
        .split(",")
        .map((note) => note.trim())
        .filter(Boolean),
    });

    window.location.href = "/coffee/journal";
  }

  return (
    <main className="coffeePage brewFormPage">
      <section className="brewFormShell">
        <header className="brewFormHeader">
          <div>
            <p className="coffeeEyebrow">snoopboopsnoop coffee</p>
            <h1>Edit brew</h1>
            <p>Changes are saved only in this browser.</p>
          </div>

          <a className="coffeeButton journalBackButton" href="/coffee/journal">
            Back to journal
          </a>
        </header>

        <form className="brewForm" onSubmit={handleSubmit}>
          <section className="brewFormSection">
            <h2>Basic brew info</h2>

            <div className="brewFormGrid">
              <label>
                Coffee bean
                <select
                  value={beanId}
                  onChange={(event) => setBeanId(event.target.value)}
                >
                  {currentBeans.map((bean) => (
                    <option key={bean.id} value={bean.id}>
                      {bean.roaster} — {bean.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Date
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>

              <label>
                Method
                <input
                  value={method}
                  onChange={(event) => setMethod(event.target.value)}
                />
              </label>

              <label>
                Overall rating / 10
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={rating}
                  onChange={(event) => setRating(event.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="brewFormSection">
            <h2>Equipment and recipe</h2>

            <div className="brewFormGrid">
              <label>
                Brewer
                <input
                  value={brewer}
                  onChange={(event) => setBrewer(event.target.value)}
                />
              </label>

              <label>
                Filter
                <input
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                />
              </label>

              <label>
                Grinder
                <input
                  value={grinder}
                  onChange={(event) => setGrinder(event.target.value)}
                />
              </label>

              <label>
                Grind setting
                <input
                  value={grindSetting}
                  onChange={(event) => setGrindSetting(event.target.value)}
                />
              </label>

              <label>
                Dose (g)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={dose}
                  onChange={(event) => setDose(event.target.value)}
                />
              </label>

              <label>
                Total water (g)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={totalWater}
                  onChange={(event) => setTotalWater(event.target.value)}
                />
              </label>

              <label>
                Water temperature (°C)
                <input
                  type="number"
                  min="0"
                  value={waterTemperature}
                  onChange={(event) =>
                    setWaterTemperature(event.target.value)
                  }
                />
              </label>

              <label>
                Total time
                <input
                  value={totalTime}
                  onChange={(event) => setTotalTime(event.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="brewFormSection">
            <div className="brewFormSectionHeading">
              <h2>Recipe steps</h2>

              <button
                className="brewFormSecondaryButton"
                type="button"
                onClick={addStep}
              >
                Add step
              </button>
            </div>

            <div className="recipeStepFormList">
              {steps.map((step, index) => (
                <div className="recipeStepFormRow" key={index}>
                  <label>
                    Time
                    <input
                      value={step.time}
                      onChange={(event) =>
                        updateStep(index, "time", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Water (g)
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={step.water}
                      onChange={(event) =>
                        updateStep(index, "water", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Action
                    <input
                      value={step.action}
                      onChange={(event) =>
                        updateStep(index, "action", event.target.value)
                      }
                    />
                  </label>

                  <button
                    className="brewFormRemoveButton"
                    type="button"
                    onClick={() => removeStep(index)}
                    disabled={steps.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="brewFormSection">
            <h2>Tasting</h2>

            <div className="ratingFormGrid">
              {ratingKeys.map((key) => (
                <div className="ratingSlider" key={key}>
                  <div className="ratingSliderHeader">
                    <span>{key}</span>
                    <strong>{ratings[key]}/5</strong>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={ratings[key]}
                    onChange={(event) =>
                      updateRating(key, event.target.value)
                    }
                    aria-label={`${key} rating`}
                  />
                </div>
              ))}
            </div>

            <label className="brewFormFullWidth">
              Tasting notes
              <input
                value={tastingNotes}
                onChange={(event) => setTastingNotes(event.target.value)}
              />
            </label>

            <label className="brewFormFullWidth">
              Brew notes
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={6}
              />
            </label>
          </section>

          <div className="brewFormActions">
            <a className="brewFormSecondaryButton" href="/coffee/journal">
              Cancel
            </a>

            <button className="coffeeButton" type="submit">
              Save changes
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}