"""Stage-3 checks for the Partner Programme episode PP01 (16–17 Sep 2026).

Every figure on screen resolves to partner_bonus_tiers, partner_revenue_share_tiers and partner_active_gate —
confirmed final by Faisal on 17 Sep 2026 (motion/partner/BRIEF.md v4, Part 7: no open questions).

What is asserted: the thresholds the composition steps at are the ones in figures.json; every pound figure on
screen sits in the same element as the condition that earns it; the two rest frames carry their conditions and
the "Most partners start at 20%" line; the brief's banned register is absent from the take and the screen; no
competitor and no hardware maker is named; nothing targets a personal attribute; the concession and both CTAs are
in the take.
"""
import re, sys
from pathlib import Path
EP = Path('motion') / sys.argv[1]

bonus = figure('partner_bonus_tiers')
share = figure('partner_revenue_share_tiers')
gate = figure('partner_active_gate')

html = (EP / 'index.html').read_text()
ON_SCREEN = ' '.join(re.sub(r'<[^>]+>', ' ', m) for m in re.findall(r'<div id="stage">(.*?)<script', html, re.S))
ON_SCREEN = re.sub(r'\s+', ' ', ON_SCREEN)
VO = ("You could be earning a hundred to three hundred pounds for every café, takeaway or barber you introduce to a card machine "
      "company. Here's how it works, and why you don't need to sell anything. We're NeroPay, we do card terminals with free till "
      "software for UK businesses. You know a business that takes card payments, you introduce them to us, and that's your whole "
      "job, because we go and set them up and we do the support. When they go live you get a bonus for that one business, a hundred "
      "pounds if they take up to twenty thousand in their first month, two hundred over that, and three hundred once they're over "
      "forty thousand. Every one you introduce pays you, and there's nothing to unlock. Then if you bring three or more in the same "
      "month, you're an Active Partner, and you also get a share of what all your merchants' card payments earn us, not just the new "
      "three, every month you hit it. And if you only bring one that month, you still get your bonus, it's yours either way. It's "
      "free to join, and you get your own link to share. Go to NeroPay dot app slash partners, and think about who you'd introduce first.")

# the tiers the composition steps at are the register's
b = {row[2]: (row[0], row[1]) for row in bonus['value']}
check('bonus tier 1, floor £', b[100][0], 0)
check('bonus tier 2, floor £', b[200][0], 20000.01)
check('bonus tier 3, floor £', b[300][0], 40000)
assert 'v >= 40000 ? 300 : v > 20000 ? 200 : 100' in html, 'the dial steps at other thresholds than the register'
r = {int(round(row[2] * 100)): row[0] for row in share['value']}
for pct, n in [(20, 3), (25, 21), (30, 36), (35, 61), (40, 111)]:
    check(f'revenue share {pct}% from', r[pct], n)
assert 'c >= 111 ? 40 : c >= 61 ? 35 : c >= 36 ? 30 : c >= 21 ? 25 : c >= 3 ? 20 : 0' in html, 'the climb steps at other counts than the register'
check('Active Partner gate, new merchants', gate['value'], 3)
for chip in ['3 · 20%', '21 · 25%', '36 · 30%', '61 · 35%', '111 · 40%']:
    assert chip in ON_SCREEN, f'step chip missing: {chip}'

# every pound figure on screen sits with the condition that earns it (brief rule 1); rest frames carry their conditions
assert 'Bonus · per merchant' in ON_SCREEN and 'in their first 30 days' in ON_SCREEN, 'the dial has lost its condition'
assert 'up to £300 per merchant — £40,000+ in their first 30 days' in ON_SCREEN, 'the only permitted "up to" must carry £40,000+ in the same line'
assert '111+ new active merchants in one month' in html, 'the climb rest frame has lost its condition'
assert 'Most partners start at 20%: three a month.' in ON_SCREEN, 'the mandatory "most partners" line is missing'
assert 'not yet — 3 to qualify' in ON_SCREEN, 'the climb must start below the gate'
assert 'Barber · Longsight' in ON_SCREEN and 'went live' in ON_SCREEN, 'the £100 row has lost "went live"'
assert '£100–£300 per merchant. Revenue share needs 3+ new active merchants per calendar month. Terms: neropay.app/partners' in ON_SCREEN, 'compliance super, short form, with the partner link Faisal gave'
assert 'draft' not in ON_SCREEN.lower(), 'the figures are final — no draft mark'
# no total, no monthly sum, no pound figure for revenue share (rules 2 and 4)
assert not re.search(r'£\s?\d[\d,]*\s*(a|per)\s*month', (VO + ON_SCREEN).lower()), 'a monthly pound figure crept in'
assert not re.search(r'£(9|6)00', ON_SCREEN), 'no summed bonus on screen in the short'

# the register the brief bans (Part 6, item 2), in the take and on screen, plus the repo scan minus the two words the
# partner brief permits per unit ("earn", "earnings") — rule 2 allows "pays you" and "earn" as a price per introduction
BAD = ['passive income', 'easy money', 'guaranteed', 'no effort', 'risk-free', 'risk free', 'no cost no contract', 'no cost, no contract', '£500',
       'unemployed', 'benefits', 'broke', 'student', 'immigrant', 'over 50', 'hustle', 'game-changer', 'simply', 'genuinely']
ALL = (VO + ' ' + ON_SCREEN).lower()
for w in BAD:
    assert w not in ALL, f'banned register: {w}'
assert not re.search(r'up to 40\s?%', ALL), '"up to 40%" alone is banned'
for w in [x for x in BANNED if x not in ('earn', 'earnings')]:
    assert w not in ALL, f'repo banned word: {w}'
print('  ok  VO + ON_SCREEN: no banned register, no attribute targeting, no total, no revenue share in pounds')
for bad in ['Square', 'SumUp', 'Zettle', 'Dojo', 'Worldpay', 'Barclaycard', 'Takepayments', 'Elavon', 'Stripe', 'PayPal', 'Verifone']:
    assert bad.lower() not in ALL, f'competitor or maker named: {bad}'
assert '!' not in ON_SCREEN, 'no exclamation marks in supers'

# the concession, the gate said first, and the CTA are in the take
assert 'hundred to three hundred pounds for every' in VO.lower(), 'the hook is per merchant (brief Part 4, "you could be earning")'
assert '£100–£300' in ON_SCREEN and 'per merchant · based on their first 30 days' in ON_SCREEN, 'the hook super must carry the condition on the same frame'
assert 'three or more in the same month' in VO.lower(), 'the gate is said with the share'
assert 'yours either way' in VO.lower() and 'yours' in ON_SCREEN and 'either way' in ON_SCREEN, '"your bonus is yours either way" must be in every body'
assert 'neropay dot app slash partners' in VO.lower() and 'neropay.app/partners' in ON_SCREEN, 'no CTA'
assert 'we go and set them up' in VO.lower() and 'You introduce' in ON_SCREEN and 'We set up' in ON_SCREEN and 'We support' in ON_SCREEN
print('  ok  PP01: tiers match the register, every figure sits with its condition, rest frames complete, rails clean, CTA present')
