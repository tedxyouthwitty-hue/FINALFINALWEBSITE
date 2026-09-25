# TEDxWittyIntlSchoolYouth — Website

Single-page site. Black / white / TEDx red only, Metamorphosis theme
built into the background motif, a scroll-driven butterfly life-cycle
icon fixed in the bottom-right corner, a custom cursor, a grouped OC
section with cursor-following photo previews, and a particle "dust"
text effect near the bottom of the page.

## Files

- `index.html` — main page content and structure
- `reveal.html` — the "Yet to be revealed" ticket page (opens when
  someone clicks "Get tickets")
- `style.css` — all styling (colors, fonts, layout)
- `script.js` — countdown timer, butterfly scroll animation, custom
  cursor, OC hover preview, particle text
- `assets/logo.png` — your TEDx logo

Open `index.html` directly in a browser to preview it locally, or
paste the relevant parts into your CMS's custom HTML/code block.

---

## What changed in this version

- **Fixed hero centering** — "METAMORPHOSIS" and everything else in
  the hero now sits inside a column with explicit `text-align: center`
  and `margin: 0 auto`, so it stays centered regardless of content
  width. If you'd made your own centering attempt on GitHub already,
  this replaces it — no need to keep both.
- **Removed the "Scroll" hint text and the faint gray line** that
  used to sit under the "Get tickets" button on the hero.
- **"Get tickets" now opens a new page** (`reveal.html`) in a new
  browser tab, showing "Yet to be revealed" in red text on a black
  background, instead of just scrolling down the same page.
- **Organizing Committee restructured** into 9 named sections:
  **Executive Producers** and **Event Managers** are shown first, each
  as their own full-width row. Below them, 7 more sections
  (**Marketing, Finance, Technology, Art, Logistics, Design,
  Curation**) are laid out in a grid. **Technology** and **Art** each
  have 1 placeholder slot; every other section has 2.

---

## Things you still need to edit

### 1. Ticket / registration link
Right now, both "Get tickets" buttons open `reveal.html` (the "Yet to
be revealed" placeholder page). Once you have a real ticket form or
registration link, find these two lines in `index.html`:

```html
<a href="reveal.html" target="_blank" rel="noopener" class="btn-primary">Get tickets</a>
```
and
```html
<a href="reveal.html" target="_blank" rel="noopener" id="ticketLink" class="btn-primary btn-large">Get tickets</a>
```

Replace `href="reveal.html"` with your real form URL, e.g.:
```html
<a href="https://forms.gle/your-form-id" target="_blank" rel="noopener" ...>
```
(You can also just delete `target="_blank" rel="noopener"` if you'd
rather it open in the same tab once it's a real link.)

### 2. Venue / map
In `index.html`, find the **Location** section:
```html
<iframe id="mapEmbed" src="" ...></iframe>
```
Once your venue is confirmed:
1. Go to Google Maps, search your venue, click **Share** → **Embed a map**
2. Copy the URL inside `src="..."` from the embed code Google gives you
3. Paste it into the `src=""` above
4. Update the text `Venue to be announced.` just above it with your
   actual venue name/address.

### 3. Event date/time (countdown)
In `script.js`, near the top:
```js
const EVENT_DATE = new Date("2026-10-10T09:00:00");
```
Change the date/time if needed, using 24-hour format
(`"2026-10-10T14:30:00"` = 2:30 PM).

### 4. Sponsor logos
In `index.html`, find the **Sponsors** section and the footer. Each
placeholder looks like:
```html
<div class="sponsor-slot">Title sponsor</div>
```
Replace with:
```html
<div class="sponsor-slot"><img src="assets/sponsor-name.png" alt="Sponsor name"></div>
```
Drop your logo image files into the `assets/` folder first, then
reference them by filename. Do the same for the smaller footer row
(`sponsor-slot small`).

### 5. Organizing committee (OC)
In `index.html`, find the **Organizing committee** section
(`<section id="oc">`). It's split into 9 named groups. Each member is
a row like:
```html
<div class="oc-item" data-name="Name" data-role="Marketing" data-img="">
  <span class="oc-name">Name</span>
  <span class="oc-role">Marketing</span>
</div>
```
Replace the visible `Name` text (in both the `data-name` attribute and
the `<span class="oc-name">`) with the real name.

To add a real photo that appears when someone hovers the name:
1. Put the photo file in the `assets/` folder (e.g. `assets/aisha.jpg`)
2. Add the path to `data-img`, e.g. `data-img="assets/aisha.jpg"`

If `data-img` is left empty, hovering shows a "Photo coming soon"
placeholder instead — safe to fill these in gradually, one at a time.

To add more people to a section beyond its current placeholder count,
copy an existing `.oc-item` block within that group and paste it
again with new details.

### 6. Speaker lineup
Currently shows "Yet to be revealed" by design. When you're ready to
reveal speakers, replace the contents of `<section id="speakers">`
with actual speaker cards — ask for a follow-up build when you're
ready, since the layout will need to change from a suspense treatment
to a speaker grid.

### 7. Theme / about copy
Both are plain paragraphs inside `<section id="theme">` in
`index.html` — edit the text directly, no special formatting needed.

### 8. "Yet to be revealed" reveal page
`reveal.html` is a separate, standalone file with its own black
background and red text. If you want to change its wording later,
just edit the `<h1>` and `<p>` text inside that file directly.

---

## Colors

All colors are defined once at the top of `style.css`:

```css
:root {
  --black: #0a0a0a;
  --red: #e62b1e;
  --white: #ffffff;
  ...
}
```

Change a value here and it updates everywhere that variable is used.

## Interactive features

### Custom cursor
Replaces the default mouse pointer with a small red dot + a lagging
ring. The ring grows and shows a "View" label when hovering any link,
button, or OC name. Automatically disabled on phones/tablets, where
normal touch behavior applies instead.

### OC hover photo preview
Hovering an organizing committee member's name shows a small photo
card that follows your cursor (see "Organizing committee" above for
how to add real photos).

### Corner scroll butterfly life-cycle
The icon in the bottom-right corner steps through four real butterfly
life-cycle stages as you scroll the page:
- 0–25% scrolled → Egg
- 25–50% scrolled → Caterpillar
- 50–75% scrolled → Chrysalis
- 75–100% scrolled → Butterfly

### Particle "Metamorphosis" text
Near the bottom of the page, "METAMORPHOSIS" is rendered as a field
of small red dots. Moving your cursor near them scatters the dots;
they spring back into the word shape once you move away. Works with
touch too.

## Notes

- The corner butterfly icon is decorative only — it will not block
  clicks on anything beneath it.
- The site respects `prefers-reduced-motion` for accessibility.
- No external dependencies — no build step, no npm install required.
  Just static HTML/CSS/JS.
