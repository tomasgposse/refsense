---
name: refsense
description: Designs landing pages and redesigns screens the way a senior designer would — by studying strong references first. It reads the brand (a website, an Instagram profile, screenshots or a plain description), finds the best references in that category on its own (or asks for a folder of references when it can't find enough), detects the patterns those references share, explains in plain language WHY each pattern works, applies them in the project's own stack, and leaves a PATTERNS.md so the design stays coherent. Use it whenever someone asks to design, redesign, improve or "make prettier" a landing page, homepage, website or app screen — especially when they pass a URL, an Instagram, screenshots or reference sites, say "make it look like X", "something like Kesef/Linear/Airbnb", "I'm bad at frontend", "I don't know design", or just "design a landing for this", even if they never mention references or patterns.
---

# refsense

Good designers rarely invent from zero. They look at what the best work in a category has in common, understand why it works, and apply that to their own brand. refsense does the same for developers who don't have that eye yet — and teaches it along the way, so every pattern comes with its reason.

The promise to the user: **"You don't need to know design or find references. Tell me what to design and for whom; I'll show you what the best ones do, why, and build it."**

## The flow

```
1. Read the brand      → a 5-line brief
2. Find references     → 5–8 strong ones (or ask for a folder)
3. Capture & measure   → screenshots + real numbers
4. Extract patterns    → shared by ≥3 refs = pattern; fewer = idea
5. Checkpoint          → refs + patterns + why, one minute of reading
6. Build               → tokens first, then sections, real content
7. Verify              → screenshot your own result, check it against the patterns
8. Hand over           → PATTERNS.md + short summary
```

Talk to the user in their language throughout (the brief, the "why", PATTERNS.md). Keep the explanations free of jargon: the reader is a developer, not a designer. When a design term is unavoidable, define it in half a sentence the first time.

---

## 1. Read the brand

Figure out what the input is and pull everything real out of it. Real content is what separates a designed page from a template.

| Input | What to do |
|---|---|
| Website URL | Fetch it. Extract: what they sell/do, for whom, the actual copy, logo, current colors and fonts, photos, prices, contact, social proof (clients, reviews, numbers). |
| Instagram | Read what you can: bio, follower count, highlight names and post dates are often visible logged out; the photos and captions usually aren't. **Ask for 5–10 of the brand's photos (or screenshots of the profile and posts)** — the page will live or die on them. Don't invent the brand from the handle. |
| Screenshots / folder | Read every image. Treat them as the brand source. |
| Plain description | Use it, and ask only for what you can't reasonably assume (usually: name, what they offer, who it's for). |
| Existing project/repo | Read the current screens and styles; the brief describes what exists and what's wrong with it. |

Write the brief before anything else:

```
Brand:      <name> — <what it is in one line>
Audience:   <who it's for, what they want when they land>
Tone:       <3 words, taken from their actual voice>
Keep:       <brand assets that must survive: logo, color, typeface, photo style>
Goal:       <the one action the page must drive: book, buy, sign up, download, contact>
```

If an asset is weak (a low-res logo, a muddy palette), note it — don't silently replace someone's brand. Improve around it and mention it in the summary.

## 2. Find references

If the user gave references, use them as the core set; you may add 2–3 more to fill a gap, saying so. If they gave none, find them yourself — that is the main use case.

Read `references/finding-references.md` for where to search, query templates and the quality bar. In short:

- Aim for **5–8 references** that are excellent, not merely relevant. One great reference teaches more than five average ones.
- Prefer, in order: the category's best-known brands → curated galleries (award sites, landing galleries) → strong adjacent categories.
- Reject templates, theme demos, pages that are mostly stock imagery, and anything that looks like generic AI output.
- If the category is niche and you can't find 5 good ones, borrow from adjacent categories and say which and why ("there are no good landing pages for tire shops; I used premium car workshops and bike shops").
- **When to ask for a folder:** if after a real search you still have fewer than 4 strong references, or the brand is so specific that outside references would mislead, stop and ask: "I couldn't find enough good references for X. Could you put screenshots or links of sites you like in a folder and tell me the path? Even 3–4 help."

## 3. Capture and measure

Look at the references, don't guess them from memory. Patterns come from what's actually on the page.

Run `scripts/shoot.mjs` on all of them at once (Node 18+ and Chrome or Edge, no npm install):

```bash
node <skill-dir>/scripts/shoot.mjs <workspace>/refs https://ref1.com https://ref2.com ...
```

For each page and for desktop (1440×900) and mobile (390×844) it saves the first screen (`-fold.png`), the whole page (`-full.png`), and `results.json` with real measurements from `references/probe.js`: font families, body size, the headline-to-body ratio, characters per line, colors by role, button labels and corner radius, the space before each section, and the navigation. It also hides cookie banners before the shot.

Then:
- **Discard what isn't a real page.** `results.json` flags pages that look blocked (bot checks, login walls, error pages), but also open the images: a "✓" can still be a Cloudflare check or an empty shell. Replace discarded references if that leaves you with fewer than 5.
- **Study the images**, full pages first, then the first screens. Note what the eye hits first, the section order, how photos are cropped, and how mobile reorders things.
- **Use the numbers.** "Headlines are 4.5× the body text and every corner is square" is a pattern you can apply; "big headlines, clean look" isn't.

If the script can't run, use any browser tool you have (paste `references/probe.js` into its JavaScript runner), or WebFetch for structure and copy.

## 4. Extract patterns

Compare the references dimension by dimension.

- **Pattern:** shared by **3 or more** references. These are the backbone of the design.
- **Idea:** appears in 1–2 references but fits this brand unusually well. Use at most one or two, and label them as ideas.
- **Contradiction:** references disagree (e.g. half dark, half light). Decide with the brief, and say why you chose.

Each pattern needs four things, because the "why" is what the user learns from:

```
Pattern:   One big promise + one action above the fold
Seen in:   Linear, Raycast, Arc, Vercel (4/6)
Why:       A visitor decides in a few seconds whether to stay. One clear promise and one obvious
           next step answers "what is this and what do I do?" before they scroll. Two competing
           buttons make them think; thinking makes them leave.
Applied:   Hero with the headline "…" and a single "Book a session" button; secondary link below.
```

The "why" must be about people (attention, trust, reading, effort, decisions), not about aesthetics ("it looks clean" explains nothing). `references/pattern-catalog.md` has the reasoning for the common ones — use it, but phrase it for this brand.

Also check the anti-patterns list in the catalog: these are the tells of generic, AI-looking pages. Avoid them even if one reference uses them.

## 5. Checkpoint

Before building, show the user in one short message:

- The brief (5 lines).
- The references with one line each on why they were chosen.
- The 4–7 patterns you will apply, each with its "why" in one sentence.
- Any idea or contradiction you resolved.

Then ask: "Should I build with this direction, or change something?" This costs the user a minute and saves rebuilding a whole page in the wrong direction.

If the user already said not to ask, to work autonomously, or that they'll be away, skip the wait: state the direction and continue.

## 6. Build

**Stack.** Use the project's stack if there is one (read package.json, existing components, CSS approach) and follow its conventions. With no project, create a folder named after the brand in the current directory and build a self-contained `index.html` there (inline CSS, minimal JS, brand photos copied into `assets/`), so it opens anywhere without a build step. Keep screenshots and measurements in a separate working folder, not next to the page.

**Tokens first.** Before writing sections, define the system the patterns imply: type scale, colors (with their roles: background, text, muted, accent, border), spacing scale, radius, max width. In CSS variables (or the project's token system). Every value in the page should come from these. This is what makes a page look designed instead of assembled.

**Then sections, in the order the patterns dictate.** Use the brand's real copy, real offer, real photos and real proof. Where you lack something:
- Copy: write it in the brand's tone, and keep it short and specific. Never lorem ipsum.
- Photos: if the brand's photos are unusable (low-res, rights unclear), leave a clearly marked slot (`<!-- PHOTO: …what should go here -->` plus a neutral placeholder block with the description) — don't fill it with generated or stock images without telling the user.
- Proof (testimonials, numbers, logos): never invent. Leave a marked slot and mention it.

**Patterns, not pixels.** Take the structure, rhythm and logic of the references, never their copy, logos, illustrations, photos or distinctive brand elements. The result should feel like it belongs among the references, not like a copy of one.

**Mobile is a reordering, not a shrinking.** A landscape photo cropped to a full-height phone screen usually shows sky and a fender. On phones, put the photo first at a shape that keeps the subject whole and the promise below it, or choose a different crop.

**Text over photos** needs a gradient only where the text sits (the left third, the bottom), so the subject stays bright. Check it on the actual photo, not in your head.

**Never hide content behind animation.** Reveal-on-scroll is fine as a garnish, but content must be visible without JavaScript and must not stay invisible if the visitor scrolls fast. Keep it short (under 0.6 s) and off under `prefers-reduced-motion`.

**Quality floor.** Responsive from 360px up with no horizontal scroll, readable contrast (WCAG AA), real focus states, semantic HTML, images with alt text and real width/height, lazy loading below the fold, and motion that respects `prefers-reduced-motion`.

## 7. Verify

Shoot your own result the same way (a local file path works):

```bash
node <skill-dir>/scripts/shoot.mjs <workspace>/verify path/to/index.html
```

Open the desktop and mobile images next to the references and check, in this order:
1. **Every section is visible** in the full-page shots. Blank areas usually mean an animation or a lazy image that never appeared; that's what a fast-scrolling visitor sees too.
2. **The first screen on mobile** shows the subject and the promise, and the text over photos is readable.
3. **Each pattern** from step 4 is actually visible, and the measurements in `results.json` match the plan (the headline-to-body ratio, characters per line, number of buttons).
4. **No anti-pattern** from the catalog snuck in.

Fix and shoot again until it passes. The first version almost always has at least one of these problems; this pass is where the page goes from assembled to designed.

## 8. Hand over

Write `PATTERNS.md` (in the user's language; name it `PATRONES.md` in Spanish, etc.) next to the page, using `references/patterns-template.md`. It records the brief, the references, each pattern with its why, the tokens, and the open slots. Future sessions read it to keep the design coherent — tell the user that.

Close with a short summary: what you built, the 3 patterns that matter most and why, and what the user still needs to provide (photos, real testimonials, etc.). Keep it scannable; the long explanation lives in PATTERNS.md.

## Reference files

- `references/finding-references.md` — where and how to search, quality bar, adjacent categories. Read in step 2.
- `references/pattern-catalog.md` — dimensions to measure, common patterns with their why, anti-patterns. Read in steps 3–4.
- `references/probe.js` — measures a page's real type, color, spacing and buttons. `shoot.mjs` runs it automatically; paste it into a browser tool if the script can't run. Step 3.
- `references/patterns-template.md` — template for PATTERNS.md. Step 8.
- `scripts/shoot.mjs` — first-screen and full-page screenshots at desktop and mobile, plus measurements and blocked-page detection, for any URL or local file. Steps 3 and 7.
