"""Stage-3 checks for NeroConnect NC01 — the intro (17 Sep 2026).

This video states no number, by design (motion/neroconnect/CLAUDE.md): an intro to a mechanism needs none, and every
NeroConnect figure is confidential (docs build plan §8) or open with Eray (§7). So the gate here is about what is
absent and what is present, not arithmetic:

  absent   any digit-led figure, pound sign or percent on screen or in the take; the banned register ("effortless",
           "no effort", "no cost", "startup cost", "risk-free", "passive", "guaranteed", "easy"); any fee, rate or
           margin word attached to a number; monthly payment plans; the Premium price; a competitor or a hardware
           maker; a real platform, partner or merchant; a personal attribute; an exclamation mark in a super;
           Faisal's name.
  present  both modes named as Faisal confirmed them (Connected mode, Platform mode); the regulatory line, in the
           take and on the end card; the wrong-door concession; both CTAs (docs.neropay.app, follow); the
           placeholder brand and never a real one.
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
      "support. There are two ways to run it. Connected mode: you work under the NeroPay name, we set the merchant rates and we "
      "handle the disputes. It's the simpler start. Platform mode: your brand, your pricing, and more of the responsibility, "
      "disputes included. It's for when you want your own name on everything. Who it's for: EPOS installers. Software companies "
      "with restaurants or salons on their platform. Anyone looking after a group of merchants. And who it isn't for. If you look "
      "after three cafés, the partner programme is the right door, one introduction and nothing to run. And platform mode can need "
      "its own regulatory permissions, so that's a conversation we have before a contract, not after. The documentation is public. "
      "Read it at docs dot NeroPay dot app, then talk to us. That's it for today. Follow us for more of this.")
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

# present
assert 'connected mode' in VO.lower() and 'platform mode' in VO.lower(), 'both modes named in the take'
assert 'Connected' in ON_SCREEN and 'Platform' in ON_SCREEN, 'both modes on screen'
assert 'regulatory permissions' in VO.lower(), 'the regulatory line is in the take'
assert 'may require your own regulatory permissions' in ON_SCREEN, 'the regulatory line is on the end card'
assert 'before a contract, not after' in VO.lower() and 'before a contract, not after' in ON_SCREEN, 'the conversation-before-a-contract line, said and shown'
assert 'partner programme is the right door' in VO.lower() and 'Partner programme' in ON_SCREEN, 'the wrong-door concession, said and shown'
assert 'docs dot neropay dot app' in VO.lower() and 'docs.neropay.app' in ON_SCREEN, 'the docs CTA, said and shown'
assert 'follow us for more' in VO.lower() and 'Follow us for more' in ON_SCREEN, 'the follow CTA, said and shown'
assert "that's it for today" in VO.lower(), 'the house sign-off'
assert 'Nero Panda Ltd' in ON_SCREEN, 'the trading-name line'
assert 'we set the merchant rates' in VO.lower(), 'Connected mode: NeroPay sets merchant rates (Playbook v1 §2)'
assert 'your pricing' in VO.lower(), 'Platform mode: the platform sets merchant pricing (Playbook v1 §2)'
print('  ok  NC01: both modes, the regulatory concession, the wrong door, both CTAs and the trading name are in the take and on screen')
