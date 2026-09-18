import { useState } from "react";
import { postJson } from "../api";
import Field from "../components/Field";
import Explainer from "../components/Explainer";
import { AMERICAN_ODDS_HELP, TRUE_PROBABILITY_HELP } from "../helpText";

export default function Ev() {
  const [american, setAmerican] = useState("110");
  const [probability, setProbability] = useState("0.5");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function run(e) {
    e.preventDefault();
    setError(null);
    try {
      setResult(
        await postJson("/api/value/ev", {
          american: parseInt(american, 10),
          trueProbability: parseFloat(probability),
        })
      );
    } catch (err) {
      setResult(null);
      setError(err.message);
    }
  }

  return (
    <section>
      <h2>Expected Value</h2>
      <p className="hint">Whether a bet pays off in the long run.</p>

      <Explainer>
        <p>
          Expected value is what a bet earns on average if you could place it
          over and over. It compares the price you're offered against what you
          believe the real chance is. Positive means the price is in your favor;
          negative means you're paying more than the outcome is worth.
        </p>
        <p>
          One bet tells you nothing — a +EV bet loses all the time. EV is a
          statement about the long run, which is why it only means anything if
          you're betting repeatedly and sizing sensibly.
        </p>
        <p className="worked">
          A coin flip offered at +110 is +EV: you win $110 half the time and
          lose $100 half the time, netting $5 per $100 staked. The same flip at
          -110 is -EV by 4.76%, which is exactly the vig.
        </p>
      </Explainer>

      <form onSubmit={run}>
        <Field
          label="Offered odds (American)"
          help={AMERICAN_ODDS_HELP}
          value={american}
          onChange={setAmerican}
        />
        <Field
          label="Your true probability"
          help={TRUE_PROBABILITY_HELP}
          value={probability}
          onChange={setProbability}
        />
        <button type="submit">Calculate EV</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p className={result.isPositiveEv ? "verdict good" : "verdict bad"}>
            {result.isPositiveEv ? "Positive EV" : "Negative EV"}
          </p>
          <dl>
            <dt>EV per $1 staked</dt>
            <dd>${result.evPerUnit.toFixed(4)}</dd>
            <dt>Your edge</dt>
            <dd>{(result.edge * 100).toFixed(2)}%</dd>
            <dt>Price implies</dt>
            <dd>{(result.offeredImpliedProbability * 100).toFixed(2)}%</dd>
            <dt>You estimate</dt>
            <dd>{(result.trueProbability * 100).toFixed(2)}%</dd>
          </dl>
          <p className="reading">
            {result.isPositiveEv
              ? `Over many bets like this you'd expect to make about $${(
                  result.evPerUnit * 100
                ).toFixed(2)} for every $100 you stake.`
              : `Over many bets like this you'd expect to lose about $${Math.abs(
                  result.evPerUnit * 100
                ).toFixed(2)} for every $100 you stake.`}{" "}
            The price implies{" "}
            {(result.offeredImpliedProbability * 100).toFixed(1)}% and you think
            it's {(result.trueProbability * 100).toFixed(1)}%.
          </p>
        </div>
      )}
    </section>
  );
}
