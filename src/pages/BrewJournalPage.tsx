import { useState } from "react";
import { deleteLocalBrew, loadLocalBrews } from "../lib/brewStorage";
import { loadLocalBeans } from "../lib/beanStorage";
import BrewCard from "../components/BrewCard";
import { brews } from "../data/brews";
import { beans } from "../data/beans";
import "../styles/coffee.css";
import "../styles/brewJournal.css";

export default function BrewJournalPage() {
  const [localBrews] = useState(loadLocalBrews);
  const [localBeans] = useState(loadLocalBeans);

  const allBeans = [...localBeans, ...beans];
  const journalBrews = [...localBrews, ...brews].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  function deleteBrew(brewId: string) {
    const confirmed = window.confirm(
      "Delete this local brew? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    deleteLocalBrew(brewId);
    window.location.reload();
  }

  return (
    <main className="coffeePage journalPage">
      <section className="journalShell">
        <header className="journalHeader">
          <div>
            <p className="coffeeEyebrow">snoopboopsnoop coffee</p>
            <h1>Brew journal</h1>
            <p>
              Notes from recent brews, recipes worth repeating, and small
              adjustments for next time.
            </p>
          </div>

          <div className="journalHeaderActions">
            <a className="coffeeButton" href="/coffee/journal/new">
              Add brew
            </a>

            <a className="coffeeButton journalBackButton" href="/coffee">
              Back to coffee
            </a>
          </div>
        </header>

        <section className="brewList" aria-label="Brew journal entries">
          {journalBrews.map((brew) => {
            const bean = allBeans.find((bean) => bean.id === brew.beanId);

            if (!bean) {
              return null;
            }

            const isLocal = localBrews.some((localBrew) => localBrew.id === brew.id);

            return (
              <BrewCard
                key={brew.id}
                brew={brew}
                bean={bean}
                isLocal={isLocal}
                onDelete={deleteBrew}
              />
            );
          })}
        </section>
      </section>
    </main>
  );
}