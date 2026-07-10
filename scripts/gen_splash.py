#!/usr/bin/env python3
"""Generira iOS PWA splash screenove i OG sliku za e-Demokracija novčanik.

Otisak prsta (public/brand/fingerprint.svg — orange, brand potpis) centriran na
navy #173863. SVG → PNG preko rsvg-convert (homebrew), kompozicija PIL-om.
Pokreni iz korijena repoa:  python3 scripts/gen_splash.py

Izlaz: public/icons/splash/splash-<WxH>.png (12 iOS dimenzija; media-query
linkovi u index.html) + public/og-image.png (1200x630 za OpenGraph/Twitter).
"""
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FINGERPRINT_SVG = ROOT / 'public' / 'brand' / 'fingerprint.svg'
OUT = ROOT / 'public' / 'icons' / 'splash'
NAVY = (0x17, 0x38, 0x63)  # brand primarna (tailwind token `navy`)

# (width, height) — portrait; pokriva iPhone SE→16 Pro Max (vidi index.html media queries)
SIZES = [
    (640, 1136), (750, 1334), (828, 1792),
    (1125, 2436), (1170, 2532), (1179, 2556),
    (1206, 2622), (1242, 2208), (1242, 2688),
    (1284, 2778), (1290, 2796), (1320, 2868),
]


def render_svg(width: int) -> Image.Image:
    """SVG → RGBA PNG zadane širine (rsvg-convert)."""
    with tempfile.NamedTemporaryFile(suffix='.png') as tmp:
        subprocess.run(
            ['rsvg-convert', '-w', str(width), str(FINGERPRINT_SVG), '-o', tmp.name],
            check=True,
        )
        return Image.open(tmp.name).convert('RGBA')


def paste_center(canvas: Image.Image, emblem: Image.Image, cx: int, cy: int) -> None:
    canvas.paste(emblem, (cx - emblem.width // 2, cy - emblem.height // 2), emblem)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    for w, h in SIZES:
        img = Image.new('RGB', (w, h), NAVY)
        # otisak ~34% širine ekrana, optički centar malo iznad polovice
        paste_center(img, render_svg(round(w * 0.34)), w // 2, round(h * 0.46))
        path = OUT / f'splash-{w}x{h}.png'
        img.save(path, optimize=True)
        print(f'  {path.relative_to(ROOT)}')

    # OG slika 1200x630 — otisak centriran; naslov nosi og:title, ne slika
    og = Image.new('RGB', (1200, 630), NAVY)
    paste_center(og, render_svg(340), 600, 315)
    og_path = ROOT / 'public' / 'og-image.png'
    og.save(og_path, optimize=True)
    print(f'  {og_path.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
