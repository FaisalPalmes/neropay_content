#!/usr/bin/env python3
"""Stage 3 of the build pipeline — the hard gate.

Two jobs:
  1. Audit figures.json: required fields, staleness, blocked records.
  2. Give each episode a way to assert its on-screen arithmetic and print the
     table to stdout, so the working shows up in the transcript.

A motion graphic stating a wrong rate is a compliance incident, not a typo.
Every check is fatal. Run it before a single frame is rendered.

    python3 maths/verify.py                 # audit figures.json
    python3 maths/verify.py episode-4       # audit, then run that episode's checks
"""
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FIGURES = ROOT / "figures.json"
STALE_DAYS = 90
REQUIRED = ("kind", "verified_on", "status")
REQUIRED_CONFIRMED = ("internal_source", "footer")
REQUIRED_BLOCKED = ("blocked_reason",)

# Words that are an earnings or guaranteed-savings claim. Rail 1 of the series
# block. Checked against VO, captions and on-screen copy, not just this file.
BANNED = (
    "save", "saving", "savings", "passive income", "risk-free", "riskfree",
    "guaranteed", "no effort", "earn", "earnings", "profit", "make money",
    "finance", "lending", "loan", "credit advance", "cash advance", "nerofinance",
)


class Fail(Exception):
    pass


def load():
    return json.loads(FIGURES.read_text())


def audit(figs, today=None):
    today = today or date.today()
    rows, problems = [], []
    for key, rec in figs.items():
        if key.startswith("_"):
            continue
        extra = REQUIRED_BLOCKED if rec.get("status") == "blocked" else REQUIRED_CONFIRMED
        missing = [f for f in REQUIRED + extra if f not in rec]
        if missing:
            problems.append(f"{key}: missing {', '.join(missing)}")
            continue
        age = (today - date.fromisoformat(rec["verified_on"])).days
        state = rec["status"]
        if state == "confirmed" and age > STALE_DAYS:
            problems.append(f"{key}: verified {age} days ago, over the {STALE_DAYS}-day limit")
            state = "STALE"
        rows.append((key, (rec.get("display") or "—")[:14], state, f"{age}d"))

    w = max(len(r[0]) for r in rows)
    print(f"\n  figures.json — {len(rows)} records, checked {today.isoformat()}\n")
    for key, disp, state, age in sorted(rows, key=lambda r: (r[2] != "confirmed", r[0])):
        mark = "ok " if state == "confirmed" else "!! "
        print(f"  {mark}{key.ljust(w)}  {disp.ljust(14)}  {state.ljust(9)}  {age}")
    return problems


def figure(figs, key):
    """Fetch a figure for use on screen. Blocked or absent is fatal."""
    if key not in figs:
        raise Fail(f"'{key}' has no figures.json record — it cannot go on screen.")
    rec = figs[key]
    if rec.get("status") != "confirmed":
        raise Fail(
            f"'{key}' is {rec.get('status')}: {rec.get('blocked_reason', 'no reason recorded')}"
        )
    return rec


def check(label, computed, stated, places=2):
    """Assert one on-screen figure against the arithmetic behind it."""
    ok = round(float(computed), places) == round(float(stated), places)
    print(f"  {'ok ' if ok else 'FAIL'}{label.ljust(46)} computed {computed}  on screen {stated}")
    if not ok:
        raise Fail(f"{label}: computed {computed}, screen says {stated}")


def scan_copy(text, where="copy"):
    """Rail 1 and rail 3 word scan. Catches the obvious, not the clever."""
    low = text.lower()
    hits = [w for w in BANNED if w in low]
    if hits:
        raise Fail(f"{where}: banned language — {', '.join(sorted(set(hits)))}")
    print(f"  ok  {where}: no earnings, savings or credit language")


def crossover(flat_rate, pct_rate, fee_pence):
    """Sale value at which a rate-plus-fixed-fee equals a flat rate."""
    return fee_pence / 100 / (flat_rate - pct_rate)


def main():
    figs = load()
    problems = audit(figs)
    if len(sys.argv) > 1:
        name = sys.argv[1]
        mod = ROOT / "maths" / name / "checks.py"
        if not mod.exists():
            problems.append(f"{name}: no checks.py — stage 3 cannot pass without one")
        else:
            print(f"\n  {name} — arithmetic\n")
            ns = {"figure": lambda k: figure(figs, k), "check": check,
                  "scan_copy": scan_copy, "crossover": crossover}
            try:
                exec(compile(mod.read_text(), str(mod), "exec"), ns)
            except Fail as e:
                problems.append(f"{name}: {e}")
    print()
    if problems:
        for p in problems:
            print(f"  FAIL  {p}")
        print(f"\n  {len(problems)} problem(s). Build stopped.\n")
        return 1
    print("  All checks passed.\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
