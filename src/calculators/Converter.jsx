import { useState } from "react";
import { getJson } from "../api";

export default function Converter() {
    const [american, setAmerican] = useState("-110");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    async function run(e) {
        e.preventDefault();
        setError(null);
        try {
            setResult(await getJson(`/api/odds/convert?american=${american}`));
        } catch (err) {
            setResult(null);
            setError(err.message);
        }
    }

    return (
        <section>
            <h2>Odds Converter</h2>
            <form onSubmit={run}>
                <label>
                    American odds
                    <input value={american} onChange={(e) => setAmerican(e.target.value)} />
                </label>
                <button type="submit">Convert</button>
            </form>
            {error && <p className="error">{error}</p>}
            {result && (
                <d1>
                    <dt>Decimal</dt><dd>{result.decimal}</dd>
                    <dt>Implied probability</dt><dd>{(result.impliedProbability * 100).toFixed(2)}%</dd>
                </d1>    
            )}
        </section>    
    );
}