import { useState } from "react";
import { postJson } from "../api";
import { parseOddsList } from "../parseOdds";

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
  const showStakes = result?.isArbitrage && !Number.isNaN(budgetNum) && budgetNum > 0;

  return (
    <section>
      <h2>Arbitrage Detection</h2>
      <p className="hint">Best available odds per outcome, across books, comma-separated.</p>
      <form onSubmit={run}>
        <label>
          Best odds
          <input value={odds} onChange={(e) => setOdds(e.target.value)} />
        </label>
        <label>
          Budget ($)
          <input value={budget} onChange={(e) => setBudget(e.target.value)} />
        </label>
        <button type="submit">Check for arbitrage</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p className={result.isArbitrage ? "verdict good" : "verdict bad"}>
            {result.isArbitrage
              ? `Arbitrage — ${result.guaranteedReturnPercent.toFixed(2)}% guaranteed`
              : "No arbitrage"}
          </p>
          <p>Overround: {result.overround.toFixed(4)}</p>

          {showStakes && (
            <table>
              <thead>
                <tr><th>Outcome</th><th>Stake</th><th>Share</th></tr>
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
        </div>
      )}
    </section>
  );
}