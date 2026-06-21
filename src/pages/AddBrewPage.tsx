import { useState } from "react";
import { beans } from "../data/beans";
import { addLocalBrew } from "../lib/brewStorage";
import { loadLocalBeans } from "../lib/beanStorage";
import type { RecipeStep, TastingRatings } from "../types/brew";
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

function withUnit(value: string, unit: string) {
  const trimmedValue = value.trim();

  return trimmedValue ? `${trimmedValue}${unit}` : undefined;
}

export default function AddBrewPage() {
  const [localBeans] = useState(loadLocalBeans);

  const currentBeans = [...localBeans, ...beans].filter(
    (bean) => bean.status === "current",
  );

  const [beanId, setBeanId] = useState(currentBeans[0]?.id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [method, setMethod] = useState("V60");
  const [brewer, setBrewer] = useState("");
  const [filter, setFilter] = useState("");
  const [grinder, setGrinder] = useState("");
  const [grindSetting, setGrindSetting] = useState("");

  const [dose, setDose] = useState("");
  const [totalWater, setTotalWater] = useState("");
  const [waterTemperature, setWaterTemperature] = useState("");
  const [totalTime, setTotalTime] = useState("");

  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");
  const [tastingNotes, setTastingNotes] = useState("");

  const [ratings, setRatings] = useState<Record<RatingKey, string>>({
    acidity: "0",
    sweetness: "0",
    bitterness: "0",
    body: "0",
    clarity: "0",
    balance: "0",
  });

  const [steps, setSteps] = useState<RecipeStep[]>([
    {
      time: "0:00",
      water: "",
      action: "Bloom",
    },
  ]);

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
    setSteps((currentSteps) => {
      const pourNumber = currentSteps.length;

      return [
        ...currentSteps,
        {
          time: "",
          water: "",
          action: `Pour ${pourNumber}`,
        },
      ];
    });
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

    if (!beanId || !method || !dose || !totalWater || !notes) {
      return;
    }

    const tastingRatings: TastingRatings = {};

    for (const key of ratingKeys) {
      const value = Number(ratings[key]);

      if (value >= 0 && value <= 5) {
        tastingRatings[key] = value;
      }
    }

    const cleanedSteps = steps.filter(
      (step) => step.time || step.water || step.action,
    );

    const newBrew = {
      id: globalThis.crypto?.randomUUID?.() ?? `brew-${Date.now()}`,
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
        steps: cleanedSteps.map((step) => ({
          ...step,
          water: withUnit(step.water, "g") ?? "",
        })),
      },
      rating: rating ? Number(rating) : undefined,
      ratings:
        Object.keys(tastingRatings).length > 0 ? tastingRatings : undefined,
      notes,
      tastingNotes: tastingNotes
        .split(",")
        .map((note) => note.trim())
        .filter(Boolean),
    };

    addLocalBrew(newBrew);

    window.location.href = "/coffee/journal";
  }

  return (
    <main className="coffeePage brewFormPage">
      <section className="brewFormShell">
        <header className="brewFormHeader">
          <div>
            <p className="coffeeEyebrow">snoopboopsnoop coffee</p>
            <h1>Add brew</h1>
            <p>
              This brew will be saved only in this browser. It will not modify
              the public site or anyone else’s journal.
            </p>
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
                  required
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
                  required
                />
              </label>

              <label>
                Method
                <input
                  value={method}
                  onChange={(event) => setMethod(event.target.value)}
                  placeholder="V60"
                  required
                />
              </label>

              <label>
                Overall rating / 10
                <input
                  type="number"
                  min="1"
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
                  placeholder="Hario V60 02"
                />
              </label>

              <label>
                Filter
                <input
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  placeholder="Cafec Abaca"
                />
              </label>

              <label>
                Grinder
                <input
                  value={grinder}
                  onChange={(event) => setGrinder(event.target.value)}
                  placeholder="Your grinder"
                />
              </label>

              <label>
                Grind setting
                <input
                  value={grindSetting}
                  onChange={(event) => setGrindSetting(event.target.value)}
                  placeholder="Medium-fine"
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
                  placeholder="15"
                  required
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
                  placeholder="250"
                  required
                />
              </label>

              <label>
                Water temperature (°C)
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={waterTemperature}
                  onChange={(event) => setWaterTemperature(event.target.value)}
                  placeholder="94"
                />
              </label>

              <label>
                Total time
                <input
                  value={totalTime}
                  onChange={(event) => setTotalTime(event.target.value)}
                  placeholder="2:45"
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
                      placeholder="0:45"
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
                      placeholder="120"
                    />
                  </label>

                  <label>
                    Action
                    <input
                      value={step.action}
                      onChange={(event) =>
                        updateStep(index, "action", event.target.value)
                      }
                      placeholder="First pour"
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
                          onChange={(event) => updateRating(key, event.target.value)}
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
                placeholder="peach, black tea, honey"
              />
            </label>

            <label className="brewFormFullWidth">
              Brew notes
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="What happened? What would you change next time?"
                rows={6}
                required
              />
            </label>
          </section>

          <div className="brewFormActions">
            <a className="brewFormSecondaryButton" href="/coffee/journal">
              Cancel
            </a>

            <button className="coffeeButton" type="submit">
              Save brew locally
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}