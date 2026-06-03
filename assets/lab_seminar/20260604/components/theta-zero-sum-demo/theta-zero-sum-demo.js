(() => {
  function initThetaZeroSumDemo(root) {
    const canvas = root.querySelector("[data-theta-zero-canvas]");
    const sumReadout = root.querySelector("[data-zero-sum]");
    const pointReadout = root.querySelector("[data-zero-points]");
    const controls = Array.from(root.querySelectorAll("[data-coeff-control]"));

    if (!canvas || !sumReadout || !pointReadout) {
      return;
    }

    const isCoarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    const renderDpr = isCoarsePointer ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    let renderQuality = "full";
    let pendingFrame = null;
    let settleTimer = null;

    const state = {
      tau: {
        re: Number(root.dataset.tauRe || 0.45),
        im: Number(root.dataset.tauIm || 1.25),
      },
      terms: isCoarsePointer ? 5 : 8,
      coeffs: [
        { amp: 1, phase: 0 },
        { amp: 0.82, phase: 0.34 },
        { amp: 0.72, phase: -0.26 },
      ],
      zeros: [],
      originOffset: null,
    };

    const colors = {
      ink: "#111111",
      accent: "#9b002a",
      blue: "#1f6f8b",
      panel: "#fffdfb",
      grid: "rgba(17, 17, 17, 0.18)",
    };

    function setupCanvas(target, quality = "full") {
      const rect = target.getBoundingClientRect();
      const dpr = quality === "fast" ? 1 : renderDpr;
      target.width = Math.max(1, Math.round(rect.width * dpr));
      target.height = Math.max(1, Math.round(rect.height * dpr));
      const ctx = target.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, width: rect.width, height: rect.height, dpr };
    }

    function cAdd(a, b) {
      return { re: a.re + b.re, im: a.im + b.im };
    }

    function cMul(a, b) {
      return {
        re: a.re * b.re - a.im * b.im,
        im: a.re * b.im + a.im * b.re,
      };
    }

    function cAbs(a) {
      return Math.hypot(a.re, a.im);
    }

    function coeffValue(index) {
      const coeff = state.coeffs[index];
      return {
        re: coeff.amp * Math.cos(coeff.phase * Math.PI),
        im: coeff.amp * Math.sin(coeff.phase * Math.PI),
      };
    }

    function phaseToHue(angle) {
      const turn = ((angle / (Math.PI * 2)) % 1 + 1) % 1;
      return turn * 360;
    }

    function hslToRgb(h, s, l) {
      const hue = h / 360;
      if (s === 0) {
        const value = Math.round(l * 255);
        return { r: value, g: value, b: value };
      }

      const hue2rgb = (p, q, t) => {
        let next = t;
        if (next < 0) next += 1;
        if (next > 1) next -= 1;
        if (next < 1 / 6) return p + (q - p) * 6 * next;
        if (next < 1 / 2) return q;
        if (next < 2 / 3) return p + (q - p) * (2 / 3 - next) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      return {
        r: Math.round(hue2rgb(p, q, hue + 1 / 3) * 255),
        g: Math.round(hue2rgb(p, q, hue) * 255),
        b: Math.round(hue2rgb(p, q, hue - 1 / 3) * 255),
      };
    }

    function uvToComplex(u, v) {
      return {
        re: u + v * state.tau.re,
        im: v * state.tau.im,
      };
    }

    function wrapUnit(value) {
      return ((value % 1) + 1) % 1;
    }

    function wrapUv(point) {
      return {
        u: wrapUnit(point.u),
        v: wrapUnit(point.v),
      };
    }

    function thetaBasis(k, u, v) {
      const z = uvToComplex(u, v);
      let re = 0;
      let im = 0;
      const shift = k / 3;
      const terms = renderQuality === "fast" ? Math.min(state.terms, 6) : state.terms;

      for (let n = -terms; n <= terms; n += 1) {
        const a = n + shift;
        const exponentRe = -Math.PI * 3 * a * a * state.tau.im - 2 * Math.PI * 3 * a * z.im;
        const exponentIm = Math.PI * 3 * a * a * state.tau.re + 2 * Math.PI * 3 * a * z.re;
        const magnitude = Math.exp(Math.max(-44, Math.min(44, exponentRe)));
        re += magnitude * Math.cos(exponentIm);
        im += magnitude * Math.sin(exponentIm);
      }

      return { re, im };
    }

    function sectionValue(u, v) {
      let value = { re: 0, im: 0 };

      for (let k = 0; k < 3; k += 1) {
        value = cAdd(value, cMul(coeffValue(k), thetaBasis(k, u, v)));
      }

      return value;
    }

    function sectionMagnitude2(u, v) {
      const value = sectionValue(u, v);
      return value.re * value.re + value.im * value.im;
    }

    function projection(width, height) {
      const minRe = Math.min(0, state.tau.re) - 0.18;
      const maxRe = Math.max(1, 1 + state.tau.re) + 0.18;
      const minIm = -0.18;
      const maxIm = state.tau.im + 0.18;
      const pad = 28;
      const scale = Math.min((width - 2 * pad) / (maxRe - minRe), (height - 2 * pad) / (maxIm - minIm));

      return {
        scale,
        origin: {
          x: pad - minRe * scale,
          y: pad + maxIm * scale,
        },
      };
    }

    function pointFromUv(u, v, proj) {
      const z = uvToComplex(u, v);
      return {
        x: proj.origin.x + z.re * proj.scale,
        y: proj.origin.y - z.im * proj.scale,
      };
    }

    function uvFromPoint(x, y, proj) {
      const zRe = (x - proj.origin.x) / proj.scale;
      const zIm = (proj.origin.y - y) / proj.scale;
      const v = zIm / state.tau.im;
      const u = zRe - v * state.tau.re;
      return { u, v };
    }

    function torusDistance(a, b) {
      let du = Math.abs(a.u - b.u);
      let dv = Math.abs(a.v - b.v);
      du = Math.min(du, 1 - du);
      dv = Math.min(dv, 1 - dv);
      return Math.hypot(du, dv);
    }

    function phaseDifference(to, from) {
      let diff = to - from;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      return diff;
    }

    function phaseAt(u, v) {
      const value = sectionValue(u, v);
      return Math.atan2(value.im, value.re);
    }

    function cellWinding(u0, v0, step) {
      const phases = [
        phaseAt(u0, v0),
        phaseAt(u0 + step, v0),
        phaseAt(u0 + step, v0 + step),
        phaseAt(u0, v0 + step),
      ];
      const total =
        phaseDifference(phases[1], phases[0]) +
        phaseDifference(phases[2], phases[1]) +
        phaseDifference(phases[3], phases[2]) +
        phaseDifference(phases[0], phases[3]);

      return total / (Math.PI * 2);
    }

    function refineZero(u, v) {
      let current = { u, v };
      const h = 0.00015;
      const iterations = renderQuality === "fast" ? 10 : (isCoarsePointer ? 14 : 20);

      for (let iter = 0; iter < iterations; iter += 1) {
        const f = sectionValue(current.u, current.v);
        const fu1 = sectionValue(current.u + h, current.v);
        const fu0 = sectionValue(current.u - h, current.v);
        const fv1 = sectionValue(current.u, current.v + h);
        const fv0 = sectionValue(current.u, current.v - h);

        const a = (fu1.re - fu0.re) / (2 * h);
        const b = (fv1.re - fv0.re) / (2 * h);
        const c = (fu1.im - fu0.im) / (2 * h);
        const d = (fv1.im - fv0.im) / (2 * h);
        const determinant = a * d - b * c;

        if (Math.abs(determinant) < 1e-10) {
          break;
        }

        const du = (-f.re * d + b * f.im) / determinant;
        const dv = (c * f.re - a * f.im) / determinant;

        current = {
          u: current.u + Math.max(-0.08, Math.min(0.08, du)),
          v: current.v + Math.max(-0.08, Math.min(0.08, dv)),
        };

        if (Math.hypot(du, dv) < 0.000001) {
          break;
        }
      }

      return {
        ...wrapUv(current),
        value: sectionMagnitude2(current.u, current.v),
      };
    }

    function findZeros() {
      const grid = renderQuality === "fast" ? 40 : (isCoarsePointer ? 44 : 60);
      const step = 1 / grid;
      const candidates = [];

      for (let i = 0; i < grid; i += 1) {
        for (let j = 0; j < grid; j += 1) {
          const u = i * step;
          const v = j * step;
          const winding = cellWinding(u, v, step);
          if (Math.abs(winding) > 0.55) {
            candidates.push({
              u: u + step / 2,
              v: v + step / 2,
              winding,
            });
          }
        }
      }

      const roots = [];
      candidates.forEach((candidate) => {
        const root = refineZero(candidate.u, candidate.v);
        if (root.value < 1e-8 && !roots.some((existing) => torusDistance(existing, root) < 0.035)) {
          roots.push(root);
        }
      });

      roots.sort((a, b) => a.u + a.v - (b.u + b.v));
      state.zeros = roots.slice(0, 3).map(wrapUv);

      if (!state.originOffset && state.zeros.length === 3) {
        state.originOffset = zeroSum(state.zeros);
      }
    }

    function zeroSum(zeros) {
      const sum = zeros.reduce(
        (acc, zero) => ({ u: acc.u + zero.u, v: acc.v + zero.v }),
        { u: 0, v: 0 }
      );
      return {
        u: wrapUnit(sum.u),
        v: wrapUnit(sum.v),
      };
    }

    function normalizedSum(zeros) {
      const sum = zeroSum(zeros);
      if (!state.originOffset) {
        return sum;
      }
      return {
        u: wrapUnit(sum.u - state.originOffset.u),
        v: wrapUnit(sum.v - state.originOffset.v),
      };
    }

    function visibleRepresentatives(point) {
      const base = wrapUv(point);
      const representatives = [base];
      const eps = 0.035;

      if (base.u < eps) representatives.push({ u: base.u + 1, v: base.v });
      if (base.u > 1 - eps) representatives.push({ u: base.u - 1, v: base.v });
      if (base.v < eps) representatives.push({ u: base.u, v: base.v + 1 });
      if (base.v > 1 - eps) representatives.push({ u: base.u, v: base.v - 1 });
      if (base.u < eps && base.v < eps) representatives.push({ u: base.u + 1, v: base.v + 1 });
      if (base.u > 1 - eps && base.v > 1 - eps) representatives.push({ u: base.u - 1, v: base.v - 1 });
      if (base.u < eps && base.v > 1 - eps) representatives.push({ u: base.u + 1, v: base.v - 1 });
      if (base.u > 1 - eps && base.v < eps) representatives.push({ u: base.u - 1, v: base.v + 1 });

      return representatives;
    }

    function drawPhase(ctx, width, height, dpr, proj) {
      const pixelWidth = Math.max(1, Math.round(width * dpr));
      const pixelHeight = Math.max(1, Math.round(height * dpr));
      const image = ctx.createImageData(pixelWidth, pixelHeight);
      const data = image.data;

      for (let py = 0; py < pixelHeight; py += 1) {
        for (let px = 0; px < pixelWidth; px += 1) {
          const cssX = px / dpr;
          const cssY = py / dpr;
          const uv = uvFromPoint(cssX, cssY, proj);
          const inside = uv.u >= 0 && uv.u <= 1 && uv.v >= 0 && uv.v <= 1;
          const index = (py * pixelWidth + px) * 4;

          if (!inside) {
            data[index] = 255;
            data[index + 1] = 253;
            data[index + 2] = 251;
            data[index + 3] = 255;
            continue;
          }

          const value = sectionValue(uv.u, uv.v);
          const magnitude = cAbs(value);
          const rgb = hslToRgb(phaseToHue(Math.atan2(value.im, value.re)), 0.78, 0.34 + Math.min(0.22, Math.log1p(magnitude) * 0.06));
          data[index] = rgb.r;
          data[index + 1] = rgb.g;
          data[index + 2] = rgb.b;
          data[index + 3] = 255;
        }
      }

      ctx.putImageData(image, 0, 0);
    }

    function drawParallelogram(ctx, proj) {
      const origin = pointFromUv(0, 0, proj);
      const one = pointFromUv(1, 0, proj);
      const tau = pointFromUv(0, 1, proj);
      const sum = pointFromUv(1, 1, proj);

      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1.2;
      for (let i = 1; i < 5; i += 1) {
        const t = i / 5;
        const a = pointFromUv(t, 0, proj);
        const b = pointFromUv(t, 1, proj);
        const c = pointFromUv(0, t, proj);
        const d = pointFromUv(1, t, proj);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
      }

      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(one.x, one.y);
      ctx.lineTo(sum.x, sum.y);
      ctx.lineTo(tau.x, tau.y);
      ctx.closePath();
      ctx.stroke();
    }

    function drawZeros(ctx, proj) {
      state.zeros.forEach((zero, index) => {
        visibleRepresentatives(zero).forEach((representative, repIndex) => {
          const point = pointFromUv(representative.u, representative.v, proj);
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = colors.accent;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          if (repIndex === 0) {
            ctx.fillStyle = colors.accent;
            ctx.font = "800 15px Pretendard, sans-serif";
            ctx.fillText(`z${index + 1}`, point.x + 10, point.y - 8);
          }
        });
      });
    }

    function drawSumPoint(ctx, proj) {
      if (state.zeros.length !== 3) {
        return;
      }

      const raw = zeroSum(state.zeros);
      visibleRepresentatives(raw).forEach((representative, index) => {
        const point = pointFromUv(representative.u, representative.v, proj);
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = colors.blue;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y - 8.5);
        ctx.lineTo(point.x + 8.5, point.y);
        ctx.lineTo(point.x, point.y + 8.5);
        ctx.lineTo(point.x - 8.5, point.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if (index === 0) {
          ctx.fillStyle = colors.blue;
          ctx.font = "800 15px Pretendard, sans-serif";
          ctx.fillText("sum", point.x + 11, point.y + 5);
        }
      });
    }

    function updateReadouts() {
      pointReadout.textContent = state.zeros.length === 3
        ? state.zeros.map((zero, index) => `z${index + 1}=(${zero.u.toFixed(2)} + ${zero.v.toFixed(2)}tau)`).join(", ")
        : "zero search did not find three stable points";

      const raw = zeroSum(state.zeros);
      const normalized = normalizedSum(state.zeros);
      sumReadout.textContent = `raw sum = ${raw.u.toFixed(2)} + ${raw.v.toFixed(2)}tau; normalized sum = ${normalized.u.toFixed(2)} + ${normalized.v.toFixed(2)}tau`;
    }

    function updateControlReadouts() {
      controls.forEach((input) => {
        const output = root.querySelector(`[data-coeff-output="${input.dataset.coeffControl}"]`);
        if (output) {
          output.textContent = Number(input.value).toFixed(2);
        }
      });
    }

    function draw(quality = "full") {
      renderQuality = quality;
      findZeros();
      const { ctx, width, height, dpr } = setupCanvas(canvas, quality);
      const proj = projection(width, height);
      ctx.fillStyle = colors.panel;
      ctx.fillRect(0, 0, width, height);
      drawPhase(ctx, width, height, dpr, proj);
      drawParallelogram(ctx, proj);
      drawZeros(ctx, proj);
      drawSumPoint(ctx, proj);

      ctx.fillStyle = colors.ink;
      ctx.font = "800 16px Pretendard, sans-serif";
      ctx.fillText("phase of F(z)=a0s0+a1s1+a2s2", 18, 26);
      ctx.font = "600 13px Pretendard, sans-serif";
      ctx.fillText("red circles are zeros; blue diamond is their sum in C/Lambda", 18, 47);
      updateReadouts();
      renderQuality = "full";
    }

    function scheduleDraw() {
      if (pendingFrame === null) {
        pendingFrame = requestAnimationFrame(() => {
          pendingFrame = null;
          draw("fast");
        });
      }

      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (pendingFrame !== null) {
          cancelAnimationFrame(pendingFrame);
          pendingFrame = null;
        }
        draw("full");
      }, 180);
    }

    controls.forEach((input) => {
      input.addEventListener("input", () => {
        const [indexText, kind] = input.dataset.coeffControl.split("-");
        const index = Number(indexText);
        state.coeffs[index][kind] = Number(input.value);
        updateControlReadouts();
        scheduleDraw();
      });
    });

    updateControlReadouts();
    draw();
    window.addEventListener("resize", () => draw("full"));
  }

  document.querySelectorAll("[data-theta-zero-sum-demo]").forEach(initThetaZeroSumDemo);
})();
