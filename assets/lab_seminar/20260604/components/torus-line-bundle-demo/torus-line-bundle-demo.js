(() => {
  const THREE_MODULE_URL = "https://unpkg.com/three@0.160.0/build/three.module.js";

  function initSlide10Carousel(root) {
    const prev = root.querySelector("[data-slide10-prev]");
    const next = root.querySelector("[data-slide10-next]");

    if (!prev || !next) {
      return;
    }

    function setPage(page) {
      const activeIndex = page === "demo" ? 1 : 0;
      root.dataset.activePage = page;
      root.querySelectorAll(".slide10-page").forEach((pageElement, index) => {
        const isActive = index === activeIndex;
        if ("inert" in pageElement) {
          pageElement.inert = !isActive;
        }
        pageElement.setAttribute("aria-hidden", isActive ? "false" : "true");
      });
    }

    prev.addEventListener("click", () => setPage("definition"));
    next.addEventListener("click", () => setPage("demo"));
    setPage(root.dataset.activePage || "definition");
  }

  function initTorusLineBundleDemo(root) {
    const canvas = root.querySelector("[data-torus-line-canvas]");
    const coordinateReadout = root.querySelector("[data-torus-coordinate]");
    const scaleReadout = root.querySelector("[data-torus-scale]");
    const statusReadout = root.querySelector("[data-torus-status]");

    if (!canvas || !coordinateReadout || !scaleReadout) {
      return;
    }

    const state = {
      lambda: Number(root.dataset.lambda || 0.55),
      cell: 7,
      position: { x: 0, z: 0 },
      yaw: 0,
      pitch: -0.08,
      keys: new Set(),
      dragging: false,
      lastPointer: { x: 0, y: 0 },
      lastTime: performance.now(),
      animationFrame: 0,
    };

    function setStatus(message) {
      if (statusReadout) {
        statusReadout.textContent = message;
      }
    }

    function latticeCoordinate() {
      return {
        m: Math.round(state.position.x / state.cell),
        n: Math.round(-state.position.z / state.cell),
      };
    }

    function updateReadouts() {
      const coordinate = latticeCoordinate();
      coordinateReadout.textContent = `(m, n) = (${coordinate.m}, ${coordinate.n})`;
      scaleReadout.textContent = `e^{-nλ} = ${Math.exp(-coordinate.n * state.lambda).toFixed(2)}`;
    }

    function moveByGrid(direction) {
      const forward = viewForward(state.yaw);
      const right = viewRight(state.yaw);

      if (direction === "left") {
        state.position.x -= right.x * state.cell;
        state.position.z -= right.z * state.cell;
      } else if (direction === "right") {
        state.position.x += right.x * state.cell;
        state.position.z += right.z * state.cell;
      } else if (direction === "forward") {
        state.position.x += forward.x * state.cell;
        state.position.z += forward.z * state.cell;
      } else if (direction === "back") {
        state.position.x -= forward.x * state.cell;
        state.position.z -= forward.z * state.cell;
      } else if (direction === "reset") {
        state.position.x = 0;
        state.position.z = 0;
        state.yaw = 0;
        state.pitch = -0.08;
      }
      updateReadouts();
    }

    root.querySelectorAll("[data-torus-move]").forEach((button) => {
      button.addEventListener("click", () => {
        root.focus({ preventScroll: true });
        moveByGrid(button.dataset.torusMove);
      });
    });

    root.addEventListener("keydown", (event) => {
      const handledKeys = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "a", "s", "d", "W", "A", "S", "D"]);
      if (!handledKeys.has(event.key)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      state.keys.add(event.key.toLowerCase());
    });

    root.addEventListener("keyup", (event) => {
      state.keys.delete(event.key.toLowerCase());
    });

    canvas.addEventListener("pointerdown", (event) => {
      root.focus({ preventScroll: true });
      state.dragging = true;
      state.lastPointer.x = event.clientX;
      state.lastPointer.y = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!state.dragging) {
        return;
      }
      const dx = event.clientX - state.lastPointer.x;
      const dy = event.clientY - state.lastPointer.y;
      state.lastPointer.x = event.clientX;
      state.lastPointer.y = event.clientY;
      state.yaw -= dx * 0.006;
      state.pitch = Math.max(-0.9, Math.min(0.45, state.pitch - dy * 0.004));
    });

    canvas.addEventListener("pointerup", (event) => {
      state.dragging = false;
      canvas.releasePointerCapture(event.pointerId);
    });

    import(THREE_MODULE_URL)
      .then((module) => initThreeScene(module, root, canvas, state, updateReadouts, setStatus))
      .catch(() => {
        const context = canvas.getContext("2d");
        context.fillStyle = "#fffdfb";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#9b002a";
        context.font = "700 18px Pretendard, sans-serif";
        context.fillText("Three.js could not be loaded.", 24, 44);
        context.fillStyle = "#111111";
        context.font = "500 15px Pretendard, sans-serif";
        context.fillText("Check network access or vendor Three.js locally for offline presentation.", 24, 72);
        setStatus("Three.js load failed");
      });

    updateReadouts();
    setStatus("Loading 3D scene...");
  }

  function initThreeScene(THREE, root, canvas, state, updateReadouts, setStatus) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0xfffdfb, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xfffdfb, 24, 76);

    const camera = new THREE.PerspectiveCamera(68, 1, 0.1, 110);
    const cameraHeight = 1.8;

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d0c8, 1.9));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
    keyLight.position.set(8, 12, 6);
    scene.add(keyLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshStandardMaterial({ color: 0xf7f3ee, roughness: 0.92, metalness: 0 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    scene.add(floor);

    const grid = new THREE.GridHelper(112, 32, 0x9b002a, 0xded9d5);
    grid.material.opacity = 0.48;
    grid.material.transparent = true;
    scene.add(grid);

    const forwardArrow = makeArrow(THREE, 0x9b002a, "forward");
    forwardArrow.position.set(-7.8, 0.02, -11);
    scene.add(forwardArrow);

    const rightArrow = makeArrow(THREE, 0x1f6f8b, "right");
    rightArrow.rotation.y = -Math.PI / 2;
    rightArrow.position.set(7.8, 0.03, 3.2);
    scene.add(rightArrow);

    const copies = [];
    for (let dz = -4; dz <= 4; dz += 1) {
      for (let dx = -4; dx <= 4; dx += 1) {
        const human = makeHuman(THREE, dx === 0 && dz === 0);
        scene.add(human);
        copies.push({ dx, dz, human });
      }
    }

    function resizeRenderer() {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function updateCamera(deltaSeconds) {
      const speed = 6.2 * deltaSeconds;
      const forwardDirection = viewForward(state.yaw);
      const rightDirection = viewRight(state.yaw);
      const forward = new THREE.Vector3(forwardDirection.x, 0, forwardDirection.z);
      const right = new THREE.Vector3(rightDirection.x, 0, rightDirection.z);

      if (state.keys.has("w") || state.keys.has("arrowup")) {
        state.position.x += forward.x * speed;
        state.position.z += forward.z * speed;
      }
      if (state.keys.has("s") || state.keys.has("arrowdown")) {
        state.position.x -= forward.x * speed;
        state.position.z -= forward.z * speed;
      }
      if (state.keys.has("a") || state.keys.has("arrowleft")) {
        state.position.x -= right.x * speed;
        state.position.z -= right.z * speed;
      }
      if (state.keys.has("d") || state.keys.has("arrowright")) {
        state.position.x += right.x * speed;
        state.position.z += right.z * speed;
      }

      camera.position.set(state.position.x, cameraHeight, state.position.z);
      camera.rotation.order = "YXZ";
      camera.rotation.y = state.yaw;
      camera.rotation.x = state.pitch;
    }

    function updateCopies() {
      copies.forEach((copy) => {
        const scale = Math.max(0.22, Math.min(2.6, Math.exp(-copy.dz * state.lambda)));
        copy.human.position.set(
          state.position.x + copy.dx * state.cell,
          0,
          state.position.z - copy.dz * state.cell
        );
        copy.human.scale.setScalar(scale);
        copy.human.lookAt(camera.position.x, 0, camera.position.z);
        copy.human.visible = !(copy.dx === 0 && copy.dz === 0);
      });
    }

    function tick(now) {
      const deltaSeconds = Math.min(0.05, (now - state.lastTime) / 1000);
      state.lastTime = now;
      resizeRenderer();
      updateCamera(deltaSeconds);
      updateCopies();
      updateReadouts();
      renderer.render(scene, camera);
      state.animationFrame = window.requestAnimationFrame(tick);
    }

    root.addEventListener("blur", () => state.keys.clear());
    window.addEventListener("resize", resizeRenderer);
    state.animationFrame = window.requestAnimationFrame(tick);
    setStatus("Drag view. Walk with W/A/S/D or arrow keys.");
  }

  function makeArrow(THREE, color) {
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color });
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 5.2), material);
    shaft.position.z = -2.1;
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.48, 1.2, 4), material);
    head.rotation.x = -Math.PI / 2;
    head.position.z = -5.0;
    group.add(shaft, head);
    return group;
  }

  function viewForward(yaw) {
    return {
      x: -Math.sin(yaw),
      z: -Math.cos(yaw),
    };
  }

  function viewRight(yaw) {
    return {
      x: Math.cos(yaw),
      z: -Math.sin(yaw),
    };
  }

  function makeHuman(THREE, central) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      color: central ? 0x9b002a : 0x202326,
      roughness: 0.7,
      metalness: 0,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: central ? 0xffffff : 0x9b002a,
      roughness: 0.8,
      metalness: 0,
    });

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), material);
    head.position.y = 1.48;
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.58, 4, 8), material);
    torso.position.y = 0.96;
    const leftArm = limb(THREE, material, -0.34, 1.02, 0.45);
    const rightArm = limb(THREE, material, 0.34, 1.02, -0.45);
    const leftLeg = limb(THREE, material, -0.13, 0.38, -0.08);
    const rightLeg = limb(THREE, material, 0.13, 0.38, 0.08);
    const marker = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.025, 8, 28), accent);
    marker.rotation.x = Math.PI / 2;
    marker.position.y = 0.04;

    group.add(head, torso, leftArm, rightArm, leftLeg, rightLeg, marker);
    return group;
  }

  function limb(THREE, material, x, y, rotationZ) {
    const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.44, 4, 8), material);
    mesh.position.set(x, y, 0);
    mesh.rotation.z = rotationZ;
    return mesh;
  }

  document.querySelectorAll("[data-slide10-carousel]").forEach(initSlide10Carousel);
  document.querySelectorAll("[data-torus-line-bundle-demo]").forEach(initTorusLineBundleDemo);
})();
