import { useState } from "react";
import { postJson } from "../api";
import { parseOddsList } from "../parseOdds";
import Field from "../components/Field";
import Explainer from "../components/Explainer";
import { ODDS_LIST_HELP } from "../helpText";

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
      <p className="hint">
        What the market really thinks, with the sportsbook's fee removed.
      </p>

      <Explainer>
        <p>
          Add up the implied probabilities of every outcome in a market and
          you'll get more than 100%. That excess is the vig — the sportsbook's
          built-in margin, and the reason the average bettor loses slowly even
          when picking winners half the time.
        </p>
        <p>
          Removing it means scaling those probabilities back down so they sum to
          exactly 100%. What's left is the market's honest opinion, which is the
          most reliable probability estimate most bettors have access to. Every
          other calculator here is more accurate when you feed it a no-vig
          number.
        </p>
        <p className="worked">
          Two sides at -110 each imply 52.38%, summing to 104.76%. Strip the
          4.76% vig and both sides are a true 50/50, priced fairly at +100.
        </p>
      </Explainer>

      <form onSubmit={run}>
        <Field
          label="Odds for each outcome"
          help={ODDS_LIST_HELP}
          value={odds}
          onChange={setOdds}
        />
        <button type="submit">Remove vig</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p className="verdict">{result.vigPercent.toFixed(2)}% vig</p>
          <table>
            <thead>
              <tr>
                <th>Listed</th>
                <th>Priced as</th>
                <th>Fair odds</th>
                <th>True chance</th>
              </tr>
            </thead>
            <tbody>
              {result.outcomes.map((o, i) => (
                <tr key={i}>
                  <td>
                    {o.listedAmerican > 0
                      ? `+${o.listedAmerican}`
                      : o.listedAmerican}
                  </td>
                  <td>{(o.listedImpliedProbability * 100).toFixed(2)}%</td>
                  <td>
                    {o.fairAmerican > 0 ? `+${o.fairAmerican}` : o.fairAmerican}
                  </td>
                  <td>{(o.fairProbability * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="reading">
            The listed prices sum to{" "}
            {(result.overround * 100).toFixed(2)}% — anything over 100% is the
            book's cut. Use the fair odds column as your baseline when judging
            whether a bet has value.
          </p>
        </div>
      )}
    </section>
  );
}
