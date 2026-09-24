#!/usr/bin/env python3
"""Rebuild the groom-first share card with the HD emblem used on /v2 frames."""

from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC_OG = ROOT / "public/og/harshit-deepshikha-12pm.jpg"
HD = ROOT / "public/scenes/logo-hd-groom.png"
OUT = ROOT / "public/og/harshit-deepshikha-idot.jpg"


def inpaint_old_dh(og: np.ndarray) -> np.ndarray:
    r, g, b = og[:, :, 0].astype(int), og[:, :, 1].astype(int), og[:, :, 2].astype(int)
    roi = np.zeros(og.shape[:2], np.uint8)
    # Stop above the name line so tittles (the dot on i) are never eaten.
    roi[8:236, 48:268] = 1
    olive = (
        (g > 90)
        & (g < 175)
        & (r > 70)
        & (r < 175)
        & (b < 140)
        & (np.abs(r - g) < 45)
        & (g > b + 8)
    )
    gold = (
        (r > 140)
        & (r < 230)
        & (g > 110)
        & (g < 200)
        & (b < 150)
        & (r > b + 25)
        & (g > b + 15)
    )
    pink = (
        (r > 170)
        & (g > 110)
        & (g < 200)
        & (b > 110)
        & (b < 190)
        & (r > g + 15)
        & (r > b + 10)
    )
    mask = ((olive | gold | pink) & roi).astype(np.uint8) * 255
    kern = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    mask = cv2.dilate(mask, kern, iterations=2)
    mask = cv2.GaussianBlur(mask, (9, 9), 0)
    _, mask = cv2.threshold(mask, 40, 255, cv2.THRESH_BINARY)
    filled = cv2.inpaint(cv2.cvtColor(og, cv2.COLOR_RGB2BGR), mask, 4, cv2.INPAINT_TELEA)
    return cv2.cvtColor(filled, cv2.COLOR_BGR2RGB)


def restore_name_tittles(out: np.ndarray, orig: np.ndarray) -> np.ndarray:
    r, g, b = orig[:, :, 0].astype(int), orig[:, :, 1].astype(int), orig[:, :, 2].astype(int)
    maroon = (r > 80) & (r < 200) & (g < 110) & (b < 110) & (r > g + 18)
    band = np.zeros(orig.shape[:2], np.uint8)
    band[236:258, 40:700] = 1
    glyph = (maroon.astype(np.uint8) * 255) * band
    kern = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    glyph = cv2.dilate(glyph, kern, iterations=1)
    mixed = out.copy()
    mixed[glyph > 0] = orig[glyph > 0]
    return mixed


def crop_logo(hd: Image.Image) -> Image.Image:
    arr = np.array(hd)
    ys, xs = np.where(arr[:, :, 3] > 8)
    pad = 6
    return hd.crop(
        (
            max(0, int(xs.min()) - pad),
            max(0, int(ys.min()) - pad),
            min(hd.width, int(xs.max()) + 1 + pad),
            min(hd.height, int(ys.max()) + 1 + pad),
        )
    )


def main() -> None:
    orig = np.array(Image.open(SRC_OG).convert("RGB"))
    base = Image.fromarray(inpaint_old_dh(orig)).convert("RGBA")
    hd = crop_logo(Image.open(HD).convert("RGBA"))
    height = 200
    ratio = height / hd.height
    logo = hd.resize((max(1, int(hd.width * ratio)), height), Image.Resampling.LANCZOS)
    base.paste(logo, (72, 14), logo)
    restored = restore_name_tittles(np.array(base.convert("RGB")), orig)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(restored).save(OUT, quality=93, optimize=True)
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
