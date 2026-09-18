import { useState } from "react";
import { postJson } from "../api";
import Field from "../components/Field";
import Explainer from "../components/Explainer";
import { ORIGINAL_BET_HELP, HEDGE_ODDS_HELP } from "../helpText";

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
      setResult(
        await postJson("/api/hedge/equal-profit", {
          originalStake: parseFloat(originalStake),
          originalAmerican: parseInt(originalAmerican, 10),
          hedgeAmerican: parseInt(hedgeAmerican, 10),
        })
      );
    } catch (err) {
      setResult(null);
      setError(err.message);
    }
  }

  return (
    <section>
      <h2>Hedge Calculator</h2>
      <p className="hint">Lock in the same result whichever side wins.</p>

      <Explainer>
        <p>
          Hedging means betting the other side of a bet you already hold, so the
          outcome stops mattering. It's what you do when a longshot you backed
          months ago is suddenly one game from paying out and you'd rather take
          a certain profit than a coin flip.
        </p>
        <p>
          This calculates the stake that makes both outcomes pay identically. If
          the line moved in your favor, that's a guaranteed profit. If it moved
          against you, the same math gives you an equal loss on both sides —
          still useful as damage control, and shown here rather than hidden.
        </p>
        <p>
          Hedging isn't free. You pay vig on the new bet, so you're trading some
          expected value for certainty. Whether that's worth it depends on how
          much the swing would hurt.
        </p>
        <p className="worked">
          $100 on a team at +1000 preseason, now in the final with the other
          side at +100: bet $550 against them and you collect $450 either way.
        </p>
      </Explainer>

      <form onSubmit={run}>
        <Field
          label="Original stake ($)"
          help={ORIGINAL_BET_HELP}
          value={originalStake}
          onChange={setOriginalStake}
        />
        <Field
          label="Original odds (American)"
          help={ORIGINAL_BET_HELP}
          value={originalAmerican}
          onChange={setOriginalAmerican}
        />
        <Field
          label="Hedge odds (American)"
          help={HEDGE_ODDS_HELP}
          value={hedgeAmerican}
          onChange={setHedgeAmerican}
        />
        <button type="submit">Calculate hedge</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p className={result.isProfitable ? "verdict good" : "verdict bad"}>
            {result.isProfitable
              ? `+$${result.lockedProfit.toFixed(2)} guaranteed`
              : `-$${Math.abs(result.lockedProfit).toFixed(2)} either way`}
          </p>
          <dl>
            <dt>Hedge stake</dt>
            <dd>${result.hedgeStake.toFixed(2)}</dd>
            <dt>Total at risk</dt>
            <dd>${result.totalOutlay.toFixed(2)}</dd>
          </dl>
          <p className="reading">
            {result.isProfitable
              ? `Put $${result.hedgeStake.toFixed(
                  2
                )} on the other side and you walk away with $${result.lockedProfit.toFixed(
                  2
                )} no matter who wins. The alternative is letting it ride for more, or nothing.`
              : `The line moved against you, so there's no profit to lock. This hedge caps your loss at $${Math.abs(
                  result.lockedProfit
                ).toFixed(2)} instead of risking the full stake.`}
          </p>
        </div>
      )}
    </section>
  );
}
