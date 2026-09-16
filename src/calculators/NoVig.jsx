import { useState } from "react";
import { postJson } from "../api";
import { parseOddsList } from "../parseOdds";

export default function NoVig() {
    const [odds, setOdds] = useState("-110, -110");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    async function run(e) {
        e.preventDefault();
        setError(null);
        try {
            const americanOdds = parseOddsList(odds);
            setResult(await postJson("/api/market/novig", { americanOdds }));
        } catch (err) {
            setResult(null);
            setError(err.message);
        }
    }

    return (
        <section>
            <h2>No-Vig Fair Odds</h2>
            <p className="hint">Enter each outcome's American odds, comma-separated.</p>
            <form onSubmit={run}>
                <label>
                    Market odds
                    <input value={odds} onChange={(e) => setOdds(e.target.value)} />
                </label>
                <button type="submit">Remove Vig</button>
            </form>

            {error && <p className="error">{error}</p>}

            {result && (
                <div className="result">
                    <p className="verdict">Vig: {result.vigPercent.toFixed(2)}%</p>
                    <p>Overround: {result.overround.toFixed(4)}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Listed</th>
                                <th>Implied</th>
                                <th>Fair</th>
                                <th>True probability</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.outcomes.map((o, i) => (
                                <tr key={i}>
                                    <td>{o.listedAmerican > 0 ? `+${o.listedAmerican}` : o.listedAmerican}</td>
                                    <td>{(o.listedImpliedProbability * 100).toFixed(2)}%</td>
                                    <td>{o.fairAmerican > 0 ? `+${o.fairAmerican}` : o.fairAmerican}</td>
                                    <td>{(o.fairProbability * 100).toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );    
}