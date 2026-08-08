(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || typeof THREE === "undefined") {
    canvas.style.display = "none";
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.z = 460;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const isSmall = window.innerWidth < 700;
  const PARTICLE_COUNT = isSmall ? 70 : 130;
  const RANGE = 900;
  const CONNECT_DIST = 130;
  const MAX_CONNECTIONS = isSmall ? 260 : 480;

  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * RANGE;
    positions[i * 3 + 1] = (Math.random() - 0.5) * RANGE;
    positions[i * 3 + 2] = (Math.random() - 0.5) * RANGE;
    velocities.push({
      x: (Math.random() - 0.5) * 0.14,
      y: (Math.random() - 0.5) * 0.14,
      z: (Math.random() - 0.5) * 0.14,
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x4dffa8,
    size: 2.6,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x2f8f63,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
  });
  const linePositions = new Float32Array(MAX_CONNECTIONS * 2 * 3);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(linePositions, 3)
  );
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("mousemove", function (e) {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  function updateLines() {
    const pos = geometry.attributes.position.array;
    let idx = 0;
    for (let i = 0; i < PARTICLE_COUNT && idx < MAX_CONNECTIONS; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT && idx < MAX_CONNECTIONS; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < CONNECT_DIST) {
          linePositions[idx * 6] = pos[i * 3];
          linePositions[idx * 6 + 1] = pos[i * 3 + 1];
          linePositions[idx * 6 + 2] = pos[i * 3 + 2];
          linePositions[idx * 6 + 3] = pos[j * 3];
          linePositions[idx * 6 + 4] = pos[j * 3 + 1];
          linePositions[idx * 6 + 5] = pos[j * 3 + 2];
          idx++;
        }
      }
    }
    lineGeometry.setDrawRange(0, idx * 2);
    lineGeometry.attributes.position.needsUpdate = true;
  }

  let frame = 0;

  function animate() {
    requestAnimationFrame(animate);
    frame++;

    const pos = geometry.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;
      for (let a = 0; a < 3; a++) {
        const v = pos[i * 3 + a];
        const half = RANGE / 2;
        if (v > half) pos[i * 3 + a] = -half;
        if (v < -half) pos[i * 3 + a] = half;
      }
    }
    geometry.attributes.position.needsUpdate = true;

    // Recomputing every frame is fine at this particle count, but skipping
    // every other frame keeps things cheap on low-end devices.
    if (frame % 2 === 0) updateLines();

    scene.rotation.y += 0.0007;
    scene.rotation.x += 0.00012;

    camera.position.x += (mouseX * 90 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 90 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
