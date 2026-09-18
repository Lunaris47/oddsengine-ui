/**
 * Field-level help, defined once and reused. Keeping these here
 * means the explanation of American odds is identical everywhere
 * it appears, and there's one place to improve the wording.
 */

export const AMERICAN_ODDS_HELP = (
  <>
    American odds are quoted against $100. A <strong>negative</strong> number
    is what you risk to win $100 — at -110 you bet $110 to win $100. A{" "}
    <strong>positive</strong> number is what you win on a $100 risk — at +150
    you bet $100 to win $150. Negative means favorite, positive means underdog.
    The $100 is just the quoting convention; the ratio holds at any stake.
  </>
);

export const ODDS_LIST_HELP = (
  <>
    One value per outcome, separated by commas. A two-way market looks like{" "}
    <code>-110, -110</code>; a soccer match with a draw looks like{" "}
    <code>150, 220, 180</code>.
  </>
);

export const TRUE_PROBABILITY_HELP = (
  <>
    Your own estimate that this outcome happens, as a decimal between 0 and 1 —{" "}
    <code>0.55</code> means 55%. This is the one number the calculator can't
    work out for you. A reasonable starting point is the no-vig probability
    from the No-Vig tab; bet only when you think the market is wrong.
  </>
);

export const BANKROLL_HELP = (
  <>
    The total amount you're betting with overall — not the amount you plan to
    put on this bet. Kelly returns a fraction of this number.
  </>
);

export const MULTIPLIER_HELP = (
  <>
    Scales the Kelly stake down. <code>1</code> is full Kelly, which assumes
    your probability estimate is exactly right. <code>0.5</code> (half Kelly)
    is the common choice: it gives up a little growth for a lot less swing.
  </>
);

export const STAKE_HELP = (
  <>The amount you're putting at risk on this bet, in dollars.</>
);

export const ORIGINAL_BET_HELP = (
  <>
    The bet you already hold — the stake you placed and the odds you got at the
    time, not today's price.
  </>
);

export const HEDGE_ODDS_HELP = (
  <>
    The odds currently available on the <em>opposite</em> outcome. This is the
    bet you'd place now to cover the one you're already holding.
  </>
);

export const BEST_ODDS_HELP = (
  <>
    The best price you can find for each outcome, which may be at different
    sportsbooks. Arbitrage comes from books disagreeing, so mixing sources is
    the point.
  </>
);
