# Black Friday, Checked — Real Deal Finder

[![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/tuyullsxx1-cmd/black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/tuyullsxx1-cmd/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

A static Black Friday / Cyber Monday deal finder. 30 real deals from Amazon, Best Buy, Walmart and Target — every price verified 27 November 2026 against a named source, with sale price, usual price, discount, store link and check time on every card, plus an honest verdict: **NEW LOW**, **STRONG DEAL**, **SOLID**, or **ROUTINE SALE**.

## What it does

- Search by product, brand or store
- Filter by category, store, minimum discount and verdict
- Sort by biggest discount, biggest dollar saving, lowest price, or new lows first
- A detail page for every deal with the evidence behind its verdict
- A same-product comparison across stores (AirPods Pro 3, Beats Solo 4)
- Works on desktop and on a phone, from static files with no network request

## How we checked

Every price was read on 27 November 2026 from a deals source that names the store and the price it showed (TradingView/Benzinga, the Black Friday diary, Yahoo Shopping, Product Bible, BuzzFeed Shopping, Popular Science, TechRadar, Engadget, The Gadgeteer, AppleInsider, MacRumors, ComicBook). The source and its date sit on every deal page. Discounts are computed from the two prices shown, so the numbers always add up. Prices move on Black Friday — confirm at checkout.

## Run it

```sh
node serve.ts   # serves app/ at http://localhost:8080
```

Or open `app/index.html` directly in a browser. The entrypoint `main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Entry

Built for [make.fun — Build the best real Black Friday deal finder](https://make.fun/bounty/black-friday-deal-finder-01) ($250, top 20).
