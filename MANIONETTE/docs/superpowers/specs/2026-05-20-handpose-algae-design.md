# Handpose Algae — Design Spec

## Overview

Web tool that uses MediaPipe Hands (via TensorFlow.js) to track hand landmarks in 3D and renders organic, algae-like lines that emerge from the user's fingers. Each finger maps to a distinct line that grows from the wrist and propagates upward with wave motion, reacting to hand gestures in real time.

## Tech Stack

- **Hand tracking**: `@mediapipe/hands` (MediaPipe Hands solution)
- **Rendering**: Three.js (with `Line2` / `LineGeometry` from three/examples for variable line width support)
- **Bundler**: Vite (vanilla JS)
- **Language**: JavaScript (ES modules)

## Hand Landmark Mapping (MediaPipe standard)

| Line | Finger   | Landmarks                  |
|------|----------|----------------------------|
| 1    | Thumb    | 0, 1, 2, 3, 4             |
| 2    | Index    | 0, 5, 6, 7, 8             |
| 3    | Middle   | 0, 9, 10, 11, 12          |
| 4    | Ring     | 0, 13, 14, 15, 16         |
| 5    | Pinky    | 0, 17, 18, 19, 20         |

Landmark 0 (wrist) is the shared base for all 5 lines.

## Architecture

### Modules

1. **HandTracker**
   - Initializes webcam and MediaPipe Hands pipeline
   - Returns normalized 3D landmarks per detected hand
   - Supports multiple hands (each hand renders independently)
   - Handles: no hand detected (fade out), partial visibility

2. **GestureEngine**
   - Receives landmarks per hand
   - Computes `openness` (0–1): average distance from fingertips to wrist/palm base
   - Apply lerp-based smoothing to avoid flicker
   - Output: `openness` value per hand

3. **WavePropagator**
   - Manages 5 lines per hand, each with ~31 control points
   - Wave index = `openness * totalSegments` → determines how many segments of each line are visible
   - Each control point has a sinusoidal displacement:
     - `amplitude * sin(time * freq + pointIndex * phaseOffset)`
     - Amplitude is modulated by proximity to wave front (newly revealed points move more)
   - Wave propagates from wrist (point 0) to fingertips

4. **AlgaeRenderer** (Three.js scene)
   - Each line is a `BufferGeometry` with `Line` + `LineBasicMaterial`
   - Glow effect: second line with low opacity and `AdditiveBlending`
   - Monochromatic bright color (e.g. `#00ff88`) on dark gradient background
   - Variable line width using `Line2`/`LineGeometry` from three/examples (base ~2px with subtle sinusoidal variation along the line)
   - Coordinate normalization: map MediaPipe pixel coords to Three.js space (-2 to +2)

### Data Flow

```
Webcam frame (30-60fps)
  → MediaPipe Hands → 21 landmarks 3D per hand
  → Normalize coords to Three.js space
  → GestureEngine → openness (0-1) per hand
  → WavePropagator → waveIndex per line
  → AlgaeRenderer:
       a) Interpolate control points up to waveIndex
       b) Apply sinusoidal displacement per point
       c) Update BufferGeometry for each line
```

## Gestures (Phase 1)

### Gesture 1: Algae Emerge (fist → open)

- Hand starts closed (fist) → openness ≈ 0
- Hand opens slowly (maintain Z axis) → openness → 1
- Wave propagates from wrist upward revealing line segments
- Lines have smooth sinusoidal "S" motion as if floating in dense water

### Future Gestures (not implemented in Phase 1)

- Fist close → algae retract
- Hand rotation → algae sway directionally
- Finger pinch → algae branch or split
- Swipe → algae get disturbed / scatter

## Aesthetic

- **Color**: Monochromatic bright (e.g. `#00ff88` cyan-green or configurable)
- **Background**: Dark (black → deep blue gradient)
- **Line style**: Thin continuous lines with subtle glow
- **Motion**: Organic, slow, sinusoidal, wave-propagation with energy decay

## Edge Cases

- **No hand detected**: lines fade out (opacity → 0 over ~0.5s)
- **Multiple hands**: each hand gets its own set of 5 lines, rendered independently
- **Hand partially out of frame**: valid landmarks continue working
- **Low confidence**: ignore frames where hand confidence < threshold

## UX Notes

- Webcam access requires a user interaction (click "Start" button) due to browser autoplay policies
- Single "Start" button on page load, no other UI in Phase 1

## Out of Scope (Phase 1)

- No settings panel (color, speed, etc.)
- No recording or export
- No sound
- No mobile optimization (desktop webcam only)
