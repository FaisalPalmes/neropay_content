"""Stage-3 checks for Small Print MG02 v3 — They have to tell you. (rebuilt 16 Sep 2026)

Every figure on screen or in the take resolves to psr_terminal_lease_cap and psr_trigger_messages.
Nothing is computed here — the episode states regulation, not arithmetic — so the checks are that the
values on screen are the confirmed ones, that the copy stays inside the rails, and that the scope of the
rule (the fourteen directed providers) is on screen where the rule is stated.
"""
import re, sys
from pathlib import Path
# verify.py execs this file with figure(), check() and scan_copy() in scope and the repo root as cwd
EP = Path('motion') / sys.argv[1]

cap = figure('psr_terminal_lease_cap')
trig = figure('psr_trigger_messages')

check('lease cap, months', cap['value'], 18)
check('rolling renewal, days', cap['rolling_days'], 31)
assert trig['value'] == '2023-07', trig['value']

VO = ("Quick one. Your card machine company has to tell you when you can walk away. Did they? "
      "Since January 2023, the regulator caps a terminal lease at 18 months. Not three years. Not four. "
      "And when that term ends, the big providers must write to you. The date it ends… and a nudge to shop around. "
      "After that, it rolls monthly. One month's notice — and you're out. "
      "Now, if your deal's decent, ignore all this. Plenty are. But find that letter, check the date. It's your call, not theirs. "
      "We're NeroPay. Card machines, from Manchester. Follow us for more of this — and have a look at neropay.app.")

html = (EP / 'index.html').read_text()
ON_SCREEN = ' '.join(re.sub(r'<[^>]+>', ' ', m) for m in re.findall(r'<div id="stage">(.*?)<script', html, re.S))

# the figures on screen are the confirmed ones
assert '18' in ON_SCREEN and 'months' in ON_SCREEN, 'the cap is not on screen'
assert '31-day rolling' in ON_SCREEN, 'the rolling term is not on screen'
assert 'Jan 2023' in ON_SCREEN, 'the start of the POS remedy is not on screen'
assert 'July 2023' in ON_SCREEN and '14 largest providers' in ON_SCREEN, 'the trigger-message scope is not on screen'
# "since 2023" in the take is true for both remedies (Jan 2023 lease cap, July 2023 trigger messages)
assert 'Since January 2023' in VO
# the scope of "the big providers" is stated on the station where the rule is stated
assert 'Payment Systems Regulator' in ON_SCREEN and 'PS22/2' in ON_SCREEN

# rails: no rate, no price, no lending, no earnings, no competitor, no guarantee — in the take and on screen
scan_copy('VO', VO)
scan_copy('ON_SCREEN', ON_SCREEN)
for bad in ['Square', 'SumUp', 'Zettle', 'Dojo', 'Worldpay', 'Barclaycard', 'Takepayments', 'Elavon', 'Stripe', 'PayPal']:
    assert bad.lower() not in (VO + ON_SCREEN).lower(), f'competitor named: {bad}'
# the concession, the CTA to the site and the CTA to follow are all in the take
assert "if your deal's decent, ignore all this" in VO.lower(), 'no concession'
assert 'neropay.app' in VO and 'neropay.app' in ON_SCREEN, 'no site CTA'
assert 'follow us' in VO.lower() and 'Follow us' in ON_SCREEN, 'no follow CTA'
# nothing persistent and nothing numbered: no footer element, no episode number in the masthead
assert 'id="footer"' not in html, 'v3 carries no persistent footer'
assert not re.search(r'Small Print</span>\s*·?\s*\d', html) and '· 01' not in html, 'no episode number on screen'
print('MG02 v3: figures confirmed, rails clean, scope on screen, both CTAs present, no footer, no number')
