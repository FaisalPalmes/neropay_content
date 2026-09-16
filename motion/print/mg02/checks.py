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

VO = ("If you rent your card machine, there's a rule you should know about. "
      "Since January 2023, the payments regulator says a terminal lease can only tie you in for 18 months. Not three years. Not four. "
      "When those 18 months are up, the big providers have to write and tell you. The letter gives the date your minimum term ended, "
      "and that you're free to switch to another card machine provider. "
      "If you choose to stay, you can still leave at any time after that, as long as you give them one month's notice. "
      "Some deals are fine as they are. But you won't know until you compare. Comparing terminal rates is easy, it doesn't take long, "
      "and the difference between providers adds up over a year. "
      "Here at NeroPay you can get a quote in minutes. Drop us a message or give us a call and speak to someone from our team. "
      "That's it for today. Give us a follow to keep up with more videos like this.")

html = (EP / 'index.html').read_text()
ON_SCREEN = ' '.join(re.sub(r'<[^>]+>', ' ', m) for m in re.findall(r'<div id="stage">(.*?)<script', html, re.S))

# the figures on screen are the confirmed ones
assert '18-month' in ON_SCREEN and '18 months' in ON_SCREEN, 'the cap is not on screen'
assert "One month's" in ON_SCREEN and '1 month' in ON_SCREEN, 'the rolling term is not on screen'
assert 'Since Jan 2023' in ON_SCREEN, 'the start of the POS remedy is not on screen'
assert 'from July 2023' in ON_SCREEN and '14 largest providers' in ON_SCREEN, 'the trigger-message scope is not on screen'
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
assert 'some deals are fine as they are' in VO.lower(), 'no concession'
assert 'get a quote in minutes' in VO.lower() and 'neropay.app' in ON_SCREEN and 'Message us' in ON_SCREEN, 'no contact CTA'
assert 'give us a follow' in VO.lower() and 'Follow for more' in ON_SCREEN, 'no follow CTA'
# no savings figure, no promise: the compare line stays qualitative (rails 2 and 8)
assert not re.search(r'(save|saving)s?\s+(you\s+)?(hundreds|thousands|£)', VO.lower()), 'a savings claim crept into the take'
# nothing persistent and nothing numbered: no footer element, no episode number in the masthead
assert 'id="footer"' not in html and 'id="mast"' not in html, 'v4 carries no persistent footer or masthead'
assert not re.search(r'Small Print</span>\s*·?\s*\d', html) and '· 01' not in html, 'no episode number on screen'
print('MG02 v4: figures confirmed, rails clean, scope on screen, contact and follow CTAs present, no footer, no masthead')
