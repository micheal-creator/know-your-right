// Generate PNG app icons for the PWA / APK from a source image.
//
// Usage:
//   node scripts/gen-icons.mjs                 # uses the built-in scales SVGs
//   node scripts/gen-icons.mjs path/to/icon.png  # uses your own square icon
//
// Outputs into public/icons/:
//   icon-192.png, icon-512.png           (purpose: any)
//   icon-maskable-512.png                (purpose: maskable, full-bleed + safe zone)
//   apple-touch-icon.png                 (180, for iOS)

import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = path.join(root, 'public')
const outDir = path.join(pub, 'icons')
mkdirSync(outDir, { recursive: true })

const GREEN = '#0F5132'
const PAPER = '#FBFBF9'
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }

const custom = process.argv[2] ? path.resolve(process.argv[2]) : null
const anySource = custom || path.join(pub, 'icon.svg')
const maskableSource = custom || path.join(pub, 'icon-maskable.svg')

// High density so SVG sources rasterize crisply.
const readOpts = { density: 512 }

async function contain(src, size, bg = TRANSPARENT) {
  return sharp(readFileSync(src), readOpts)
    .resize(size, size, { fit: 'contain', background: bg })
    .png()
    .toBuffer()
}

async function gen() {
  const meta = await sharp(readFileSync(anySource)).metadata()
  console.log(`Source: ${anySource} (${meta.width}x${meta.height}, ${meta.format})`)
  if (custom && Math.min(meta.width || 0, meta.height || 0) < 512) {
    console.warn('WARNING: source is smaller than 512px — the icon may look soft when scaled up.')
  }
  if (custom && meta.width !== meta.height) {
    console.warn(`NOTE: source is not square (${meta.width}x${meta.height}); it will be letterboxed to a square.`)
  }

  // "any" icons
  for (const size of [192, 512]) {
    const buf = await contain(anySource, size)
    await sharp(buf).toFile(path.join(outDir, `icon-${size}.png`))
  }

  // maskable 512: full-bleed green background, artwork within ~78% safe zone
  const canvas = 512
  if (custom) {
    const inner = Math.round(canvas * 0.78)
    const art = await contain(custom, inner)
    await sharp({ create: { width: canvas, height: canvas, channels: 4, background: GREEN } })
      .composite([{ input: art, gravity: 'center' }])
      .png()
      .toFile(path.join(outDir, 'icon-maskable-512.png'))
  } else {
    // built-in maskable SVG is already full-bleed green with safe-zone artwork
    await sharp(readFileSync(maskableSource), readOpts)
      .resize(canvas, canvas, { fit: 'cover' })
      .png()
      .toFile(path.join(outDir, 'icon-maskable-512.png'))
  }

  // apple-touch-icon: 180 on paper background (iOS ignores transparency nicely)
  const appleInner = await contain(anySource, 150)
  await sharp({ create: { width: 180, height: 180, channels: 4, background: PAPER } })
    .composite([{ input: appleInner, gravity: 'center' }])
    .png()
    .toFile(path.join(outDir, 'apple-touch-icon.png'))

  console.log('Icons written to public/icons/ from:', custom || 'built-in scales SVGs')
}

gen().catch((e) => {
  console.error(e)
  process.exit(1)
})
