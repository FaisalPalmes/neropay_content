"""Stage-3 checks for the Partner Programme episode PP02 — your road (17 Sep 2026; v6 take of 18 Sep 2026).

Every figure on screen resolves to partner_bonus_tiers, partner_revenue_share_tiers and partner_active_gate, confirmed
final by Faisal on 17 Sep 2026 (motion/partner/BRIEF.md v4). Two rulings of the same day apply (motion/partner/CLAUDE.md):
the bonus is said as paid after 30 days, never as conditional in the sentence, and the tier condition stays on screen;
and no copy may sound like work for the partner.

Asserted: the climb steps at the register's counts and rates; £100–£300 sits with "per merchant" and the receipt's
"paid after 30 days" and tier line on the same section; the rest frame carries "Most partners start at 20%: three a
month."; the compliance super carries the link; the banned register is absent from the take and the screen; no
competitor and no hardware maker is named; no personal attribute; the concession and the CTA are in the take.
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
# the receipt and the phone screen are canvas textures: their strings live in the script, so read those too
SCRIPT = html[html.index('<script type="module">'):]
CANVAS = ' '.join(re.findall(r"'([^'\\\n]*)'", SCRIPT))
ALLSCREEN = ON_SCREEN + ' ' + CANVAS
VO = ("How many of the businesses on your road actually know your name? The café, the barber, the takeaway on the corner. "
      "Because every one of them you introduce to NeroPay is worth a hundred to three hundred pounds to you, paid once they've "
      "been taking card payments with us for thirty days. And you don't do any of it. No selling, no setting anything up, you "
      "don't even have to make the call. Just send us a name and a number and we'll close it for you. Do that three times in a "
      "month and you're an Active Partner, so you also get a share of what all your merchants' card payments earn us, every "
      "month you hit it. And if it's a quiet month and you only bring one, that bonus is still yours. It's free to join. Go to "
      "NeroPay dot app slash partners and get your link.")

b = {row[2]: (row[0], row[1]) for row in bonus['value']}
check('bonus tier 1, £', min(b), 100)
check('bonus tier 3, £', max(b), 300)
r = {int(round(row[2] * 100)): row[0] for row in share['value']}
for pct, n in [(20, 3), (25, 21), (30, 36), (35, 61), (40, 111)]:
    check(f'revenue share {pct}% from', r[pct], n)
assert 'const TIERS = [[3, 20], [21, 25], [36, 30], [61, 35], [111, 40]];' in html, 'the chart tiers must be the register'
assert 'const BARS = [0, 2, 4];' in html, 'the chart shows 20% from 3, 30% from 36, 40% from 111+'
for n, pct in [(3, 20), (36, 30), (111, 40)]:
    assert f'>{n}+</b> merchants' in ON_SCREEN or f'<b>{n}+</b>' in html, f'bar {pct}% must carry its count {n}+'
    assert f'>{pct}%<' in html, f'bar {pct}% label'
check('Active Partner gate, new merchants', gate['value'], 3)

# ruling 1: the figure is paid after 30 days, the tier condition on screen, never "based on" in the take
assert 'based on' not in VO.lower(), 'the take must not say the bonus is based on what they take'
assert 'taking card payments with us for thirty days' in VO.lower(), 'the take says the bonus is paid after 30 days with us'
# v6: the hero figure is digit columns that roll, so the HTML carries it whole on the element as data-figure
assert 'data-figure="£100–£300"' in html and 'per merchant' in ON_SCREEN, 'the figure sits with "per merchant" on the same section'
assert 'paid after 30 days' in CANVAS and 'of card payments with us' in CANVAS, 'the receipt carries the payment condition'
assert '£100 · £200 · £300' in CANVAS and 'first 30 days' in CANVAS, 'the receipt carries the tier condition (BRIEF rule 1)'
assert 'Most partners start at 20%: three a month.' in html, 'the mandatory "most partners" line is missing from the rest frame'
assert '£100–£300 per merchant, paid after 30 days with us. Revenue share needs 3+ new active merchants per calendar month. Terms: neropay.app/partners' in ON_SCREEN, 'compliance super'
assert 'draft' not in ALLSCREEN.lower(), 'the figures are final — no draft mark'
assert not re.search(r'£\s?\d[\d,]*\s*(a|per)\s*month', (VO + ALLSCREEN).lower()), 'a monthly pound figure crept in'
assert not re.search(r'£(6|9)00', ALLSCREEN), 'no summed bonus on screen'

# ruling 2: nothing that sounds like work for the partner; the hand-off is in the take and on screen
for bad_work in ['walk down', 'count', 'go and', 'knock', 'pitch']:
    assert bad_work not in VO.lower(), f'copy that sounds like work: {bad_work}'
assert 'send us a name and a number' in VO.lower() and "we'll close it for you" in VO.lower(), 'the hand-off must be in the take'
assert 'no selling.' in ON_SCREEN and 'no setting up.' in ON_SCREEN and 'no calling.' in ON_SCREEN, 'the three struck claims'
assert 'name' in ON_SCREEN and 'number' in ON_SCREEN and 'data-text="what we need"' in html, 'the hand-off must be on screen (the kicker is typed from data-text)'
assert not re.search(r'07\d', ALLSCREEN), 'never a real-looking phone number on screen'

BAD = ['passive income', 'easy money', 'guaranteed', 'no effort', 'risk-free', 'risk free', 'no cost no contract', 'no cost, no contract', '£500',
       'unemployed', 'benefits', 'broke', 'student', 'immigrant', 'over 50', 'hustle', 'game-changer', 'simply', 'genuinely', 'easy']
ALL = (VO + ' ' + ALLSCREEN).lower()
for w in BAD:
    assert w not in ALL, f'banned register: {w}'
assert not re.search(r'up to 40\s?%', ALL), '"up to 40%" alone is banned'
for w in [x for x in BANNED if x not in ('earn', 'earnings')]:
    assert w not in ALL, f'repo banned word: {w}'
for bad in ['Square', 'SumUp', 'Zettle', 'Dojo', 'Worldpay', 'Barclaycard', 'Takepayments', 'Elavon', 'Stripe', 'PayPal', 'Verifone']:
    assert bad.lower() not in ALL, f'competitor or maker named: {bad}'
for place in ['wilmslow', 'rusholme', 'manchester', 'london', 'longsight', 'stockport']:
    assert place not in ALL, f'no place is named (Faisal, 17 Sep 2026): {place}'
assert '!' not in ON_SCREEN, 'no exclamation marks in supers'
print('  ok  VO + screen: no banned register, no place, no attribute targeting, no total, no revenue share in pounds')

assert 'three times in a month' in VO.lower() and 'active partner' in VO.lower(), 'the gate is said with the share'
assert 'that bonus is still yours' in VO.lower() and 'yours' in ON_SCREEN and 'either way' in ON_SCREEN, 'the concession is in the take and on screen'
assert 'neropay dot app slash partners' in VO.lower() and 'neropay.app/' in ON_SCREEN and 'partners' in ON_SCREEN, 'no CTA'
assert 'free to join' in VO.lower() and 'Free to join' in ON_SCREEN
print('  ok  PP02: tiers match the register, the figure sits with its condition, the rulings hold, rails clean, CTA present')
