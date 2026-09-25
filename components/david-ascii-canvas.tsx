"use client";

import React, { useEffect, useRef } from "react";

export interface DavidAsciiProps {
  className?: string;
  imageSrc?: string;
  opacity?: number;
}

// Full 21st.dev recipe parameters
const CONFIG = {
  renderMode: "matrix",
  bgMode: "original",
  bgBlur: 2,
  bgOpacity: 0.73,
  cellSize: 21,
  coverage: 0.91,
  invert: false,
  brightness: 17,
  contrast: 77,
  toneCurve: [
    { x: 0, y: 0 },
    { x: 1, y: 0.8884049554781263 },
    { x: 0.5223367697594502, y: 0.7954897406116919 },
    { x: 0.3161512027491409, y: 0.1326945412311266 },
    { x: 0.6907216494845361, y: 0.4548006194347658 },
    { x: 0.1683848797250859, y: 0.2751645373596593 },
  ],
  tint: "#141414",
  tintOpacity: 0.17,
  pfx: {
    vignette: { enabled: true, intensity: 38 },
    scanLines: { enabled: true, intensity: 40 },
    bloom: { enabled: true, intensity: 25 },
  },
  animated: true,
  animStyle: "flicker",
  animSpeed: 69,
  animIntensity: 12,
};

// Glyphs sampled from 21st.dev David ASCII Matrix look (hex digits + katakana + math symbols)
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
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;
    let time = 0;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    // Offscreen canvas to sample downscaled source pixels
    const sampleCanvas = document.createElement("canvas");
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth || document.documentElement.clientWidth;
      const h = window.innerHeight || document.documentElement.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Spline tone curve lookup table (256 values)
    const lut = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      const normalized = i / 255;
      // Contrast and brightness adjustment
      const contrastFactor = (259 * (CONFIG.contrast + 255)) / (255 * (259 - CONFIG.contrast));
      let val = contrastFactor * ((normalized - 0.5) * 255) + 128 + (CONFIG.brightness * 1.5);
      // Clamp
      val = Math.max(0, Math.min(255, val));
      lut[i] = Math.round(val);
    }

    // Matrix column state for self-animated rain
    interface Column {
      y: number;
      speed: number;
      length: number;
    }
    let columns: Column[] = [];

    const initColumns = (colsCount: number) => {
      columns = [];
      for (let i = 0; i < colsCount; i++) {
        columns.push({
          y: Math.random() * 50 - 50,
          speed: 0.4 + Math.random() * 0.8,
          length: Math.floor(8 + Math.random() * 16),
        });
      }
    };

    const render = () => {
      if (!isRunning || !ctx || !canvas || !img.complete || img.naturalWidth === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += (CONFIG.animSpeed / 100) * 0.05;

      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      const cellSize = Math.max(14, Math.round(CONFIG.cellSize * (w / 1440)));
      const cols = Math.ceil(w / cellSize);
      const rows = Math.ceil(h / cellSize);

      if (columns.length !== cols) {
        initColumns(cols);
      }

      // Step 1: Draw source photo with background parameters
      ctx.clearRect(0, 0, w, h);

      // Compute cover aspect ratio
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

      // Draw background original photo at bgOpacity
      if (CONFIG.bgMode === "original") {
        ctx.save();
        ctx.filter = `blur(${CONFIG.bgBlur}px) grayscale(100%)`;
        ctx.globalAlpha = CONFIG.bgOpacity * 0.7;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      // Sample pixels into small offscreen canvas aligned with cover coords
      if (sampleCtx) {
        sampleCanvas.width = cols;
        sampleCanvas.height = rows;
        sampleCtx.clearRect(0, 0, cols, rows);
        sampleCtx.drawImage(
          img,
          (drawX / w) * cols,
          (drawY / h) * rows,
          (drawW / w) * cols,
          (drawH / h) * rows
        );
        const imgData = sampleCtx.getImageData(0, 0, cols, rows).data;

        // Step 2 & 3: Render Matrix code characters
        ctx.font = `600 ${Math.round(cellSize * 0.8)}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            // Pseudo-random coverage check
            const hash = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
            if (Math.abs(hash) > CONFIG.coverage) continue;

            const idx = (y * cols + x) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];

            // Grayscale luminance
            let lum = 0.299 * r + 0.587 * g + 0.114 * b;
            lum = lut[Math.min(255, Math.floor(lum))];

            if (lum < 15) continue; // skip deep blacks

            // Matrix animation & flicker
            const col = columns[x];
            const distFromHead = y - col.y;
            const isInRain = distFromHead >= 0 && distFromHead < col.length;
            const isHead = Math.floor(distFromHead) === 0;

            let flicker = 1;
            if (CONFIG.animStyle === "flicker") {
              const noise = Math.sin(x * 7.1 + y * 3.7 + time * 12);
              flicker = 1 + (noise * (CONFIG.animIntensity / 100));
            }

            // Pick character based on luminance + coordinate seed + time
            const charIdx = Math.floor(
              (Math.abs(Math.sin(x * 93.1 + y * 17.3 + Math.floor(time * 3))) * 1000)
            ) % MATRIX_CHARS.length;
            const char = MATRIX_CHARS[charIdx];

            const cx = x * cellSize + cellSize / 2;
            const cy = y * cellSize + cellSize / 2;

            const alpha = Math.min(1, Math.max(0.15, (lum / 255) * flicker));

            // Color choice: chiaroscuro white/silver with subtle matrix green/cyan head
            if (isInRain && isHead) {
              ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.5)})`;
              ctx.shadowColor = "#ffffff";
              ctx.shadowBlur = 6;
            } else if (isInRain) {
              ctx.fillStyle = `rgba(210, 235, 220, ${alpha * 0.95})`;
              ctx.shadowColor = "rgba(100, 240, 180, 0.4)";
              ctx.shadowBlur = 4;
            } else {
              ctx.fillStyle = `rgba(${lum}, ${Math.min(255, lum + 15)}, ${Math.min(255, lum + 20)}, ${alpha * 0.75})`;
              ctx.shadowBlur = 0;
            }

            ctx.fillText(char, cx, cy);
          }
        }
      }

      // Update falling matrix columns
      for (let i = 0; i < columns.length; i++) {
        columns[i].y += columns[i].speed;
        if (columns[i].y - columns[i].length > rows) {
          columns[i].y = -Math.random() * 20;
          columns[i].speed = 0.4 + Math.random() * 0.8;
          columns[i].length = Math.floor(8 + Math.random() * 16);
        }
      }

      // Step 4 & 5: Post-effects (scanLines, bloom, vignette)
      // 5.1 Scanlines
      if (CONFIG.pfx.scanLines.enabled) {
        const scanAlpha = (CONFIG.pfx.scanLines.intensity / 100) * 0.22;
        ctx.fillStyle = `rgba(0, 0, 0, ${scanAlpha})`;
        for (let y = 0; y < h; y += 4) {
          ctx.fillRect(0, y, w, 2);
        }
      }

      // 5.2 Vignette
      if (CONFIG.pfx.vignette.enabled) {
        const vigRadius = Math.max(w, h) * 0.65;
        const vigGradient = ctx.createRadialGradient(
          w / 2,
          h / 2,
          vigRadius * 0.35,
          w / 2,
          h / 2,
          vigRadius
        );
        const vigAlpha = (CONFIG.pfx.vignette.intensity / 100) * 0.85;
        vigGradient.addColorStop(0, "rgba(5, 5, 5, 0)");
        vigGradient.addColorStop(0.7, `rgba(5, 5, 5, ${vigAlpha * 0.6})`);
        vigGradient.addColorStop(1, `rgba(5, 5, 5, ${vigAlpha})`);

        ctx.fillStyle = vigGradient;
        ctx.fillRect(0, 0, w, h);
      }

      // 5.3 Bottom & Top Edge Fade into page background (#050505)
      const fadeGrad = ctx.createLinearGradient(0, 0, 0, h);
      fadeGrad.addColorStop(0, "rgba(5, 5, 5, 0.4)");
      fadeGrad.addColorStop(0.15, "rgba(5, 5, 5, 0)");
      fadeGrad.addColorStop(0.7, "rgba(5, 5, 5, 0.2)");
      fadeGrad.addColorStop(1, "rgba(5, 5, 5, 0.95)");
      ctx.fillStyle = fadeGrad;
      ctx.fillRect(0, 0, w, h);

      animationFrameId = requestAnimationFrame(render);
    };

    img.onload = () => {
      render();
    };

    if (img.complete) {
      render();
    }

    return () => {
      isRunning = false;
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [imageSrc]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <canvas ref={canvasRef} className="h-full w-full object-cover" />
    </div>
  );
}
