# شاهنامه‌ی دیدنی · Visual Shahnameh

Ferdowsi's Shahnameh as a journey inward. Scroll, and the camera moves
forward into each painting's light and through a portal of gold to the next
one, with the couplets appearing one by one in nastaliq.

Production domain: [shahnameh.world](https://shahnameh.world), hosted on Cloudflare Workers and its CDN.
Cloudflare fallback: [visual-shahnameh.farzin-nasiri.workers.dev](https://visual-shahnameh.farzin-nasiri.workers.dev).

Progress: `pnpm run status` lists built sections, claims and the next section.

The repository includes the optimized AVIF paintings in `public/art/`, so a
fresh clone can run and deploy the completed chapters. Original generated
PNGs, local credentials and generated review output are excluded from git.

## Chapter checklist

As of 2026-11-05, chapters 01–07 are complete through **07.18, درگذشتن فریدون**.
The app includes **40 of 646 sections** and **1,941 of 49,615 couplets**, with paintings and generative music.
Next: **08.01, پادشاهی منوچهر**. Unchecked chapters remain to be illustrated and scored.

The source heading 07.13 has no couplets; it is included as a title-only section.

- [x] 01 · آغاز کتاب (11/11 sections)
- [x] 02 · کیومرس (1/1 sections)
- [x] 03 · هوشنگ (1/1 sections)
- [x] 04 · تهمورس (1/1 sections)
- [x] 05 · جمشید (2/2 sections)
- [x] 06 · ضحاک (6/6 sections)
- [x] 07 · فریدون (18/18 sections)
- [ ] 08 · منوچهر (0/1 sections)
- [ ] 09 · زال و رودابه (0/31 sections)
- [ ] 10 · نوذر (0/6 sections)
- [ ] 11 · افراسیاب (0/6 sections)
- [ ] 12 · زوتهماسپ (0/1 sections)
- [ ] 13 · گرشاسپ (0/6 sections)
- [ ] 14 · کیقباد (0/4 sections)
- [ ] 15 · کی کاووس (0/4 sections)
- [ ] 16 · هفتخوان رستم (0/34 sections)
- [ ] 17 · رستم و سهراب (0/19 sections)
- [ ] 18 · سیاوش (0/55 sections)
- [ ] 19 · پادشاهی کیخسرو (0/19 sections)
- [ ] 20 · داستان کاموس کشانی (0/22 sections)
- [ ] 21 · داستان خاقان چین (0/13 sections)
- [ ] 22 · داستان اکوان دیو (0/4 sections)
- [ ] 23 · داستان بیژن با منیژه (0/17 sections)
- [ ] 24 · داستان دورازده رخ (0/24 sections)
- [ ] 25 · جنگ بزرگ کیخسرو با افراسیاب (0/34 sections)
- [ ] 26 · پادشاهی لهراسپ (0/2 sections)
- [ ] 27 · پادشاهی گشتاسپ (0/16 sections)
- [ ] 28 · هفتخوان اسفندیار (0/14 sections)
- [ ] 29 · داستان رستم و اسفندیار (0/22 sections)
- [ ] 30 · داستان رستم و شغاد (0/5 sections)
- [ ] 31 · پادشاهی بهمن اسفندیار (0/26 sections)
- [ ] 32 · پادشاهی اسکندر (0/11 sections)
- [ ] 33 · پادشاهی اشکانیان (0/6 sections)
- [ ] 34 · داستان هفتواد و سرگذشت کرم (0/5 sections)
- [ ] 35 · پادشاهی ساسانیان (0/22 sections)
- [ ] 36 · پادشاهی یزدگرد بزه (0/9 sections)
- [ ] 37 · پادشاهی بهرام گور (0/21 sections)
- [ ] 38 · پادشاهی یزدگرد پسر بهرام گور (0/2 sections)
- [ ] 39 · پادشاهی پیروز (0/1 sections)
- [ ] 40 · پادشاهی بلاش (0/1 sections)
- [ ] 41 · پادشاهی قباد (0/9 sections)
- [ ] 42 · پادشاهی انوشیروان (0/37 sections)
- [ ] 43 · پادشاهی هرمزد (0/18 sections)
- [ ] 44 · پادشاهی خسرو پرویز (0/40 sections)
- [ ] 45 · داستان خسرو و شیرین (0/13 sections)
- [ ] 46 · پادشاهی قباد مشهور بشیرویه (0/6 sections)
- [ ] 47 · پادشاهی اردشیر شیروی (0/3 sections)
- [ ] 48 · پادشاهی پوراندخت (0/1 sections)
- [ ] 49 · پادشاهی آزرم دخت (0/2 sections)
- [ ] 50 · پادشاهی یزدگرد (0/14 sections)

```sh
pnpm run setup      # dependencies + Python venv for AVIF encoding
pnpm dev        # open http://localhost:5173
pnpm check 02.01   # verify a section end to end
pnpm deploy     # typecheck, build and deploy to Cloudflare (see DEPLOY.md)
```

To build more of the book with agents, open the project in any coding agent
and ask, for example, "spawn 20 agents to build the next 20 sections". The
agent follows `AGENTS.md`.

| Where | What |
| --- | --- |
| `DESIGN.md` | Vision, art direction, colour, type, motion and architecture |
| `AGENTS.md` | How agents build sections, alone or many in parallel |
| `art/` | Painting style guide, prompts, manifests, character sheets |
| `docs/BUILDER_BRIEF.md` | The brief for agents building sections |
| `reports/` | One report per built section |
| `DEPLOY.md` | Cloudflare deployment, DNS and optional R2 migration |
| `sound/` | The generative score's design guide |
| `text/` | The full Shahnameh text (50 chapters, 646 sections, 49,615 couplets) |
| `src/` | Engine and content |

Source text: takbook.com PDF edition, after Fereydoun Joneydi's 1354 edition
(`source/shahnameh-ferdowsi.pdf`).

## Package manager

Use pnpm 12.16.1, pinned in `package.json`. Run `make install` to install the
locked dependencies with `pnpm install --frozen-lockfile`. Commit `pnpm-lock.yaml`
when changing dependencies. Keep each package root independent; pnpm shares package
contents through its global store. Do not commit `node_modules` or create npm/yarn
lockfiles. Dependency build permissions live in `pnpm-workspace.yaml`.
