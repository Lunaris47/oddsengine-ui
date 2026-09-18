import { useState } from "react";
import { getJson } from "../api";
import Field from "../components/Field";
import Explainer from "../components/Explainer";
import { AMERICAN_ODDS_HELP } from "../helpText";

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
      <p className="hint">The same price in three formats.</p>

      <Explainer>
        <p>
          American, decimal, and implied probability are three ways of writing
          the same thing. American odds are quoted against $100 and are what US
          sportsbooks display. Decimal odds state the total return per $1 staked
          including your stake back, which makes the math cleaner. Implied
          probability is simply 1 divided by the decimal odds.
        </p>
        <p>
          Worth knowing: the implied probability shown here still includes the
          sportsbook's margin, so it overstates the real chance. The No-Vig tab
          strips that out.
        </p>
        <p className="worked">
          -110 is decimal 1.909 and an implied 52.38%. Bet $110 to win $100.
        </p>
      </Explainer>

      <form onSubmit={run}>
        <Field
          label="American odds"
          help={AMERICAN_ODDS_HELP}
          value={american}
          onChange={setAmerican}
        />
        <button type="submit">Convert</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p className="verdict">{result.decimal.toFixed(4)}</p>
          <dl>
            <dt>Decimal odds</dt>
            <dd>{result.decimal.toFixed(4)}</dd>
            <dt>Implied probability</dt>
            <dd>{(result.impliedProbability * 100).toFixed(2)}%</dd>
          </dl>
          <p className="reading">
            A $100 bet returns ${(result.decimal * 100).toFixed(2)} in total — $
            {(result.decimal * 100 - 100).toFixed(2)} profit. The price implies
            this outcome happens about{" "}
            {(result.impliedProbability * 100).toFixed(1)}% of the time.
          </p>
        </div>
      )}
    </section>
  );
}
