import "./App.css";

function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <h1>snoopboopsnoop</h1>
        <p>bobr bobr bobr bobr</p>

        <a className="button" href="/coffee">
          Go to coffee app
        </a>
      </section>
    </main>
  );
}

function CoffeePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">snoopboopsnoop coffee</p>
        <h1>Brew journal + bean shelf</h1>
        <p>
          This will eventually become a place to log brews, review recipes, and
          keep track of the coffee beans currently at home.
        </p>

        <div className="cardGrid">
          <a className="card" href="/coffee/journal">
            <h2>Brew journal</h2>
            <p>Scrollable brew cards with recipes, notes, and tasting details.</p>
          </a>

          <a className="card" href="/coffee/beans">
            <h2>Bean catalogue</h2>
            <p>A visual shelf of coffee bags, each clickable for more info.</p>
          </a>
        </div>
      </section>
    </main>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Coming soon</p>
        <h1>{title}</h1>
        <p>This page exists, but we have not built the real UI yet.</p>
        <a className="button" href="/coffee">
          Back to coffee
        </a>
      </section>
    </main>
  );
}

export default function App() {
  const path = window.location.pathname;

  if (path === "/coffee") {
    return <CoffeePage />;
  }

  if (path === "/coffee/journal") {
    return <PlaceholderPage title="Brew journal" />;
  }

  if (path === "/coffee/beans") {
    return <PlaceholderPage title="Bean catalogue" />;
  }

  return <HomePage />;
}