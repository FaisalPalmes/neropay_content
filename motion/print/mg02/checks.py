# Small Print, MG02 — "They have to tell you."
# Stage 3 gate. There is no arithmetic in this episode; the gate is that every figure spoken or
# shown resolves to a confirmed figures.json record, and that the spoken and on-screen words
# clear the rails scan. A regulatory figure stated wrong is a compliance incident, not a typo.

cap = figure("psr_terminal_lease_cap")
trig = figure("psr_trigger_messages")

check("lease cap · months", cap["value"], 18)
check("lease cap · rolling days after the minimum term", cap["rolling_days"], 31)
assert trig["value"] == "2023-07", f"trigger messages moved: {trig['value']}"
print("  ok  trigger messages · from July 2023")

# The VO says "Since twenty twenty-three" — the POS remedy is from Jan 2023 and the trigger
# messages from July 2023, so the year alone is the safe spoken form. Assert both live in 2023.
assert "Jan 2023" in cap["internal_source"], "lease cap source no longer says Jan 2023"
assert trig["value"].startswith("2023"), "trigger messages no longer 2023"
print("  ok  'since 2023' holds for both the cap (Jan 2023) and the message (July 2023)")

# The spoken "Not thirty-six. Not forty-eight." are the terms the cap replaces, not figures we
# assert about any provider. They must never appear as a claim about a named provider.
VO = """Your card machine company is legally required to tell you when you can leave. Did you get the message?
Since twenty twenty-three, the payments regulator caps a card terminal lease at eighteen months. Not thirty-six. Not forty-eight.
And when that term ends, they have to send you a message. In writing. Telling you the date, and telling you to shop around.
After that it rolls month to month. Thirty-one days. You can leave with a month's notice, not a year's.
If your deal's good, bin the message. Most of them are fine. The point is it's your choice, on a date you know. Check the letter. Then decide."""

ON_SCREEN = """THEY HAVE TO TELL YOU your card machine company, that is
TERMINAL LEASE 18 months max minimum term · PSR · from Jan 2023
36 48 struck
Your minimum term ends on trigger message in writing · from July 2023 · the 14 largest providers
THIRTY-ONE DAYS rolling, after that
If your deal's good, bin the message. Most of them are fine.
NERO PAY neropay.app
Terminal lease cap 18 months then 31-day rolling; trigger messages from July 2023. PSR PS22/2, Oct 2022. The 14 directed providers; check your own contract."""

scan_copy(VO, "VO script")
scan_copy(ON_SCREEN, "on-screen text")

for name in ("square", "sumup", "paypal", "dojo", "worldpay", "teya", "zettle",
             "takepayments", "stripe", "verifone", "barclaycard", "elavon", "lloyds"):
    assert name not in (VO + ON_SCREEN).lower(), f"provider named on screen or in VO: {name}"
print("  ok  no provider named in VO or on-screen text")

# The footer must carry the scope, or the hook over-claims.
assert "14 directed providers" in ON_SCREEN, "footer lost the directed-providers scope"
print("  ok  footer carries the directed-providers scope")
