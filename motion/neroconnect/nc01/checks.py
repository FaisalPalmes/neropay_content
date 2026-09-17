"""Stage-3 checks for NeroConnect NC01 — the intro (17 Sep 2026).

This video states no number, by design (motion/neroconnect/CLAUDE.md): an intro to a mechanism needs none, and every
NeroConnect figure is confidential (docs build plan §8) or open with Eray (§7). So the gate here is about what is
absent and what is present, not arithmetic:

  absent   any digit-led figure, pound sign or percent on screen or in the take; the banned register ("effortless",
           "no effort", "no cost", "startup cost", "risk-free", "passive", "guaranteed", "easy"); any fee, rate or
           margin word attached to a number; monthly payment plans; the Premium price; a competitor or a hardware
           maker; a real platform, partner or merchant; a personal attribute; an exclamation mark in a super;
           Faisal's name.
  present  the two arrangements as the docs describe them (who pays NeroPay's processing fee; merchant pricing the
           platform's in both) with no mode named and neither called simpler; the regulatory concession, generalised;
           the wrong-door concession; both CTAs (docs.neropay.app, follow on social media); the placeholder brand and
           never a real one.  (v2, 17 Sep 2026 — v1 carried the June playbook's mode story, which the September docs supersede.)
"""
import re, sys
from pathlib import Path
EP = Path('motion') / sys.argv[1]

html = (EP / 'index.html').read_text()
ON_SCREEN = ' '.join(re.sub(r'<[^>]+>', ' ', m) for m in re.findall(r'<div id="stage">(.*?)<script', html, re.S))
ON_SCREEN = re.sub(r'\s+', ' ', ON_SCREEN)
SCRIPT = html[html.index('<script type="module">'):]
CANVAS = ' '.join(re.findall(r"'([^'\\\n]*)'", SCRIPT))
OBJ = (EP / 'objects-nc.js').read_text()
CANVAS += ' ' + ' '.join(re.findall(r"'([^'\\\n]*)'", OBJ))
ALLSCREEN = ON_SCREEN + ' ' + CANVAS
VO = ("You don't have to build a payments company to run one. Everything it takes already exists. The card terminals. The till "
      "software. The settlement, the compliance, the support desk. We built all of it for NeroPay, and NeroConnect lets you run it "
      "under your own name. Here's how it works. You sign up as a platform and you get one dashboard for every merchant you look "
      "after. Your logo on the dashboard, your domain in the address bar, and if you want it, your branding on the terminal itself. "
      "You bring the merchants. And underneath, it's us: the card acquiring, the money landing in their account, the paperwork, the "
      "support. There are two ways to set it up. Either your platform pays NeroPay's processing fee and bills your merchants yourself, "
      "or each merchant pays it directly, with your fee on top. Either way, you set what your merchants pay. Who it's for: EPOS "
      "installers. Software companies with restaurants or salons on their platform. Anyone looking after a group of merchants. And who "
      "it isn't for. If you look after three cafés, the partner programme is the right door, one introduction and nothing to run. And "
      "depending on the setup, there can be regulatory questions on your side too, so that's a conversation we have before a contract, "
      "not after. The documentation is public. Read it at docs dot NeroPay dot app, then talk to us. That's it for today. Follow us for "
      "more of this.")
ALL = (VO + ' ' + ALLSCREEN).lower()

# absent: figures. The till screen's demo "£0.00" is the product's own idle display and is the one pound sign allowed on screen.
assert not re.search(r'£\s?\d', VO), 'no pound figure in the take'
assert not re.search(r'\d\s?%|\bper\s?cent\b', ALL), 'no percentage anywhere'
assert not re.search(r'£\s?(?!0\.00\b)\d', ALLSCREEN), 'no pound figure on screen beyond the till\'s idle £0.00'
assert not re.search(r'\b\d+\s?(p|pence)\b', ALL), 'no pence figure'
for w in ['effortless', 'no effort', 'no cost', 'startup cost', 'start-up cost', 'risk-free', 'risk free', 'passive', 'guaranteed',
          'easy money', 'easy', 'instalment', 'installment', 'monthly payment', 'payment plan', 'premium', '£500', 'wholesale', 'margin',
          'commission', 'interchange', 'finance', 'credit', 'loan', 'cash advance', 'simply', 'genuinely', 'game-changer', 'hustle']:
    assert w not in ALL, f'banned register or confidential term: {w}'
for w in ['unemployed', 'benefits', 'broke', 'student', 'immigrant', 'over 50', 'struggling']:
    assert w not in ALL, f'personal attribute: {w}'
for bad in ['Square', 'SumUp', 'Zettle', 'Dojo', 'Worldpay', 'Barclaycard', 'Takepayments', 'Elavon', 'Stripe', 'PayPal', 'Verifone', 'Kepos', 'Tyl', 'Teya']:
    assert bad.lower() not in ALL, f'competitor, maker or real platform named: {bad}'
for name in ['faisal', 'eray', 'elif', 'arman', 'armenian taverna']:
    assert name not in ALL, f'nobody is named: {name}'
assert '!' not in ON_SCREEN, 'no exclamation marks in supers'
assert 'your brand' in ALL and 'yourbrand' in ALL.replace(' ', ''), 'the placeholder brand is YOUR BRAND / pay.yourbrand.co.uk'
print('  ok  nothing stated that may not be: no figure, no fee, no plan, no price, no competitor, no name, no banned register')

# present — the two arrangements as the docs describe them ("Choosing your partnership mode", docs.neropay.app, Sep 2026):
# the arrangement decides who pays NeroPay's processing fee; merchant pricing is the platform's in both; no mode is named
# on screen and neither arrangement is called simpler, cheaper or better.
vo = VO.lower()
assert 'two ways to set it up' in vo and 'Two ways to set it up' in ON_SCREEN, 'the two arrangements, said and shown'
assert "your platform pays neropay's processing fee" in vo and 'Your platform pays' in ON_SCREEN, 'arrangement one: the platform pays the fee'
assert 'each merchant pays it directly' in vo and 'The merchant pays' in ON_SCREEN and 'On top' in ON_SCREEN, 'arrangement two: the merchant pays it, the platform fee on top'
assert 'you set what your merchants pay' in vo and 'Merchant pricing is yours either way' in ON_SCREEN, 'merchant pricing is the platform\'s in both arrangements'
for w in ['connected mode', 'platform mode', 'simpler', 'cheaper', 'lower risk', 'we set the merchant rates', 'disputes']:
    assert w not in vo and w not in ON_SCREEN.lower(), f'the old mode story is gone: {w}'
assert 'regulatory questions' in vo, 'the regulatory concession is in the take, generalised (no mode named)'
assert 'before a contract, not after' in vo and 'before a contract, not after' in ON_SCREEN, 'the conversation-before-a-contract line, said and shown'
assert 'partner programme is the right door' in vo and 'Partner programme' in ON_SCREEN, 'the wrong-door concession, said and shown'
assert 'docs dot neropay dot app' in vo and 'docs.neropay.app' in ON_SCREEN, 'the docs CTA, said and shown'
assert 'follow us for more' in vo and 'NeroPay on social media' in ON_SCREEN, 'the follow CTA, said and shown'
assert "that's it for today" in vo, 'the house sign-off'
assert 'Nero Panda Ltd' in ON_SCREEN, 'the trading-name line'
assert ON_SCREEN.count('<svg') == 0 and ALLSCREEN.count('Instagram') == 0, 'the social marks are drawn, never named'
print('  ok  NC01 v2: the two arrangements as the docs say them, the concession, the wrong door, both CTAs and the trading name are in the take and on screen')
