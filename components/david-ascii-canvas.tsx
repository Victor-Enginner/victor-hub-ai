"use client";

import React, { useEffect, useRef } from "react";

export interface DavidAsciiProps {
  className?: string;
  imageSrc?: string;
  opacity?: number;
}

// Configuração visual da matriz ASCII
const CONFIG = {
  cellSize: 18,
  coverage: 0.92,
  brightness: 22,
  contrast: 80,
  targetFps: 30,
};

// Caracteres estilo Matrix Cyberpunk
const MATRIX_CHARS = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "A", "B", "C", "D", "E", "F", "X", "Z",
  "ﾊ", "ﾐ", "ﾋ", "ｰ", "ｳ", "ｼ", "ﾅ", "ﾓ", "ｸ", "ﾔ", "ｻ", "ﾃ", "ﾂ",
  "•", ":", "*", "+", "§", "%", "$", "#", "@"
];

export default function DavidAsciiCanvas({
  className = "",
  imageSrc = "/david.jpg",
  opacity = 0.55,
}: DavidAsciiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;
    let time = 0;
    let lastFrameTime = 0;
    const frameInterval = 1000 / CONFIG.targetFps;

    const img = new Image();
    // NÃO colocar crossOrigin = 'anonymous' para imagem local/same-origin para evitar erro de canvas tainted no Chrome

    let gridCols = 0;
    let gridRows = 0;
    let lumGrid: Uint8Array | null = null;
    let drawMetrics = { x: 0, y: 0, w: 0, h: 0, cellSize: CONFIG.cellSize };

    // Tabela de contraste e tom (LUT pré-calculada)
    const lut = new Uint8Array(256);
    const contrastFactor = (259 * (CONFIG.contrast + 255)) / (255 * (259 - CONFIG.contrast));
    for (let i = 0; i < 256; i++) {
      const normalized = i / 255;
      let val = contrastFactor * ((normalized - 0.5) * 255) + 128 + (CONFIG.brightness * 1.5);
      lut[i] = Math.max(0, Math.min(255, Math.round(val)));
    }

    interface Column {
      y: number;
      speed: number;
      length: number;
    }
    let columns: Column[] = [];

    const precomputeGrid = () => {
      if (!canvas || !img.complete || img.naturalWidth === 0) return;

      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      const cellSize = Math.max(14, Math.round(CONFIG.cellSize * Math.min(1.2, w / 1440)));
      const cols = Math.ceil(w / cellSize);
      const rows = Math.ceil(h / cellSize);

      gridCols = cols;
      gridRows = rows;

      // Aspect ratio cover
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = w / h;
      let drawW = w;
      let drawH = h;
      let drawX = 0;
      let drawY = 0;

      if (canvasRatio > imgRatio) {
        drawW = w;
        drawH = w / imgRatio;
        drawY = (h - drawH) / 2;
      } else {
        drawH = h;
        drawW = h * imgRatio;
        drawX = (w - drawW) / 2;
      }

      drawMetrics = { x: drawX, y: drawY, w: drawW, h: drawH, cellSize };

      try {
        const offCanvas = document.createElement("canvas");
        offCanvas.width = cols;
        offCanvas.height = rows;
        const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
        if (!offCtx) return;

        offCtx.drawImage(
          img,
          (drawX / w) * cols,
          (drawY / h) * rows,
          (drawW / w) * cols,
          (drawH / h) * rows
        );

        const raw = offCtx.getImageData(0, 0, cols, rows).data;
        const grid = new Uint8Array(cols * rows);

        for (let i = 0; i < cols * rows; i++) {
          const idx = i * 4;
          const r = raw[idx];
          const g = raw[idx + 1];
          const b = raw[idx + 2];
          const rawLum = 0.299 * r + 0.587 * g + 0.114 * b;
          grid[i] = lut[Math.min(255, Math.floor(rawLum))];
        }
        lumGrid = grid;
      } catch (err) {
        console.warn("Could not precompute ASCII luminance grid:", err);
      }

      // Reinicializa colunas de matrix rain
      columns = [];
      for (let i = 0; i < cols; i++) {
        columns.push({
          y: Math.random() * 40 - 40,
          speed: 0.35 + Math.random() * 0.65,
          length: Math.floor(6 + Math.random() * 12),
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      const w = window.innerWidth || document.documentElement.clientWidth;
      const h = window.innerHeight || document.documentElement.clientHeight;
      canvas.width = w;
      canvas.height = h;
      precomputeGrid();
    };

    img.onload = () => {
      precomputeGrid();
    };
    img.src = imageSrc;
    if (img.complete && img.naturalWidth > 0) {
      precomputeGrid();
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    // Render loop
    const render = (now: number) => {
      if (!isRunning) return;

      animationFrameId = requestAnimationFrame(render);

      const elapsed = now - lastFrameTime;
      if (elapsed < frameInterval) return;
      lastFrameTime = now - (elapsed % frameInterval);

      if (!ctx || !canvas) return;
      if (document.hidden) return;

      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      // Se a imagem terminou de carregar e a grade ainda não foi calculada
      if (!lumGrid && img.complete && img.naturalWidth > 0) {
        precomputeGrid();
      }

      time += 0.04;
      const cellSize = drawMetrics.cellSize;

      ctx.clearRect(0, 0, w, h);

      // Fundo da imagem original com opacidade controlada
      if (img.complete && img.naturalWidth > 0 && drawMetrics.w > 0) {
        ctx.globalAlpha = 0.38;
        ctx.drawImage(img, drawMetrics.x, drawMetrics.y, drawMetrics.w, drawMetrics.h);
      }

      // Se temos a grade ASCII calculada, desenhamos os caracteres
      if (lumGrid && gridCols > 0 && gridRows > 0) {
        ctx.globalAlpha = 1.0;
        ctx.font = `600 ${Math.round(cellSize * 0.85)}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const cols = gridCols;
        const rows = gridRows;
        const charsLen = MATRIX_CHARS.length;

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const lum = lumGrid[y * cols + x];
            if (lum < 20) continue; // ignora sombras escuras

            const col = columns[x];
            const distFromHead = col ? y - col.y : -1;
            const isInRain = distFromHead >= 0 && distFromHead < (col?.length || 0);
            const isHead = Math.floor(distFromHead) === 0;

            const charIdx = (x * 17 + y * 31 + Math.floor(time * 2)) % charsLen;
            const char = MATRIX_CHARS[charIdx];

            const cx = x * cellSize + cellSize / 2;
            const cy = y * cellSize + cellSize / 2;

            if (isInRain && isHead) {
              ctx.fillStyle = "#ffffff";
            } else if (isInRain) {
              ctx.fillStyle = "#ff6b81"; // toque sutil vermelho neon
            } else {
              const alpha = Math.min(0.95, Math.max(0.25, lum / 255));
              ctx.fillStyle = `rgba(245, 245, 250, ${alpha})`;
            }

            ctx.fillText(char, cx, cy);
          }
        }

        // Atualiza chuva da matriz
        for (let i = 0; i < columns.length; i++) {
          columns[i].y += columns[i].speed;
          if (columns[i].y - columns[i].length > rows) {
            columns[i].y = -Math.random() * 15;
            columns[i].speed = 0.35 + Math.random() * 0.65;
            columns[i].length = Math.floor(6 + Math.random() * 12);
          }
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [imageSrc]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden transform-gpu will-change-transform ${className}`}
      style={{ opacity, transform: "translate3d(0, 0, 0)" }}
    >
      <canvas ref={canvasRef} className="h-full w-full object-cover transform-gpu" />

      {/* Efeito Scanlines otimizado via CSS puro */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.22) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Vinheta radial */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "radial-gradient(circle at center, transparent 45%, rgba(5, 5, 5, 0.82) 100%)",
        }}
      />
    </div>
  );
}
