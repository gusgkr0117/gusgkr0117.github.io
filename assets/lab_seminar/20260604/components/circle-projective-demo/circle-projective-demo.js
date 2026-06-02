(() => {
  function initCircleProjectiveDemo(root) {
    const circleCanvas = root.querySelector("[data-circle-canvas]");
    const graphCanvas = root.querySelector("[data-graph-canvas]");
    const tReadout = root.querySelector("[data-t-readout]");
    const cosReadout = root.querySelector("[data-cos-readout]");
    const sinReadout = root.querySelector("[data-sin-readout]");
    const pointReadout = root.querySelector("[data-point-readout]");

    if (!circleCanvas || !graphCanvas || !tReadout || !cosReadout || !sinReadout || !pointReadout) {
      return;
    }

    const state = {
      t: Number(root.dataset.initialT || 0.85),
      dragging: false,
    };

    const colors = {
      ink: "#111111",
      accent: "#9b002a",
      grid: "#e3e0dd",
      blue: "#1f6f8b",
      muted: "#6d747a",
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

    function pointOnCircle(width, height) {
      const radius = Math.min(width, height) * 0.34;
      const center = { x: width * 0.5, y: height * 0.52 };
      return {
        center,
        radius,
        point: {
          x: center.x + radius * Math.cos(state.t),
          y: center.y - radius * Math.sin(state.t),
        },
      };
    }

    function drawCircle() {
      const { ctx, width, height } = setupCanvas(circleCanvas);
      const { center, radius, point } = pointOnCircle(width, height);
      const cosValue = Math.cos(state.t);
      const sinValue = Math.sin(state.t);

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(center.x - radius - 34, center.y);
      ctx.lineTo(center.x + radius + 34, center.y);
      ctx.moveTo(center.x, center.y - radius - 34);
      ctx.lineTo(center.x, center.y + radius + 34);
      ctx.stroke();

      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = colors.blue;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(point.x, center.y);
      ctx.stroke();

      ctx.strokeStyle = colors.accent;
      ctx.beginPath();
      ctx.moveTo(point.x, center.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      ctx.strokeStyle = colors.muted;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = colors.blue;
      ctx.font = "700 18px Pretendard, sans-serif";
      ctx.fillText("cos t", (center.x + point.x) / 2 - 22, center.y + 26);
      ctx.fillStyle = colors.accent;
      ctx.fillText("sin t", point.x + 12, (center.y + point.y) / 2);

      ctx.fillStyle = colors.ink;
      ctx.font = "700 18px Pretendard, sans-serif";
      ctx.fillText(`(${cosValue.toFixed(2)}, ${sinValue.toFixed(2)})`, point.x + 12, point.y - 12);
    }

    function drawGraphCurve(ctx, width, height, fn, color) {
      const left = width * 0.1;
      const right = width * 0.94;
      const midY = height * 0.5;
      const amp = height * 0.32;

      ctx.beginPath();
      for (let i = 0; i <= 240; i += 1) {
        const ratio = i / 240;
        const t = ratio * Math.PI * 2;
        const x = left + ratio * (right - left);
        const y = midY - fn(t) * amp;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    function drawGraphs() {
      const { ctx, width, height } = setupCanvas(graphCanvas);
      const left = width * 0.1;
      const right = width * 0.94;
      const midY = height * 0.5;
      const amp = height * 0.32;
      const normalizedT = ((state.t % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const markerX = left + (normalizedT / (Math.PI * 2)) * (right - left);
      const cosY = midY - Math.cos(normalizedT) * amp;
      const sinY = midY - Math.sin(normalizedT) * amp;

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1.2;
      for (let i = 0; i <= 4; i += 1) {
        const y = midY - amp + (i / 4) * amp * 2;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
      }
      ctx.strokeStyle = "#b9b2ae";
      ctx.beginPath();
      ctx.moveTo(left, midY);
      ctx.lineTo(right, midY);
      ctx.stroke();

      drawGraphCurve(ctx, width, height, Math.cos, colors.blue);
      drawGraphCurve(ctx, width, height, Math.sin, colors.accent);

      ctx.strokeStyle = colors.ink;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(markerX, height * 0.12);
      ctx.lineTo(markerX, height * 0.88);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = colors.blue;
      ctx.beginPath();
      ctx.arc(markerX, cosY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(markerX, sinY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "700 17px Pretendard, sans-serif";
      ctx.fillStyle = colors.blue;
      ctx.fillText("cos t", left, height * 0.12);
      ctx.fillStyle = colors.accent;
      ctx.fillText("sin t", left + 76, height * 0.12);
      ctx.fillStyle = colors.ink;
      ctx.fillText("0", left - 16, midY + 6);
      ctx.fillText("2π", right - 12, midY + 26);
    }

    function render() {
      const normalizedT = ((state.t % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const cosValue = Math.cos(normalizedT);
      const sinValue = Math.sin(normalizedT);
      tReadout.textContent = `t = ${normalizedT.toFixed(2)}`;
      cosReadout.textContent = `cos t = ${cosValue.toFixed(2)}`;
      sinReadout.textContent = `sin t = ${sinValue.toFixed(2)}`;
      pointReadout.textContent = `[1 : ${cosValue.toFixed(2)} : ${sinValue.toFixed(2)}]`;
      drawCircle();
      drawGraphs();
    }

    function setTFromEvent(event) {
      const rect = circleCanvas.getBoundingClientRect();
      const { center } = pointOnCircle(rect.width, rect.height);
      const x = event.clientX - rect.left - center.x;
      const y = center.y - (event.clientY - rect.top);
      state.t = Math.atan2(y, x);
      render();
    }

    circleCanvas.addEventListener("pointerdown", (event) => {
      state.dragging = true;
      circleCanvas.setPointerCapture(event.pointerId);
      setTFromEvent(event);
    });

    circleCanvas.addEventListener("pointermove", (event) => {
      if (state.dragging) {
        setTFromEvent(event);
      }
    });

    circleCanvas.addEventListener("pointerup", () => {
      state.dragging = false;
    });

    circleCanvas.addEventListener("pointercancel", () => {
      state.dragging = false;
    });

    window.addEventListener("resize", render);
    render();
  }

  function initAll() {
    document.querySelectorAll("[data-circle-projective-demo]").forEach(initCircleProjectiveDemo);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
