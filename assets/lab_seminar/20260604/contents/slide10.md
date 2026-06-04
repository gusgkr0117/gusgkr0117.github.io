# Definition of Line Bundle

<div class="slide10-carousel" data-slide10-carousel>
  <button type="button" class="slide10-arrow slide10-arrow-left" data-slide10-prev aria-label="Show line bundle definition">‹</button>
  <div class="slide10-track">
    <div class="slide10-page">
      <div class="line-bundle-slide">
        <div class="line-bundle-definition">
          <article class="definition">
            <h3>Definition. Line bundle</h3>
            <p>
              A line bundle over a space <span class="math">X</span> is a map
              <span class="math">π: L → X</span> such that each fiber
              <span class="math">L<sub>x</sub> = π<sup>-1</sup>(x)</span> is a one-dimensional vector space.
            </p>
          </article>
          <p>
            Locally, it looks like a product
            <span class="math">U × ℝ</span> or <span class="math">U × ℂ</span>.
          </p>
          <p>
            The key point is local triviality: locally product-like, globally possibly twisted.
          </p>
          <div class="line-bundle-transition">
            <p>Example: the Möbius strip is a real line bundle over <span class="math">S<sup>1</sup></span>.</p>
          </div>
        </div>
        <div class="mobius-panel">
          <div class="mobius-demo" data-mobius-line-bundle-demo data-initial-t="0.9">
            <canvas
              data-mobius-canvas
              width="760"
              height="520"
              aria-label="Interactive Mobius strip line bundle over the circle"
            ></canvas>
            <div class="mobius-readout">
              <p class="mobius-value" data-mobius-angle>base angle t = 0.90</p>
            </div>
          </div>
          <p class="mobius-caption">
            Each point of <span class="math">S<sup>1</sup></span> has a line attached to it,
            but after going once around the circle, the line returns with a twist.
          </p>
        </div>
      </div>
    </div>
    <div class="slide10-page">
      <div class="slide10-demo-page">
        <div class="torus-line-demo" data-torus-line-bundle-demo data-lambda="0.55" tabindex="0">
          <div class="torus-line-stage">
            <canvas
              data-torus-line-canvas
              width="820"
              height="540"
              aria-label="3D first-person view of a scaled torus line bundle"
            ></canvas>
          </div>
          <div class="torus-line-controls">
            <div class="torus-line-readout">
              <p data-torus-coordinate>(m, n) = (0, 0)</p>
              <p data-torus-scale>e<sup>-nλ</sup> = 1.00</p>
              <p class="torus-line-status" data-torus-status>Loading 3D scene...</p>
            </div>
            <div class="torus-line-move-pad" aria-label="Move on the universal cover">
              <button type="button" class="torus-line-button" data-torus-move="forward">Forward</button>
              <button type="button" class="torus-line-button" data-torus-move="back">Back</button>
              <button type="button" class="torus-line-button" data-torus-move="left">Left</button>
              <button type="button" class="torus-line-button" data-torus-move="right">Right</button>
              <button type="button" class="torus-line-button" data-torus-move="reset">Reset</button>
            </div>
            <div class="torus-line-caption">
              <p>
                Drag the mouse to turn your view. Walk with W/A/S/D or arrow keys.
                Left and right copies keep the same size, while forward copies shrink and backward copies grow by
                <span class="math">e<sup>-nλ</sup></span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button type="button" class="slide10-arrow slide10-arrow-right" data-slide10-next aria-label="Show torus line bundle demo">›</button>
</div>
