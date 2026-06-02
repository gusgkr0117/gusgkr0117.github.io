(() => {
  function initSlide3Carousel(root) {
    const prev = root.querySelector("[data-slide3-prev]");
    const next = root.querySelector("[data-slide3-next]");

    if (!prev || !next) {
      return;
    }

    function setPage(page) {
      root.dataset.activePage = page;
    }

    prev.addEventListener("click", () => setPage("interactive"));
    next.addEventListener("click", () => {
      setPage(root.dataset.activePage === "video" ? "interactive" : "video");
    });
    setPage(root.dataset.activePage || "interactive");
  }

  function initLatticeTorusDemo(root) {
    const latticeCanvas = root.querySelector("[data-lattice-canvas]");
    const torusCanvas = root.querySelector("[data-torus-canvas]");
    const tauReadout = root.querySelector("[data-tau-readout]");

    if (!latticeCanvas || !torusCanvas || !tauReadout) {
      return;
    }

    const state = {
      tau: {
        re: Number(root.dataset.initialTauRe || 0.5),
        im: Number(root.dataset.initialTauIm || 1.3),
      },
      dragging: false,
    };

    const colors = {
      ink: "#111111",
      accent: "#9b002a",
      grid: "#e3e0dd",
      fill: "rgba(155, 0, 42, 0.10)",
      blue: "#1f6f8b",
    };

    function setupCanvas(canvas) {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, width: rect.width, height: rect.height };
    }

    function latticeProjection(width, height) {
      const scale = Math.min(width / 6.2, height / 5.1);
      return {
        scale,
        origin: { x: width * 0.43, y: height * 0.62 },
      };
    }

    function toScreen(z, projection) {
      return {
        x: projection.origin.x + z.re * projection.scale,
        y: projection.origin.y - z.im * projection.scale,
      };
    }

    function fromScreen(point, projection) {
      return {
        re: (point.x - projection.origin.x) / projection.scale,
        im: (projection.origin.y - point.y) / projection.scale,
      };
    }

    function drawArrow(ctx, from, to, color, label) {
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const size = 10;
      ctx.save();
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
      ctx.font = "700 18px Pretendard, sans-serif";
      ctx.fillText(label, to.x + 10, to.y - 10);
      ctx.restore();
    }

    function drawLattice() {
      const { ctx, width, height } = setupCanvas(latticeCanvas);
      const projection = latticeProjection(width, height);
      const one = { re: 1, im: 0 };
      const tau = state.tau;
      const origin = toScreen({ re: 0, im: 0 }, projection);
      const onePoint = toScreen(one, projection);
      const tauPoint = toScreen(tau, projection);
      const sumPoint = toScreen({ re: one.re + tau.re, im: one.im + tau.im }, projection);

      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      for (let x = Math.floor(-projection.origin.x / projection.scale) - 1; x < 5; x += 0.5) {
        const p = toScreen({ re: x, im: 0 }, projection);
        ctx.beginPath();
        ctx.moveTo(p.x, 0);
        ctx.lineTo(p.x, height);
        ctx.stroke();
      }
      for (let y = -1; y < 5; y += 0.5) {
        const p = toScreen({ re: 0, im: y }, projection);
        ctx.beginPath();
        ctx.moveTo(0, p.y);
        ctx.lineTo(width, p.y);
        ctx.stroke();
      }

      ctx.strokeStyle = "#b9b2ae";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, origin.y);
      ctx.lineTo(width, origin.y);
      ctx.moveTo(origin.x, 0);
      ctx.lineTo(origin.x, height);
      ctx.stroke();

      ctx.fillStyle = colors.fill;
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(onePoint.x, onePoint.y);
      ctx.lineTo(sumPoint.x, sumPoint.y);
      ctx.lineTo(tauPoint.x, tauPoint.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      for (let m = -5; m <= 5; m += 1) {
        for (let n = -3; n <= 4; n += 1) {
          const z = { re: m + n * tau.re, im: n * tau.im };
          const p = toScreen(z, projection);
          if (p.x < -12 || p.x > width + 12 || p.y < -12 || p.y > height + 12) {
            continue;
          }
          ctx.beginPath();
          ctx.fillStyle = n === 0 && m === 0 ? colors.accent : colors.ink;
          ctx.arc(p.x, p.y, n === 0 && m === 0 ? 4.5 : 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      drawArrow(ctx, origin, onePoint, colors.blue, "1");
      drawArrow(ctx, origin, tauPoint, colors.accent, "τ");

      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(tauPoint.x, tauPoint.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    function projectTorus(u, v, width, height) {
      const R = Math.min(width, height) * 0.25;
      const r = Math.min(width, height) * 0.095;
      const x3 = (R + r * Math.cos(v)) * Math.cos(u);
      const y3 = (R + r * Math.cos(v)) * Math.sin(u);
      const z3 = r * Math.sin(v);
      const tilt = 0.58;
      return {
        x: width / 2 + x3,
        y: height * 0.46 + y3 * tilt - z3,
      };
    }

    function drawCoefficientCurve(ctx, width, height, coordinateAt, color, widthLine) {
      ctx.beginPath();
      for (let i = 0; i <= 220; i += 1) {
        const q = i / 220;
        const coordinate = coordinateAt(q);
        const point = projectTorus(
          coordinate.s * Math.PI * 2,
          coordinate.t * Math.PI * 2,
          width,
          height
        );
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = widthLine;
      ctx.stroke();
    }

    function drawComplexGridOnTorus(ctx, width, height, tau) {
      const xMin = Math.min(0, tau.re);
      const xMax = 1 + Math.max(0, tau.re);
      const realStep = 0.125;
      const imagStep = 0.125;

      for (let x = Math.ceil(xMin / realStep) * realStep; x <= xMax + 0.001; x += realStep) {
        drawCoefficientCurve(
          ctx,
          width,
          height,
          (q) => {
            const y = q * tau.im;
            const t = y / tau.im;
            return { s: x - t * tau.re, t };
          },
          "rgba(155, 0, 42, 0.30)",
          Math.abs(x - Math.round(x)) < 0.01 ? 2.1 : 1.1
        );
      }

      for (let y = 0; y <= tau.im + 0.001; y += imagStep) {
        const t = y / tau.im;
        drawCoefficientCurve(
          ctx,
          width,
          height,
          (q) => {
            const x = xMin + q * (xMax - xMin);
            return { s: x - t * tau.re, t };
          },
          "rgba(31, 111, 139, 0.30)",
          Math.abs(y - Math.round(y)) < 0.01 ? 2.1 : 1.1
        );
      }

      drawCoefficientCurve(ctx, width, height, (q) => ({ s: q, t: 0 }), colors.blue, 3.2);
      drawCoefficientCurve(ctx, width, height, (q) => ({ s: 0, t: q }), colors.accent, 3.2);
    }

    function drawTorus() {
      const { ctx, width, height } = setupCanvas(torusCanvas);
      const tau = state.tau;
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#fffdfb";
      ctx.fillRect(0, 0, width, height);

      drawComplexGridOnTorus(ctx, width, height, tau);
    }

    function render() {
      tauReadout.textContent = `τ = ${state.tau.re.toFixed(2)} + ${state.tau.im.toFixed(2)}i`;
      drawLattice();
      drawTorus();
    }

    function setTauFromEvent(event) {
      const rect = latticeCanvas.getBoundingClientRect();
      const projection = latticeProjection(rect.width, rect.height);
      const point = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      const value = fromScreen(point, projection);
      state.tau.re = Math.max(-2.1, Math.min(2.1, value.re));
      state.tau.im = Math.max(0.35, Math.min(2.9, value.im));
      render();
    }

    latticeCanvas.addEventListener("pointerdown", (event) => {
      state.dragging = true;
      latticeCanvas.setPointerCapture(event.pointerId);
      setTauFromEvent(event);
    });

    latticeCanvas.addEventListener("pointermove", (event) => {
      if (state.dragging) {
        setTauFromEvent(event);
      }
    });

    latticeCanvas.addEventListener("pointerup", () => {
      state.dragging = false;
    });

    latticeCanvas.addEventListener("pointercancel", () => {
      state.dragging = false;
    });

    window.addEventListener("resize", render);
    render();
  }

  function initAll() {
    document.querySelectorAll("[data-slide3-carousel]").forEach(initSlide3Carousel);
    document.querySelectorAll("[data-lattice-demo]").forEach(initLatticeTorusDemo);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
