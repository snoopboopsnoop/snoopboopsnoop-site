import { useState } from "react";
import BeanBag from "../components/BeanBag";
import { beans } from "../data/beans";
import { loadLocalBeans } from "../lib/beanStorage";
import "../styles/coffee.css";
import "../styles/beanCatalogue.css";

export default function BeanCataloguePage() {
  const [localBeans] = useState(loadLocalBeans);

  const allBeans = [...localBeans, ...beans];

  const currentBeans = allBeans.filter((bean) => bean.status === "current");

  return (
    <main className="coffeePage beanCataloguePage">
      <section className="beanCatalogueShell">
        <header className="beanCatalogueHeader">
          <div>
            <p className="coffeeEyebrow">snoopboopsnoop coffee</p>
            <h1>Bean catalogue</h1>
            <p>
              A shelf of the coffees currently at home, with origin details,
              roast info, and tasting notes.
            </p>
          </div>

          <div className="beanCatalogueHeaderActions">
            <a className="coffeeButton" href="/coffee/beans/new">
              Add bean
            </a>

            <a className="coffeeButton beanCatalogueBackButton" href="/coffee">
              Back to coffee
            </a>
          </div>
        </header>

        <section className="beanShelf" aria-label="Current coffee beans">
          {currentBeans.map((bean) => (
            <BeanBag key={bean.id} bean={bean} />
          ))}
        </section>
      </section>
    </main>
  );
}