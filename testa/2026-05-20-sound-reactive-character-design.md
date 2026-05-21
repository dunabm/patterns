# Sound-Reactive Character Animation — Design Doc

## Stack
- Vanilla HTML + CSS + JavaScript (single page, no frameworks)
- Web Audio API for microphone input
- SVG inline for the character illustration

## Structure
```
testa/
  index.html
  style.css
  script.js
  testa reactiva sonido.ai       (original Illustrator)
  testa reactiva silencio.svg    (SVG export, contains both states)
  testa reactiva sonido.svg      (SVG export, contains both states)
```

## States
The SVG contains two complete character states:
- **Silencio** (`cabeza_silencio`, `boca_silencio`, `ojo_silencio`, `brazo_izq_silencio`, `brazo_der_silencio`) — shown at 0% sound
- **Sonido** (`cabeza_sonido`, `boca_sonido`, `ojo_sonido`, `brazo_izq_sonido`, `brazo_der_sonido`) — shown at 100% sound

Both states coexist in the SVG viewBox (580.57 x 218.29). The two versions are overlaid at the same position via CSS.

## Audio Pipeline
1. `navigator.mediaDevices.getUserMedia` → microphone stream
2. `AnalyserNode` (FFT 256) → real-time amplitude analysis
3. `requestAnimationFrame` loop → read RMS level, normalize to 0-1
4. Exponential moving average smoothing factor (~0.3) for fluid response
5. If microphone permission denied: static silence state with message

## Animation Mapping

### Head (cabeza)
- **Technique:** `clip-path: inset()` + `opacity`
- Silence visible at 0-20% sound, crossfade 20-50%, sonido visible 50-100%
- `clip-path` reveals sonido from top to bottom during transition

### Mouth (boca)
- **Technique:** `opacity` crossfade + `transform: scaleY()` + `rotate()` for shake
- `scaleY` goes from ~0.3 (silence, smaller mouth) to 1.0 (full open)
- Shake/tremble: random `rotate()` oscillation, amplitude proportional to sound level (0-2deg at peak)
- Transition range: 0-50% sound

### Eye (ojo)
- **Technique:** `opacity` crossfade + `transform: scaleY()` + `clip-path: circle()`
- `scaleY` from ~0.2 (closed) to 1.0 (wide open)
- `clip-path: circle()` radius grows with sound level
- Transition range: 0-60% sound

### Arms (brazos)
- **Technique:** `transform: rotate()` with `transform-origin` at shoulder joint + `opacity`
- Left arm rotates from silence angle to sonido angle
- Right arm rotates from silence angle to sonido angle
- Shoulder pivot points calculated from SVG coordinates
- Transition range: 0-70% sound

### Sound → Animation Mapping Table

| Level    | Head       | Mouth              | Eye           | Arms            |
|----------|------------|--------------------|---------------|-----------------|
| 0-20%    | silence    | closed, still      | closed        | silence pos     |
| 20-50%   | transition | opening            | opening       | transitioning   |
| 50-80%   | sound      | open, light shake  | open          | sound pos       |
| 80-100%  | sound      | open, strong shake | max open      | sound + vibrate |

## Visual Design
- Dark background (#1a1a1a) to make colors pop (green, pink, orange, white)
- Character centered in viewport
- Smooth `transition: all 0.1s ease-out` on animated properties
- Responsive: viewBox scales naturally

## Error Handling
- No mic permission → show informative message, static silence state
- No audio input → remain in silence state
- Browser doesn't support Web Audio → graceful fallback message

## Browser Support
- Chrome, Firefox, Safari (latest versions)
- Requires HTTPS or localhost for microphone access
