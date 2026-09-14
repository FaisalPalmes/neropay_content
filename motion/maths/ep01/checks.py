# The Maths, episode 1 — "Don't switch to us."
# Stage 3 gate. Every figure that appears on screen or is spoken is computed
# here and asserted against the stated value. Nothing is eyeballed.

ours = figure("neropay_workhorse_rate")
bench = figure("benchmark_flat_no_fee")

NP_R, NP_F = ours["value"], ours["fixed_fee_pence"] / 100
BM_R, BM_F = bench["value"], bench["fixed_fee_pence"] / 100

cost = lambda t, r, f: t * r + f
eff = lambda t, r, f: cost(t, r, f) / t

# --- beat 1 and 3: the £4 coffee ---
check("£4 · our percentage part (1.30% x 4.00)", round(4 * NP_R, 4), 0.052, 4)
check("£4 · our total cost", round(cost(4, NP_R, NP_F), 4), 0.1320, 4)
check("£4 · our effective rate", round(eff(4, NP_R, NP_F) * 100, 2), 3.30)
check("£4 · benchmark cost", round(cost(4, BM_R, BM_F), 4), 0.0676, 4)
check("£4 · benchmark effective rate", round(eff(4, BM_R, BM_F) * 100, 2), 1.69)

# --- beat 5: the £40 sale ---
check("£40 · our cost", round(cost(40, NP_R, NP_F), 4), 0.6000, 4)
check("£40 · our effective rate", round(eff(40, NP_R, NP_F) * 100, 2), 1.50)
check("£40 · benchmark cost", round(cost(40, BM_R, BM_F), 4), 0.6760, 4)
check("£40 · benchmark effective rate", round(eff(40, BM_R, BM_F) * 100, 2), 1.69)

# --- beat 6: the crossover ---
check("crossover 8p / (1.69% - 1.30%)", round(crossover(BM_R, NP_R, 8), 2), 20.51)

# At the crossover both must cost the same, or the whole episode is wrong.
check("crossover · costs equal", round(cost(20.51, NP_R, NP_F), 4),
      round(cost(20.51, BM_R, BM_F), 4), 4)

# --- the spoken claim "would charge you half that" ---
# 6.76p against 13.20p is 51.2%. "Half" is a fair spoken rounding; assert the
# ratio stays inside 48-52% so a figure change can never silently break it.
ratio = cost(4, BM_R, BM_F) / cost(4, NP_R, NP_F)
check("£4 · benchmark as a share of ours (spoken 'half')", round(ratio, 3), 0.512, 3)
assert 0.48 <= ratio <= 0.52, f"'half that' no longer holds: {ratio:.1%}"
print("  ok  'half that' holds at 51.2% — inside the 48-52% band")

# --- bar geometry, so the drawn lengths match the arithmetic ---
check("£4 bars · ours is longer", round(cost(4, NP_R, NP_F) / cost(4, BM_R, BM_F), 3), 1.953, 3)
check("£40 bars · ours is shorter", round(cost(40, NP_R, NP_F) / cost(40, BM_R, BM_F), 3), 0.888, 3)

# --- rails word scan over everything spoken or shown ---
VO = """That's our rate on a four pound coffee. It's terrible.
One point three percent, plus eight pence. On four pounds, that's thirteen pence.
Which is three point three percent.
A flat rate with no fixed fee would charge you half that. On a four pound sale, we lose.
Same rate card. Forty pound sale. One point five percent. Now we're the cheaper one.
The fixed fee is what moves. It stops hurting at about twenty pounds fifty a sale.
Our rate isn't one number. It depends entirely on what you sell things for.
So work that out before anyone quotes you anything. Us included."""

ON_SCREEN = """3.30% what you'd pay NeroPay on a 4 pound coffee
1.30% x 4.00 = 5.2p + 8p fixed = 13.2p = 3.30%
US 13.2p A FLAT RATE, NO FIXED FEE 6.8p we lose
40.00 SALE 1.50% 1.69%
20.51 where the fixed fee stops hurting
NERO PAY neropay.app"""

scan_copy(VO, "VO script")
scan_copy(ON_SCREEN, "on-screen text")

# No provider may be named anywhere. internal_source may; the screen may not.
for name in ("square", "sumup", "paypal", "dojo", "worldpay", "teya", "zettle",
             "takepayments", "stripe", "verifone", "northwick"):
    assert name not in (VO + ON_SCREEN).lower(), f"provider named on screen or in VO: {name}"
print("  ok  no provider named in VO or on-screen text")
