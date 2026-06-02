# Lattice Torus Demo

Reusable interactive canvas component for visualizing the lattice

`Lambda_tau = Z + Z tau`

and the quotient torus `C / Lambda_tau`.

## Files

- `lattice-torus-demo.css`: layout and presentation styles.
- `lattice-torus-demo.js`: canvas rendering and pointer interaction.

## Usage

Include the CSS in `<head>`:

```html
<link rel="stylesheet" href="components/lattice-torus-demo/lattice-torus-demo.css">
```

Use this markup:

```html
<div class="interactive-lattice" data-lattice-demo data-initial-tau-re="0.5" data-initial-tau-im="1.3">
  <div class="interactive-panel">
    <h3>Choose tau and generate Lambda_tau</h3>
    <canvas data-lattice-canvas width="720" height="520"></canvas>
    <div class="interactive-caption">
      <p class="tau-readout" data-tau-readout></p>
      <p class="drag-hint">Drag the red point in the upper half-plane.</p>
    </div>
  </div>
  <div class="interactive-panel">
    <h3>Quotient by the lattice</h3>
    <canvas data-torus-canvas width="600" height="520"></canvas>
  </div>
</div>
```

Include the JS before `</body>`:

```html
<script src="components/lattice-torus-demo/lattice-torus-demo.js"></script>
```

Multiple demos can exist on the same page as long as each root has `data-lattice-demo`.
