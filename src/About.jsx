export default function About({ onNavigate }) {
  return (
    <section className="about">
      <h2>Start here</h2>
      <p className="hint">
        Seven calculators that answer one question in sequence: is this bet
        worth making, and for how much?
      </p>

      <p>
        A sportsbook doesn't post the odds it believes. It posts odds shaded in
        its own favor, and that margin is why most bettors lose slowly even when
        they pick winners half the time. These tools exist to see past the
        margin, judge a price against your own opinion, and size a bet so a bad
        run doesn't end you.
      </p>

      <h3>The workflow</h3>
      <ol className="workflow">
        <li>
          <button className="link" onClick={() => onNavigate("converter")}>
            Converter
          </button>
          <span>
            Read the price. American, decimal, and probability are the same
            number in different clothes.
          </span>
        </li>
        <li>
          <button className="link" onClick={() => onNavigate("novig")}>
            No-Vig
          </button>
          <span>
            Strip the book's margin to find what the market actually thinks.
            This is your baseline for everything below.
          </span>
        </li>
        <li>
          <button className="link" onClick={() => onNavigate("ev")}>
            Expected Value
          </button>
          <span>
            Compare the price against your own estimate. Positive means the
            price favors you over the long run.
          </span>
        </li>
        <li>
          <button className="link" onClick={() => onNavigate("kelly")}>
            Kelly
          </button>
          <span>
            Turn an edge into a stake. Bets too large ruin bankrolls faster than
            bad picks do.
          </span>
        </li>
        <li>
          <button className="link" onClick={() => onNavigate("parlay")}>
            Parlay
          </button>
          <span>
            Check what a multi-leg ticket really pays against how rarely it
            lands.
          </span>
        </li>
        <li>
          <button className="link" onClick={() => onNavigate("hedge")}>
            Hedge
          </button>
          <span>
            Already holding a bet that's looking good? Lock in a result instead
            of riding the outcome.
          </span>
        </li>
        <li>
          <button className="link" onClick={() => onNavigate("arbitrage")}>
            Arbitrage
          </button>
          <span>
            Catch the rare moments when books disagree enough that every outcome
            profits.
          </span>
        </li>
      </ol>

      <h3>New to this?</h3>
      <p>
        Every calculator has a <strong>How this works</strong> section with a
        worked example, and the <strong>?</strong> beside a field explains what
        to type in it. Start with the Converter — once odds notation makes
        sense, the rest follows.
      </p>

      <p className="disclaimer">
        A calculator, not advice. It tells you what the math says about a price
        you supply; it has no opinion on whether any outcome will happen, and no
        edge survives bets you can't afford to lose.
      </p>
    </section>
  );
}
