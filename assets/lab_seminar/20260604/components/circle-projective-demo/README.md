# Circle Projective Demo

Reusable canvas component showing how a point on the real circle determines the coordinate functions `cos t` and `sin t`, and hence the projective coordinate `[1 : cos t : sin t]`.

Include:

```html
<link rel="stylesheet" href="components/circle-projective-demo/circle-projective-demo.css">
<script src="components/circle-projective-demo/circle-projective-demo.js"></script>
```

Markup root:

```html
<div class="circle-demo" data-circle-projective-demo data-initial-t="0.85">
  <canvas data-circle-canvas></canvas>
  <canvas data-graph-canvas></canvas>
  <span data-t-readout></span>
  <span data-cos-readout></span>
  <span data-sin-readout></span>
  <span data-point-readout></span>
</div>
```
