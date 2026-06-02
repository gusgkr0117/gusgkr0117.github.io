(() => {
  function initComplexLineBundleDemo(root) {
    const canvas = root.querySelector("[data-complex-line-canvas]");
    const pointReadout = root.querySelector("[data-complex-line-point]");
    const phaseReadout = root.querySelector("[data-complex-line-phase]");
    const tauReadout = root.querySelector("[data-complex-line-tau]");
    const tauReInput = root.querySelector("[data-tau-re-input]");
    const tauImInput = root.querySelector("[data-tau-im-input]");
    const tauReOutput = root.querySelector("[data-tau-re-output]");
    const tauImOutput = root.querySelector("[data-tau-im-output]");

    if (!canvas || !pointReadout || !phaseReadout) {
      return;
    }

    const state = {
      tau: {
        re: Number(root.dataset.tauRe || 0.45),
        im: Number(root.dataset.tauIm || 1.25),
      },
      s: 0.34,
      t: 0.42,
      yaw: -0.6,
      pitch: 0.72,
      draggingPoint: false,
      rotating: false,
      last: { x: 0, y: 0 },
    };

    const colors = {
      ink: "#111111",
      accent: "#9b002a",
      blue: "#1f6f8b",
      grid: "#d9d4d0",
    };

    function setupCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, width: rect.width, height: rect.height };
    }

    function phaseAt(s, t) {
      const tau = state.tau;
      const zRe = s + t * tau.re;
      const zIm = t * tau.im;
      const exponentImag = -Math.PI * tau.re - 2 * Math.PI * zRe;
      const exponentReal = Math.PI * tau.im + 2 * Math.PI * zIm;
      return {
        angle: exponentImag,
        magnitude: Math.exp(Math.min(2.3, exponentReal * 0.14)),
        zRe,
        zIm,
      };
    }

    function hueFromPhase(angle) {
      const turn = ((angle / (Math.PI * 2)) % 1 + 1) % 1;
      return Math.round(turn * 360);
    }

    function torusPoint(s, t) {
      const u = s * Math.PI * 2;
      const v = t * Math.PI * 2;
      const R = 1.55;
      const r = 0.48;
      return {
        x: (R + r * Math.cos(v)) * Math.cos(u),
        y: (R + r * Math.cos(v)) * Math.sin(u),
        z: r * Math.sin(v),
      };
    }

    function rotate(point) {
      const cy = Math.cos(state.yaw);
      const sy = Math.sin(state.yaw);
      const cp = Math.cos(state.pitch);
      const sp = Math.sin(state.pitch);
      const x1 = point.x * cy - point.y * sy;
      const y1 = point.x * sy + point.y * cy;
      const z1 = point.z;
      return {
        x: x1,
        y: y1 * cp - z1 * sp,
        z: y1 * sp + z1 * cp,
      };
    }

    function project(point, width, height) {
      const rotated = rotate(point);
      const scale = Math.min(width, height) * 0.14;
      return {
        x: width * 0.34 + rotated.x * scale,
        y: height * 0.44 - rotated.y * scale,
        depth: rotated.z,
      };
    }

    function drawPatch(ctx, width, height, s0, t0, ds, dt) {
      const corners = [
        project(torusPoint(s0, t0), width, height),
        project(torusPoint(s0 + ds, t0), width, height),
        project(torusPoint(s0 + ds, t0 + dt), width, height),
        project(torusPoint(s0, t0 + dt), width, height),
      ];
      const light = 56 + Math.max(-9, Math.min(9, corners.reduce((sum, p) => sum + p.depth, 0) * 1.9));
      ctx.fillStyle = `hsl(28, 18%, ${light + 22}%)`;
      ctx.strokeStyle = "rgba(17, 17, 17, 0.09)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      for (let i = 1; i < corners.length; i += 1) {
        ctx.lineTo(corners[i].x, corners[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    function drawCurve(ctx, width, height, fixed, isS, color, lineWidth) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      for (let i = 0; i <= 180; i += 1) {
        const q = i / 180;
        const p = isS
          ? project(torusPoint(q, fixed), width, height)
          : project(torusPoint(fixed, q), width, height);
        if (i === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
    }

    function drawArrow(ctx, from, to, color) {
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const size = 10;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(to.x, to.y);
      ctx.lineTo(to.x - size * Math.cos(angle - Math.PI / 6), to.y - size * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(to.x - size * Math.cos(angle + Math.PI / 6), to.y - size * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }

    function drawPhaseLegend(ctx, width, height) {
      const x = width * 0.07;
      const y = height * 0.89;
      const w = width * 0.29;
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
      ctx.fillText("transition phase", x, y - 8);
      ctx.fillText("0", x - 2, y + h + 18);
      ctx.fillText("2π", x + w - 18, y + h + 18);
    }

    function planeView(width, height) {
      return {
        x: width * 0.58,
        y: height * 0.15,
        width: width * 0.36,
        height: height * 0.62,
      };
    }

    function planeProjection(view) {
      const tau = state.tau;
      const minRe = Math.min(0, tau.re) - 0.18;
      const maxRe = Math.max(1, 1 + tau.re) + 0.18;
      const minIm = -0.18;
      const maxIm = tau.im + 0.18;
      const scale = Math.min(view.width / (maxRe - minRe), view.height / (maxIm - minIm));
      return {
        scale,
        origin: {
          x: view.x + (view.width - (maxRe - minRe) * scale) / 2 - minRe * scale,
          y: view.y + (view.height - (maxIm - minIm) * scale) / 2 + maxIm * scale,
        },
      };
    }

    function planePoint(re, im, projection) {
      return {
        x: projection.origin.x + re * projection.scale,
        y: projection.origin.y - im * projection.scale,
      };
    }

    function drawColoredSegment(ctx, from, to, color, lineWidth) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.lineCap = "butt";
    }

    function drawTransitionEdges(ctx, projection, tau) {
      const steps = 80;
      for (let i = 0; i < steps; i += 1) {
        const s0 = i / steps;
        const s1 = (i + 1) / steps;
        const bottomA = planePoint(s0, 0, projection);
        const bottomB = planePoint(s1, 0, projection);
        drawColoredSegment(ctx, bottomA, bottomB, "hsl(0, 78%, 48%)", 5);

        const topA = planePoint(s0 + tau.re, tau.im, projection);
        const topB = planePoint(s1 + tau.re, tau.im, projection);
        const hue = hueFromPhase(phaseAt(s0, 1).angle);
        drawColoredSegment(ctx, topA, topB, `hsl(${hue}, 76%, 52%)`, 5);
      }
    }

    function drawPlaneView(ctx, width, height) {
      const view = planeView(width, height);
      const projection = planeProjection(view);
      const tau = state.tau;

      ctx.fillStyle = "#fffdfb";
      ctx.fillRect(view.x, view.y, view.width, view.height);
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.strokeRect(view.x, view.y, view.width, view.height);

      const origin = planePoint(0, 0, projection);
      const one = planePoint(1, 0, projection);
      const tauPoint = planePoint(tau.re, tau.im, projection);
      const sum = planePoint(1 + tau.re, tau.im, projection);
      const selected = planePoint(state.s + state.t * tau.re, state.t * tau.im, projection);

      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(one.x, one.y);
      ctx.lineTo(sum.x, sum.y);
      ctx.lineTo(tauPoint.x, tauPoint.y);
      ctx.closePath();
      ctx.stroke();

      drawTransitionEdges(ctx, projection, tau);

      drawArrow(ctx, origin, one, colors.blue);
      drawArrow(ctx, origin, tauPoint, colors.accent);

      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(selected.x, selected.y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = colors.ink;
      ctx.font = "700 15px Pretendard, sans-serif";
      ctx.fillText("complex plane", view.x + 10, view.y + 22);
      ctx.fillText("bottom edge: phase 0", view.x + 10, view.y + view.height - 14);
      ctx.fillStyle = colors.blue;
      ctx.fillText("1", one.x + 8, one.y + 16);
      ctx.fillStyle = colors.accent;
      ctx.fillText("τ", tauPoint.x + 8, tauPoint.y - 8);
      ctx.fillStyle = colors.ink;
      ctx.fillText("z", selected.x + 8, selected.y - 8);
    }

    function draw() {
      const { ctx, width, height } = setupCanvas();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fffdfb";
      ctx.fillRect(0, 0, width, height);

      const rows = 38;
      const cols = 58;
      const patches = [];
      for (let i = 0; i < cols; i += 1) {
        for (let j = 0; j < rows; j += 1) {
          const s = i / cols;
          const t = j / rows;
          const depth = rotate(torusPoint(s + 0.5 / cols, t + 0.5 / rows)).z;
          patches.push({ s, t, depth });
        }
      }
      patches.sort((a, b) => a.depth - b.depth);
      patches.forEach((patch) => drawPatch(ctx, width, height, patch.s, patch.t, 1 / cols, 1 / rows));

      for (let k = 0; k < 8; k += 1) {
        drawCurve(ctx, width, height, k / 8, true, "rgba(17, 17, 17, 0.18)", 1.2);
        drawCurve(ctx, width, height, k / 8, false, "rgba(17, 17, 17, 0.18)", 1.2);
      }

      drawCurve(ctx, width, height, 0, true, colors.blue, 3);
      drawCurve(ctx, width, height, 0, false, colors.accent, 3);

      const selected = project(torusPoint(state.s, state.t), width, height);
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(selected.x, selected.y, 7, 0, Math.PI * 2);
      ctx.fill();

      drawPlaneView(ctx, width, height);
      drawPhaseLegend(ctx, width, height);
    }

    function render() {
      const phase = phaseAt(state.s, state.t);
      const normalizedPhase = ((phase.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      if (tauReadout) {
        tauReadout.textContent = `τ = ${state.tau.re.toFixed(2)} + ${state.tau.im.toFixed(2)}i`;
      }
      if (tauReOutput) {
        tauReOutput.textContent = state.tau.re.toFixed(2);
      }
      if (tauImOutput) {
        tauImOutput.textContent = state.tau.im.toFixed(2);
      }
      pointReadout.textContent = `z = ${phase.zRe.toFixed(2)} + ${phase.zIm.toFixed(2)}i`;
      phaseReadout.textContent = `arg factor = ${normalizedPhase.toFixed(2)}`;
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

    function nearestParameter(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      let best = { s: state.s, t: state.t, distance: Infinity };
      for (let i = 0; i <= 70; i += 1) {
        for (let j = 0; j <= 44; j += 1) {
          const s = i / 70;
          const t = j / 44;
          const p = project(torusPoint(s, t), rect.width, rect.height);
          const distance = (p.x - x) ** 2 + (p.y - y) ** 2;
          if (distance < best.distance) {
            best = { s, t, distance };
          }
        }
      }
      return best;
    }

    function parameterFromPlane(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const view = planeView(rect.width, rect.height);
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < view.x || x > view.x + view.width || y < view.y || y > view.y + view.height) {
        return null;
      }
      const projection = planeProjection(view);
      const zRe = (x - projection.origin.x) / projection.scale;
      const zIm = (projection.origin.y - y) / projection.scale;
      const t = zIm / state.tau.im;
      const s = zRe - t * state.tau.re;
      return {
        s: Math.max(0, Math.min(1, s)),
        t: Math.max(0, Math.min(1, t)),
      };
    }

    canvas.addEventListener("pointerdown", (event) => {
      const planeParameter = parameterFromPlane(event.clientX, event.clientY);
      const nearest = nearestParameter(event.clientX, event.clientY);
      state.last = { x: event.clientX, y: event.clientY };
      if (planeParameter && !event.shiftKey) {
        state.draggingPoint = true;
        state.s = planeParameter.s;
        state.t = planeParameter.t;
      } else if (event.shiftKey || nearest.distance > 900) {
        state.rotating = true;
      } else {
        state.draggingPoint = true;
        state.s = nearest.s;
        state.t = nearest.t;
      }
      canvas.setPointerCapture(event.pointerId);
      render();
    });

    canvas.addEventListener("pointermove", (event) => {
      if (state.draggingPoint) {
        const planeParameter = parameterFromPlane(event.clientX, event.clientY);
        if (planeParameter) {
          state.s = planeParameter.s;
          state.t = planeParameter.t;
        } else {
          const nearest = nearestParameter(event.clientX, event.clientY);
          state.s = nearest.s;
          state.t = nearest.t;
        }
        render();
      } else if (state.rotating) {
        const dx = event.clientX - state.last.x;
        const dy = event.clientY - state.last.y;
        state.yaw += dx * 0.01;
        state.pitch = Math.max(0.2, Math.min(1.25, state.pitch + dy * 0.006));
        state.last = { x: event.clientX, y: event.clientY };
        render();
      }
    });

    canvas.addEventListener("pointerup", () => {
      state.draggingPoint = false;
      state.rotating = false;
    });

    canvas.addEventListener("pointercancel", () => {
      state.draggingPoint = false;
      state.rotating = false;
    });

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
    document.querySelectorAll("[data-complex-line-bundle-demo]").forEach(initComplexLineBundleDemo);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
