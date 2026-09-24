#!/usr/bin/env python3
"""Compose a looping tanpura + shehnai bed for the engagement invite.

Original instrumental — no third-party samples. Sa is D, raga Bilawal
(a bright, festive that) with a slow shehnai alap over a four-string drone.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np

SR = 44100
SA = 293.66  # D4
PA = SA * 1.5
SA_LOW = SA / 2
SA_HIGH = SA * 2
CYCLE = 2.4
MELODY_BEAT = 0.62
FADE = 2.8


def midi_hz(n: float) -> float:
    return 440.0 * (2 ** ((n - 69) / 12))


# Bilawal (major) around D: S R G m P D N S'
SCALE = {
    "S,": SA_LOW,
    "P,": PA / 2,
    "S": SA,
    "R": SA * 9 / 8,
    "G": SA * 5 / 4,
    "m": SA * 4 / 3,
    "P": PA,
    "D": SA * 5 / 3,
    "N": SA * 15 / 8,
    "S'": SA_HIGH,
    "R'": SA_HIGH * 9 / 8,
    "G'": SA_HIGH * 5 / 4,
}


def tanh_soft(x: np.ndarray, drive: float = 1.0) -> np.ndarray:
    return np.tanh(drive * x)


def biquad_lowpass(x: np.ndarray, cutoff: float, q: float = 0.72) -> np.ndarray:
    w0 = 2 * np.pi * cutoff / SR
    alpha = np.sin(w0) / (2 * q)
    cosw = np.cos(w0)
    b0 = (1 - cosw) / 2
    b1 = 1 - cosw
    b2 = (1 - cosw) / 2
    a0 = 1 + alpha
    a1 = -2 * cosw
    a2 = 1 - alpha
    b0, b1, b2, a1, a2 = b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0
    y = np.zeros_like(x)
    x1 = x2 = y1 = y2 = 0.0
    for i, s in enumerate(x):
        out = b0 * s + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
        y[i] = out
        x2, x1 = x1, s
        y2, y1 = y1, out
    return y


def biquad_highpass(x: np.ndarray, cutoff: float, q: float = 0.7) -> np.ndarray:
    w0 = 2 * np.pi * cutoff / SR
    alpha = np.sin(w0) / (2 * q)
    cosw = np.cos(w0)
    b0 = (1 + cosw) / 2
    b1 = -(1 + cosw)
    b2 = (1 + cosw) / 2
    a0 = 1 + alpha
    a1 = -2 * cosw
    a2 = 1 - alpha
    b0, b1, b2, a1, a2 = b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0
    y = np.zeros_like(x)
    x1 = x2 = y1 = y2 = 0.0
    for i, s in enumerate(x):
        out = b0 * s + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
        y[i] = out
        x2, x1 = x1, s
        y2, y1 = y1, out
    return y


def pluck_env(n: int, attack: float = 0.012, decay: float = 2.15) -> np.ndarray:
    t = np.arange(n) / SR
    a_n = max(1, int(attack * SR))
    att = np.linspace(0, 1, a_n) ** 1.35
    body = np.exp(-t * (1 / decay))
    body[:a_n] *= att
    return body


def tanpura_string(freq: float, n: int, phase: float, rng: np.random.Generator) -> np.ndarray:
    t = np.arange(n) / SR
    sig = np.zeros(n)
    # Jivari-like buzz: many harmonics, slight inharmonicity, slow beating.
    for k in range(1, 16):
        amp = 0.62 / (k**0.78)
        if k % 2 == 0:
            amp *= 0.72
        fk = freq * k * (1 + 0.00035 * k)
        detune = 1 + 0.0011 * np.sin(2 * np.pi * (0.12 + 0.015 * k) * t + phase)
        sig += amp * np.sin(2 * np.pi * fk * t * detune + phase * k)
    noise = rng.standard_normal(n) * 0.008
    env = pluck_env(n)
    tone = (sig + noise) * env
    return tone


def tanpura_bed(seconds: float, rng: np.random.Generator) -> tuple[np.ndarray, np.ndarray]:
    n = int(seconds * SR)
    left = np.zeros(n)
    right = np.zeros(n)
    strings = [
        (PA / 2, 0.00, 0.90, 0.55),  # Pa
        (SA, 0.62, 1.00, 0.72),  # Sa
        (SA, 1.18, 0.82, 1.00),  # Sa
        (SA_HIGH, 1.78, 0.70, 0.95),  # Sa'
    ]
    t0 = 0.0
    while t0 < seconds + CYCLE:
        for freq, offset, lpan, rpan in strings:
            start = int((t0 + offset) * SR)
            if start >= n:
                continue
            length = min(int(4.6 * SR), n - start)
            if length < SR // 4:
                continue
            wave = tanpura_string(freq, length, phase=t0 * 0.7 + freq, rng=rng)
            left[start : start + length] += wave * lpan
            right[start : start + length] += wave * rpan
        t0 += CYCLE
    return left, right


def shehnai_tone(freq: np.ndarray, t: np.ndarray) -> np.ndarray:
    vibrato = 1 + 0.011 * np.sin(2 * np.pi * 5.05 * t) * (1 - np.exp(-t * 2.4))
    phase = 2 * np.pi * np.cumsum(freq * vibrato) / SR
    reed = np.sin(phase)
    reed = tanh_soft(reed * 1.55, 1.0)
    reed += 0.28 * np.sin(2 * phase) + 0.16 * np.sin(3 * phase)
    reed += 0.07 * np.sin(5 * phase) + 0.03 * np.sin(7 * phase)
    return reed


def render_note(
    name: str,
    duration: float,
    rng: np.random.Generator,
    slur_from: float | None = None,
) -> tuple[np.ndarray, np.ndarray]:
    n = int(duration * SR)
    t = np.arange(n) / SR
    if name == "-":
        z = np.zeros(n)
        return z, z
    target = SCALE[name]
    start = slur_from if slur_from is not None else target
    glide = np.linspace(start, target, n)
    # Quick meend into the note, then sit.
    k = min(n, int(0.14 * SR))
    freq = np.full(n, target)
    freq[:k] = glide[:k]
    body = shehnai_tone(freq, t)
    attack = min(0.09, duration * 0.22)
    release = min(0.28, duration * 0.35)
    env = np.ones(n)
    a_n = max(1, int(attack * SR))
    r_n = max(1, int(release * SR))
    env[:a_n] = np.linspace(0, 1, a_n) ** 1.25
    env[-r_n:] *= np.linspace(1, 0, r_n) ** 1.45
    # Soft swell in the middle of longer notes.
    if duration > 1.1:
        env *= 0.88 + 0.12 * np.sin(np.pi * t / duration)
    breath = rng.standard_normal(n)
    breath = biquad_highpass(breath, 1800) * 0.045
    tone = (body + breath) * env
    # Slight stereo air.
    delay = int(0.012 * SR)
    left = tone.copy()
    right = np.zeros_like(tone)
    right[delay:] = tone[:-delay] * 0.92
    right[:delay] = tone[:delay] * 0.4
    return left, right


# Slow mangal alap, then a short festive mukhda. Times in beats.
PHRASE: list[tuple[str, float]] = [
    ("N", 2.0),
    ("R", 1.6),
    ("G", 2.4),
    ("R", 1.2),
    ("S", 3.2),
    ("-", 0.6),
    ("G", 1.1),
    ("m", 1.4),
    ("P", 2.2),
    ("m", 1.0),
    ("G", 1.6),
    ("R", 1.2),
    ("S", 2.6),
    ("-", 0.5),
    ("P", 1.3),
    ("D", 1.6),
    ("N", 1.4),
    ("S'", 2.8),
    ("N", 1.1),
    ("D", 1.3),
    ("P", 2.0),
    ("-", 0.4),
    ("m", 1.0),
    ("P", 1.2),
    ("G", 1.4),
    ("m", 1.1),
    ("P", 2.0),
    ("D", 1.2),
    ("P", 1.0),
    ("m", 1.2),
    ("G", 1.6),
    ("R", 1.4),
    ("S", 3.6),
    ("-", 1.2),
]


def shehnai_line(rng: np.random.Generator) -> tuple[np.ndarray, np.ndarray]:
    left_parts: list[np.ndarray] = []
    right_parts: list[np.ndarray] = []
    prev: float | None = None
    for name, beats in PHRASE:
        dur = beats * MELODY_BEAT
        slur = None if name == "-" or prev is None else prev
        l, r = render_note(name, dur, rng, slur_from=slur)
        left_parts.append(l)
        right_parts.append(r)
        prev = None if name == "-" else SCALE[name]
    return np.concatenate(left_parts), np.concatenate(right_parts)


def conv_reverb(x: np.ndarray, decay: float, mix: float, seed: int) -> np.ndarray:
    ir_n = int(SR * 2.1)
    rng = np.random.default_rng(seed)
    t = np.arange(ir_n) / SR
    ir = rng.standard_normal(ir_n) * np.exp(-t * decay)
    ir[: int(0.008 * SR)] *= np.linspace(0, 1, int(0.008 * SR))
    n = len(x)
    pad = ir_n
    X = np.fft.rfft(np.pad(x, (0, pad)))
    H = np.fft.rfft(np.pad(ir, (0, n)))
    wet = np.fft.irfft(X * H, n + pad)[:n]
    peak = np.max(np.abs(wet)) + 1e-9
    wet /= peak
    return (1 - mix) * x + mix * wet


def loop_crossfade(x: np.ndarray, seconds: float = FADE) -> np.ndarray:
    fade_n = int(seconds * SR)
    fade = np.linspace(0, 1, fade_n)
    out = x.copy()
    out[-fade_n:] = out[-fade_n:] * (1 - fade) + out[:fade_n] * fade
    return out[:-fade_n]


def normalize(left: np.ndarray, right: np.ndarray, peak: float = 0.86) -> tuple[np.ndarray, np.ndarray]:
    m = max(np.max(np.abs(left)), np.max(np.abs(right)), 1e-9)
    gain = peak / m
    return left * gain, right * gain


def main() -> None:
    rng = np.random.default_rng(20261025)
    melody_l, melody_r = shehnai_line(rng)
    melody_seconds = len(melody_l) / SR
    # Two passes of the alap so the bed outlasts the 49s card, then loop.
    repeats = 2
    total = melody_seconds * repeats + FADE + 0.4
    tan_l, tan_r = tanpura_bed(total, rng)

    m_n = len(melody_l)
    she_l = np.zeros(int(total * SR))
    she_r = np.zeros(int(total * SR))
    # Enter after a breath of drone.
    offset = int(1.6 * SR)
    for i in range(repeats):
        start = offset + i * m_n
        end = start + m_n
        if end > len(she_l):
            break
        she_l[start:end] += melody_l
        she_r[start:end] += melody_r

    left = tan_l * 0.33 + she_l * 0.22
    right = tan_r * 0.33 + she_r * 0.22
    n = min(len(left), len(right))
    left, right = left[:n], right[:n]

    left = conv_reverb(left, decay=2.35, mix=0.32, seed=11)
    right = conv_reverb(right, decay=2.2, mix=0.34, seed=29)
    left = biquad_lowpass(left, 6200)
    right = biquad_lowpass(right, 6400)
    left = biquad_highpass(left, 55)
    right = biquad_highpass(right, 55)

    left, right = normalize(left, right)
    stereo = np.stack([loop_crossfade(left), loop_crossfade(right)], axis=1)
    peak = np.max(np.abs(stereo))
    stereo = stereo / peak * 0.84

    out_dir = Path(__file__).resolve().parents[1] / "public" / "audio"
    out_dir.mkdir(parents=True, exist_ok=True)
    wav_path = out_dir / "garden-evening.wav"
    pcm = np.clip(stereo, -1, 1)
    pcm_i16 = (pcm * 32767).astype(np.int16)
    import wave

    with wave.open(str(wav_path), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(pcm_i16.tobytes())
    print(f"wrote {wav_path} ({len(pcm) / SR:.1f}s)")


if __name__ == "__main__":
    main()
