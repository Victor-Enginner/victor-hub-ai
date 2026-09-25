"use client";

import React, { useEffect, useRef } from "react";

export interface DavidAsciiProps {
  className?: string;
  imageSrc?: string;
  opacity?: number;
}

// Visual tuning
const CONFIG = {
  cellSize: 20,
  coverage: 0.88,
  brightness: 18,
  contrast: 75,
  animSpeed: 50,
  targetFps: 28,
};

// Glyphs sampled from David ASCII Matrix aesthetic
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
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    // Cache precalculado de luminescência e dimensões
    let gridCols = 0;
    let gridRows = 0;
    let lumGrid: Uint8Array | null = null;
    let drawMetrics = { x: 0, y: 0, w: 0, h: 0, cellSize: CONFIG.cellSize };

    // Tabela de contraste e curva de tom (LUT pré-calculada)
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

    // Função única de pre-amostragem (roda APENAS no load da imagem ou resize)
    const precomputeGrid = () => {
      if (!canvas || !img.complete || img.naturalWidth === 0) return;

      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      const cellSize = Math.max(16, Math.round(CONFIG.cellSize * Math.min(1.2, w / 1440)));
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

      // Offscreen temporário para extrair luminescência uma única vez
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
      lumGrid = new Uint8Array(cols * rows);

      for (let i = 0; i < cols * rows; i++) {
        const idx = i * 4;
        const r = raw[idx];
        const g = raw[idx + 1];
        const b = raw[idx + 2];
        const rawLum = 0.299 * r + 0.587 * g + 0.114 * b;
        lumGrid[i] = lut[Math.min(255, Math.floor(rawLum))];
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
      // DPR cap em 1.0 para background decorativo garante 60fps sem sobrecarregar a GPU
      const w = window.innerWidth || document.documentElement.clientWidth;
      const h = window.innerHeight || document.documentElement.clientHeight;
      canvas.width = w;
      canvas.height = h;
      precomputeGrid();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Loop de renderização 100% acelerado por hardware e desacoplado de getImageData
    const render = (now: number) => {
      if (!isRunning) return;

      animationFrameId = requestAnimationFrame(render);

      // Throttling inteligente de FPS
      const elapsed = now - lastFrameTime;
      if (elapsed < frameInterval) return;
      lastFrameTime = now - (elapsed % frameInterval);

      if (!ctx || !canvas || !lumGrid || gridCols === 0 || gridRows === 0) return;

      // Pula renderização quando aba está em segundo plano
      if (document.hidden) return;

      time += 0.04;

      const w = canvas.width;
      const h = canvas.height;
      const cellSize = drawMetrics.cellSize;

      ctx.clearRect(0, 0, w, h);

      // Fundo suave de estátua com opacidade controlada
      if (img.complete && img.naturalWidth > 0) {
        ctx.globalAlpha = 0.42;
        ctx.drawImage(img, drawMetrics.x, drawMetrics.y, drawMetrics.w, drawMetrics.h);
      }

      ctx.globalAlpha = 1.0;
      ctx.font = `600 ${Math.round(cellSize * 0.8)}px "JetBrains Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cols = gridCols;
      const rows = gridRows;
      const charsLen = MATRIX_CHARS.length;

      // Renderiza caracteres ASCII da matriz pré-calculada
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const lum = lumGrid[y * cols + x];
          if (lum < 20) continue; // ignora sombras escuras

          const col = columns[x];
          const distFromHead = y - col.y;
          const isInRain = distFromHead >= 0 && distFromHead < col.length;
          const isHead = Math.floor(distFromHead) === 0;

          // Seleciona glifo baseado no tempo e coordenadas
          const charIdx = (x * 17 + y * 31 + Math.floor(time * 2)) % charsLen;
          const char = MATRIX_CHARS[charIdx];

          const cx = x * cellSize + cellSize / 2;
          const cy = y * cellSize + cellSize / 2;

          if (isInRain && isHead) {
            ctx.fillStyle = "#ffffff";
          } else if (isInRain) {
            ctx.fillStyle = "#a7f3d0"; // verde matrix suave
          } else {
            const alpha = Math.min(0.9, Math.max(0.2, lum / 255));
            ctx.fillStyle = `rgba(240, 240, 245, ${alpha})`;
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
    };

    img.onload = () => {
      precomputeGrid();
    };

    if (img.complete) {
      precomputeGrid();
    }

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

      {/* Efeito Scanlines otimizado via CSS puro (GPU) sem loop de repaints */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Vinheta radial otimizada via CSS puro */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "radial-gradient(circle at center, transparent 40%, rgba(5, 5, 5, 0.85) 100%)",
        }}
      />
    </div>
  );
}
