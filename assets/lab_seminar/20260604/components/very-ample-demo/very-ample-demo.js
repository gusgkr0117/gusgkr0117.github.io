(() => {
  function initVeryAmpleDemo(root) {
    const bundleCanvas = root.querySelector("[data-bundle-canvas]");
    const sectionsCanvas = root.querySelector("[data-sections-canvas]");
    const pointReadout = root.querySelector("[data-va-point]");
    const valuesReadout = root.querySelector("[data-va-values]");
    const coordinateReadout = root.querySelector("[data-va-coordinate]");

    if (!bundleCanvas || !sectionsCanvas || !pointReadout || !valuesReadout || !coordinateReadout) {
      return;
    }

    const isCoarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    const renderDpr = isCoarsePointer ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    let renderQuality = "full";
    let pendingFrame = null;
    let settleTimer = null;
    let sectionsCache = null;

    const state = {
      tau: {
        re: Number(root.dataset.tauRe || 0.45),
        im: Number(root.dataset.tauIm || 1.25),
      },
      s: 0.35,
      t: 0.42,
      terms: isCoarsePointer ? 5 : 7,
      dragging: false,
    };

    const colors = {
      ink: "#111111",
      accent: "#9b002a",
      blue: "#1f6f8b",
      grid: "#d9d4d0",
    };

    function setupCanvas(canvas, quality = "full") {
      const rect = canvas.getBoundingClientRect();
      const dpr = quality === "fast" ? 1 : renderDpr;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, width: rect.width, height: rect.height };
    }

    function phaseToHue(angle) {
      const turn = ((angle / (Math.PI * 2)) % 1 + 1) % 1;
      return Math.round(turn * 360);
    }

    function hslToRgb(h, s, l) {
      if (s === 0) {
        const value = Math.round(l * 255);
        return { r: value, g: value, b: value };
      }
      const hue2rgb = (p, q, t) => {
        let nextT = t;
        if (nextT < 0) nextT += 1;
        if (nextT > 1) nextT -= 1;
        if (nextT < 1 / 6) return p + (q - p) * 6 * nextT;
        if (nextT < 1 / 2) return q;
        if (nextT < 2 / 3) return p + (q - p) * (2 / 3 - nextT) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      return {
        r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
        g: Math.round(hue2rgb(p, q, h) * 255),
        b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
      };
    }

    function thetaBasis(k, zRe, zIm) {
      let re = 0;
      let im = 0;
      const tau = state.tau;
      const shift = k / 3;
      const terms = renderQuality === "fast" ? Math.min(state.terms, 5) : state.terms;
      for (let n = -terms; n <= terms; n += 1) {
        const a = n + shift;
        const exponentRe = -Math.PI * 3 * a * a * tau.im - 2 * Math.PI * 3 * a * zIm;
        const exponentIm = Math.PI * 3 * a * a * tau.re + 2 * Math.PI * 3 * a * zRe;
        const magnitude = Math.exp(Math.max(-38, Math.min(38, exponentRe)));
        re += magnitude * Math.cos(exponentIm);
        im += magnitude * Math.sin(exponentIm);
      }
      return { re, im };
    }

    function planeProjection(width, height) {
      const tau = state.tau;
      const minRe = Math.min(0, tau.re) - 0.18;
      const maxRe = Math.max(1, 1 + tau.re) + 0.18;
      const minIm = -0.18;
      const maxIm = tau.im + 0.18;
      const pad = 24;
      const scale = Math.min((width - 2 * pad) / (maxRe - minRe), (height - 2 * pad) / (maxIm - minIm));
      return {
        scale,
        origin: {
          x: pad - minRe * scale,
          y: pad + maxIm * scale,
        },
      };
    }

    function planePoint(re, im, projection) {
      return {
        x: projection.origin.x + re * projection.scale,
        y: projection.origin.y - im * projection.scale,
      };
    }

    function drawSegment(ctx, from, to, color, width) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.lineCap = "butt";
    }

    function transitionPhaseAt(s) {
      const tau = state.tau;
      const zRe = s + tau.re;
      return -Math.PI * 3 * tau.re - 2 * Math.PI * 3 * zRe;
    }

    function drawBundleCanvas(quality = "full") {
      const { ctx, width, height } = setupCanvas(bundleCanvas, quality);
      const projection = planeProjection(width, height);
      const tau = state.tau;
      const origin = planePoint(0, 0, projection);
      const one = planePoint(1, 0, projection);
      const tauPoint = planePoint(tau.re, tau.im, projection);
      const sum = planePoint(1 + tau.re, tau.im, projection);
      const selected = planePoint(state.s + state.t * tau.re, state.t * tau.im, projection);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fffdfb";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(one.x, one.y);
      ctx.lineTo(sum.x, sum.y);
      ctx.lineTo(tauPoint.x, tauPoint.y);
      ctx.closePath();
      ctx.stroke();

      const steps = 80;
      for (let i = 0; i < steps; i += 1) {
        const s0 = i / steps;
        const s1 = (i + 1) / steps;
        drawSegment(ctx, planePoint(s0, 0, projection), planePoint(s1, 0, projection), "hsl(0, 78%, 48%)", 5);
        const hue = phaseToHue(transitionPhaseAt(s0));
        drawSegment(
          ctx,
          planePoint(s0 + tau.re, tau.im, projection),
          planePoint(s1 + tau.re, tau.im, projection),
          `hsl(${hue}, 76%, 52%)`,
          5
        );
      }

      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(selected.x, selected.y, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = colors.ink;
      ctx.font = "700 15px Pretendard, sans-serif";
      ctx.fillText("degree 3 line bundle", 18, 28);
      ctx.fillStyle = colors.blue;
      ctx.fillText("1", one.x + 8, one.y + 16);
      ctx.fillStyle = colors.accent;
      ctx.fillText("tau", tauPoint.x + 8, tauPoint.y - 8);
      ctx.fillStyle = colors.ink;
      ctx.fillText("z", selected.x + 8, selected.y - 8);
    }

    function drawThetaPanel(ctx, x0, y0, panelWidth, panelHeight, k, includeSelected = true, quality = "full") {
      const dpr = quality === "fast" ? 1 : renderDpr;
      const pixelWidth = Math.max(1, Math.floor(panelWidth * dpr));
      const pixelHeight = Math.max(1, Math.floor(panelHeight * dpr));
      const offscreen = document.createElement("canvas");
      offscreen.width = pixelWidth;
      offscreen.height = pixelHeight;
      const offscreenCtx = offscreen.getContext("2d");
      const image = offscreenCtx.createImageData(pixelWidth, pixelHeight);
      const projection = planeProjection(panelWidth, panelHeight);
      const data = image.data;

      for (let y = 0; y < pixelHeight; y += 1) {
        for (let x = 0; x < pixelWidth; x += 1) {
          const cssX = x / dpr;
          const cssY = y / dpr;
          const zRe = (cssX - projection.origin.x) / projection.scale;
          const zIm = (projection.origin.y - cssY) / projection.scale;
          const value = thetaBasis(k, zRe, zIm);
          const angle = Math.atan2(value.im, value.re);
          const magnitude = Math.hypot(value.re, value.im);
          const rgb = hslToRgb(phaseToHue(angle) / 360, 0.72, (56 + Math.min(12, Math.log1p(magnitude) * 1.8)) / 100);
          const index = (y * pixelWidth + x) * 4;
          data[index] = rgb.r;
          data[index + 1] = rgb.g;
          data[index + 2] = rgb.b;
          data[index + 3] = 255;
        }
      }

      offscreenCtx.putImageData(image, 0, 0);
      ctx.drawImage(offscreen, x0, y0, panelWidth, panelHeight);

      ctx.save();
      ctx.translate(x0, y0);
      const tau = state.tau;
      const origin = planePoint(0, 0, projection);
      const one = planePoint(1, 0, projection);
      const tauPoint = planePoint(tau.re, tau.im, projection);
      const sum = planePoint(1 + tau.re, tau.im, projection);

      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(one.x, one.y);
      ctx.lineTo(sum.x, sum.y);
      ctx.lineTo(tauPoint.x, tauPoint.y);
      ctx.closePath();
      ctx.stroke();

      if (includeSelected) {
        drawThetaPanelSelection(ctx, projection);
      }

      ctx.fillStyle = colors.ink;
      ctx.font = "700 14px Pretendard, sans-serif";
      ctx.fillText(`s${k}`, 10, 21);
      ctx.restore();

      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 2;
      ctx.strokeRect(x0, y0, panelWidth, panelHeight);
    }

    function drawThetaPanelSelection(ctx, projection) {
      const tau = state.tau;
      const selected = planePoint(state.s + state.t * tau.re, state.t * tau.im, projection);
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(selected.x, selected.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    function sectionsCacheKey(width, height, dpr, quality) {
      return [
        Math.round(width),
        Math.round(height),
        dpr,
        quality,
        state.tau.re.toFixed(3),
        state.tau.im.toFixed(3),
        state.terms,
      ].join(":");
    }

    function drawSectionsCanvas(quality = "full") {
      const { ctx, width, height } = setupCanvas(sectionsCanvas, quality);
      ctx.clearRect(0, 0, width, height);
      const dpr = quality === "fast" ? 1 : renderDpr;
      const key = sectionsCacheKey(width, height, dpr, quality);
      const gap = 12;
      const panelWidth = (width - gap * 4) / 3;
      const panelHeight = height - 2 * gap;

      if (!sectionsCache || sectionsCache.key !== key) {
        const cacheCanvas = document.createElement("canvas");
        cacheCanvas.width = Math.max(1, Math.round(width * dpr));
        cacheCanvas.height = Math.max(1, Math.round(height * dpr));
        const cacheCtx = cacheCanvas.getContext("2d");
        cacheCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cacheCtx.fillStyle = "#fffdfb";
        cacheCtx.fillRect(0, 0, width, height);
        for (let k = 0; k < 3; k += 1) {
          drawThetaPanel(cacheCtx, gap + k * (panelWidth + gap), gap, panelWidth, panelHeight, k, false, quality);
        }
        sectionsCache = { key, canvas: cacheCanvas };
      }

      ctx.drawImage(sectionsCache.canvas, 0, 0, width, height);
      for (let k = 0; k < 3; k += 1) {
        ctx.save();
        ctx.translate(gap + k * (panelWidth + gap), gap);
        drawThetaPanelSelection(ctx, planeProjection(panelWidth, panelHeight));
        ctx.restore();
      }
    }

    function parameterFromBundleCanvas(clientX, clientY) {
      const rect = bundleCanvas.getBoundingClientRect();
      const projection = planeProjection(rect.width, rect.height);
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const zRe = (x - projection.origin.x) / projection.scale;
      const zIm = (projection.origin.y - y) / projection.scale;
      const t = zIm / state.tau.im;
      const s = zRe - t * state.tau.re;
      return {
        s: Math.max(0, Math.min(1, s)),
        t: Math.max(0, Math.min(1, t)),
      };
    }

    function valueText(value) {
      const re = value.re.toFixed(2);
      const im = Math.abs(value.im).toFixed(2);
      const sign = value.im >= 0 ? "+" : "-";
      return `${re}${sign}${im}i`;
    }

    function render(quality = "full") {
      renderQuality = quality;
      const tau = state.tau;
      const zRe = state.s + state.t * tau.re;
      const zIm = state.t * tau.im;
      const values = [0, 1, 2].map((k) => thetaBasis(k, zRe, zIm));

      pointReadout.textContent = `z = ${zRe.toFixed(2)} + ${zIm.toFixed(2)}i`;
      valuesReadout.textContent = values.map((value, index) => `s${index}(z) = ${valueText(value)}`).join("    ");
      coordinateReadout.textContent = `[${values.map(valueText).join(" : ")}]`;
      drawBundleCanvas(quality);
      drawSectionsCanvas(quality);
      renderQuality = "full";
    }

    function scheduleRender() {
      if (pendingFrame === null) {
        pendingFrame = requestAnimationFrame(() => {
          pendingFrame = null;
          render("fast");
        });
      }

      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (pendingFrame !== null) {
          cancelAnimationFrame(pendingFrame);
          pendingFrame = null;
        }
        render("full");
      }, 160);
    }

    bundleCanvas.addEventListener("pointerdown", (event) => {
      state.dragging = true;
      bundleCanvas.setPointerCapture(event.pointerId);
      const parameter = parameterFromBundleCanvas(event.clientX, event.clientY);
      state.s = parameter.s;
      state.t = parameter.t;
      scheduleRender();
    });

    bundleCanvas.addEventListener("pointermove", (event) => {
      if (!state.dragging) return;
      const parameter = parameterFromBundleCanvas(event.clientX, event.clientY);
      state.s = parameter.s;
      state.t = parameter.t;
      scheduleRender();
    });

    bundleCanvas.addEventListener("pointerup", () => {
      state.dragging = false;
      render("full");
    });

    bundleCanvas.addEventListener("pointercancel", () => {
      state.dragging = false;
      render("full");
    });

    window.addEventListener("resize", () => {
      sectionsCache = null;
      render("full");
    });
    render();
  }

  function initAll() {
    document.querySelectorAll("[data-very-ample-demo]").forEach(initVeryAmpleDemo);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
