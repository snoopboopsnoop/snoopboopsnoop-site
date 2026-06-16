import "../styles/home.css";

export default function HomePage() {
  return (
    <main className="homePage">
      <section className="homeContent">
        <h1>snoopboopsnoop.com</h1>
        <img
          className="homeImage"
          src="/images/bobr.jpg"
          alt="homepage image"
        />

        <p>bobr bobr bobr bobr</p>
        <a href="/coffee">Coffee app</a>
      </section>
    </main>
  );
}