import BeanBag from "../components/BeanBag";
import { beans } from "../data/beans";
import "../styles/coffee.css";
import "../styles/beanCatalogue.css";

export default function BeanCataloguePage() {
  const currentBeans = beans.filter((bean) => bean.status === "current");

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

          <a className="coffeeButton" href="/coffee">
            Back to coffee
          </a>
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