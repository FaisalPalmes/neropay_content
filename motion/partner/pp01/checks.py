"""Stage-3 checks for the Partner Programme episode PP01 — DRAFT build (16 Sep 2026).

Every figure on screen resolves to the three draft records Faisal released with motion/partner/BRIEF.md:
partner_bonus_tiers, partner_revenue_share_tiers, partner_active_gate. They are drafts (three items open with
Eray — BRIEF.md Part 7), so verify.py marks the build DRAFT and every export carries -DRAFT.

What is asserted: the thresholds the composition steps at are the ones in figures.json; every pound figure on
screen sits in the same element as the condition that earns it; the two rest frames carry their conditions and
the "Most partners start at 20%" line; the brief's banned register is absent from the take and the screen; no
competitor and no hardware maker is named; nothing targets a personal attribute; the concession and both CTAs are
in the take.
"""
import re, sys
from pathlib import Path
EP = Path('motion') / sys.argv[1]

bonus = draft_figure('partner_bonus_tiers')
share = draft_figure('partner_revenue_share_tiers')
gate = draft_figure('partner_active_gate')

html = (EP / 'index.html').read_text()
ON_SCREEN = ' '.join(re.sub(r'<[^>]+>', ' ', m) for m in re.findall(r'<div id="stage">(.*?)<script', html, re.S))
ON_SCREEN = re.sub(r'\s+', ' ', ON_SCREEN)
VO = ("Okay, here's the catch first, because we'd rather you heard it from us than found it in the terms: the revenue share "
      "only kicks in when you're introducing three businesses a month, and the bonus has no catch at all. So here's how the "
      "whole thing works. You know a café, or a takeaway, or a barber that takes card payments, and you introduce them to "
      "NeroPay. We go and set them up, we do the support, you don't touch any of it. And when they go live you get a bonus "
      "for that one business, which starts at a hundred pounds, goes to two hundred if they take over twenty thousand in their "
      "first month, and three hundred if they take over forty. So every business you introduce pays you, and there's nothing "
      "to unlock. Then if you introduce three or more in the same month, you're an Active Partner, which means you also get a "
      "share of what all your merchants' card payments earn us, not just the new three, every month you hit it. And if you "
      "have a quiet month and only bring one, you still get that bonus, it's yours either way. So if someone's already come to "
      "mind, go to partners dot NeroPay dot app, it's free to join, and get your link.")

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
assert '£100–£300 per merchant. Revenue share needs 3+ new active merchants per calendar month. Terms: partners.neropay.app' in ON_SCREEN, 'compliance super, short form, verbatim'
assert 'Draft · figures pending confirmation · not for posting' in ON_SCREEN, 'a DRAFT build carries the draft mark'
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
assert "here's the catch first" in VO.lower() and 'three businesses a month' in VO.lower(), 'the condition is not said first'
assert 'yours either way' in VO.lower() and 'yours' in ON_SCREEN and 'either way' in ON_SCREEN, '"your bonus is yours either way" must be in every body'
assert 'partners dot neropay dot app' in VO.lower() and 'partners.neropay.app' in ON_SCREEN, 'no CTA'
assert 'we go and set them up' in VO.lower() and 'You introduce' in ON_SCREEN and 'We set up' in ON_SCREEN and 'We support' in ON_SCREEN
print('  ok  PP01: tiers match the register, every figure sits with its condition, rest frames complete, rails clean, CTA present')
