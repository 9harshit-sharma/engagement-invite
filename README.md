# Deepshikha & Harshit — Engagement Invite

A digital engagement invitation in the spirit of a Rajasthani palace-garden card: marble arches, bougainvillea, peacocks, and a short animated sequence.

The card opens from a wax seal, then reveals a Ganesha blessing, the couple’s names, ceremony details, and a closing garden scene. Lines appear one after another. A shehnai and tanpura bed starts when the seal is opened; the gold speaker at the top-left mutes or unmutes it. Use the dots at the bottom of the card to step between scenes, or replay from the start.

Default details are Deepshikha and Harshit’s Sagayi, Godh Bharayi and Ring Ceremony on 25 October 2026 at The Stellar Gymkhana, Greater Noida. The pencil button still lets you change a line.

## Run locally

```bash
npm install
npm run dev -- --port 43217
```

Open [http://localhost:43217](http://localhost:43217) for Deepshikha first, or [http://localhost:43217/v2](http://localhost:43217/v2) for Harshit first.

## Two share links

After publishing, send these URLs (the query string is required so WhatsApp fetches a fresh card instead of an old cached preview):

- Bride first: `/` or `/?v=12pm` — thumbnail says Deepshikha & Harshit, then `25 October 2026 · 12 PM onwards` with the venue on the next line
- Groom first: `/v2` or `/v2?v=idot` — thumbnail says Harshit & Deepshikha with the HD emblem and a dotted i, same date, time, and venue layout

A new WhatsApp chat still uses WhatsApp’s saved preview for that exact link. If the card looks old, send the `?v=12pm` (bride) or `?v=idot` (groom) URL, or paste the link in [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and click **Scrape Again**.

Host editing (not shown to guests) is `?edit=host` on either URL.

## Customize

Use **Edit** on the card, or change the defaults in `src/lib/invite.ts`. Illustrated scenes live in `public/scenes/`. The D & H monogram is `public/scenes/logo-dh.png`. Background music is `public/audio/garden-evening.mp3` (original loop; regenerate with `python3 scripts/compose-invite-music.py` then encode to mp3).
