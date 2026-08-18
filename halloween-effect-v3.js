/**
 * ShopBase Halloween Atmosphere v3
 * =================================
 *
 * Premium / minimal Halloween atmosphere.
 *
 * Behaviours:
 * - Leaves      -> falling + drifting
 * - Bats       -> flying horizontally
 * - Ghosts     -> floating
 * - Pumpkins   -> slow drifting
 * - Spiders    -> hanging from silk
 * - Webs       -> decorative corners
 * - Moon       -> atmospheric
 * - Stars      -> subtle twinkle
 * - Witch hats -> floating
 * - Tombstones -> very rare atmospheric objects
 *
 * No dependencies.
 * No external assets.
 * No emoji.
 *
 * Usage:
 *
 * <script
 *   src="https://cdn.jsdelivr.net/gh/bh10-d/effect/halloween-effect-v3.js"
 *   defer>
 * </script>
 */

(() => {
  "use strict";

  // ============================================================
  // CONFIG
  // ============================================================

  const CONFIG = {
    /**
     * Overall intensity.
     *
     * 0.4 = extremely subtle
     * 0.6 = subtle
     * 0.8 = recommended
     * 1.0 = normal
     * 1.3 = strong
     */
    intensity: 0.8,

    /**
     * Overall opacity.
     */
    opacity: 0.72,

    /**
     * Base number of atmospheric objects.
     */
    maxParticles: 30,

    /**
     * Mobile particle multiplier.
     */
    mobileMultiplier: 0.45,

    /**
     * Global animation speed.
     */
    speed: 1,

    /**
     * Canvas layer.
     */
    zIndex: 9999,

    /**
     * Respect prefers-reduced-motion.
     */
    respectReducedMotion: true,

    /**
     * Enable debug logs.
     */
    debug: true
  };

  // ============================================================
  // DEBUG
  // ============================================================

  function log(...args) {
    if (CONFIG.debug) {
      console.log(
        "[ShopBase Halloween]",
        ...args
      );
    }
  }

  // ============================================================
  // DOM SAFE INITIALIZATION
  // ============================================================

  function init() {
    log("Initializing Halloween Atmosphere v3...");

    if (!document.body) {
      log("Body is not ready. Retrying...");

      setTimeout(
        init,
        50
      );

      return;
    }

    // Prevent duplicate initialization.
    if (
      window.ShopBaseHalloweenEffect &&
      window.ShopBaseHalloweenEffect.initialized
    ) {
      log("Effect already initialized.");

      return;
    }

    // Respect accessibility settings.
    if (
      CONFIG.respectReducedMotion &&
      window.matchMedia &&
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      log(
        "Disabled because prefers-reduced-motion is enabled."
      );

      return;
    }

    createEffect();
  }

  // ============================================================
  // EFFECT
  // ============================================================

  function createEffect() {
    // ----------------------------------------------------------
    // CONSTANTS
    // ----------------------------------------------------------

    const TYPE = {
      LEAF: "leaf",
      BAT: "bat",
      GHOST: "ghost",
      PUMPKIN: "pumpkin",
      SPIDER: "spider",
      WEB: "web",
      MOON: "moon",
      STAR: "star",
      WITCH_HAT: "witchHat",
      TOMBSTONE: "tombstone"
    };

    // ----------------------------------------------------------
    // HELPERS
    // ----------------------------------------------------------

    const random = (
      min,
      max
    ) =>
      Math.random() *
        (max - min) +
      min;

    const clamp = (
      value,
      min,
      max
    ) =>
      Math.max(
        min,
        Math.min(
          max,
          value
        )
      );

    // ----------------------------------------------------------
    // CANVAS
    // ----------------------------------------------------------

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.id =
      "shopbase-halloween-atmosphere";

    Object.assign(
      canvas.style,
      {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        userSelect: "none",
        touchAction: "none",
        zIndex:
          String(
            CONFIG.zIndex
          )
      }
    );

    document.body.appendChild(
      canvas
    );

    const ctx =
      canvas.getContext(
        "2d",
        {
          alpha: true
        }
      );

    if (!ctx) {
      console.error(
        "[ShopBase Halloween] Canvas is not supported."
      );

      return;
    }

    let width =
      window.innerWidth;

    let height =
      window.innerHeight;

    let dpr =
      Math.min(
        window.devicePixelRatio ||
          1,
        2
      );

    // ----------------------------------------------------------
    // RESIZE
    // ----------------------------------------------------------

    function resize() {
      width =
        window.innerWidth;

      height =
        window.innerHeight;

      dpr =
        Math.min(
          window.devicePixelRatio ||
            1,
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

    // ==========================================================
    // PARTICLE FACTORY
    // ==========================================================

    function createParticle(
      type,
      initial = false
    ) {
      const particle = {
        type,

        x:
          random(
            -100,
            width + 100
          ),

        y:
          initial
            ? random(
                -height,
                height
              )
            : random(
                -160,
                -40
              ),

        size:
          random(
            10,
            20
          ),

        speed:
          random(
            0.2,
            0.8
          ) *
          CONFIG.speed,

        opacity:
          random(
            0.3,
            0.8
          ),

        rotation:
          random(
            0,
            Math.PI * 2
          ),

        rotationSpeed:
          random(
            -0.015,
            0.015
          ),

        phase:
          random(
            0,
            Math.PI * 2
          ),

        phaseSpeed:
          random(
            0.006,
            0.02
          ),

        drift:
          random(
            0.3,
            1.5
          ),

        direction:
          Math.random() >
          0.5
            ? 1
            : -1,

        life:
          random(
            0,
            Math.PI * 2
          )
      };

      // --------------------------------------------------------
      // LEAF
      // --------------------------------------------------------

      if (
        type === TYPE.LEAF
      ) {
        particle.size =
          random(
            7,
            14
          );

        particle.speed =
          random(
            0.35,
            0.9
          ) *
          CONFIG.speed;

        particle.drift =
          random(
            0.8,
            1.8
          );

        particle.rotationSpeed =
          random(
            -0.035,
            0.035
          );
      }

      // --------------------------------------------------------
      // BAT
      // --------------------------------------------------------

      if (
        type === TYPE.BAT
      ) {
        particle.size =
          random(
            10,
            18
          );

        particle.y =
          initial
            ? random(
                50,
                height * 0.65
              )
            : random(
                50,
                height * 0.7
              );

        particle.x =
          particle.direction ===
          1
            ? -80
            : width + 80;

        particle.speed =
          random(
            0.7,
            1.5
          ) *
          CONFIG.speed;

        particle.drift =
          random(
            1,
            2.5
          );

        particle.opacity =
          random(
            0.25,
            0.65
          );
      }

      // --------------------------------------------------------
      // GHOST
      // --------------------------------------------------------

      if (
        type === TYPE.GHOST
      ) {
        particle.size =
          random(
            17,
            28
          );

        particle.speed =
          random(
            0.12,
            0.35
          ) *
          CONFIG.speed;

        particle.drift =
          random(
            1,
            2
          );

        particle.opacity =
          random(
            0.12,
            0.32
          );
      }

      // --------------------------------------------------------
      // PUMPKIN
      // --------------------------------------------------------

      if (
        type === TYPE.PUMPKIN
      ) {
        particle.size =
          random(
            11,
            20
          );

        particle.speed =
          random(
            0.12,
            0.4
          ) *
          CONFIG.speed;

        particle.drift =
          random(
            0.6,
            1.2
          );

        particle.opacity =
          random(
            0.25,
            0.65
          );

        particle.rotationSpeed =
          random(
            -0.012,
            0.012
          );
      }

      // --------------------------------------------------------
      // SPIDER
      // --------------------------------------------------------

      if (
        type === TYPE.SPIDER
      ) {
        particle.size =
          random(
            8,
            14
          );

        particle.x =
          random(
            20,
            width - 20
          );

        particle.y =
          random(
            -20,
            height * 0.45
          );

        particle.speed =
          random(
            0.08,
            0.25
          ) *
          CONFIG.speed;

        particle.threadLength =
          random(
            40,
            150
          );

        particle.opacity =
          random(
            0.25,
            0.65
          );
      }

      // --------------------------------------------------------
      // WEB
      // --------------------------------------------------------

      if (
        type === TYPE.WEB
      ) {
        particle.size =
          random(
            35,
            70
          );

        particle.speed = 0;

        particle.opacity =
          random(
            0.08,
            0.22
          );

        particle.rotation =
          random(
            0,
            Math.PI * 2
          );

        particle.x =
          Math.random() >
          0.5
            ? random(
                -20,
                100
              )
            : random(
                width - 100,
                width + 20
              );

        particle.y =
          Math.random() >
          0.5
            ? random(
                -20,
                100
              )
            : random(
                height - 100,
                height + 20
              );
      }

      // --------------------------------------------------------
      // MOON
      // --------------------------------------------------------

      if (
        type === TYPE.MOON
      ) {
        particle.size =
          random(
            22,
            38
          );

        particle.speed =
          0.01;

        particle.opacity =
          random(
            0.15,
            0.3
          );

        particle.x =
          random(
            30,
            width - 30
          );

        particle.y =
          random(
            40,
            height * 0.35
          );
      }

      // --------------------------------------------------------
      // STAR
      // --------------------------------------------------------

      if (
        type === TYPE.STAR
      ) {
        particle.size =
          random(
            3,
            7
          );

        particle.speed =
          0;

        particle.opacity =
          random(
            0.15,
            0.5
          );

        particle.x =
          random(
            0,
            width
          );

        particle.y =
          random(
            0,
            height * 0.65
          );
      }

      // --------------------------------------------------------
      // WITCH HAT
      // --------------------------------------------------------

      if (
        type === TYPE.WITCH_HAT
      ) {
        particle.size =
          random(
            12,
            21
          );

        particle.speed =
          random(
            0.08,
            0.25
          ) *
          CONFIG.speed;

        particle.drift =
          random(
            0.8,
            1.5
          );

        particle.opacity =
          random(
            0.2,
            0.55
          );
      }

      // --------------------------------------------------------
      // TOMBSTONE
      // --------------------------------------------------------

      if (
        type === TYPE.TOMBSTONE
      ) {
        particle.size =
          random(
            18,
            30
          );

        particle.speed =
          random(
            0.05,
            0.15
          ) *
          CONFIG.speed;

        particle.opacity =
          random(
            0.08,
            0.2
          );

        particle.x =
          random(
            30,
            width - 30
          );
      }

      return particle;
    }

    // ==========================================================
    // TYPE DISTRIBUTION
    // ==========================================================

    const typePool = [
      {
        type: TYPE.LEAF,
        weight: 24
      },

      {
        type: TYPE.BAT,
        weight: 20
      },

      {
        type: TYPE.GHOST,
        weight: 9
      },

      {
        type: TYPE.PUMPKIN,
        weight: 9
      },

      {
        type: TYPE.SPIDER,
        weight: 8
      },

      {
        type: TYPE.WITCH_HAT,
        weight: 7
      },

      {
        type: TYPE.STAR,
        weight: 8
      },

      {
        type: TYPE.WEB,
        weight: 5
      },

      {
        type: TYPE.MOON,
        weight: 5
      },

      {
        type: TYPE.TOMBSTONE,
        weight: 2
      }
    ];

    function chooseType() {
      const total =
        typePool.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.weight,
          0
        );

      let value =
        Math.random() *
        total;

      for (
        const item
        of typePool
      ) {
        value -=
          item.weight;

        if (
          value <= 0
        ) {
          return item.type;
        }
      }

      return TYPE.LEAF;
    }

    // ==========================================================
    // PARTICLE COUNT
    // ==========================================================

    function getParticleCount() {
      const isMobile =
        window.innerWidth <=
        768;

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

    // ==========================================================
    // PARTICLES
    // ==========================================================

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
          createParticle(
            chooseType(),
            true
          )
        );
      }

      log(
        `Created ${count} particles.`
      );
    }

    initializeParticles();

    // ==========================================================
    // DRAW HELPERS
    // ==========================================================

    function beginParticle(p) {
      ctx.save();

      ctx.translate(
        p.x,
        p.y
      );

      ctx.rotate(
        p.rotation
      );

      ctx.globalAlpha =
        clamp(
          p.opacity *
            CONFIG.opacity,
          0,
          1
        );
    }

    // ==========================================================
    // LEAF
    // ==========================================================

    function drawLeaf(p) {
      const s =
        p.size;

      beginParticle(p);

      ctx.fillStyle =
        "rgba(132, 73, 38, 0.9)";

      ctx.beginPath();

      ctx.moveTo(
        0,
        -s
      );

      ctx.bezierCurveTo(
        s * 0.9,
        -s * 0.4,
        s * 0.7,
        s * 0.65,
        0,
        s
      );

      ctx.bezierCurveTo(
        -s * 0.7,
        s * 0.65,
        -s * 0.9,
        -s * 0.4,
        0,
        -s
      );

      ctx.closePath();

      ctx.fill();

      ctx.strokeStyle =
        "rgba(55, 30, 18, 0.45)";

      ctx.lineWidth =
        0.7;

      ctx.beginPath();

      ctx.moveTo(
        0,
        -s * 0.7
      );

      ctx.lineTo(
        0,
        s * 0.7
      );

      ctx.stroke();

      ctx.restore();
    }

    // ==========================================================
    // BAT
    // ==========================================================

    function drawBat(p) {
      const s =
        p.size;

      beginParticle(p);

      ctx.fillStyle =
        "rgba(25, 22, 30, 0.9)";

      // Body
      ctx.beginPath();

      ctx.ellipse(
        0,
        0,
        s * 0.17,
        s * 0.42,
        0,
        0,
        Math.PI * 2
      );

      ctx.fill();

      // Wings
      ctx.beginPath();

      ctx.moveTo(
        -s * 0.1,
        0
      );

      ctx.quadraticCurveTo(
        -s * 0.55,
        -s * 0.65,
        -s,
        -s * 0.25
      );

      ctx.quadraticCurveTo(
        -s * 0.75,
        s * 0.12,
        -s * 0.28,
        s * 0.28
      );

      ctx.closePath();

      ctx.fill();

      ctx.beginPath();

      ctx.moveTo(
        s * 0.1,
        0
      );

      ctx.quadraticCurveTo(
        s * 0.55,
        -s * 0.65,
        s,
        -s * 0.25
      );

      ctx.quadraticCurveTo(
        s * 0.75,
        s * 0.12,
        s * 0.28,
        s * 0.28
      );

      ctx.closePath();

      ctx.fill();

      ctx.restore();
    }

    // ==========================================================
    // GHOST
    // ==========================================================

    function drawGhost(p) {
      const s =
        p.size;

      beginParticle(p);

      ctx.fillStyle =
        "rgba(245, 245, 245, 0.8)";

      ctx.beginPath();

      ctx.arc(
        0,
        -s * 0.1,
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
        s * 0.35,
        0,
        s * 0.6
      );

      ctx.quadraticCurveTo(
        -s * 0.25,
        s * 0.35,
        -s * 0.48,
        s * 0.55
      );

      ctx.closePath();

      ctx.fill();

      ctx.fillStyle =
        "rgba(40, 35, 45, 0.5)";

      ctx.beginPath();

      ctx.arc(
        -s * 0.16,
        -s * 0.18,
        s * 0.055,
        0,
        Math.PI * 2
      );

      ctx.arc(
        s * 0.16,
        -s * 0.18,
        s * 0.055,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.restore();
    }

    // ==========================================================
    // PUMPKIN
    // ==========================================================

    function drawPumpkin(p) {
      const s =
        p.size;

      beginParticle(p);

      ctx.fillStyle =
        "rgba(190, 76, 28, 0.85)";

      ctx.beginPath();

      ctx.ellipse(
        -s * 0.22,
        0,
        s * 0.38,
        s * 0.48,
        0,
        0,
        Math.PI * 2
      );

      ctx.ellipse(
        s * 0.22,
        0,
        s * 0.38,
        s * 0.48,
        0,
        0,
        Math.PI * 2
      );

      ctx.fill();

      // Stem
      ctx.fillStyle =
        "rgba(65, 80, 40, 0.85)";

      ctx.fillRect(
        -s * 0.08,
        -s * 0.58,
        s * 0.16,
        s * 0.18
      );

      // Face
      ctx.fillStyle =
        "rgba(35, 22, 20, 0.9)";

      ctx.beginPath();

      ctx.moveTo(
        -s * 0.35,
        -s * 0.05
      );

      ctx.lineTo(
        -s * 0.18,
        -s * 0.14
      );

      ctx.lineTo(
        -s * 0.24,
        s * 0.02
      );

      ctx.closePath();

      ctx.fill();

      ctx.beginPath();

      ctx.moveTo(
        s * 0.35,
        -s * 0.05
      );

      ctx.lineTo(
        s * 0.18,
        -s * 0.14
      );

      ctx.lineTo(
        s * 0.24,
        s * 0.02
      );

      ctx.closePath();

      ctx.fill();

      ctx.beginPath();

      ctx.moveTo(
        -s * 0.28,
        s * 0.2
      );

      ctx.quadraticCurveTo(
        0,
        s * 0.4,
        s * 0.28,
        s * 0.2
      );

      ctx.strokeStyle =
        "rgba(35, 22, 20, 0.9)";

      ctx.lineWidth =
        1;

      ctx.stroke();

      ctx.restore();
    }

    // ==========================================================
    // SPIDER
    // ==========================================================

    function drawSpider(p) {
      const s =
        p.size;

      ctx.save();

      ctx.globalAlpha =
        clamp(
          p.opacity *
            CONFIG.opacity,
          0,
          1
        );

      ctx.strokeStyle =
        "rgba(35, 30, 38, 0.75)";

      ctx.lineWidth =
        0.7;

      // Silk thread
      ctx.beginPath();

      ctx.moveTo(
        p.x,
        0
      );

      ctx.lineTo(
        p.x,
        p.y
      );

      ctx.stroke();

      ctx.translate(
        p.x,
        p.y
      );

      // Body
      ctx.fillStyle =
        "rgba(30, 27, 35, 0.9)";

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
        const yy =
          -s * 0.28 +
          i *
            s *
            0.18;

        ctx.beginPath();

        ctx.moveTo(
          -s * 0.18,
          yy
        );

        ctx.quadraticCurveTo(
          -s * 0.65,
          yy -
            s * 0.12,
          -s * 0.85,
          yy +
            s * 0.12
        );

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(
          s * 0.18,
          yy
        );

        ctx.quadraticCurveTo(
          s * 0.65,
          yy -
            s * 0.12,
          s * 0.85,
          yy +
            s * 0.12
        );

        ctx.stroke();
      }

      ctx.restore();
    }

    // ==========================================================
    // WEB
    // ==========================================================

    function drawWeb(p) {
      const s =
        p.size;

      beginParticle(p);

      ctx.strokeStyle =
        "rgba(85, 75, 90, 0.8)";

      ctx.lineWidth =
        0.65;

      const arms =
        8;

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
          Math.cos(angle) *
            s,
          Math.sin(angle) *
            s
        );

        ctx.stroke();
      }

      for (
        let ring = 1;
        ring <= 4;
        ring++
      ) {
        const radius =
          (s / 4) *
          ring;

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

          if (
            i === 0
          ) {
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

    // ==========================================================
    // MOON
    // ==========================================================

    function drawMoon(p) {
      const s =
        p.size;

      ctx.save();

      ctx.globalAlpha =
        clamp(
          p.opacity *
            CONFIG.opacity,
          0,
          1
        );

      ctx.fillStyle =
        "rgba(210, 198, 158, 0.8)";

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        s,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.globalCompositeOperation =
        "destination-out";

      ctx.beginPath();

      ctx.arc(
        p.x +
          s * 0.42,
        p.y -
          s * 0.18,
        s * 0.9,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.globalCompositeOperation =
        "source-over";

      ctx.restore();
    }

    // ==========================================================
    // STAR
    // ==========================================================

    function drawStar(p) {
      const s =
        p.size;

      ctx.save();

      ctx.translate(
        p.x,
        p.y
      );

      ctx.globalAlpha =
        clamp(
          p.opacity *
            CONFIG.opacity,
          0,
          1
        );

      ctx.fillStyle =
        "rgba(220, 200, 145, 0.85)";

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        s,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.restore();
    }

    // ==========================================================
    // WITCH HAT
    // ==========================================================

    function drawWitchHat(p) {
      const s =
        p.size;

      beginParticle(p);

      ctx.fillStyle =
        "rgba(42, 28, 55, 0.85)";

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

      ctx.fillStyle =
        "rgba(155, 75, 32, 0.9)";

      ctx.fillRect(
        -s * 0.35,
        s * 0.1,
        s * 0.7,
        s * 0.12
      );

      ctx.restore();
    }

    // ==========================================================
    // TOMBSTONE
    // ==========================================================

    function drawTombstone(p) {
      const s =
        p.size;

      beginParticle(p);

      ctx.fillStyle =
        "rgba(70, 67, 76, 0.65)";

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

      ctx.restore();
    }

    // ==========================================================
    // DRAW PARTICLE
    // ==========================================================

    function drawParticle(p) {
      switch (
        p.type
      ) {
        case TYPE.LEAF:
          drawLeaf(p);
          break;

        case TYPE.BAT:
          drawBat(p);
          break;

        case TYPE.GHOST:
          drawGhost(p);
          break;

        case TYPE.PUMPKIN:
          drawPumpkin(p);
          break;

        case TYPE.SPIDER:
          drawSpider(p);
          break;

        case TYPE.WEB:
          drawWeb(p);
          break;

        case TYPE.MOON:
          drawMoon(p);
          break;

        case TYPE.STAR:
          drawStar(p);
          break;

        case TYPE.WITCH_HAT:
          drawWitchHat(p);
          break;

        case TYPE.TOMBSTONE:
          drawTombstone(p);
          break;
      }
    }

    // ==========================================================
    // UPDATE
    // ==========================================================

    function updateParticle(p) {
      p.phase +=
        p.phaseSpeed;

      p.life +=
        0.015;

      // --------------------------------------------------------
      // LEAF
      // --------------------------------------------------------

      if (
        p.type === TYPE.LEAF
      ) {
        p.y +=
          p.speed;

        p.x +=
          Math.sin(
            p.phase
          ) *
          p.drift *
          0.3;

        p.rotation +=
          p.rotationSpeed;
      }

      // --------------------------------------------------------
      // BAT
      // --------------------------------------------------------

      else if (
        p.type === TYPE.BAT
      ) {
        p.x +=
          p.speed *
          p.direction;

        p.y +=
          Math.sin(
            p.phase
          ) *
          0.35;

        p.rotation =
          Math.sin(
            p.phase
          ) *
          0.08;

        if (
          p.direction === 1 &&
          p.x >
            width + 100
        ) {
          Object.assign(
            p,
            createParticle(
              TYPE.BAT
            )
          );
        }

        if (
          p.direction === -1 &&
          p.x <
            -100
        ) {
          Object.assign(
            p,
            createParticle(
              TYPE.BAT
            )
          );
        }
      }

      // --------------------------------------------------------
      // GHOST
      // --------------------------------------------------------

      else if (
        p.type === TYPE.GHOST
      ) {
        p.y +=
          p.speed;

        p.x +=
          Math.sin(
            p.phase
          ) *
          p.drift *
          0.2;

        p.rotation =
          Math.sin(
            p.phase
          ) *
          0.04;

        if (
          p.y >
            height + 80
        ) {
          Object.assign(
            p,
            createParticle(
              TYPE.GHOST
            )
          );
        }
      }

      // --------------------------------------------------------
      // PUMPKIN
      // --------------------------------------------------------

      else if (
        p.type === TYPE.PUMPKIN
      ) {
        p.y +=
          p.speed;

        p.x +=
          Math.sin(
            p.phase
          ) *
          p.drift *
          0.15;

        p.rotation +=
          p.rotationSpeed;

        if (
          p.y >
            height + 80
        ) {
          Object.assign(
            p,
            createParticle(
              TYPE.PUMPKIN
            )
          );
        }
      }

      // --------------------------------------------------------
      // SPIDER
      // --------------------------------------------------------

      else if (
        p.type === TYPE.SPIDER
      ) {
        p.y +=
          p.speed;

        if (
          p.y >
            p.threadLength
        ) {
          p.y =
            p.threadLength;

          p.speed *=
            -1;
        }

        if (
          p.y < 0
        ) {
          p.y = 0;

          p.speed =
            Math.abs(
              p.speed
            );
        }
      }

      // --------------------------------------------------------
      // WITCH HAT
      // --------------------------------------------------------

      else if (
        p.type === TYPE.WITCH_HAT
      ) {
        p.y +=
          p.speed;

        p.x +=
          Math.sin(
            p.phase
          ) *
          p.drift *
          0.2;

        p.rotation =
          Math.sin(
            p.phase
          ) *
          0.08;

        if (
          p.y >
            height + 80
        ) {
          Object.assign(
            p,
            createParticle(
              TYPE.WITCH_HAT
            )
          );
        }
      }

      // --------------------------------------------------------
      // STAR
      // --------------------------------------------------------

      else if (
        p.type === TYPE.STAR
      ) {
        p.opacity =
          0.25 +
          Math.sin(
            p.life
          ) *
          0.18;
      }

      // --------------------------------------------------------
      // MOON
      // --------------------------------------------------------

      else if (
        p.type === TYPE.MOON
      ) {
        p.x +=
          Math.sin(
            p.phase
          ) *
          0.05;
      }

      // --------------------------------------------------------
      // WEB
      // --------------------------------------------------------

      else if (
        p.type === TYPE.WEB
      ) {
        p.rotation +=
          p.rotationSpeed;
      }

      // --------------------------------------------------------
      // TOMBSTONE
      // --------------------------------------------------------

      else if (
        p.type === TYPE.TOMBSTONE
      ) {
        p.y +=
          p.speed;

        p.x +=
          Math.sin(
            p.phase
          ) *
          0.05;

        if (
          p.y >
            height + 80
        ) {
          Object.assign(
            p,
            createParticle(
              TYPE.TOMBSTONE
            )
          );
        }
      }

      // --------------------------------------------------------
      // GENERAL BOUNDS
      // --------------------------------------------------------

      if (
        p.type !== TYPE.WEB &&
        p.type !== TYPE.MOON &&
        p.type !== TYPE.STAR &&
        p.type !== TYPE.SPIDER
      ) {
        if (
          p.x <
            -150
        ) {
          p.x =
            width + 50;
        }

        if (
          p.x >
            width + 150
        ) {
          p.x =
            -50;
        }
      }
    }

    // ==========================================================
    // ANIMATION LOOP
    // ==========================================================

    let animationFrame =
      null;

    let running =
      true;

    function animate() {
      if (!running) {
        return;
      }

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

    // ==========================================================
    // EVENT HANDLERS
    // ==========================================================

    function handleResize() {
      resize();

      initializeParticles();
    }

    window.addEventListener(
      "resize",
      handleResize,
      {
        passive: true
      }
    );

    // ==========================================================
    // PUBLIC API
    // ==========================================================

    function destroy() {
      log(
        "Destroying Halloween Atmosphere."
      );

      running = false;

      if (
        animationFrame !== null
      ) {
        cancelAnimationFrame(
          animationFrame
        );
      }

      window.removeEventListener(
        "resize",
        handleResize
      );

      canvas.remove();

      particles.length = 0;

      window.ShopBaseHalloweenEffect =
        null;
    }

    function restart() {
      log(
        "Restarting Halloween Atmosphere."
      );

      running = false;

      if (
        animationFrame !== null
      ) {
        cancelAnimationFrame(
          animationFrame
        );
      }

      initializeParticles();

      running = true;

      animate();
    }

    function setIntensity(
      value
    ) {
      const intensity =
        Number(value);

      if (
        !Number.isFinite(
          intensity
        )
      ) {
        return;
      }

      CONFIG.intensity =
        clamp(
          intensity,
          0,
          2
        );

      log(
        "Intensity:",
        CONFIG.intensity
      );

      initializeParticles();
    }

    // ==========================================================
    // EXPOSE API
    // ==========================================================

    window.ShopBaseHalloweenEffect = {
      initialized: true,

      destroy,

      restart,

      setIntensity
    };

    log(
      "Halloween Atmosphere v3 initialized."
    );

    log(
      "Particles:",
      particles.length
    );

    animate();
  }

  // ============================================================
  // START SAFELY
  // ============================================================

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );
  } else {
    init();
  }

})();