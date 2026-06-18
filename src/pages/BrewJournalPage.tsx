import BrewCard from "../components/BrewCard";
import { brews } from "../data/brews";
import { beans } from "../data/beans";
import "../styles/coffee.css";
import "../styles/brewJournal.css";

export default function BrewJournalPage() {
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

          <a className="coffeeButton" href="/coffee">
            Back to coffee
          </a>
        </header>

        <section className="brewList" aria-label="Brew journal entries">
          {brews.map((brew) => {
            const bean = beans.find((bean) => bean.id === brew.beanId);

            if (!bean) {
              return null;
            }

            return <BrewCard key={brew.id} brew={brew} bean={bean} />;
          })}
        </section>
      </section>
    </main>
  );
}