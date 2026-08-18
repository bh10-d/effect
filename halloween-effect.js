/**
 * ShopBase Halloween Effect
 * =========================
 *
 * Lightweight Halloween decoration for ShopBase storefronts.
 *
 * Features:
 * - Canvas based
 * - No dependencies
 * - No HTML/CSS required
 * - pointer-events disabled
 * - Mobile optimized
 * - Minimal / premium visual style
 *
 * Usage:
 *
 * <script
 *   src="https://YOUR-DOMAIN/halloween-effect.js"
 *   defer>
 * </script>
 */

(() => {
  "use strict";

  // ============================================================
  // CONFIG
  // ============================================================

  const CONFIG = {
    // Overall intensity.
    // 0.5 = very subtle
    // 1.0 = normal
    // 1.5 = more visible
    intensity: 0.8,

    // Overall opacity.
    opacity: 0.75,

    // Maximum particles on desktop.
    maxParticles: 38,

    // Percentage of desktop particles used on mobile.
    mobileMultiplier: 0.55,

    // Animation speed.
    speed: 1,

    // Canvas layer.
    // Keep this high enough to appear above the page,
    // but pointer-events remain disabled.
    zIndex: 9999,

    // Enable / disable different particle types.
    leaves: true,
    bats: true,
    ghosts: true,

    // Ghosts are intentionally rare.
    ghostRatio: 0.08,

    // Bats are also intentionally rare.
    batRatio: 0.12
  };

  // ============================================================
  // UTILS
  // ============================================================

  const random = (min, max) =>
    Math.random() * (max - min) + min;

  const randomInt = (min, max) =>
    Math.floor(random(min, max + 1));

  const clamp = (value, min, max) =>
    Math.max(min, Math.min(max, value));

  // ============================================================
  // CANVAS
  // ============================================================

  const canvas = document.createElement("canvas");

  canvas.id = "shopbase-halloween-effect";

  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    userSelect: "none",
    zIndex: String(CONFIG.zIndex)
  });

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d", {
    alpha: true
  });

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    dpr = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );
  }

  resize();

  window.addEventListener(
    "resize",
    resize,
    { passive: true }
  );

  // ============================================================
  // PARTICLE TYPES
  // ============================================================

  const TYPES = {
    LEAF: "leaf",
    BAT: "bat",
    GHOST: "ghost"
  };

  // ============================================================
  // PARTICLE CREATION
  // ============================================================

  function getParticleType() {
    const value = Math.random();

    if (
      CONFIG.ghosts &&
      value < CONFIG.ghostRatio
    ) {
      return TYPES.GHOST;
    }

    if (
      CONFIG.bats &&
      value < CONFIG.ghostRatio + CONFIG.batRatio
    ) {
      return TYPES.BAT;
    }

    return TYPES.LEAF;
  }

  function createParticle(initial = false) {
    const type = getParticleType();

    const particle = {
      type,

      x: random(-50, width + 50),

      y: initial
        ? random(-height, height)
        : random(-120, -30),

      size: 1,

      speed: 1,

      drift: random(
        0.2,
        0.8
      ),

      driftOffset: random(
        0,
        Math.PI * 2
      ),

      driftSpeed: random(
        0.006,
        0.018
      ),

      rotation: random(
        0,
        Math.PI * 2
      ),

      rotationSpeed: random(
        -0.015,
        0.015
      ),

      opacity: random(
        0.35,
        0.85
      )
    };

    // ----------------------------------------------------------
    // LEAF
    // ----------------------------------------------------------

    if (type === TYPES.LEAF) {
      particle.size = random(7, 15);

      particle.speed =
        random(0.45, 1.15) *
        CONFIG.speed;

      particle.drift =
        random(0.4, 1.4);

      particle.rotationSpeed =
        random(-0.025, 0.025);
    }

    // ----------------------------------------------------------
    // BAT
    // ----------------------------------------------------------

    if (type === TYPES.BAT) {
      particle.size = random(9, 16);

      particle.speed =
        random(0.25, 0.65) *
        CONFIG.speed;

      particle.drift =
        random(0.8, 1.8);

      particle.rotationSpeed = 0;
    }

    // ----------------------------------------------------------
    // GHOST
    // ----------------------------------------------------------

    if (type === TYPES.GHOST) {
      particle.size = random(14, 24);

      particle.speed =
        random(0.25, 0.55) *
        CONFIG.speed;

      particle.drift =
        random(0.5, 1.2);

      particle.opacity =
        random(0.18, 0.45);

      particle.rotationSpeed =
        random(-0.004, 0.004);
    }

    return particle;
  }

  // ============================================================
  // PARTICLE COUNT
  // ============================================================

  function getParticleCount() {
    const mobile =
      window.innerWidth <= 768;

    const multiplier = mobile
      ? CONFIG.mobileMultiplier
      : 1;

    return Math.round(
      CONFIG.maxParticles *
      CONFIG.intensity *
      multiplier
    );
  }

  const particles = [];

  function initializeParticles() {
    particles.length = 0;

    const count = getParticleCount();

    for (let i = 0; i < count; i++) {
      particles.push(
        createParticle(true)
      );
    }
  }

  initializeParticles();

  // ============================================================
  // DRAW LEAF
  // ============================================================

  function drawLeaf(particle) {
    const size = particle.size;

    ctx.save();

    ctx.translate(
      particle.x,
      particle.y
    );

    ctx.rotate(
      particle.rotation
    );

    ctx.globalAlpha =
      particle.opacity *
      CONFIG.opacity;

    ctx.beginPath();

    ctx.moveTo(
      0,
      -size
    );

    ctx.bezierCurveTo(
      size * 0.8,
      -size * 0.45,
      size * 0.8,
      size * 0.55,
      0,
      size
    );

    ctx.bezierCurveTo(
      -size * 0.8,
      size * 0.55,
      -size * 0.8,
      -size * 0.45,
      0,
      -size
    );

    ctx.closePath();

    // Muted autumn tone.
    ctx.fillStyle =
      "rgba(120, 72, 38, 0.9)";

    ctx.fill();

    // Leaf vein.
    ctx.beginPath();

    ctx.moveTo(
      0,
      -size * 0.75
    );

    ctx.lineTo(
      0,
      size * 0.75
    );

    ctx.strokeStyle =
      "rgba(60, 35, 20, 0.45)";

    ctx.lineWidth = 0.7;

    ctx.stroke();

    ctx.restore();
  }

  // ============================================================
  // DRAW BAT
  // ============================================================

  function drawBat(particle) {
    const size = particle.size;

    ctx.save();

    ctx.translate(
      particle.x,
      particle.y
    );

    ctx.globalAlpha =
      particle.opacity *
      CONFIG.opacity;

    ctx.fillStyle =
      "rgba(30, 24, 30, 0.82)";

    ctx.beginPath();

    // Body.
    ctx.ellipse(
      0,
      0,
      size * 0.18,
      size * 0.45,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // Wings.
    ctx.beginPath();

    ctx.moveTo(
      -size * 0.12,
      -size * 0.05
    );

    ctx.quadraticCurveTo(
      -size * 0.7,
      -size * 0.65,
      -size,
      -size * 0.25
    );

    ctx.quadraticCurveTo(
      -size * 0.75,
      size * 0.1,
      -size * 0.35,
      size * 0.25
    );

    ctx.quadraticCurveTo(
      -size * 0.15,
      size * 0.1,
      -size * 0.12,
      0
    );

    ctx.closePath();

    ctx.fill();

    ctx.beginPath();

    ctx.moveTo(
      size * 0.12,
      -size * 0.05
    );

    ctx.quadraticCurveTo(
      size * 0.7,
      -size * 0.65,
      size,
      -size * 0.25
    );

    ctx.quadraticCurveTo(
      size * 0.75,
      size * 0.1,
      size * 0.35,
      size * 0.25
    );

    ctx.quadraticCurveTo(
      size * 0.15,
      size * 0.1,
      size * 0.12,
      0
    );

    ctx.closePath();

    ctx.fill();

    ctx.restore();
  }

  // ============================================================
  // DRAW GHOST
  // ============================================================

  function drawGhost(particle) {
    const size = particle.size;

    ctx.save();

    ctx.translate(
      particle.x,
      particle.y
    );

    ctx.globalAlpha =
      particle.opacity *
      CONFIG.opacity;

    ctx.fillStyle =
      "rgba(255, 255, 255, 0.8)";

    ctx.beginPath();

    ctx.arc(
      0,
      -size * 0.15,
      size * 0.48,
      Math.PI,
      0
    );

    ctx.lineTo(
      size * 0.48,
      size * 0.55
    );

    ctx.quadraticCurveTo(
      size * 0.25,
      size * 0.35,
      0,
      size * 0.58
    );

    ctx.quadraticCurveTo(
      -size * 0.25,
      size * 0.35,
      -size * 0.48,
      size * 0.55
    );

    ctx.closePath();

    ctx.fill();

    // Eyes.
    ctx.fillStyle =
      "rgba(40, 35, 45, 0.55)";

    ctx.beginPath();

    ctx.arc(
      -size * 0.17,
      -size * 0.2,
      size * 0.055,
      0,
      Math.PI * 2
    );

    ctx.arc(
      size * 0.17,
      -size * 0.2,
      size * 0.055,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
  }

  // ============================================================
  // DRAW PARTICLE
  // ============================================================

  function drawParticle(particle) {
    switch (particle.type) {
      case TYPES.BAT:
        drawBat(particle);
        break;

      case TYPES.GHOST:
        drawGhost(particle);
        break;

      case TYPES.LEAF:
      default:
        drawLeaf(particle);
        break;
    }
  }

  // ============================================================
  // UPDATE PARTICLE
  // ============================================================

  function updateParticle(particle) {
    particle.y += particle.speed;

    particle.driftOffset +=
      particle.driftSpeed;

    particle.x +=
      Math.sin(
        particle.driftOffset
      ) *
      particle.drift *
      0.15;

    if (
      particle.type === TYPES.LEAF ||
      particle.type === TYPES.GHOST
    ) {
      particle.rotation +=
        particle.rotationSpeed;
    }

    // Reset when particle leaves screen.
    if (
      particle.y >
      height + 60
    ) {
      Object.assign(
        particle,
        createParticle(false)
      );
    }

    // Keep particles horizontally inside
    // a reasonable range.
    if (
      particle.x < -80
    ) {
      particle.x = width + 20;
    }

    if (
      particle.x > width + 80
    ) {
      particle.x = -20;
    }
  }

  // ============================================================
  // ANIMATION
  // ============================================================

  let animationFrame;

  function animate() {
    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    for (
      let i = 0;
      i < particles.length;
      i++
    ) {
      const particle =
        particles[i];

      updateParticle(particle);

      drawParticle(particle);
    }

    animationFrame =
      requestAnimationFrame(
        animate
      );
  }

  // ============================================================
  // START
  // ============================================================

  animate();

  // ============================================================
  // PUBLIC API
  // ============================================================

  window.ShopBaseHalloweenEffect = {
    destroy() {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );

      canvas.remove();

      particles.length = 0;
    },

    restart() {
      cancelAnimationFrame(
        animationFrame
      );

      initializeParticles();

      animate();
    }
  };

})();