(function () {
  const cfg = window.VHConfig;
  if (cfg && cfg.wa) {
    document.querySelectorAll("[data-wa]").forEach((a) => {
      a.href = cfg.wa(a.getAttribute("data-wa") || "orcamento");
    });
  }

  const canvas = document.getElementById("mesh");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canvas && !reduce) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, raf = 0, t = 0;
    const mouse = { x: 0.72, y: 0.28, tx: 0.72, ty: 0.28 };
    function resize() {
      w = canvas.width = Math.floor(canvas.offsetWidth * devicePixelRatio);
      h = canvas.height = Math.floor(canvas.offsetHeight * devicePixelRatio);
    }
    function draw() {
      t += 0.006;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      ctx.clearRect(0, 0, w, h);
      const cols = 28;
      const rows = 16;
      const pts = [];
      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          const px = (x / cols) * w;
          const py = (y / rows) * h;
          const nx = x / cols;
          const ny = y / rows;
          const wave = Math.sin(nx * 8 + t) * Math.cos(ny * 6 - t * 0.8);
          pts.push([px + wave * 10 * devicePixelRatio, py + wave * 8 * devicePixelRatio, nx, ny]);
        }
      }
      const glowX = mouse.x * w;
      const glowY = mouse.y * h;
      ctx.lineWidth = 1;
      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          const i = y * (cols + 1) + x;
          const p = pts[i];
          const dx = p[0] - glowX;
          const dy = p[1] - glowY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const near = Math.max(0, 1 - dist / (420 * devicePixelRatio));
          if (x < cols) {
            const q = pts[i + 1];
            ctx.strokeStyle = "rgba(239,35,60," + (0.015 + near * 0.22) + ")";
            ctx.beginPath();
            ctx.moveTo(p[0], p[1]);
            ctx.lineTo(q[0], q[1]);
            ctx.stroke();
          }
          if (y < rows) {
            const q = pts[i + cols + 1];
            ctx.strokeStyle = "rgba(239,35,60," + (0.012 + near * 0.16) + ")";
            ctx.beginPath();
            ctx.moveTo(p[0], p[1]);
            ctx.lineTo(q[0], q[1]);
            ctx.stroke();
          }
        }
      }
      const g = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 280 * devicePixelRatio);
      g.addColorStop(0, "rgba(239,35,60,0.16)");
      g.addColorStop(1, "rgba(239,35,60,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      raf = requestAnimationFrame(draw);
    }
    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", (e) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else draw();
    });
  }

  const menu = document.getElementById("menu-btn");
  const links = document.getElementById("nav-links");
  if (menu && links) {
    menu.addEventListener("click", () => links.classList.toggle("open"));
    links.addEventListener("click", () => links.classList.remove("open"));
  }
  const modal = document.getElementById("plan-modal");
  const open = document.getElementById("open-plan");
  const close = document.getElementById("close-plan");
  if (open && modal) open.addEventListener("click", () => modal.classList.remove("hidden"));
  if (close && modal) close.addEventListener("click", () => modal.classList.add("hidden"));
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });
})();
