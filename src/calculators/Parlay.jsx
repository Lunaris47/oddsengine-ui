import { useState } from "react";
import { postJson } from "../api";
import { parseOddsList } from "../parseOdds";

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
      if (Number.isNaN(stakeNum) || stakeNum <= 0) throw new Error("Stake must be a positive number.");
      setResult(await postJson("/api/parlay/price", { stake: stakeNum, americanLegs }));
    } catch (err) {
      setResult(null);
      setError(err.message);
    }
  }

  return (
    <section>
      <h2>Parlay Pricing</h2>
      <p className="hint">Enter each leg's American odds, comma-separated.</p>
      <form onSubmit={run}>
        <label>
          Stake ($)
          <input value={stake} onChange={(e) => setStake(e.target.value)} />
        </label>
        <label>
          Legs
          <input value={legs} onChange={(e) => setLegs(e.target.value)} />
        </label>
        <button type="submit">Price parlay</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p className="verdict">Payout: ${result.payout.toFixed(2)}</p>
          <dl>
            <dt>Profit</dt><dd>${result.profit.toFixed(2)}</dd>
            <dt>Combined odds</dt>
            <dd>
              {result.combinedAmerican > 0 ? `+${result.combinedAmerican}` : result.combinedAmerican}
              {" "}({result.combinedDecimal.toFixed(4)})
            </dd>
            <dt>Legs</dt><dd>{result.legCount}</dd>
            <dt>Hit probability</dt><dd>{(result.hitProbability * 100).toFixed(2)}%</dd>
          </dl>
        </div>
      )}
    </section>
  );
}