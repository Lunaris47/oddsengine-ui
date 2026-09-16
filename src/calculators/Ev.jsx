import { useState } from "react";
import { postJson } from "../api";

export default function Ev() {
    const [american, setAmerican] = useState("100");
    const [probability, setProbability] = useState("0.5");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    async function run(e) {
        e.preventDefault();
        setError(null);
        try {
            setResult(await postJson("/api/value/ev", {
                american: parseInt(american, 10),
                trueProbability: parseFloat(probability),
            }));
        } catch (err) {
            setResult(null);
            setError(err.message);
        }
    }

    return (
        <section>
            <h2>Expected Value</h2>
            <p className="hint">Your assessed probability, as a decimal between 0 and 1</p>
            <form onSubmit={run}>
                <label>
                    Offered odds (American)
                    <input value={american} onChange={(e) => setAmerican(e.target.value)} />
                </label>
                <label>
                    True probability
                    <input value={probability} onChange={(e) => setProbability(e.target.value)} />
                </label>
                <button type="submit">Calculate EV</button>
            </form>

            {error && <p className="error">{error}</p>}

            {result && (
                <div className="result">
                    <p className={result.isPositiveEv ? "verdict good" : "verdict bad"}>
                        {result.isPositiveEv ? "+EV bet" : "-EV bet"}
                    </p>
                    <dl>
                        <dt>EV per unit staked</dt><dd>${result.evPerUnit.toFixed(4)}</dd>
                        <dt>Edge</dt><dd>{(result.edge * 100).toFixed(2)}%</dd>
                        <dt>Market implies</dt><dd>{(result.offeredImpliedProbability * 100).toFixed(2)}%</dd>
                        <dt>You estimate</dt><dd>{(result.trueProbability * 100).toFixed(2)}%</dd>
                    </dl>
                </div>
            )}
        </section>
    );        
}