import { useState } from "react";
import { postJson } from "../api";
import { parseOddsList } from "../parseOdds";
import Field from "../components/Field";
import Explainer from "../components/Explainer";
import { ODDS_LIST_HELP, STAKE_HELP } from "../helpText";

export default function Parlay() {
  const [stake, setStake] = useState("10");
  const [legs, setLegs] = useState("-110, -110, -110");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function run(e) {
    e.preventDefault();
    setError(null);
    try {
      const americanLegs = parseOddsList(legs);
      const stakeNum = parseFloat(stake);
      if (Number.isNaN(stakeNum) || stakeNum <= 0)
        throw new Error("Stake must be a positive number.");
      setResult(
        await postJson("/api/parlay/price", { stake: stakeNum, americanLegs })
      );
    } catch (err) {
      setResult(null);
      setError(err.message);
    }
  }

  return (
    <section>
      <h2>Parlay Pricing</h2>
      <p className="hint">Payout and real odds for a multi-leg bet.</p>

      <Explainer>
        <p>
          A parlay combines several bets into one. Every leg has to win or the
          whole ticket loses, and in exchange the payout multiplies rather than
          adds. That's what makes them tempting.
        </p>
        <p>
          The catch is that the probabilities multiply too, and each leg carries
          its own vig. Three coin flips at -110 pay about 6-to-1, but they only
          all land about 12.5% of the time — and a fair price would be 7-to-1.
          The gap is why parlays are the most profitable product a sportsbook
          sells.
        </p>
        <p className="worked">
          $10 on three -110 legs returns $79.58, and hits roughly 1 time in 7.
        </p>
      </Explainer>

      <form onSubmit={run}>
        <Field label="Stake ($)" help={STAKE_HELP} value={stake} onChange={setStake} />
        <Field
          label="Odds for each leg"
          help={ODDS_LIST_HELP}
          value={legs}
          onChange={setLegs}
        />
        <button type="submit">Price parlay</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p className="verdict">${result.payout.toFixed(2)}</p>
          <dl>
            <dt>Profit</dt>
            <dd>${result.profit.toFixed(2)}</dd>
            <dt>Combined odds</dt>
            <dd>
              {result.combinedAmerican > 0
                ? `+${result.combinedAmerican}`
                : result.combinedAmerican}{" "}
              ({result.combinedDecimal.toFixed(4)})
            </dd>
            <dt>Legs</dt>
            <dd>{result.legCount}</dd>
            <dt>Chance all hit</dt>
            <dd>{(result.hitProbability * 100).toFixed(2)}%</dd>
          </dl>
          <p className="reading">
            All {result.legCount} legs have to win. That happens about{" "}
            {(result.hitProbability * 100).toFixed(1)}% of the time — roughly 1
            ticket in {Math.round(1 / result.hitProbability)}.
          </p>
        </div>
      )}
    </section>
  );
}
