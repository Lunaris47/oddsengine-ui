import { useState } from "react";
import { postJson } from "../api";

export default function Kelly() {
  const [bankroll, setBankroll] = useState("1000");
  const [american, setAmerican] = useState("100");
  const [probability, setProbability] = useState("0.55");
  const [multiplier, setMultiplier] = useState("1");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function run(e) {
    e.preventDefault();
    setError(null);
    try {
      setResult(await postJson("/api/staking/kelly", {
        bankroll: parseFloat(bankroll),
        american: parseInt(american, 10),
        trueProbability: parseFloat(probability),
        multiplier: parseFloat(multiplier),
      }));
    } catch (err) {
      setResult(null);
      setError(err.message);
    }
  }

  return (
    <section>
      <h2>Kelly Staking</h2>
      <p className="hint">Multiplier 1 = full Kelly, 0.5 = half Kelly.</p>
      <form onSubmit={run}>
        <label>
          Bankroll ($)
          <input value={bankroll} onChange={(e) => setBankroll(e.target.value)} />
        </label>
        <label>
          Offered odds (American)
          <input value={american} onChange={(e) => setAmerican(e.target.value)} />
        </label>
        <label>
          True probability
          <input value={probability} onChange={(e) => setProbability(e.target.value)} />
        </label>
        <label>
          Kelly multiplier
          <input value={multiplier} onChange={(e) => setMultiplier(e.target.value)} />
        </label>
        <button type="submit">Calculate stake</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p className={result.isBetRecommended ? "verdict good" : "verdict bad"}>
            {result.isBetRecommended
              ? `Bet $${result.recommendedStake.toFixed(2)}`
              : "No bet — no edge at these odds"}
          </p>
          <dl>
            <dt>Kelly fraction</dt><dd>{(result.kellyFraction * 100).toFixed(2)}% of bankroll</dd>
            <dt>Multiplier used</dt><dd>{result.multiplierUsed}</dd>
          </dl>
        </div>
      )}
    </section>
  );
}