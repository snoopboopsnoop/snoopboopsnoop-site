import { useState } from "react";
import { loadLocalBeans, updateLocalBean } from "../lib/beanStorage";
import type { Bean, BeanStatus } from "../types/bean";
import "../styles/coffee.css";
import "../styles/beanForm.css";

function getBeanIdFromPath() {
  return window.location.pathname.split("/").pop() ?? "";
}

function removeUnit(value: string | undefined, unit: string) {
  if (!value) {
    return "";
  }

  return value.replace(unit, "").trim();
}

export default function EditBeanPage() {
  const beanId = getBeanIdFromPath();

  const bean = loadLocalBeans().find(
    (currentBean) => currentBean.id === beanId,
  );

  if (!bean) {
    return (
      <main className="coffeePage beanFormPage">
        <section className="beanFormShell">
          <h1>Bean not found</h1>
          <a className="coffeeButton" href="/coffee/beans">
            Back to beans
          </a>
        </section>
      </main>
    );
  }

  return <EditBeanForm bean={bean} />;
}

function EditBeanForm({ bean }: { bean: Bean }) {
  const [name, setName] = useState(bean.name);
  const [roaster, setRoaster] = useState(bean.roaster);

  const [origin, setOrigin] = useState(bean.origin ?? "");
  const [region, setRegion] = useState(bean.region ?? "");
  const [farm, setFarm] = useState(bean.farm ?? "");
  const [producer, setProducer] = useState(bean.producer ?? "");
  const [altitude, setAltitude] = useState(bean.altitude ?? "");
  const [variety, setVariety] = useState(bean.variety ?? "");
  const [process, setProcess] = useState(bean.process ?? "");

  const [roastDate, setRoastDate] = useState(bean.roastDate ?? "");
  const [openedDate, setOpenedDate] = useState(bean.openedDate ?? "");

  const [bagSize, setBagSize] = useState(removeUnit(bean.bagSize, "g"));
  const [remaining, setRemaining] = useState(removeUnit(bean.remaining, "g"));

  const [tastingNotes, setTastingNotes] = useState(
    bean.tastingNotes?.join(", ") ?? "",
  );

  const [status, setStatus] = useState<BeanStatus>(bean.status);

  function withUnit(value: string, unit: string) {
    const trimmed = value.trim();
    return trimmed ? `${trimmed}${unit}` : undefined;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateLocalBean({
      ...bean,
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
            <h1>Edit bean</h1>
            <p>Changes are saved only in this browser.</p>
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
                  required
                />
              </label>

              <label>
                Roaster
                <input
                  value={roaster}
                  onChange={(event) => setRoaster(event.target.value)}
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
                  value={bagSize}
                  onChange={(event) => setBagSize(event.target.value)}
                />
              </label>

              <label>
                Remaining (g)
                <input
                  type="number"
                  min="0"
                  value={remaining}
                  onChange={(event) => setRemaining(event.target.value)}
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
                />
              </label>

              <label>
                Region
                <input
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                />
              </label>

              <label>
                Farm / washing station
                <input
                  value={farm}
                  onChange={(event) => setFarm(event.target.value)}
                />
              </label>

              <label>
                Producer
                <input
                  value={producer}
                  onChange={(event) => setProducer(event.target.value)}
                />
              </label>

              <label>
                Altitude
                <input
                  value={altitude}
                  onChange={(event) => setAltitude(event.target.value)}
                />
              </label>

              <label>
                Variety
                <input
                  value={variety}
                  onChange={(event) => setVariety(event.target.value)}
                />
              </label>

              <label>
                Process
                <input
                  value={process}
                  onChange={(event) => setProcess(event.target.value)}
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
              />
            </label>
          </section>

          <div className="beanFormActions">
            <a className="beanFormSecondaryButton" href="/coffee/beans">
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