(() => {
  function initMobiusDemo(root) {
    const canvas = root.querySelector("[data-mobius-canvas]");
    const angleReadout = root.querySelector("[data-mobius-angle]");
    const fiberReadout = root.querySelector("[data-mobius-fiber]");

    if (!canvas || !angleReadout) {
      return;
    }

    const state = {
      t: Number(root.dataset.initialT || 0.9),
      dragging: false,
    };

    const colors = {
      ink: "#111111",
      accent: "#9b002a",
      blue: "#1f6f8b",
      grid: "#e3e0dd",
      paleAccent: "rgba(155, 0, 42, 0.13)",
      paleBlue: "rgba(31, 111, 139, 0.20)",
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

    function baseCircle(width, height) {
      return {
        center: { x: width * 0.28, y: height * 0.52 },
        radius: Math.min(width, height) * 0.25,
      };
    }

    function basePoint(width, height) {
      const circle = baseCircle(width, height);
      return {
        circle,
        point: {
          x: circle.center.x + circle.radius * Math.cos(state.t),
          y: circle.center.y - circle.radius * Math.sin(state.t),
        },
      };
    }

    function mobiusPoint(u, v, width, height) {
      const cx = width * 0.69;
      const cy = height * 0.52;
      const rx = Math.min(width, height) * 0.24;
      const ry = Math.min(width, height) * 0.13;
      const twist = Math.cos(u / 2);
      const lift = Math.sin(u / 2);
      return {
        x: cx + (rx + v * 42 * twist) * Math.cos(u),
        y: cy + (ry + v * 18 * twist) * Math.sin(u) - v * 52 * lift,
      };
    }

    function drawMobiusBand(ctx, width, height) {
      const steps = 150;
      for (let i = 0; i < steps; i += 1) {
        const u0 = (i / steps) * Math.PI * 2;
        const u1 = ((i + 1) / steps) * Math.PI * 2;
        const a = mobiusPoint(u0, -1, width, height);
        const b = mobiusPoint(u1, -1, width, height);
        const c = mobiusPoint(u1, 1, width, height);
        const d = mobiusPoint(u0, 1, width, height);
        const shade = 245 - Math.round(28 * Math.cos(u0));
        ctx.fillStyle = i % 2 === 0 ? `rgb(${shade}, ${232}, ${238})` : "#ffffff";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(d.x, d.y);
        ctx.closePath();
        ctx.fill();
      }

      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 2.8;
      [-1, 1].forEach((v) => {
        ctx.beginPath();
        for (let i = 0; i <= steps; i += 1) {
          const p = mobiusPoint((i / steps) * Math.PI * 2, v, width, height);
          if (i === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      });

      ctx.strokeStyle = colors.blue;
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 6]);
      ctx.beginPath();
      for (let i = 0; i <= steps; i += 1) {
        const p = mobiusPoint((i / steps) * Math.PI * 2, 0, width, height);
        if (i === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function draw() {
      const { ctx, width, height } = setupCanvas();
      const { circle, point } = basePoint(width, height);
      const fiberAngle = state.t / 2;
      const dir = {
        x: Math.cos(fiberAngle),
        y: -Math.sin(fiberAngle),
      };
      const fiberHalf = Math.min(width, height) * 0.13;

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#fffdfb";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width * 0.5, height * 0.12);
      ctx.lineTo(width * 0.5, height * 0.88);
      ctx.stroke();

      drawMobiusBand(ctx, width, height);

      const mobiusCenter = mobiusPoint(state.t, 0, width, height);
      const mobiusA = mobiusPoint(state.t, -1.15, width, height);
      const mobiusB = mobiusPoint(state.t, 1.15, width, height);
      ctx.strokeStyle = colors.blue;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(mobiusA.x, mobiusA.y);
      ctx.lineTo(mobiusB.x, mobiusB.y);
      ctx.stroke();
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(mobiusCenter.x, mobiusCenter.y, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(circle.center.x, circle.center.y, circle.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = colors.blue;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(point.x - dir.x * fiberHalf, point.y - dir.y * fiberHalf);
      ctx.lineTo(point.x + dir.x * fiberHalf, point.y + dir.y * fiberHalf);
      ctx.stroke();

      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = colors.ink;
      ctx.font = "700 18px Pretendard, sans-serif";
      ctx.fillText("base S1", circle.center.x - 34, circle.center.y + circle.radius + 34);
      ctx.fillText("Mobius strip", width * 0.6, height * 0.15);
    }

    function render() {
      const normalized = ((state.t % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      angleReadout.textContent = `base angle t = ${normalized.toFixed(2)}`;
      if (fiberReadout) {
        fiberReadout.textContent = `fiber direction angle = t / 2 = ${(normalized / 2).toFixed(2)}`;
      }
      draw();
    }

    function setTFromEvent(event) {
      const rect = canvas.getBoundingClientRect();
      const { circle } = basePoint(rect.width, rect.height);
      const x = event.clientX - rect.left - circle.center.x;
      const y = circle.center.y - (event.clientY - rect.top);
      state.t = Math.atan2(y, x);
      render();
    }

    canvas.addEventListener("pointerdown", (event) => {
      state.dragging = true;
      canvas.setPointerCapture(event.pointerId);
      setTFromEvent(event);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (state.dragging) {
        setTFromEvent(event);
      }
    });

    canvas.addEventListener("pointerup", () => {
      state.dragging = false;
    });

    canvas.addEventListener("pointercancel", () => {
      state.dragging = false;
    });

    window.addEventListener("resize", render);
    render();
  }

  function initAll() {
    document.querySelectorAll("[data-mobius-line-bundle-demo]").forEach(initMobiusDemo);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
