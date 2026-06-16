import "../styles/coffee.css";

export default function CoffeePage() {
  return (
    <main className="coffeePage">
      <section className="coffeeHero">
        <p className="coffeeEyebrow">snoopboopsnoop coffee</p>

        <h1>Brew journal + bean shelf</h1>

        <p>
          This will eventually become a place to log brews, review recipes, and
          keep track of the coffee beans currently at home.
        </p>

        <div className="coffeeCardGrid">
          <a className="coffeeCard" href="/coffee/journal">
            <h2>Brew journal</h2>
            <p>Scrollable brew cards with recipes, notes, and tasting details.</p>
          </a>

          <a className="coffeeCard" href="/coffee/beans">
            <h2>Bean catalogue</h2>
            <p>A visual shelf of coffee bags, each clickable for more info.</p>
          </a>
        </div>
      </section>
    </main>
  );
}