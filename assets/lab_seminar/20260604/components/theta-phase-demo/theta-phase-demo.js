(() => {
  function initThetaPhaseDemo(root) {
    const canvas = root.querySelector("[data-theta-canvas]");
    const tauReadout = root.querySelector("[data-theta-tau]");
    const termsReadout = root.querySelector("[data-theta-terms]");
    const tauReInput = root.querySelector("[data-theta-tau-re-input]");
    const tauImInput = root.querySelector("[data-theta-tau-im-input]");
    const tauReOutput = root.querySelector("[data-theta-tau-re-output]");
    const tauImOutput = root.querySelector("[data-theta-tau-im-output]");

    if (!canvas) {
      return;
    }

    const isCoarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    const renderDpr = isCoarsePointer ? 1 : Math.min(window.devicePixelRatio || 1, 2);

    const state = {
      tau: {
        re: Number(root.dataset.tauRe || 0.45),
        im: Number(root.dataset.tauIm || 1.25),
      },
      terms: isCoarsePointer ? Math.min(Number(root.dataset.terms || 8), 5) : Number(root.dataset.terms || 8),
    };

    const colors = {
      ink: "#111111",
      accent: "#9b002a",
      blue: "#1f6f8b",
      grid: "#d9d4d0",
    };

    function setupCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = renderDpr;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return {
        ctx,
        width: rect.width,
        height: rect.height,
        dpr,
        pixelWidth: canvas.width,
        pixelHeight: canvas.height,
      };
    }

    function theta(zRe, zIm) {
      let re = 0;
      let im = 0;
      const tau = state.tau;
      for (let n = -state.terms; n <= state.terms; n += 1) {
        const exponentRe = -Math.PI * n * n * tau.im - 2 * Math.PI * n * zIm;
        const exponentIm = Math.PI * n * n * tau.re + 2 * Math.PI * n * zRe;
        const magnitude = Math.exp(Math.max(-40, Math.min(40, exponentRe)));
        re += magnitude * Math.cos(exponentIm);
        im += magnitude * Math.sin(exponentIm);
      }
      return { re, im };
    }

    function hueFromAngle(angle) {
      const turn = ((angle / (Math.PI * 2)) % 1 + 1) % 1;
      return Math.round(turn * 360);
    }

    function drawPhaseLegend(ctx, width, height) {
      const x = width * 0.08;
      const y = height * 0.9;
      const w = width * 0.34;
      const h = 13;
      for (let i = 0; i < w; i += 1) {
        ctx.fillStyle = `hsl(${Math.round((i / w) * 360)}, 72%, 56%)`;
        ctx.fillRect(x + i, y, 1, h);
      }
      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = colors.ink;
      ctx.font = "700 15px Pretendard, sans-serif";
      ctx.fillText("arg theta", x, y - 8);
      ctx.fillText("0", x - 2, y + h + 18);
      ctx.fillText("2π", x + w - 18, y + h + 18);
    }

    function drawLattice(ctx, width, height, projection) {
      const tau = state.tau;
      const origin = planePoint(0, 0, projection);
      const one = planePoint(1, 0, projection);
      const tauPoint = planePoint(tau.re, tau.im, projection);
      const sum = planePoint(1 + tau.re, tau.im, projection);

      ctx.strokeStyle = "rgba(17, 17, 17, 0.25)";
      ctx.lineWidth = 1;
      for (let m = -2; m <= 3; m += 1) {
        for (let n = -1; n <= 2; n += 1) {
          const p = planePoint(m + n * tau.re, n * tau.im, projection);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(one.x, one.y);
      ctx.lineTo(sum.x, sum.y);
      ctx.lineTo(tauPoint.x, tauPoint.y);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = colors.blue;
      ctx.font = "700 16px Pretendard, sans-serif";
      ctx.fillText("1", one.x + 8, one.y + 16);
      ctx.fillStyle = colors.accent;
      ctx.fillText("tau", tauPoint.x + 8, tauPoint.y - 8);
    }

    function planeProjection(width, height) {
      const tau = state.tau;
      const minRe = -0.6 + Math.min(0, tau.re);
      const maxRe = 1.6 + Math.max(0, tau.re);
      const minIm = -0.55;
      const maxIm = tau.im + 0.75;
      const pad = 26;
      const scale = Math.min((width - 2 * pad) / (maxRe - minRe), (height - 2 * pad) / (maxIm - minIm));
      return {
        scale,
        origin: {
          x: pad - minRe * scale,
          y: pad + maxIm * scale,
        },
        minRe,
        maxRe,
        minIm,
        maxIm,
      };
    }

    function planePoint(re, im, projection) {
      return {
        x: projection.origin.x + re * projection.scale,
        y: projection.origin.y - im * projection.scale,
      };
    }

    function draw() {
      const { ctx, width, height, dpr, pixelWidth, pixelHeight } = setupCanvas();
      const projection = planeProjection(width, height);
      const image = ctx.createImageData(pixelWidth, pixelHeight);
      const data = image.data;

      for (let y = 0; y < image.height; y += 1) {
        for (let x = 0; x < image.width; x += 1) {
          const cssX = x / dpr;
          const cssY = y / dpr;
          const zRe = (cssX - projection.origin.x) / projection.scale;
          const zIm = (projection.origin.y - cssY) / projection.scale;
          const value = theta(zRe, zIm);
          const angle = Math.atan2(value.im, value.re);
          const magnitude = Math.hypot(value.re, value.im);
          const hue = hueFromAngle(angle);
          const light = 54 + Math.min(14, Math.log1p(magnitude) * 2.1);
          const color = hslToRgb(hue / 360, 0.72, light / 100);
          const index = (y * image.width + x) * 4;
          data[index] = color.r;
          data[index + 1] = color.g;
          data[index + 2] = color.b;
          data[index + 3] = 255;
        }
      }

      ctx.putImageData(image, 0, 0);
      drawLattice(ctx, width, height, projection);
      drawPhaseLegend(ctx, width, height);

      ctx.fillStyle = colors.ink;
      ctx.font = "700 17px Pretendard, sans-serif";
      ctx.fillText("complex plane colored by arg theta(z, tau)", width * 0.06, height * 0.08);
    }

    function hslToRgb(h, s, l) {
      let r;
      let g;
      let b;

      if (s === 0) {
        r = l;
        g = l;
        b = l;
      } else {
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
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
      };
    }

    function render() {
      if (tauReadout) {
        tauReadout.textContent = `τ = ${state.tau.re.toFixed(2)} + ${state.tau.im.toFixed(2)}i`;
      }
      if (termsReadout) {
        termsReadout.textContent = `partial sum: n = -${state.terms},...,${state.terms}`;
      }
      if (tauReOutput) {
        tauReOutput.textContent = state.tau.re.toFixed(2);
      }
      if (tauImOutput) {
        tauImOutput.textContent = state.tau.im.toFixed(2);
      }
      draw();
    }

    function updateTauFromInputs() {
      if (tauReInput) {
        state.tau.re = Number(tauReInput.value);
      }
      if (tauImInput) {
        state.tau.im = Number(tauImInput.value);
      }
      render();
    }

    if (tauReInput) {
      tauReInput.value = state.tau.re;
      tauReInput.addEventListener("input", updateTauFromInputs);
    }
    if (tauImInput) {
      tauImInput.value = state.tau.im;
      tauImInput.addEventListener("input", updateTauFromInputs);
    }

    window.addEventListener("resize", render);
    render();
  }

  function initAll() {
    document.querySelectorAll("[data-theta-phase-demo]").forEach(initThetaPhaseDemo);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
