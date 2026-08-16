# Wedding Invitation Template System — reference scaffold

Drop the `templates/` folder into your Next.js app (e.g. at the project root, or inside `src/`).

## What's here

- `templates/types.ts` — the `InvitationData` shape every template renders from. This is your one contract between your dashboard/form and the templates.
- `templates/theme.ts` — palette + font tokens per template. Adding a new color scheme is adding an entry here, not writing new CSS.
- `templates/shared/features/` — the reusable pieces: `CountdownTimer`, `ScratchReveal`, `DoorReveal3D`, `CurtainReveal`, `CinematicHero`, `RSVPForm`, `MusicPlayer`, `EventDetails` (map/venue), `PhotoSlideshow`.
- `templates/classic/emerald-noir/` — one full Classic template built from the primitives above.
- `templates/royal/cinematic-royal/` — one full Royal template (video hero + curtain reveal).
- `templates/manifest.ts` — registry mapping a `templateId` string to a lazy-loaded component.
- `templates/InvitationRenderer.tsx` — the component your public invitation page actually renders.

## Wiring it up

1. Install dependencies you don't already have: `next` (you have it), and optionally `framer-motion` if you want to replace the CSS transitions in `CurtainReveal`/`DoorReveal3D` with spring physics later.
2. In your invitation page (e.g. `app/invite/[slug]/page.tsx`):

```tsx
import { InvitationRenderer } from '@/templates/InvitationRenderer';
import { getInvitationBySlug } from '@/lib/db'; // your own fetch

export default async function InvitePage({ params }: { params: { slug: string } }) {
  const data = await getInvitationBySlug(params.slug); // returns InvitationData
  return <InvitationRenderer data={data} />;
}
```

3. In your template picker (dashboard, plan selection), import `templateManifest` / `getTemplatesByTier('classic' | 'royal')` from `templates/manifest.ts` to render the "choose your template" grid, using `thumbnail` + `name` + `features`.

## Adding your remaining 14 templates

You don't need new component logic for most of them — you need a new **theme** and a new **arrangement**:

1. Add a `ThemeConfig` in `theme.ts` (palette + fonts).
2. Copy `classic/emerald-noir/index.tsx` (or `royal/cinematic-royal/index.tsx`) into a new folder, swap the theme import, reorder/remove sections as the design calls for.
3. Register it in `manifest.ts`.

Reserve genuinely new *primitives* (a new reveal animation, a new hero style) for when a template actually needs new interaction — not for every palette variant.

## Notes / things left for you to plug in

- `RSVPForm`'s `onSubmit` is a no-op by default — wire it to a `POST /api/invitations/[id]/rsvp` route so responses land in your dashboard's guest inbox.
- `MapEmbed`'s `EventDetails` just links out to a Maps URL — swap the `<a>` for an actual `<iframe>` Google Maps embed if you want it inline.
- Video hero assets: source from a licensed stock library (Pexels/Envato/Artgrid) and serve via a CDN (Cloudflare Stream/Mux/Bunny) rather than through Vercel's serverless functions — raw video there gets slow and expensive fast.
- All colors/fonts are consumed as CSS custom properties (`var(--accent)`, etc.) set by `themeToCssVars()` — if you migrate to Tailwind, you can map these same tokens into your `tailwind.config` theme extension instead of inline styles.
