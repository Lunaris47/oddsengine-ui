import { useState } from "react";
import { postJson } from "../api";
import { parseOddsList } from "../parseOdds";
import Field from "../components/Field";
import Explainer from "../components/Explainer";
import { BEST_ODDS_HELP } from "../helpText";

export default function Arbitrage() {
  const [odds, setOdds] = useState("105, 105");
  const [budget, setBudget] = useState("1000");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function run(e) {
    e.preventDefault();
    setError(null);
    try {
      const americanOdds = parseOddsList(odds);
      setResult(await postJson("/api/hedge/arbitrage", { americanOdds }));
    } catch (err) {
      setResult(null);
      setError(err.message);
    }
  }

  const budgetNum = parseFloat(budget);
  const showStakes =
    result?.isArbitrage && !Number.isNaN(budgetNum) && budgetNum > 0;

  return (
    <section>
      <h2>Arbitrage Detection</h2>
      <p className="hint">
        When books disagree enough that every outcome pays.
      </p>

      <Explainer>
        <p>
          A single sportsbook always prices a market above 100%, so you can't
          beat one book by betting every side. But books don't share an opinion,
          and they update at different speeds. Occasionally the best price on
          each outcome, taken across different books, adds up to less than 100%.
        </p>
        <p>
          When that happens you can back every outcome in the right proportions
          and profit no matter what. It's the mirror image of the vig: the book
          usually has the edge, and here you do.
        </p>
        <p>
          In practice these are small, short-lived, and riskier than they look.
          Prices move between placing your first and second bet, books limit
          stakes, and different books void bets under different rules — if one
          leg gets voided and the other stands, your sure thing becomes a plain
          gamble.
        </p>
        <p className="worked">
          Both sides at +105 across two books sum to 97.6%, a guaranteed 2.5%.
          On $1,000 that's $500 per side and about $25 profit.
        </p>
      </Explainer>

      <form onSubmit={run}>
        <Field
          label="Best odds per outcome"
          help={BEST_ODDS_HELP}
          value={odds}
          onChange={setOdds}
        />
        <Field label="Budget ($)" value={budget} onChange={setBudget} />
        <button type="submit">Check for arbitrage</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p className={result.isArbitrage ? "verdict good" : "verdict bad"}>
            {result.isArbitrage
              ? `${result.guaranteedReturnPercent.toFixed(2)}% guaranteed`
              : "No arbitrage"}
          </p>

          {showStakes && (
            <table>
              <thead>
                <tr>
                  <th>Outcome</th>
                  <th>Stake</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {result.stakeProportions.map((s, i) => (
                  <tr key={i}>
                    <td>{s.american > 0 ? `+${s.american}` : s.american}</td>
                    <td>${(s.proportionOfBudget * budgetNum).toFixed(2)}</td>
                    <td>{(s.proportionOfBudget * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <p className="reading">
            {result.isArbitrage
              ? `These prices sum to ${(result.overround * 100).toFixed(
                  2
                )}% — under 100%, so covering every outcome at the stakes above returns about $${(
                  budgetNum * (result.guaranteedReturnPercent / 100)
                ).toFixed(2)} on a $${budgetNum.toFixed(
                  2
                )} budget regardless of the result.`
              : `These prices sum to ${(result.overround * 100).toFixed(
                  2
                )}%. Anything at or above 100% means the books' margin swallows the gap, so betting every side loses money.`}
          </p>
        </div>
      )}
    </section>
  );
}
