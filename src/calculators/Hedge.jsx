import { useState } from "react";
import { postJson } from "../api";

export default function Hedge() {
  const [originalStake, setOriginalStake] = useState("100");
  const [originalAmerican, setOriginalAmerican] = useState("1000");
  const [hedgeAmerican, setHedgeAmerican] = useState("100");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function run(e) {
    e.preventDefault();
    setError(null);
    try {
      setResult(await postJson("/api/hedge/equal-profit", {
        originalStake: parseFloat(originalStake),
        originalAmerican: parseInt(originalAmerican, 10),
        hedgeAmerican: parseInt(hedgeAmerican, 10),
      }));
    } catch (err) {
      setResult(null);
      setError(err.message);
    }
  }

  return (
    <section>
      <h2>Hedge Calculator</h2>
      <p className="hint">The stake that locks in the same result either way.</p>
      <form onSubmit={run}>
        <label>
          Original stake ($)
          <input value={originalStake} onChange={(e) => setOriginalStake(e.target.value)} />
        </label>
        <label>
          Original odds (American)
          <input value={originalAmerican} onChange={(e) => setOriginalAmerican(e.target.value)} />
        </label>
        <label>
          Hedge odds (American)
          <input value={hedgeAmerican} onChange={(e) => setHedgeAmerican(e.target.value)} />
        </label>
        <button type="submit">Calculate hedge</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p className={result.isProfitable ? "verdict good" : "verdict bad"}>
            {result.isProfitable
              ? `Locked profit: $${result.lockedProfit.toFixed(2)}`
              : `Locked loss: $${Math.abs(result.lockedProfit).toFixed(2)}`}
          </p>
          <dl>
            <dt>Hedge stake</dt><dd>${result.hedgeStake.toFixed(2)}</dd>
            <dt>Total outlay</dt><dd>${result.totalOutlay.toFixed(2)}</dd>
          </dl>
        </div>
      )}
    </section>
  );
}