# TEDxWittyIntlSchoolYouth — Website

Single-page site. Black / white / TEDx red only, Metamorphosis theme
built into the background motif (fragmented shapes near the top,
smoother shapes further down the page), a scroll-driven butterfly
life-cycle icon fixed in the bottom-right corner, a custom cursor,
an OC section with cursor-following photo previews, and a
particle "dust" text effect near the bottom of the page.

## Files

- `index.html` — all page content and structure
- `style.css` — all styling (colors, fonts, layout)
- `script.js` — countdown timer + corner morph animation
- `assets/logo.png` — your TEDx logo (already included)

Open `index.html` directly in a browser to preview it locally, or
paste the relevant parts into your CMS's custom HTML/code block.

---

## Things you still need to edit

### 1. Ticket / registration link
Two places link to your ticket form. In `index.html`, find:

```html
<a href="#" id="ticketLink" class="btn-primary btn-large">Get tickets</a>
```
(in the **Register** section, and also the "Get tickets" button in
the Hero section near the top)

Replace `href="#"` with your real Google Form / ticketing URL, e.g.:
```html
<a href="https://forms.gle/your-form-id" ...>
```

### 2. Venue / map
In `index.html`, find the **Location** section:
```html
<iframe id="mapEmbed" src="" ...></iframe>
```
Once your venue is confirmed:
1. Go to Google Maps, search your venue, click **Share** → **Embed a map**
2. Copy the URL inside `src="..."` from the embed code Google gives you
3. Paste it into the `src=""` above
4. Also update the text `Venue to be announced.` just above it with
   your actual venue name/address.

### 3. Event date/time (countdown)
In `script.js`, near the top:
```js
const EVENT_DATE = new Date("2026-10-10T09:00:00");
```
Already set to October 10, 2026, 9:00 AM. Change the time if your
event starts at a different hour, using 24-hour format
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
In `index.html`, find the **Organizing committee** section. Each
member is a row like:
```html
<div class="oc-item" data-name="Name" data-role="Role" data-img="">
  <span class="oc-name">Name</span>
  <span class="oc-role">Role</span>
</div>
```
Replace the visible `Name` / `Role` text with real details.

To add a real photo that appears when someone hovers the name:
1. Put the photo file in the `assets/` folder (e.g. `assets/aisha.jpg`)
2. Add the path to `data-img`, e.g. `data-img="assets/aisha.jpg"`

If `data-img` is left empty, hovering will show a "Photo coming soon"
placeholder instead — so it's safe to fill these in gradually.

### 6. Speaker lineup
Currently shows "Yet to be revealed" by design. When you're ready to
reveal speakers, replace the contents of the `<section id="speakers">`
block with actual speaker cards — ask for a follow-up build when
you're ready, since the layout will need to change from a suspense
treatment to a speaker grid.

### 7. Theme / about copy
Both are plain paragraphs inside `<section id="theme">` in
`index.html` — edit the text directly, no special formatting needed.

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

## Notes

- The corner butterfly life-cycle icon (bottom-right) is decorative
  only — it will not block clicks on anything beneath it.
- The site respects `prefers-reduced-motion` for accessibility.
- No external dependencies — no build step, no npm install required.
  Just static HTML/CSS/JS.

## Interactive features

### Custom cursor
Replaces the default mouse pointer with a small red dot + a
lagging ring. The ring grows and shows a "View" label when hovering
any link, button, or OC name. Automatically disabled on phones/
tablets (detected via `(hover: none)`), where the normal touch
behavior applies instead.

To change the cursor's color or size, edit `.cursor-dot` and
`.cursor-ring` in `style.css`.

### OC hover photo preview
Hovering an organizing committee member's name shows a small photo
card that follows your cursor (see the "Organizing committee"
section above for how to add real photos).

### Corner scroll butterfly life-cycle
The small icon in the bottom-right corner steps through four
real butterfly life-cycle stages as you scroll the page:
- 0–25% scrolled → Egg
- 25–50% scrolled → Caterpillar
- 50–75% scrolled → Chrysalis
- 75–100% scrolled → Butterfly

This is built from actual SVG shapes (not abstract polygons), and
ties directly into the Metamorphosis theme.

### Particle "Metamorphosis" text
Near the bottom of the page, the word "METAMORPHOSIS" is rendered
as a field of small red dots. Moving your cursor near them scatters
the dots apart; they spring back into the word shape once you move
away — a literal coming-apart/reforming effect tied to the theme.
Works with touch as well (dragging a finger scatters nearby dots).

This is drawn on an HTML `<canvas>` element and needs no external
libraries. If you want to change the displayed word, edit this line
in `script.js`:
```js
offCtx.fillText("METAMORPHOSIS", canvas.width / 2, canvas.height / 2);
```
