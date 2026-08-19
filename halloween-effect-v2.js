/**
 * ShopBase Halloween Effect v2
 * ============================
 *
 * Premium / Minimal Halloween storefront decoration.
 * copyright 2026 bh10-d
 *
 * Features:
 * - Canvas based
 * - No dependencies
 * - No external assets
 * - No emoji
 * - 10 Halloween objects
 * - Different rarity for each object
 * - Mobile optimized
 * - pointer-events: none
 * - Lightweight
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
    /*
     * Overall effect intensity.
     *
     * 0.5  = very subtle
     * 0.8  = recommended
     * 1.0  = normal
     * 1.5  = strong
     */
    intensity: 0.8,

    /*
     * Overall opacity.
     */
    // opacity: 0.78,
    opacity: 1,

    /*
     * Maximum number of particles.
     */
    // maxParticles: 42,
    maxParticles: 40,

    /*
     * Mobile particle multiplier.
     */
    mobileMultiplier: 0.001,

    /*
     * Animation speed.
     */
    // speed: 1,
    speed: 1.3,

    /*
     * Canvas layer.
     */
    zIndex: 9999,

    /*
     * Enable / disable individual categories.
     */
    pumpkin: true,
    bat: true,
    ghost: true,
    spider: true,
    web: true,
    witchHat: true,
    moon: true,
    star: true,
    leaf: true,
    tombstone: true
  };

  const SIZE_MULTIPLIER = 0.001;
  console.log("🔥 HALLOWEEN V3 LOADED", SIZE_MULTIPLIER, Date.now());

  // ============================================================
  // CONSTANTS
  // ============================================================

  const TYPE = {
    LEAF: "leaf",
    BAT: "bat",
    PUMPKIN: "pumpkin",
    GHOST: "ghost",
    SPIDER: "spider",
    WEB: "web",
    WITCH_HAT: "witchHat",
    MOON: "moon",
    STAR: "star",
    TOMBSTONE: "tombstone"
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const random = (min, max) =>
    Math.random() * (max - min) + min;

  const randomInt = (min, max) =>
    Math.floor(random(min, max + 1));

  const pick = (array) =>
    array[
      Math.floor(
        Math.random() * array.length
      )
    ];

  // ============================================================
  // CANVAS
  // ============================================================

  const canvas =
    document.createElement("canvas");

  canvas.id =
    "shopbase-halloween-effect";

  Object.assign(
    canvas.style,
    {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      userSelect: "none",
      touchAction: "none",
      zIndex: String(CONFIG.zIndex)
    }
  );

  document.body.appendChild(canvas);

  const ctx =
    canvas.getContext("2d", {
      alpha: true
    });

  let width =
    window.innerWidth;

  let height =
    window.innerHeight;

  let dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  function resize() {
    width =
      window.innerWidth;

    height =
      window.innerHeight;

    dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    canvas.width =
      width * dpr;

    canvas.height =
      height * dpr;

    canvas.style.width =
      `${width}px`;

    canvas.style.height =
      `${height}px`;

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
    {
      passive: true
    }
  );

  // ============================================================
  // TYPE WEIGHTS
  // ============================================================

  /*
   * Lower weight = rarer.
   *
   * Leaves / bats are common.
   * Tombstones / webs are rare.
   */

  const TYPE_POOL = [
    {
      type: TYPE.LEAF,
      weight: 28
    },

    {
      type: TYPE.BAT,
      weight: 18
    },

    {
      type: TYPE.PUMPKIN,
      weight: 12
    },

    {
      type: TYPE.GHOST,
      weight: 10
    },

    {
      type: TYPE.SPIDER,
      weight: 7
    },

    {
      type: TYPE.WITCH_HAT,
      weight: 6
    },

    {
      type: TYPE.STAR,
      weight: 6
    },

    {
      type: TYPE.MOON,
      weight: 4
    },

    {
      type: TYPE.WEB,
      weight: 5
    },

    {
      type: TYPE.TOMBSTONE,
      weight: 2
    }
  ];

  function isEnabled(type) {
    switch (type) {
      case TYPE.LEAF:
        return CONFIG.leaf;

      case TYPE.BAT:
        return CONFIG.bat;

      case TYPE.PUMPKIN:
        return CONFIG.pumpkin;

      case TYPE.GHOST:
        return CONFIG.ghost;

      case TYPE.SPIDER:
        return CONFIG.spider;

      case TYPE.WEB:
        return CONFIG.web;

      case TYPE.WITCH_HAT:
        return CONFIG.witchHat;

      case TYPE.MOON:
        return CONFIG.moon;

      case TYPE.STAR:
        return CONFIG.star;

      case TYPE.TOMBSTONE:
        return CONFIG.tombstone;

      default:
        return false;
    }
  }

  function getRandomType() {
    const enabled =
      TYPE_POOL.filter(
        item =>
          isEnabled(item.type)
      );

    if (!enabled.length) {
      return TYPE.LEAF;
    }

    const totalWeight =
      enabled.reduce(
        (sum, item) =>
          sum + item.weight,
        0
      );

    let value =
      Math.random() *
      totalWeight;

    for (const item of enabled) {
      value -= item.weight;

      if (value <= 0) {
        return item.type;
      }
    }

    return enabled[0].type;
  }

  // ============================================================
  // PARTICLE CREATION
  // ============================================================

  function createParticle(
    initial = false
  ) {
    const type =
      getRandomType();

    const particle = {
      type,

      x:
        random(
          -80,
          width + 80
        ),

      y:
        initial
          ? random(
              -height,
              height
            )
          : random(
              -160,
              -30
            ),

      size:
        random(
          10,
          20
        ),

      speed:
        random(
          0.4,
          1
        ) * CONFIG.speed,

      drift:
        random(
          0.4,
          1.5
        ),

      driftPhase:
        random(
          0,
          Math.PI * 2
        ),

      driftSpeed:
        random(
          0.006,
          0.018
        ),

      rotation:
        random(
          0,
          Math.PI * 2
        ),

      rotationSpeed:
        random(
          -0.02,
          0.02
        ),

      opacity:
        random(
          0.35,
          0.9
        )
    };

    switch (type) {
      // --------------------------------------------------------
      // LEAF
      // --------------------------------------------------------

      case TYPE.LEAF:
        particle.size =
          random(7, 15);

        particle.speed =
          random(
            0.45,
            1.1
          ) * CONFIG.speed;

        particle.rotationSpeed =
          random(
            -0.03,
            0.03
          );

        break;

      // --------------------------------------------------------
      // BAT
      // --------------------------------------------------------

      case TYPE.BAT:
        particle.size =
          random(9, 17);

        particle.speed =
          random(
            0.25,
            0.65
          ) * CONFIG.speed;

        particle.drift =
          random(
            0.8,
            2
          );

        particle.rotationSpeed = 0;

        break;

      // --------------------------------------------------------
      // PUMPKIN
      // --------------------------------------------------------

      case TYPE.PUMPKIN:
        particle.size =
          random(11, 20);

        particle.speed =
          random(
            0.35,
            0.8
          ) * CONFIG.speed;

        particle.rotationSpeed =
          random(
            -0.012,
            0.012
          );

        break;

      // --------------------------------------------------------
      // GHOST
      // --------------------------------------------------------

      case TYPE.GHOST:
        particle.size =
          random(15, 25);

        particle.speed =
          random(
            0.25,
            0.55
          ) * CONFIG.speed;

        particle.opacity =
          random(
            0.15,
            0.4
          );

        particle.drift =
          random(
            0.7,
            1.4
          );

        break;

      // --------------------------------------------------------
      // SPIDER
      // --------------------------------------------------------

      case TYPE.SPIDER:
        particle.size =
          random(8, 15);

        particle.speed =
          random(
            0.45,
            0.9
          ) * CONFIG.speed;

        particle.drift = 0.25;

        particle.rotationSpeed = 0;

        break;

      // --------------------------------------------------------
      // WEB
      // --------------------------------------------------------

      case TYPE.WEB:
        particle.size =
          random(18, 32);

        particle.speed =
          random(
            0.18,
            0.4
          ) * CONFIG.speed;

        particle.opacity =
          random(
            0.12,
            0.3
          );

        particle.rotationSpeed =
          random(
            -0.005,
            0.005
          );

        break;

      // --------------------------------------------------------
      // WITCH HAT
      // --------------------------------------------------------

      case TYPE.WITCH_HAT:
        particle.size =
          random(12, 21);

        particle.speed =
          random(
            0.35,
            0.75
          ) * CONFIG.speed;

        break;

      // --------------------------------------------------------
      // MOON
      // --------------------------------------------------------

      case TYPE.MOON:
        particle.size =
          random(16, 28);

        particle.speed =
          random(
            0.12,
            0.3
          ) * CONFIG.speed;

        particle.opacity =
          random(
            0.18,
            0.4
          );

        particle.drift =
          random(
            0.3,
            0.8
          );

        break;

      // --------------------------------------------------------
      // STAR
      // --------------------------------------------------------

      case TYPE.STAR:
        particle.size =
          random(4, 9);

        particle.speed =
          random(
            0.2,
            0.45
          ) * CONFIG.speed;

        particle.opacity =
          random(
            0.25,
            0.65
          );

        particle.rotationSpeed =
          random(
            -0.01,
            0.01
          );

        break;

      // --------------------------------------------------------
      // TOMBSTONE
      // --------------------------------------------------------

      case TYPE.TOMBSTONE:
        particle.size =
          random(15, 25);

        particle.speed =
          random(
            0.15,
            0.35
          ) * CONFIG.speed;

        particle.opacity =
          random(
            0.12,
            0.28
          );

        particle.drift =
          random(
            0.25,
            0.6
          );

        break;
    }

    return particle;
  }

  // ============================================================
  // PARTICLE COUNT
  // ============================================================

  function getParticleCount() {
    const isMobile =
      window.innerWidth <= 768;

    const multiplier =
      isMobile
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

    const count =
      getParticleCount();

    for (
      let i = 0;
      i < count;
      i++
    ) {
      particles.push(
        createParticle(true)
      );
    }
  }

  initializeParticles();

  // ============================================================
  // DRAW: LEAF
  // ============================================================

  function drawLeaf(p) {
    const s = p.size * SIZE_MULTIPLIER;

    ctx.save();

    ctx.translate(
      p.x,
      p.y
    );

    ctx.rotate(
      p.rotation
    );

    ctx.globalAlpha =
      p.opacity *
      CONFIG.opacity;

    ctx.fillStyle =
      "rgba(126, 73, 39, 0.9)";

    ctx.beginPath();

    ctx.moveTo(
      0,
      -s
    );

    ctx.bezierCurveTo(
      s * 0.8,
      -s * 0.45,
      s * 0.8,
      s * 0.55,
      0,
      s
    );

    ctx.bezierCurveTo(
      -s * 0.8,
      s * 0.55,
      -s * 0.8,
      -s * 0.45,
      0,
      -s
    );

    ctx.closePath();

    ctx.fill();

    ctx.beginPath();

    ctx.moveTo(
      0,
      -s * 0.75
    );

    ctx.lineTo(
      0,
      s * 0.75
    );

    ctx.strokeStyle =
      "rgba(50, 30, 20, 0.5)";

    ctx.lineWidth = 0.7;

    ctx.stroke();

    ctx.restore();
  }

  // ============================================================
  // DRAW: BAT
  // ============================================================

  function drawBat(p) {
    const s = p.size * SIZE_MULTIPLIER;

    ctx.save();

    ctx.translate(
      p.x,
      p.y
    );

    ctx.globalAlpha =
      p.opacity *
      CONFIG.opacity;

    ctx.fillStyle =
      "rgba(28, 24, 32, 0.9)";

    // Body
    ctx.beginPath();

    ctx.ellipse(
      0,
      0,
      s * 0.18,
      s * 0.42,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // Left wing
    ctx.beginPath();

    ctx.moveTo(
      -s * 0.1,
      -s * 0.05
    );

    ctx.quadraticCurveTo(
      -s * 0.65,
      -s * 0.65,
      -s,
      -s * 0.25
    );

    ctx.quadraticCurveTo(
      -s * 0.75,
      s * 0.12,
      -s * 0.3,
      s * 0.3
    );

    ctx.quadraticCurveTo(
      -s * 0.15,
      s * 0.1,
      -s * 0.1,
      0
    );

    ctx.closePath();

    ctx.fill();

    // Right wing
    ctx.beginPath();

    ctx.moveTo(
      s * 0.1,
      -s * 0.05
    );

    ctx.quadraticCurveTo(
      s * 0.65,
      -s * 0.65,
      s,
      -s * 0.25
    );

    ctx.quadraticCurveTo(
      s * 0.75,
      s * 0.12,
      s * 0.3,
      s * 0.3
    );

    ctx.quadraticCurveTo(
      s * 0.15,
      s * 0.1,
      s * 0.1,
      0
    );

    ctx.closePath();

    ctx.fill();

    ctx.restore();
  }

  // ============================================================
  // DRAW: PUMPKIN
  // ============================================================

  function drawPumpkin(p) {
    const s = p.size * SIZE_MULTIPLIER;

    ctx.save();

    ctx.translate(
      p.x,
      p.y
    );

    ctx.rotate(
      p.rotation
    );

    ctx.globalAlpha =
      p.opacity *
      CONFIG.opacity;

    // Pumpkin body
    ctx.fillStyle =
      "rgba(190, 78, 27, 0.9)";

    ctx.beginPath();

    ctx.ellipse(
      -s * 0.22,
      0,
      s * 0.4,
      s * 0.55,
      0,
      0,
      Math.PI * 2
    );

    ctx.ellipse(
      s * 0.22,
      0,
      s * 0.4,
      s * 0.55,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // Stem
    ctx.fillStyle =
      "rgba(62, 82, 43, 0.9)";

    ctx.fillRect(
      -s * 0.08,
      -s * 0.62,
      s * 0.16,
      s * 0.2
    );

    // Eyes
    ctx.fillStyle =
      "rgba(35, 22, 20, 0.9)";

    ctx.beginPath();

    ctx.moveTo(
      -s * 0.38,
      -s * 0.08
    );

    ctx.lineTo(
      -s * 0.18,
      -s * 0.18
    );

    ctx.lineTo(
      -s * 0.25,
      s * 0.02
    );

    ctx.closePath();

    ctx.fill();

    ctx.beginPath();

    ctx.moveTo(
      s * 0.38,
      -s * 0.08
    );

    ctx.lineTo(
      s * 0.18,
      -s * 0.18
    );

    ctx.lineTo(
      s * 0.25,
      s * 0.02
    );

    ctx.closePath();

    ctx.fill();

    // Mouth
    ctx.beginPath();

    ctx.moveTo(
      -s * 0.32,
      s * 0.2
    );

    ctx.quadraticCurveTo(
      0,
      s * 0.45,
      s * 0.32,
      s * 0.2
    );

    ctx.strokeStyle =
      "rgba(35, 22, 20, 0.9)";

    ctx.lineWidth = 1;

    ctx.stroke();

    ctx.restore();
  }

  // ============================================================
  // DRAW: GHOST
  // ============================================================

  function drawGhost(p) {
    const s = p.size * SIZE_MULTIPLIER;

    ctx.save();

    ctx.translate(
      p.x,
      p.y
    );

    ctx.globalAlpha =
      p.opacity *
      CONFIG.opacity;

    ctx.fillStyle =
      "rgba(245, 245, 245, 0.8)";

    ctx.beginPath();

    ctx.arc(
      0,
      -s * 0.15,
      s * 0.48,
      Math.PI,
      0
    );

    ctx.lineTo(
      s * 0.48,
      s * 0.55
    );

    ctx.quadraticCurveTo(
      s * 0.25,
      s * 0.32,
      0,
      s * 0.58
    );

    ctx.quadraticCurveTo(
      -s * 0.25,
      s * 0.32,
      -s * 0.48,
      s * 0.55
    );

    ctx.closePath();

    ctx.fill();

    // Eyes
    ctx.fillStyle =
      "rgba(45, 38, 50, 0.55)";

    ctx.beginPath();

    ctx.arc(
      -s * 0.16,
      -s * 0.2,
      s * 0.055,
      0,
      Math.PI * 2
    );

    ctx.arc(
      s * 0.16,
      -s * 0.2,
      s * 0.055,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
  }

  // ============================================================
  // DRAW: SPIDER
  // ============================================================

  function drawSpider(p) {
    const s = p.size * SIZE_MULTIPLIER;

    ctx.save();

    ctx.translate(
      p.x,
      p.y
    );

    ctx.globalAlpha =
      p.opacity *
      CONFIG.opacity;

    ctx.strokeStyle =
      "rgba(35, 30, 38, 0.85)";

    ctx.fillStyle =
      "rgba(35, 30, 38, 0.9)";

    ctx.lineWidth =
      Math.max(
        0.7,
        s * 0.08
      );

    // Body
    ctx.beginPath();

    ctx.ellipse(
      0,
      0,
      s * 0.3,
      s * 0.42,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // Legs
    for (
      let i = 0;
      i < 4;
      i++
    ) {
      const y =
        -s * 0.25 +
        i * s * 0.16;

      ctx.beginPath();

      ctx.moveTo(
        -s * 0.2,
        y
      );

      ctx.quadraticCurveTo(
        -s * 0.7,
        y - s * 0.15,
        -s * 0.85,
        y + s * 0.15
      );

      ctx.stroke();

      ctx.beginPath();

      ctx.moveTo(
        s * 0.2,
        y
      );

      ctx.quadraticCurveTo(
        s * 0.7,
        y - s * 0.15,
        s * 0.85,
        y + s * 0.15
      );

      ctx.stroke();
    }

    ctx.restore();
  }

  // ============================================================
  // DRAW: WEB
  // ============================================================

  function drawWeb(p) {
    const s = p.size * SIZE_MULTIPLIER;

    ctx.save();

    ctx.translate(
      p.x,
      p.y
    );

    ctx.rotate(
      p.rotation
    );

    ctx.globalAlpha =
      p.opacity *
      CONFIG.opacity;

    ctx.strokeStyle =
      "rgba(80, 70, 85, 0.75)";

    ctx.lineWidth = 0.7;

    const arms = 8;

    for (
      let i = 0;
      i < arms;
      i++
    ) {
      const angle =
        (Math.PI * 2 * i) /
        arms;

      ctx.beginPath();

      ctx.moveTo(
        0,
        0
      );

      ctx.lineTo(
        Math.cos(angle) * s,
        Math.sin(angle) * s
      );

      ctx.stroke();
    }

    for (
      let ring = 1;
      ring <= 4;
      ring++
    ) {
      const radius =
        (s / 4) * ring;

      ctx.beginPath();

      for (
        let i = 0;
        i <= arms;
        i++
      ) {
        const angle =
          (Math.PI * 2 * i) /
          arms;

        const x =
          Math.cos(angle) *
          radius;

        const y =
          Math.sin(angle) *
          radius;

        if (i === 0) {
          ctx.moveTo(
            x,
            y
          );
        } else {
          ctx.lineTo(
            x,
            y
          );
        }
      }

      ctx.stroke();
    }

    ctx.restore();
  }

  // ============================================================
  // DRAW: WITCH HAT
  // ============================================================

  function drawWitchHat(p) {
    const s = p.size * SIZE_MULTIPLIER;

    ctx.save();

    ctx.translate(
      p.x,
      p.y
    );

    ctx.rotate(
      p.rotation
    );

    ctx.globalAlpha =
      p.opacity *
      CONFIG.opacity;

    ctx.fillStyle =
      "rgba(42, 28, 55, 0.9)";

    // Cone
    ctx.beginPath();

    ctx.moveTo(
      0,
      -s
    );

    ctx.lineTo(
      s * 0.42,
      s * 0.3
    );

    ctx.lineTo(
      -s * 0.42,
      s * 0.3
    );

    ctx.closePath();

    ctx.fill();

    // Brim
    ctx.beginPath();

    ctx.ellipse(
      0,
      s * 0.3,
      s * 0.65,
      s * 0.18,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // Band
    ctx.fillStyle =
      "rgba(150, 74, 31, 0.9)";

    ctx.fillRect(
      -s * 0.35,
      s * 0.1,
      s * 0.7,
      s * 0.13
    );

    ctx.restore();
  }

  // ============================================================
  // DRAW: MOON
  // ============================================================

  function drawMoon(p) {
    const s = p.size * SIZE_MULTIPLIER;

    ctx.save();

    ctx.translate(
      p.x,
      p.y
    );

    ctx.globalAlpha =
      p.opacity *
      CONFIG.opacity;

    ctx.fillStyle =
      "rgba(210, 198, 158, 0.8)";

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      s,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.globalCompositeOperation =
      "destination-out";

    ctx.beginPath();

    ctx.arc(
      s * 0.42,
      -s * 0.18,
      s * 0.9,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.globalCompositeOperation =
      "source-over";

    ctx.restore();
  }

  // ============================================================
  // DRAW: STAR
  // ============================================================

  function drawStar(p) {
    const s = p.size * SIZE_MULTIPLIER;

    ctx.save();

    ctx.translate(
      p.x,
      p.y
    );

    ctx.rotate(
      p.rotation
    );

    ctx.globalAlpha =
      p.opacity *
      CONFIG.opacity;

    ctx.fillStyle =
      "rgba(220, 200, 145, 0.85)";

    ctx.beginPath();

    for (
      let i = 0;
      i < 8;
      i++
    ) {
      const angle =
        -Math.PI / 2 +
        (Math.PI * 2 * i) /
          8;

      const radius =
        i % 2 === 0
          ? s
          : s * 0.35;

      const x =
        Math.cos(angle) *
        radius;

      const y =
        Math.sin(angle) *
        radius;

      if (i === 0) {
        ctx.moveTo(
          x,
          y
        );
      } else {
        ctx.lineTo(
          x,
          y
        );
      }
    }

    ctx.closePath();

    ctx.fill();

    ctx.restore();
  }

  // ============================================================
  // DRAW: TOMBSTONE
  // ============================================================

  function drawTombstone(p) {
    const s = p.size * SIZE_MULTIPLIER;

    ctx.save();

    ctx.translate(
      p.x,
      p.y
    );

    ctx.globalAlpha =
      p.opacity *
      CONFIG.opacity;

    ctx.fillStyle =
      "rgba(70, 67, 76, 0.7)";

    ctx.beginPath();

    ctx.moveTo(
      -s * 0.45,
      s * 0.65
    );

    ctx.lineTo(
      -s * 0.45,
      -s * 0.15
    );

    ctx.arc(
      0,
      -s * 0.15,
      s * 0.45,
      Math.PI,
      0
    );

    ctx.lineTo(
      s * 0.45,
      s * 0.65
    );

    ctx.closePath();

    ctx.fill();

    // Cross
    ctx.strokeStyle =
      "rgba(35, 32, 38, 0.45)";

    ctx.lineWidth =
      Math.max(
        0.8,
        s * 0.06
      );

    ctx.beginPath();

    ctx.moveTo(
      0,
      -s * 0.05
    );

    ctx.lineTo(
      0,
      s * 0.32
    );

    ctx.moveTo(
      -s * 0.13,
      s * 0.08
    );

    ctx.lineTo(
      s * 0.13,
      s * 0.08
    );

    ctx.stroke();

    ctx.restore();
  }

  // ============================================================
  // DRAW PARTICLE
  // ============================================================

  function drawParticle(p) {
    switch (p.type) {
      case TYPE.LEAF:
        drawLeaf(p);
        break;

      case TYPE.BAT:
        drawBat(p);
        break;

      case TYPE.PUMPKIN:
        drawPumpkin(p);
        break;

      case TYPE.GHOST:
        drawGhost(p);
        break;

      case TYPE.SPIDER:
        drawSpider(p);
        break;

      case TYPE.WEB:
        drawWeb(p);
        break;

      case TYPE.WITCH_HAT:
        drawWitchHat(p);
        break;

      case TYPE.MOON:
        drawMoon(p);
        break;

      case TYPE.STAR:
        drawStar(p);
        break;

      case TYPE.TOMBSTONE:
        drawTombstone(p);
        break;
    }
  }

  // ============================================================
  // UPDATE
  // ============================================================

  function updateParticle(p) {
    p.y += p.speed;

    p.driftPhase +=
      p.driftSpeed;

    p.x +=
      Math.sin(
        p.driftPhase
      ) *
      p.drift *
      0.12;

    p.rotation +=
      p.rotationSpeed;

    if (
      p.y >
      height + 80
    ) {
      Object.assign(
        p,
        createParticle(false)
      );
    }

    if (
      p.x <
      -100
    ) {
      p.x =
        width + 40;
    }

    if (
      p.x >
      width + 100
    ) {
      p.x = -40;
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

      updateParticle(
        particle
      );

      drawParticle(
        particle
      );
    }

    animationFrame =
      requestAnimationFrame(
        animate
      );
  }

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
    },

    setIntensity(value) {
      CONFIG.intensity =
        Math.max(
          0,
          Number(value) || 0
        );

      initializeParticles();
    }
  };

})();