# Slide 10 Torus Line Bundle Demo Design

## Goal

Extend slide 10 with a second horizontal page that visually explains a line bundle over a 2D torus by showing repeated copies of an observer in the universal cover.

The current definition content stays on the first page. The new interactive page appears when the presenter uses the slide's right-arrow control.

## User Experience

Slide 10 becomes a two-page carousel:

1. Page 1: the current "Definition of Line Bundle" text.
2. Page 2: an interactive canvas showing the universal cover of a torus with repeated observer copies.

The interactive page shows a central observer and repeated observer copies in four directions. Left and right copies keep the same scale. Forward copies shrink exponentially, and backward copies grow exponentially. This represents a gluing action where one torus direction carries a scale factor.

The demo supports arrow-key movement and four compact on-screen direction buttons. The center observer remains the reference point while the surrounding repeated copies shift and rescale. A small readout shows the current lattice coordinate and the scale factor.

## Architecture

Add a new component:

- `components/torus-line-bundle-demo/torus-line-bundle-demo.css`
- `components/torus-line-bundle-demo/torus-line-bundle-demo.js`

Update:

- `contents/slide10.md` to wrap the current definition and the new demo page in a slide-10 carousel.
- `index.html` to lazy-load the new component when `[data-torus-line-bundle-demo]` or the slide-10 carousel selector is present.

The carousel should follow the existing slide 3 pattern: a flex track with two pages, arrow buttons, and a `data-active-page` state. The component JavaScript initializes both the carousel and the canvas demo.

## Visual Model

The canvas uses a 2D universal-cover grid rather than a full 3D torus. The horizontal axis represents one torus generator and preserves scale. The vertical axis represents the generator whose line-bundle gluing factor scales the fiber.

For a copy at relative lattice offset `(dx, dy)`, its visual scale is proportional to:

```text
exp(-dy * lambda)
```

where `lambda` is a fixed positive constant chosen for readable spacing. Copies above the observer shrink; copies below grow. The demo clamps visual scale so nearby large copies remain legible without covering the whole canvas.

## Controls

The demo supports:

- Arrow keys: move the observer by one lattice step.
- Four direction buttons: same movement as the arrow keys.
- Reset button: return to the origin.

The readout displays:

- Current lattice coordinate `(m, n)`.
- Current fiber scale `e^{-n lambda}`.

## Error Handling

If required DOM nodes are missing, initialization returns without throwing. Canvas drawing resizes to the element's display size and redraws on window resize. Keyboard events only affect the demo when the slide page has focus or when the demo root is active, so normal page scrolling is not hijacked globally.

## Testing

Manual verification is sufficient because this is a presentation component with canvas rendering:

- Open the slide deck locally.
- Navigate to slide 10.
- Use the carousel arrow to reach the demo page.
- Confirm the canvas is nonblank.
- Confirm left/right movement preserves copy scale.
- Confirm forward movement makes repeated copies smaller and backward movement makes them larger.
- Confirm on-screen buttons and keyboard arrows both work.
- Check a narrow viewport to ensure the layout does not overlap.
