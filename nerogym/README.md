# NeroGym feasibility brief

The research and plan for NeroGym, the physical gym, as an eight-page site. Built for a meeting with
Eray; internal, `noindex`, not for circulation. Dated 16 September 2026.

## Pages

| Page | Job |
|---|---|
| `index.html` | Overview: the one-line version, the numbers that matter, the three questions for Eray, corrections to the September brief |
| `premises.html` | The gate that comes before every other figure: planning use class, must-have criteria, where in Stockport, what the rent X does, lease terms, a scoring sheet |
| `sequence.html` | Eight phases in chronological order, what is put in place in each, mid-tier cost per phase |
| `costs.html` | Every one-off cost at three tiers with UK and overseas suppliers and sources; equipment itemised; importing from China; finance |
| `running.html` | The monthly ledger with X at the top; three staffing models at 2026/27 wage rates; energy, rates, maintenance; ancillary income |
| `model.html` | Interactive: pick X, running case, price plan, space per member, equipment finance → break-even, scenarios, competitor register, thirty-month ramp with downside, sensitivity, verdict |
| `concept.html` | Purpose, audience, the five commitments, design and lighting, creator zones and the privacy answer, screens, software roadmap, recovery |
| `marketing.html` | Pre-sale, launch, steady state, by location type, creator programme, corporate, retention, what we never say |

## How it is built

- **`data.js` is the only place a figure lives.** Phases, one-off rows (`capex`), monthly rows (`opex`),
  ancillary income, assumptions, price plans and the competitor register. Every table, total and
  `<span data-fig="…">` in the pages is rendered from it by `nerogym.js`. Change a number there, never
  in a page. Rows carry `who` (suppliers), `src` (URL + label) and a `tag` (`est.`, `if B2/B8`, `in-house`).
- **`X` (the rent) is `NG.lease.default`** and can be moved on the model page; the choice is remembered
  in the reader's browser and followed by the other pages.
- Pages are assembled from `_head.tpl` + `<name>.body.html` + `_foot.tpl` by `_build.sh`:
  `./_build.sh costs "NeroGym · One-off costs" "description"`. Edit the `.body.html`, rebuild, commit both.
- `nerogym.css` is its own stylesheet in NeroPay's world (off-white paper, black and grey type, yellow
  accent, Chivo / Source Serif 4 / Martian Mono). It does not touch `../style.css`.
- Figures are GBP ex VAT unless a row says otherwise. Everything was read from search-result snippets
  on 16 September 2026 because direct page fetches were blocked in the research session; re-quote
  from the live page before a number goes to a lender or landlord.

## Rules that apply here as everywhere in this repo

No NeroPay rates, margins or partner terms (the till line says "in-house, not priced"). No earnings or
transformation claims in any marketing copy. No merchant or member named. British English.

## Checks before pushing

```
node --check nerogym/data.js nerogym/nerogym.js
```

Then load each page: no console errors other than the font CDN, nothing overflows at 390px, no
`data-fig` span left empty.
