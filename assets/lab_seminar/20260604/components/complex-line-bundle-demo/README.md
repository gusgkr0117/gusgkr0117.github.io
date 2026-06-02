# Complex Line Bundle Demo

Canvas component showing a complex torus colored by the phase of the transition factor

`exp(-pi i tau - 2 pi i z)`

for the identification `(z, r) ~ (z + tau, exp(-pi i tau - 2 pi i z) r)`.

Use:

```html
<link rel="stylesheet" href="components/complex-line-bundle-demo/complex-line-bundle-demo.css">
<script src="components/complex-line-bundle-demo/complex-line-bundle-demo.js"></script>
```

Markup:

```html
<div class="complex-line-demo" data-complex-line-bundle-demo data-tau-re="0.45" data-tau-im="1.25">
  <canvas data-complex-line-canvas></canvas>
  <span data-complex-line-point></span>
  <span data-complex-line-phase></span>
</div>
```

Drag near the torus surface or the unfolded complex-plane parallelogram to move the selected point. Shift-drag empty space to rotate the view.
