# CLAUDE.md: soleilsportswear site

Read this whole file before every session. It is the handoff from the claude.ai chats where this site was built.

---

## 1. What this site is

The brand site for **Cite Soleil** and its clothing line **soleilsportswear**.

- **Main job:** a place where potential sponsors can see all of Soleil's creative work (events, campaigns, media).
- **Second job:** showcase clothes and, later, sell them.
- **Not public yet.** Visitors get in with a code that Stevens hands out. He opens specific pages for sponsor meetings.
- **Live test link:** https://citesoleil.github.io/Soleil-Test/ (GitHub Pages, repo `Soleil-Test`, account `CiteSoleil`).
- **Future:** may move to soleilsportswear.com, and may become a Shopify theme or connect Shopify only for products and checkout. Nothing is decided. Whatever happens, the design, motion, music and interactions must stay exactly as they are now.

---

## 2. How to work with Stevens

**Ask before you push.** Show what you changed and get his OK before committing or pushing to the repo. Never send messages, accept prices or commit to anything on his behalf.

**Garments are his designs.** Do not design clothing. You can place, organize, spec and present his designs.

**Writing style.** Never use em dashes, anywhere: code comments, copy, commit messages. Section content with headings and short blocks, not one long list.

**No mimicked handwriting.** No handwriting fonts, scrawled notes or fake pen marks anywhere on the site.

**Leopard print needs his approval.** Before using leopard anywhere new, get his explicit OK on both where it goes and why. Leopard already in his own designs (backpack, booth lining and floor option) stays as he made it.

**Nothing is final until he says so.** Prices, product details, FAQ answers and policies are placeholders.

**Test before you call it done.** Check phone size and desktop size, light and dark mode. Use `checklist.html` (Section 9).

---

## 3. Brand rules (short version)

**Names**
- CITE SOLEIL ("Soleil"): parent brand and creative studio. No accent, ever.
- soleilsportswear: all clothing and merch.
- Anhedonia: party series name only. Never on products. It is a rave and electronic party, never a skate event.
- Shred Soleil: future skate showcase, on hold.
- The meaning of the name "Soleil" is never explained or hinted at.

**Lines**
- Culture line (site, social): "Soleil is a creative world where fashion, music, skate culture, art, and nightlife meet."
- Business line (sponsors, press): "Soleil makes clothes, throws parties, and documents the culture around them."
- Sponsor-facing pages can use both: business line first.
- Never publish the internal north star or a mission statement.

**Type and wordmarks**
- Neue Helvetica Bold, tight tracking (about -0.03em). Webfont license still needed; the site uses a Helvetica fallback for now.
- Wordmarks are black #0B0B0B or white #F9F9F9 (pink this season). No outlines or effects. Never stretch, rotate or retype a wordmark.
- Clear space around wordmarks: at least the height of the "O".

**Colors**
- Rich black #0B0B0B, leopard white #F9F9F9, spot gray #B7B7B7, graphite #5E5E5E.
- Red #E1251B is the site accent (banners, mock garments). Stevens chose it. It is not yet in the official brand palette.
- Season pink (#FA98B8 or #FFBADC) is still OPEN.

**Art direction**
- Product: clean editorial luxury.
- Events and culture: raw nightlife (flash, grain, real moments).
- AI imagery is never used for product shots. Event content is always real.

**Third-party characters stay off the site.** Do not add artwork that shows recognizable characters owned by others (for example Betty Boop or Woody Woodpecker), even redrawn. Stevens manages his own additions through `my-items.js` (Section 5). Do not edit that file or move its contents into the site.

---

## 4. Files

| File | What it is | Who edits it |
|---|---|---|
| `index.html` | The whole site: HTML, CSS, JS and most images (embedded as data URIs) | Claude |
| `my-items.js` | Extra pieces Stevens adds to the homepage pile | **Stevens only** |
| `site-settings.js` | Which pages are open without the code, and whether the homepage is locked | **Stevens** (Claude can explain it) |
| `music.mp3` | Background music, loops site-wide | Stevens supplies |
| `video.mp4` | Background video for the video page (muted) | Stevens supplies |
| `privacy/`, `terms/`, `refunds/`, `shipping/` | Standalone legal pages (each folder has its own `index.html`), styled by `css/legal.css`. No JavaScript, never locked. | Claude |
| `checklist.html` | Tester checklist (Pass, Fail, Skip, send results) | Claude, when features change |
| `sticker_03.png` etc. | Images referenced by `my-items.js` | Stevens |

**Recommended first job:** split `index.html` into normal files (`css/`, `js/`, `assets/img/`) without changing how anything looks or behaves. The embedded images make the file about 1.2 MB, and the photo and video library coming next cannot work that way. Then run the checklist on the new version and compare it side by side with the current live site.

---

## 5. How the site works

**One page, hash routes.** Every "page" is a section shown or hidden by `route()` on `hashchange`. Routes:
`home`, `mens`, `womens`, `accessories`, `campaigns`, `media`, `about`, `faq`, `more`, `cart`, `booth`, `video`, plus `random` (redirects).
Old `#privacy`, `#terms`, `#refunds` and `#shipping` links redirect to the standalone pages (`LEGAL_PAGES` in `route()`). Link to them as `privacy/`, `terms/`, `refunds/`, `shipping/` (relative paths, so they also work on the github.io test link).
Because it is one document, music keeps playing between pages. Keep that true in any rebuild (page transitions if pages become separate files or a Shopify theme).

**Top banner (menu)** and **bottom banner** ("JOIN SMS FOR EARLY ACCESS TO EXCLUSIVE DROPS & GIVEAWAYS"): red, Helvetica Bold, the top one includes the real wordmark SVG. Both auto-scroll in opposite directions. Hold to stop, drag to scrub, release to resume. A quick tap on a menu word navigates; a drag never does.

**Homepage pile.** Draggable pieces (the `ITEMS` array). One finger drags and flicks. Two fingers rotate and resize. Desktop scroll or trackpad pinch resizes. Tap opens a slide-up panel; red mock garments open their shop page instead. Shuffle rescatters. **Remove** (next to Shuffle) breaks every piece apart in pixel squares (`disintegrate()`); Shuffle brings them all back. Pieces avoid the sign-up box when scattered. When dragged they pass **under** the Join SMS label, phone field and messages, but **over** the consent text and checkbox. Piece size is set by `PILE_DESK` (desktop, currently .38) and `PILE_PHONE` (phone and tablet, currently .75) near the top of `js/site.js`.

**Sign-up box** in the middle of the homepage: +1, numbers only, 10 digits, auto-formatted. Sends to Klaviyo (Section 7). Every SMS form (homepage, pop-up, and the video page, which reuses the homepage form) has a separate, unchecked consent checkbox (`smsOk`, `popOk`) beside this exact consent text, and will not submit until it is checked:
"By checking this box and joining, you agree to receive recurring automated informational (like order updates) and marketing texts from Soleilsportswear (Cite Soleil LLC) at this number, including texts sent by autodialer. Consent is not a condition of purchase. Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to cancel. Terms & Privacy."
"Terms" links to Klaviyo's hosted mobile terms (https://soleilsportswear.myklpages.com/p/mobile-terms-of-service) and "Privacy" to `privacy/`. The text lives in `index.html` (twice); status messages go in the line below it (`#fine`, `#popFine`), so the consent text never changes. After a successful sign-up on the homepage or video page, the whole sign-up box breaks apart in 4px squares (`disintegrate()`, 10 steps, about half a second, skipped with reduced motion) and is gone until the page reloads; the braille fills back in and the red toast says "You're in. Watch for a text" ("You're in. Enjoy the video" on the video page). In the pop-up, the form and consent break apart and "You're in" shows in the pop-up; it resets when closed (`resetPop`). Small Privacy and Terms links also sit in the homepage footer and under the lock screen.

**Braille art** repeats down the left side of the homepage behind the pile.

**Pixel clouds** drift behind everything on every page except the 3D booth and the video page (18 clouds, 6 shapes, full screen height, with extra clouds through the middle). Pages sit above them (`.page` has z-index 1). Their motion is driven by JavaScript, not CSS. On the homepage only, they are interactive from empty space (anything starting on a sticker, the sign-up box, a button or a banner goes to that instead): **tap** pops a cloud in pixel squares and a new one drifts in from the left 2.5 to 6 seconds later; **drag** moves it and a flick sends it gliding; while dragging, a **second finger pinches** to resize (0.4x to 3x), and on desktop **scroll or trackpad pinch** over a cloud resizes it; clouds **slide away** from a nearby mouse or finger and settle back. On every other page the clouds just drift.

**Music bar** above the bottom banner: play and pause icons (drawn SVG, not text symbols), scrolling waveform. Music starts on the first tap anywhere, loops, and remembers mute. A round speaker button covers other pages.

**Lock.** Every page except the homepage shows a lock screen. The legal pages are separate files outside the app, so the lock and `site-settings.js` never touch them. Code: **SOLEIL** (case-insensitive, stored only as a SHA-256 hash). The SMS pop-up appears on each locked page visit. Unlocking is remembered on that device (`localStorage: ssw-access`). `site-settings.js` can open chosen pages and lock the homepage. This is a soft lock for a static site, not real security.

**Random.** Every 1st or 2nd tap lands on a surprise, alternating between the **video page** (same pile over `video.mp4`; the sign-up hides after a valid number) and the **3D booth** (three.js r128, loaded only when opened; views, tower tops, heights, colors, floor). Other taps land on regular pages.

**Shop pages** (Mens, Womens, Accessories): item rail, corner frame, pixel build-in, console sounds, sold-out size, add to cart. Placeholder prices and copy. CSH003 hoodie is in Mens and Womens (all hoodies sell as both). The backpack is one item in Accessories with two angles (side and front): arrows on its picture switch views, and a label shows which one (`views` on the shop item; `showViews` and `stepView` in `js/site.js`). Tapping either backpack piece on the homepage opens it on that angle. The pink hoodie back is not on shop pages (not a product photo).

**Cart.** Quantities, remove, subtotal, demo checkout. Saved in `localStorage: ssw-cart`.

**Policy pages** (Privacy, Terms, Refunds, Shipping): standalone static pages at `/privacy/`, `/terms/`, `/refunds/`, `/shipping/`. They load fully with JavaScript off (required for SMS carrier review). Leaving the app for them stops the music; that is expected. Business details: Cite Soleil LLC, admin@soleilsportswear.com, 450 Summer St, Brockton, MA 02302, Massachusetts law, effective November 1, 2026.
- **Privacy** follows Klaviyo's SMS privacy guidance (help.klaviyo.com article 4404199571867): SMS program description (how numbers are collected, used, shared), Klaviyo's example third-party sharing clarification, Klaviyo named as SMS and marketing provider, and the `__kla_id` onsite tracking cookie.
- **Terms** has the SMS program section (`#sms`): program name Soleilsportswear (matches Klaviyo's mobile terms), informational and marketing texts including by autodialer, drops, early access and giveaways, frequency varies, rates may apply, HELP and STOP, carriers not liable, consent not a condition of purchase, link to Privacy.
- **Refunds**: all sales final, no refunds; size exchanges for items in the same condition, unworn, all tags attached. **Shipping**: worldwide, ships in 2 to 4 business days, rates calculated at checkout, customer pays duties. **Terms**: pre-orders charged at checkout. No fill-in boxes remain.
- The pages are generated from one Python script during a Claude session (not in the repo); to change them, edit the four `index.html` files directly and keep them consistent.
- A lawyer should review all four before launch.

**Other:** dark mode supported everywhere; reduced motion respected; safe-area insets for phones; Instagram links to instagram.com/soleilsportswear.

---

## 6. What Stevens wants next

1. **Portfolio for sponsors.** Large photography and video library across Media, Campaigns and events. Photos stored as separate, web-sized files and lazy-loaded. Videos hosted on a streaming service (Vimeo, Mux or Cloudflare Stream) and embedded, not stored in the repo.
2. **Per-page access for sponsor meetings** (already possible with `site-settings.js`; may grow into separate codes per audience).
3. **Asset pages.** Tapping a pile piece should eventually open its own page: a product page to buy it, or an info page for a mark or sticker.
4. **Shop** once real product photos exist.
5. **Domain and Shopify decision** later. If it becomes a Shopify theme, everything above must look, move and sound the same; music needs page transitions so it does not restart.

---

## 7. Open items

- **SMS: Klaviyo.** The SMS program name is **Soleilsportswear** everywhere, to match Klaviyo's mobile terms. Do not use "Soleil Early Access" as a program name. The homepage, pop-up and video page forms post to Klaviyo's Client Subscriptions API (`smsSubscribe` and `wireSms` in `js/site.js`, source tagged Homepage or Pop-up; subscribes to both SMS marketing and transactional consent). Public key `KLAVIYO_PUBLIC_KEY` = Ymzppw and SMS list `KLAVIYO_SMS_LIST` = X6BhSq are set near the Video page code in `js/site.js` (if either is emptied, a submit says "Sign-up opens soon. Nothing was sent."). The same public key also loads Klaviyo's onsite script (the `__kla_id` cookie described on the Privacy page). If the consent wording changes, update both consent labels in `index.html`, the Terms SMS section and the Privacy SMS section together.
- **Abandoned cart disclosure.** When Shopify cart reminders (abandoned cart texts) start, add Klaviyo's abandoned cart disclosure to `privacy/index.html` (cookies track cart items, including when a cart is abandoned, to decide when to send reminder texts). Same for location tracking if it is ever used. Both were left out on purpose because neither is used yet.
- International SMS is not decided (diaspora outreach matters). For now +1 covers the US and Canada.
- Season pink, prices, FAQ answers, policy details, launch date: all OPEN.
- Neue Helvetica webfont license.
- Possible lookalike concerns Stevens is reviewing with his lawyer: rabbit sticker vs FR2, backpack frame vs MLB logo, I love CS vs I love NY.

---

## 8. Things not to do

- Do not edit `my-items.js` or `site-settings.js` unless Stevens asks.
- Do not add recognizable third-party characters or reproduce other brands' logos.
- Do not use em dashes or handwriting fonts.
- Do not use leopard anywhere new without his approval.
- Do not change the look, motion or sound of existing features while restructuring.
- Do not push without his OK.

---

## 9. Testing

`checklist.html` lives next to the site at `/checklist.html`. Testers mark Pass, Fail or Skip and send results. It does not yet cover the lock, the SMS pop-up, Random surprises, the video page, music or the booth; add those sections.
