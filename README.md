# refsense

**English** · [Español](#español)

A skill for Claude Code (and other agents that read `SKILL.md`) that designs landing pages and screens the way a senior designer does: **by studying strong references first**, and explaining why each decision works.

Built for developers who are great at code but don't have a designer's eye yet. You don't need to know design or find references:

> "Design a new landing for this Instagram: instagram.com/somebrand"
> "Redesign the home of this app, it looks amateur"
> "Make a landing for my dentist friend, here's her website"

## What it does

1. **Reads the brand** from a website, an Instagram, screenshots or a description, and writes a 5-line brief. It uses the brand's real copy and photos and never invents testimonials or numbers.
2. **Finds references on its own.** It looks for 5–8 excellent sites in the category (category leaders, curated galleries, adjacent categories when the niche is thin). If it can't find enough good ones, it asks you for a folder.
3. **Captures and measures them**: first screen and full page, desktop and mobile, plus real numbers (type scale, colors by role, spacing, buttons), with no npm dependencies.
4. **Extracts patterns.** Something shared by 3 or more references is a pattern; something in only 1–2 is an idea.
5. **Explains the why** of each pattern in plain language, in terms of how people read, decide and trust, not "it looks clean".
6. **Builds** in your stack (or a single `index.html`), tokens first, with real content and marked slots for what's missing.
7. **Checks its own work** with screenshots of the result against the patterns, and fixes what fails.
8. **Leaves a `PATTERNS.md`** so the next session keeps the design coherent.

## Install

```bash
git clone https://github.com/tomasgposse/refsense ~/.claude/skills/refsense
```

Or copy the folder into your project's `.claude/skills/`. Claude picks it up when you ask it to design or redesign something.

**Requirements:** Node 18+ and Chrome or Edge, for the screenshot and measuring script. Set `CHROME_PATH` if the browser is somewhere unusual.

## What's inside

| File | What it's for |
|---|---|
| `SKILL.md` | The workflow |
| `references/finding-references.md` | Where to search, quality bar, adjacent categories |
| `references/pattern-catalog.md` | What to measure, common patterns with their why, anti-patterns |
| `references/probe.js` | Measures a page's real type, color, spacing and buttons |
| `references/patterns-template.md` | Template for the `PATTERNS.md` it leaves behind |
| `scripts/shoot.mjs` | Screenshots and measurements of any URL or local file, through the DevTools protocol |

You can also use the script on its own:

```bash
node scripts/shoot.mjs out https://linear.app https://stripe.com
```

## Principles

- **Patterns, not pixels.** It takes the structure and logic of the references, never their copy, logos or images.
- **Never invents.** Missing specs, testimonials or photos become visible slots, not fake content.
- **Teaches as it goes.** Every decision comes with a reason you can reuse in the next project.

## License

MIT

---

## Español

Una skill para Claude Code (y otros agentes que leen `SKILL.md`) que diseña landings y pantallas como lo haría alguien senior de diseño: **primero estudia buenas referencias** y después explica por qué funciona cada decisión.

Está pensada para devs que programan muy bien pero todavía no tienen ojo de diseño. No hace falta saber diseño ni buscar referencias:

> "Diseñá una landing nueva para este Instagram: instagram.com/unamarca"
> "Rediseñá la home de esta app, se ve amateur"
> "Armá una landing para mi amiga dentista, este es su sitio"

## Qué hace

1. **Lee la marca** desde un sitio, un Instagram, capturas o una descripción, y escribe un brief de 5 líneas. Usa los textos y las fotos reales de la marca, y nunca inventa testimonios ni números.
2. **Busca referencias sola.** Encuentra entre 5 y 8 sitios excelentes del rubro: líderes de la categoría, galerías curadas y rubros vecinos cuando el nicho tiene pocas. Si no encuentra suficientes buenas, te pide una carpeta.
3. **Las captura y las mide:** primera pantalla y página completa, en escritorio y en celular, con números reales (escala tipográfica, colores según su uso, espaciado, botones). No necesita dependencias de npm.
4. **Detecta patrones.** Lo que comparten 3 o más referencias es un patrón; lo que aparece en 1 o 2, una idea.
5. **Explica el porqué** de cada patrón en lenguaje simple, en términos de cómo la gente lee, decide y confía, no de "se ve limpio".
6. **Construye** en tu stack (o en un solo `index.html`): primero los tokens, después las secciones, con contenido real y espacios marcados para lo que falta.
7. **Revisa su propio trabajo:** captura el resultado, lo compara con los patrones y corrige lo que falla.
8. **Deja un `PATRONES.md`** para que la próxima sesión mantenga el diseño coherente.

## Instalación

```bash
git clone https://github.com/tomasgposse/refsense ~/.claude/skills/refsense
```

También podés copiar la carpeta en `.claude/skills/` de tu proyecto. Claude la usa cuando le pedís diseñar o rediseñar algo.

**Requisitos:** Node 18 o superior y Chrome o Edge, para el script de capturas y medición. Si el navegador está en una ubicación poco común, configurá `CHROME_PATH`.

## Principios

- **Patrones, no píxeles.** Toma la estructura y la lógica de las referencias, nunca sus textos, logos ni imágenes.
- **No inventa.** Las fichas técnicas, testimonios o fotos que faltan quedan como espacios visibles, no como contenido falso.
- **Enseña mientras trabaja.** Cada decisión viene con una razón que podés reutilizar en el próximo proyecto.

## Licencia

MIT
