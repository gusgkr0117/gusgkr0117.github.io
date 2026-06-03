(() => {
  function initFloatingThanks(root) {
    const canvas = root.querySelector("[data-floating-thanks-canvas]");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const text = root.dataset.text || "Thank you";
    const letters = [];
    const pointer = { x: 0, y: 0, active: false };
    const isCoarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    let width = 0;
    let height = 0;
    let scale = 1;
    let lastTime = performance.now();
    let startTime = performance.now();
    let hasDropped = false;
    let isVisible = false;
    let frameId = null;

    function random(min, max) {
      return min + Math.random() * (max - min);
    }

    function setInitialRope(letter) {
      letter.nodes.length = 0;
      for (let i = 0; i <= letter.segmentCount; i += 1) {
        const t = i / letter.segmentCount;
        const bend = Math.sin(t * Math.PI) * letter.initialBend;
        const theta = letter.initialTheta + bend;
        const length = letter.segmentLength * i;
        const x = letter.anchorX + Math.sin(theta) * length;
        const y = letter.anchorY + Math.cos(theta) * length;
        letter.nodes.push({ x, y, oldX: x, oldY: y });
      }
      const end = letter.nodes[letter.nodes.length - 1];
      letter.x = end.x;
      letter.y = end.y;
      letter.angle = letter.initialTheta * 0.42;
    }

    function resetLetters() {
      letters.length = 0;
      const chars = Array.from(text);
      const fontSize = Math.max(58, Math.min(124, width / 9.5));
      ctx.font = `800 ${fontSize}px Pretendard, sans-serif`;
      const widths = chars.map((char) => ctx.measureText(char === " " ? " " : char).width);
      const letterGap = fontSize * 0.03;
      const totalWidth = widths.reduce((sum, next) => sum + next, 0) + letterGap * (chars.length - 1);
      let cursor = width / 2 - totalWidth / 2;

      chars.forEach((char, index) => {
        const charWidth = widths[index];
        const anchorX = cursor + charWidth / 2;
        const anchorY = Math.max(18, height * 0.035);
        const targetLength = height * 0.52 + Math.sin(index * 0.8) * fontSize * 0.08;
        const segmentCount = 8;
        cursor += charWidth + letterGap;
        const letter = {
          char,
          x: anchorX,
          y: anchorY + fontSize * 0.34,
          anchorX,
          anchorY,
          targetLength,
          segmentCount,
          segmentLength: targetLength / segmentCount,
          nodes: [],
          angle: 0,
          initialTheta: random(-0.42, 0.42),
          initialBend: random(-0.2, 0.2),
          dropDelay: index * 0.07,
          size: char === " " ? fontSize * 0.55 : fontSize,
          mass: char === " " ? 1.6 : 1,
        };
        setInitialRope(letter);
        letters.push(letter);
      });
    }

    function resize() {
      scale = isCoarsePointer ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      const rect = root.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      resetLetters();
    }

    function drawBackground() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(155, 0, 42, 0.11)";
      ctx.lineWidth = 1.4;
      const gap = Math.max(42, Math.min(70, width / 18));
      for (let x = -gap; x < width + gap; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + height * 0.3, height);
        ctx.stroke();
      }
    }

    function updateLetter(letter, dt, elapsed) {
      if (!hasDropped) {
        setInitialRope(letter);
        return;
      }

      const localTime = elapsed - startTime / 1000 - letter.dropDelay;
      if (localTime < 0) {
        setInitialRope(letter);
        return;
      }

      const nodes = letter.nodes;
      const gravity = 2100;
      nodes[0].x = letter.anchorX;
      nodes[0].y = letter.anchorY;
      nodes[0].oldX = letter.anchorX;
      nodes[0].oldY = letter.anchorY;

      for (let i = 1; i < nodes.length; i += 1) {
        const node = nodes[i];
        const vx = (node.x - node.oldX) * 0.985;
        const vy = (node.y - node.oldY) * 0.985;
        node.oldX = node.x;
        node.oldY = node.y;
        node.x += vx;
        node.y += vy + gravity * dt * dt;

        if (pointer.active) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          const radius = Math.max(80, letter.size * 1.28);
          if (distSq < radius * radius && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / radius) * 5200 * dt * dt / letter.mass;
            node.x += (dx / dist) * force;
            node.y += (dy / dist) * force;
          }
        }
      }

      const iterations = isCoarsePointer ? 5 : 9;
      for (let iteration = 0; iteration < iterations; iteration += 1) {
        nodes[0].x = letter.anchorX;
        nodes[0].y = letter.anchorY;
        for (let i = 0; i < nodes.length - 1; i += 1) {
          const a = nodes[i];
          const b = nodes[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const difference = (distance - letter.segmentLength) / distance;
          const correctionX = dx * difference;
          const correctionY = dy * difference;
          if (i === 0) {
            b.x -= correctionX;
            b.y -= correctionY;
          } else {
            a.x += correctionX * 0.5;
            a.y += correctionY * 0.5;
            b.x -= correctionX * 0.5;
            b.y -= correctionY * 0.5;
          }
        }
      }

      const end = nodes[nodes.length - 1];
      const prev = nodes[nodes.length - 2];
      letter.x = end.x;
      letter.y = end.y;
      letter.angle = Math.atan2(end.x - prev.x, end.y - prev.y) * 0.42;
    }

    function drawLetter(letter) {
      if (letter.char === " ") return;
      ctx.save();
      ctx.translate(letter.x, letter.y);
      ctx.rotate(letter.angle);
      ctx.font = `800 ${letter.size}px Pretendard, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = isCoarsePointer ? "transparent" : "rgba(0, 0, 0, 0.15)";
      ctx.shadowBlur = isCoarsePointer ? 0 : 18;
      ctx.shadowOffsetY = isCoarsePointer ? 0 : 8;
      ctx.fillStyle = "#9b002a";
      ctx.fillText(letter.char, 0, 0);
      ctx.restore();
    }

    function frame(now) {
      if (!isVisible) {
        frameId = null;
        return;
      }
      const dt = Math.min(0.033, (now - lastTime) / 1000 || 0.016);
      lastTime = now;
      const elapsed = now / 1000;
      drawBackground();
      letters.forEach((letter) => updateLetter(letter, dt, elapsed));
      letters.forEach(drawLetter);
      frameId = requestAnimationFrame(frame);
    }

    function startAnimation() {
      if (frameId !== null) {
        return;
      }
      lastTime = performance.now();
      frameId = requestAnimationFrame(frame);
    }

    root.addEventListener("pointermove", (event) => {
      const rect = root.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    });

    root.addEventListener("pointerdown", (event) => {
      const rect = root.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    });

    root.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    window.addEventListener("resize", resize);
    resize();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6 && !hasDropped) {
          hasDropped = true;
          startTime = performance.now();
        }
        if (isVisible) {
          startAnimation();
        }
      });
    }, { threshold: [0, 0.6, 1] });
    observer.observe(root);
  }

  document.querySelectorAll("[data-floating-thanks-demo]").forEach(initFloatingThanks);
})();
