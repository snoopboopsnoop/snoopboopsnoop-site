import { useState } from "react";
import { addLocalBean } from "../lib/beanStorage";
import type { BeanStatus } from "../types/bean";
import "../styles/coffee.css";
import "../styles/beanForm.css";

function withUnit(value: string, unit: string) {
  const trimmedValue = value.trim();

  return trimmedValue ? `${trimmedValue}${unit}` : undefined;
}

export default function AddBeanPage() {
  const [name, setName] = useState("");
  const [roaster, setRoaster] = useState("");

  const [origin, setOrigin] = useState("");
  const [region, setRegion] = useState("");
  const [farm, setFarm] = useState("");
  const [producer, setProducer] = useState("");
  const [altitude, setAltitude] = useState("");
  const [variety, setVariety] = useState("");
  const [process, setProcess] = useState("");

  const [roastDate, setRoastDate] = useState("");
  const [openedDate, setOpenedDate] = useState("");

  const [bagSize, setBagSize] = useState("");
  const [remaining, setRemaining] = useState("");

  const [tastingNotes, setTastingNotes] = useState("");
  const [status, setStatus] = useState<BeanStatus>("current");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name || !roaster) {
      return;
    }

    addLocalBean({
      id: globalThis.crypto?.randomUUID?.() ?? `bean-${Date.now()}`,
      name,
      roaster,

      origin: origin || undefined,
      region: region || undefined,
      farm: farm || undefined,
      producer: producer || undefined,
      altitude: altitude || undefined,
      variety: variety || undefined,
      process: process || undefined,

      roastDate: roastDate || undefined,
      openedDate: openedDate || undefined,

      bagSize: withUnit(bagSize, "g"),
      remaining: withUnit(remaining, "g"),

      tastingNotes: tastingNotes
        .split(",")
        .map((note) => note.trim())
        .filter(Boolean),

      status,
    });

    window.location.href = "/coffee/beans";
  }

  return (
    <main className="coffeePage beanFormPage">
      <section className="beanFormShell">
        <header className="beanFormHeader">
          <div>
            <p className="coffeeEyebrow">snoopboopsnoop coffee</p>
            <h1>Add bean</h1>
            <p>
              This coffee bag will be saved only in this browser. It will not
              change the public catalogue for other visitors.
            </p>
          </div>

          <a className="coffeeButton beanFormBackButton" href="/coffee/beans">
            Back to beans
          </a>
        </header>

        <form className="beanForm" onSubmit={handleSubmit}>
          <section className="beanFormSection">
            <h2>Bag basics</h2>

            <div className="beanFormGrid">
              <label>
                Coffee name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ethiopia Guji"
                  required
                />
              </label>

              <label>
                Roaster
                <input
                  value={roaster}
                  onChange={(event) => setRoaster(event.target.value)}
                  placeholder="Example Roaster"
                  required
                />
              </label>

              <label>
                Status
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as BeanStatus)
                  }
                >
                  <option value="current">Current</option>
                  <option value="finished">Finished</option>
                  <option value="archived">Archived</option>
                </select>
              </label>

              <label>
                Bag size (g)
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={bagSize}
                  onChange={(event) => setBagSize(event.target.value)}
                  placeholder="250"
                />
              </label>

              <label>
                Remaining (g)
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={remaining}
                  onChange={(event) => setRemaining(event.target.value)}
                  placeholder="180"
                />
              </label>
            </div>
          </section>

          <section className="beanFormSection">
            <h2>Coffee information</h2>

            <div className="beanFormGrid">
              <label>
                Origin
                <input
                  value={origin}
                  onChange={(event) => setOrigin(event.target.value)}
                  placeholder="Ethiopia"
                />
              </label>

              <label>
                Region
                <input
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  placeholder="Guji"
                />
              </label>

              <label>
                Farm / washing station
                <input
                  value={farm}
                  onChange={(event) => setFarm(event.target.value)}
                  placeholder="Gachatha Factory"
                />
              </label>

              <label>
                Producer
                <input
                  value={producer}
                  onChange={(event) => setProducer(event.target.value)}
                  placeholder="Producer name"
                />
              </label>

              <label>
                Altitude
                <input
                  value={altitude}
                  onChange={(event) => setAltitude(event.target.value)}
                  placeholder="1,900–2,100 masl"
                />
              </label>

              <label>
                Variety
                <input
                  value={variety}
                  onChange={(event) => setVariety(event.target.value)}
                  placeholder="Heirloom"
                />
              </label>

              <label>
                Process
                <input
                  value={process}
                  onChange={(event) => setProcess(event.target.value)}
                  placeholder="Washed"
                />
              </label>

              <label>
                Roast date
                <input
                  type="date"
                  value={roastDate}
                  onChange={(event) => setRoastDate(event.target.value)}
                />
              </label>

              <label>
                Opened date
                <input
                  type="date"
                  value={openedDate}
                  onChange={(event) => setOpenedDate(event.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="beanFormSection">
            <h2>Tasting notes</h2>

            <label className="beanFormFullWidth">
              Notes, separated by commas
              <input
                value={tastingNotes}
                onChange={(event) => setTastingNotes(event.target.value)}
                placeholder="peach, black tea, honey"
              />
            </label>
          </section>

          <div className="beanFormActions">
            <a className="beanFormSecondaryButton" href="/coffee/beans">
              Cancel
            </a>

            <button className="coffeeButton" type="submit">
              Save bean locally
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}