import { useState } from "react";
import { postJson } from "../api";
import Field from "../components/Field";
import Explainer from "../components/Explainer";
import {
  AMERICAN_ODDS_HELP,
  TRUE_PROBABILITY_HELP,
  BANKROLL_HELP,
  MULTIPLIER_HELP,
} from "../helpText";

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
      setResult(
        await postJson("/api/staking/kelly", {
          bankroll: parseFloat(bankroll),
          american: parseInt(american, 10),
          trueProbability: parseFloat(probability),
          multiplier: parseFloat(multiplier),
        })
      );
    } catch (err) {
      setResult(null);
      setError(err.message);
    }
  }

  return (
    <section>
      <h2>Kelly Staking</h2>
      <p className="hint">How much to bet, given your edge.</p>

      <Explainer>
        <p>
          Knowing a bet is good doesn't tell you how much to put on it. Bet too
          little and the edge barely earns anything; bet too much and a normal
          losing streak wipes you out. The Kelly criterion, worked out at Bell
          Labs in 1956, is the stake that grows a bankroll fastest over time.
        </p>
        <p>
          Two things make it trustworthy. It scales with your edge, so a thin
          edge gets a small bet. And it returns zero whenever the bet is -EV —
          it will never tell you to bet without an advantage.
        </p>
        <p>
          The formula assumes your probability estimate is exactly right, which
          it never is. Overbetting is punished far more harshly than
          underbetting, so most people use half Kelly: nearly all the growth,
          much less turbulence.
        </p>
        <p className="worked">
          A 55% shot at +100 with a $1,000 bankroll: Kelly says risk 10%, so
          $100. At half Kelly, $50. If your estimate drops to 40%, it says bet
          nothing.
        </p>
      </Explainer>

      <form onSubmit={run}>
        <Field
          label="Bankroll ($)"
          help={BANKROLL_HELP}
          value={bankroll}
          onChange={setBankroll}
        />
        <Field
          label="Offered odds (American)"
          help={AMERICAN_ODDS_HELP}
          value={american}
          onChange={setAmerican}
        />
        <Field
          label="Your true probability"
          help={TRUE_PROBABILITY_HELP}
          value={probability}
          onChange={setProbability}
        />
        <Field
          label="Kelly multiplier"
          help={MULTIPLIER_HELP}
          value={multiplier}
          onChange={setMultiplier}
        />
        <button type="submit">Calculate stake</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p className={result.isBetRecommended ? "verdict good" : "verdict bad"}>
            {result.isBetRecommended
              ? `Bet $${result.recommendedStake.toFixed(2)}`
              : "No bet"}
          </p>
          <dl>
            <dt>Share of bankroll</dt>
            <dd>{(result.kellyFraction * 100).toFixed(2)}%</dd>
            <dt>Multiplier used</dt>
            <dd>{result.multiplierUsed}</dd>
          </dl>
          <p className="reading">
            {result.isBetRecommended
              ? `Risking ${(result.kellyFraction * 100).toFixed(
                  1
                )}% of your bankroll on this bet grows it fastest over the long run. Betting much more than this makes you more likely to go broke, not richer.`
              : "At these odds your estimated probability gives you no advantage, so the growth-optimal stake is nothing. Either find a better price or pass."}
          </p>
        </div>
      )}
    </section>
  );
}
