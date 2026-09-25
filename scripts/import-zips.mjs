#!/usr/bin/env node

/**
 * ==============================================================================
 * VICTOR HUB AI - IMPORTADOR DE COMPONENTES & TEMPLATES (.ZIP / PASTAS)
 * ==============================================================================
 * Escaneia o workspace em busca de arquivos .zip de templates, kits de componentes
 * e bibliotecas de prompts salvos pelo Victor. Indexa automaticamente no Arsenal.
 *
 * Uso:
 *   node scripts/import-zips.mjs
 *   node scripts/import-zips.mjs ./caminho/para/pasta
 * ==============================================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT_DIR, "data");
const OUTPUT_FILE = path.join(DATA_DIR, "imported-components.json");

// Diretório de escaneamento inicial (pode ser passado como argumento)
const targetDir = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : ROOT_DIR;

console.log("==================================================================");
console.log("⚡ VICTOR HUB AI - SCANNER DE ARQUIVOS E COMPONENTES ZIP");
console.log(`📁 Diretório de busca: ${targetDir}`);
console.log("==================================================================");

function scanForZipsAndTemplates(dir, depth = 0, maxDepth = 3) {
  let results = [];
  if (depth > maxDepth) return results;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      // Ignorar node_modules, .git, .next, etc.
      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === ".git" ||
        entry.name === "dist" ||
        entry.name === ".gemini"
      ) {
        continue;
      }

      const fullPath = path.join(dir, entry.name);

      if (entry.isFile() && entry.name.toLowerCase().endsWith(".zip")) {
        const stats = fs.statSync(fullPath);
        const relativePath = path.relative(ROOT_DIR, fullPath);
        const nameWithoutExt = entry.name.replace(/\.zip$/i, "");
        const formattedTitle = nameWithoutExt
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        results.push({
          id: `zip-${nameWithoutExt.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          name: formattedTitle,
          filename: entry.name,
          relativePath,
          sizeBytes: stats.size,
          sizeFormatted: (stats.size / (1024 * 1024)).toFixed(2) + " MB",
          lastModified: stats.mtime.toISOString(),
          category: detectCategory(entry.name),
          tags: ["zip", "template", "componentes", "tailwind"],
          status: "indexado",
          autoExtracted: false,
        });
      } else if (entry.isDirectory()) {
        results = results.concat(scanForZipsAndTemplates(fullPath, depth + 1, maxDepth));
      }
    }
  } catch (err) {
    console.warn(`[Aviso] Falha ao ler pasta ${dir}:`, err.message);
  }

  return results;
}

function detectCategory(filename) {
  const f = filename.toLowerCase();
  if (f.includes("os") || f.includes("system") || f.includes("cockpit")) return "Templates de Sistema (OS)";
  if (f.includes("landing") || f.includes("site") || f.includes("vendas")) return "Landing Pages & Vendas";
  if (f.includes("agent") || f.includes("prompt") || f.includes("ai")) return "Biblioteca de IA & Prompts";
  if (f.includes("component") || f.includes("ui") || f.includes("visual")) return "Componentes Visuais Tailwind";
  return "Acervo Geral de Produção";
}

// Executar varredura
const foundZips = scanForZipsAndTemplates(targetDir);

// Garantir que a pasta data/ existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Salvar inventário
const catalog = {
  updatedAt: new Date().toISOString(),
  targetDirectory: targetDir,
  totalItems: foundZips.length,
  items: foundZips,
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(catalog, null, 2), "utf-8");

console.log(`\n✓ Escaneamento concluído! Encontrados ${foundZips.length} pacotes de templates/componentes:`);
foundZips.forEach((item, idx) => {
  console.log(`  [${idx + 1}] ${item.name} (${item.sizeFormatted}) -> ${item.relativePath}`);
});

console.log(`\n💾 Catálogo salvo em: ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
console.log("==================================================================");
