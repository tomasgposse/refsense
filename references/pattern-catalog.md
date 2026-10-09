# Pattern catalog

What to measure in each reference, the patterns that show up again and again, and why they work. The "why" is always about people: how they read, decide, trust and act. Use these explanations as raw material and phrase them for the brand at hand.

Contents:
1. Dimensions to measure
2. Common patterns and their why
3. Anti-patterns (the generic / AI-looking tells)
4. Turning measurements into tokens

---

## 1. Dimensions to measure

For each reference, note what you actually see (numbers when you can — `probe.js` gives most of them):

| Dimension | Measure |
|---|---|
| Structure | Order of sections from top to bottom. How many sections. What's above the fold. |
| Hierarchy | What the eye hits first, second, third. Size ratio between the biggest heading and body text. |
| Type | Number of families. Serif / sans / mono. Body size, line height, line length (characters per line). Heading weight and letter-spacing. |
| Color | Background, text, accent. How many colors carry meaning. Where the accent appears (only on actions? also on decoration?). Light or dark. |
| Spacing | Section padding (vertical). Gap between related items vs. unrelated groups. Max content width. |
| Imagery | Photos, product UI, illustration, 3D, none. Real or stock. Cropping, full-bleed or framed. |
| Actions | Number of distinct calls to action. Primary CTA text. How often it repeats down the page. |
| Trust | Logos, numbers, testimonials, press, guarantees — and where they sit. |
| Navigation | Number of nav items. Sticky or not. CTA in the nav. Mobile menu. |
| Motion | None, subtle reveal, scroll-driven, hover states. What's animated and why. |
| Mobile | What changes: order, what's hidden, size of tap targets, sticky CTA. |
| Voice | Headline length. Concrete vs. abstract. First/second person. Jargon level. |

---

## 2. Common patterns and their why

### Structure

**One promise, one action above the fold.**
Why: visitors decide within seconds whether a page is for them. A specific headline answers "what is this?" and a single primary button answers "what do I do?". Two equal buttons force a choice before the visitor is convinced; choices cost effort, and effort makes people leave.

**Show the thing early.**
Product screenshot, the actual food, the real space, the work itself — in the first screen or right after it.
Why: people trust what they can see more than what they're told. A real image proves the promise; an abstract illustration asks them to imagine it.

**Problem → solution → proof → action, in that order.**
Why: it follows the questions a visitor has in their head: "do you get my situation?", "how do you fix it?", "can I believe you?", "how do I start?". Answering them out of order (proof before they know what you do) wastes the proof.

**Few sections, each with one job.**
Strong pages usually have 5–8 sections. Why: every section is a chance for the visitor to stop reading. A section that doesn't move them closer to the action is a leak.

**Repeat the main action at the end (and sometimes mid-page).**
Why: people who scroll to the bottom are the most convinced ones; making them scroll back up to act loses some of them.

### Hierarchy and type

**Big contrast between headline and body (often 3–5×).**
Why: the eye needs an obvious place to start. When everything is medium-sized, nothing is read first, and the page feels flat and harder to scan.

**One or two typefaces, used consistently.**
Why: each typeface is a voice. Two voices (one for headings, one for reading) give character and order; three or more sound like several people talking at once.

**Body text 16–20px, lines of 50–75 characters, line height ~1.5.**
Why: these are the ranges where reading is effortless. Longer lines make the eye lose its place when jumping back; tighter line height makes paragraphs feel like walls.

**Tight letter-spacing and line height on large headings.**
Why: at large sizes the default spacing looks loose and unfinished; tightening it makes the headline read as one shape, which is what makes big type feel confident.

**Left-aligned text for anything longer than two lines.**
Why: the eye returns to the same left edge on every line. Centered paragraphs make each line start somewhere new, which is tiring to read. Centering works for short headlines and labels only.

### Color

**Neutral base + one accent reserved for action.**
Why: if the accent color only appears on things you can click, people learn in seconds that "this color means I can act". Spreading it on decoration dilutes that signal.

**Near-black and off-white instead of pure #000 / #fff.**
Why: pure black on pure white has harsh contrast that feels cheap on screens; slightly softened values feel calmer and more premium while keeping excellent legibility.

**Color from the brand, not from a trend.**
Why: a palette that already lives in the logo, the storefront or the product makes the page feel like the business, not like a template wearing it.

### Spacing

**Generous space between sections, tight space inside groups.**
Why: the brain groups things that are close together. Big gaps between sections and small gaps within them tell the visitor what belongs together without any lines or boxes.

**A spacing scale (e.g. 4/8/12/16/24/32/48/64/96/128) used everywhere.**
Why: repeated distances create rhythm. When every gap is a random number, the page feels "off" even if the visitor can't say why.

**Constrained content width (~1100–1280px for layout, ~65ch for text).**
Why: on big screens, content stretched edge-to-edge is hard to scan; a contained column keeps the eye's travel short.

### Imagery

**Real photos of the real thing, consistently treated.**
Same crop logic, same light, same color grading. Why: consistency makes a set of photos read as one brand; mixing styles looks like a collage of borrowed images.

**Full-bleed or large images instead of many small ones.**
Why: one strong image says more and feels more confident than a grid of thumbnails competing for attention.

**Product UI shown cropped and focused, not as full screenshots.**
Why: a full screenshot is unreadable at page size; a cropped detail shows the one thing that matters.

### Actions

**Specific CTA text ("Book a table", "Start free trial") instead of "Submit" or "Learn more".**
Why: the button should say what happens when you press it. Specific text reduces the uncertainty that makes people hesitate.

**One primary style, one secondary style, nothing else.**
Why: if there are four button styles, the visitor can't tell which action matters.

### Trust

**Proof right after the claim it supports.**
Why: proof works best at the moment of doubt. A testimonial about speed placed right under the "fast" claim answers the doubt as it appears.

**Specific proof over vague proof.**
"Delivered 1,200 events since 2016" beats "Trusted by many". Why: specifics are verifiable, so they're believable; vague claims sound like everyone else's.

### Navigation

**Few nav items (3–6) and the main CTA in the nav.**
Why: every extra link is a way out of the page. Keeping the CTA visible in the nav gives convinced visitors an exit that's also the goal.

### Motion

**Subtle, purposeful motion: reveal on scroll, responsive hover states, nothing looping for no reason.**
Why: motion attracts attention by force. Used sparingly it guides the eye; used everywhere it competes with the content and makes the page feel busy and slow.

### Mobile

**Mobile is a reordering, not a shrinking.**
The most important thing stays first, images get cropped for portrait, and the primary action is reachable with a thumb (sometimes a sticky bottom bar).
Why: most visitors arrive on a phone, holding it with one hand, half-distracted. The page has to work in that situation first.

---

## 3. Anti-patterns — the generic / AI-looking tells

Avoid these even if a reference uses them; they make a page read as "made by a template or an AI":

- Purple-to-blue gradients, glowing blobs or mesh gradients as the main visual idea.
- Three identical cards with an icon, a bold title and two lines of text, as the default "features" section.
- Everything centered, all the way down.
- Emoji used as icons.
- Vague headlines: "Unlock the power of…", "Elevate your…", "Your all-in-one solution", "Seamless", "Revolutionize".
- Glassmorphism cards floating over gradients.
- Generic stock photos of people pointing at laptops or shaking hands.
- Badges/pills above every heading.
- Every section the same height with the same layout (heading, subheading, grid).
- Fake numbers or fake testimonials.
- Text over busy images with low contrast.
- Gray text on gray backgrounds that fails contrast.

---

## 4. Turning measurements into tokens

Once patterns are clear, write the system before the page:

```css
:root {
  /* type — e.g. a 1.25 (major third) or 1.333 scale from the references */
  --font-display: ...; --font-body: ...;
  --text-sm: ...; --text-base: ...; --text-lg: ...; --text-xl: ...; --text-2xl: ...; --text-hero: ...;
  --leading-tight: 1.05; --leading-body: 1.55;
  /* color by role, not by name */
  --bg: ...; --surface: ...; --text: ...; --muted: ...; --border: ...; --accent: ...; --accent-ink: ...;
  /* spacing scale */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 24px;
  --space-6: 32px; --space-7: 48px; --space-8: 64px; --space-9: 96px; --space-10: 128px;
  /* layout */
  --max: 1200px; --measure: 65ch; --radius: ...;
}
```

Take the ratios from the references (if they jump 3.5× from body to hero, do the same) and the values from the brand (its colors, its typeface if it has one). When the brand has no typeface, choose one that matches the references' tone and is available (Google Fonts or system), and explain the choice in one line.
