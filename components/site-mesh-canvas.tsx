"use client";

import React, { useEffect, useRef } from "react";

export interface SiteMeshCanvasProps {
  className?: string;
  dotGrid?: boolean;
}

export default function SiteMeshCanvas({
  className = "",
  dotGrid = true,
}: SiteMeshCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let isRunning = true;
    const mouse = { x: 0.72, y: 0.28, tx: 0.72, ty: 0.28 };

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    }

    function draw() {
      if (!isRunning || !ctx || !canvas) return;
      if (document.hidden) {
        raf = requestAnimationFrame(draw);
        return;
      }

      t += 0.007;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const cols = 28;
      const rows = 16;
      const pts: [number, number, number, number][] = [];

      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          const px = (x / cols) * w;
          const py = (y / rows) * h;
          const nx = x / cols;
          const ny = y / rows;
          const wave = Math.sin(nx * 8 + t) * Math.cos(ny * 6 - t * 0.8);
          pts.push([px + wave * 10 * dpr, py + wave * 8 * dpr, nx, ny]);
        }
      }

      const glowX = mouse.x * w;
      const glowY = mouse.y * h;
      ctx.lineWidth = 1;

      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          const i = y * (cols + 1) + x;
          const p = pts[i];
          if (!p) continue;
          const dx = p[0] - glowX;
          const dy = p[1] - glowY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const near = Math.max(0, 1 - dist / (420 * dpr));

          if (x < cols) {
            const q = pts[i + 1];
            if (q) {
              ctx.strokeStyle = "rgba(239, 35, 60, " + (0.025 + near * 0.32) + ")";
              ctx.beginPath();
              ctx.moveTo(p[0], p[1]);
              ctx.lineTo(q[0], q[1]);
              ctx.stroke();
            }
          }
          if (y < rows) {
            const q = pts[i + cols + 1];
            if (q) {
              ctx.strokeStyle = "rgba(239, 35, 60, " + (0.02 + near * 0.24) + ")";
              ctx.beginPath();
              ctx.moveTo(p[0], p[1]);
              ctx.lineTo(q[0], q[1]);
              ctx.stroke();
            }
          }
        }
      }

      // Brilho radial no cursor
      const g = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 320 * dpr);
      g.addColorStop(0, "rgba(239, 35, 60, 0.22)");
      g.addColorStop(0.5, "rgba(239, 35, 60, 0.06)");
      g.addColorStop(1, "rgba(239, 35, 60, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const handlePointerMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      isRunning = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}>
      {/* Mesh Interativo */}
      <canvas ref={canvasRef} className="h-full w-full object-cover" />

      {/* Cyber Dot Grid Original */}
      {dotGrid && (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255, 255, 255, 0.055) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      )}
    </div>
  );
}
