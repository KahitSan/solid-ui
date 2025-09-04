import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite'

import type { Plugin } from "rollup";
import path from "path";

/**
 * Inject import into the CSS helper chunk (X.module.css.js) when present,
 * otherwise fall back to a sibling chunk. Rename emitted .module.css -> .css,
 * and rewrite import strings to .css. Does NOT rename .module.css.js helpers.
 */
export function injectIntoCssHelperAndRename(): Plugin {
  return {
    name: "inject-into-css-helper-and-rename",
    generateBundle(_, bundle) {
      const assetsToAdd: Record<string, any> = {};
      const assetsToDelete: string[] = [];

      // Helper to compute a posix relative import starting with "./" when same dir
      const relativeImportPath = (fromFile: string, toFile: string) => {
        // Use posix so windows paths are consistent in the emitted bundle
        const fromDir = path.posix.dirname(fromFile);
        let rel = path.posix.relative(fromDir, toFile);
        if (!rel.startsWith(".") && !rel.startsWith("/")) {
          rel = `./${rel}`;
        }
        return rel;
      };

      // 1) For each .module.css asset, determine its helper chunk and inject import there
      for (const [fileName, file] of Object.entries(bundle)) {
        // Only operate on raw asset files that end with .module.css (NOT .module.css.js)
        if (file.type === "asset" && file.fileName && /\.module\.css$/.test(file.fileName)) {
          const cssAssetName = file.fileName; // e.g. "components/base/Button/Button.module.css"
          const cssAssetNewName = cssAssetName.replace(/\.module\.css$/, ".css");

          // Candidate helper chunk name: css asset + ".js"
          const helperChunkName = cssAssetName + ".js"; // e.g. "components/base/Button/Button.module.css.js"
          let injected = false;

          // If helper chunk exists, inject import into it
          if (bundle[helperChunkName] && (bundle[helperChunkName] as any).type === "chunk") {
            const helperChunk = bundle[helperChunkName] as any;
            // compute relative path from helper chunk to the new css asset name
            const rel = relativeImportPath(helperChunk.fileName, cssAssetNewName);
            const importStmt = `import "${rel}";\n`;
            if (typeof helperChunk.code === "string" && !helperChunk.code.includes(importStmt)) {
              helperChunk.code = importStmt + helperChunk.code;
            }
            injected = true;
          } else {
            // fallback: try to find a sibling JS chunk (fileName replacing .module.css with .js)
            const siblingJsName = cssAssetName.replace(/\.module\.css$/, ".js"); // e.g. "components/base/Button/Button.js"
            if (bundle[siblingJsName] && (bundle[siblingJsName] as any).type === "chunk") {
              const siblingChunk = bundle[siblingJsName] as any;
              const rel = relativeImportPath(siblingChunk.fileName, cssAssetNewName);
              const importStmt = `import "${rel}";\n`;
              if (typeof siblingChunk.code === "string" && !siblingChunk.code.includes(importStmt)) {
                siblingChunk.code = importStmt + siblingChunk.code;
              }
              injected = true;
            }
          }

          // Schedule rename of the asset (only raw css asset)
          assetsToAdd[cssAssetNewName] = { ...(file as any), fileName: cssAssetNewName };
          assetsToDelete.push(cssAssetName);

          // If we didn't find any chunk to inject into, still rename asset and we'll rewrite imports globally below
          if (!injected) {
            // no-op; rename still applied below, and global rewrite will update any imports
          }
        }
      }

      // Apply the asset renames (delete old keys, add new ones)
      for (const d of assetsToDelete) {
        delete bundle[d];
      }
      for (const [k, v] of Object.entries(assetsToAdd)) {
        (bundle as any)[k] = v;
      }

      // 2) Rewrite any ".module.css" import strings to ".css" across JS chunks
      //    This handles remaining cases where an import string still points to .module.css
      const moduleCssRegex = /\.module\.css(['"])/g;
      for (const [fileName, file] of Object.entries(bundle)) {
        if (file.type === "chunk") {
          const chunk = file as any;
          if (typeof chunk.code === "string" && moduleCssRegex.test(chunk.code)) {
            chunk.code = chunk.code.replace(moduleCssRegex, ".css$1");
          }
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    solid(),
    tailwindcss(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
      outDir: 'dist',
      include: ['src/**/*'],
      exclude: ['**/*.stories.*', '**/*.test.*', '**/*.spec.*']
    }),
    injectIntoCssHelperAndRename()
  ],
  css: {
    modules: {
      generateScopedName: process.env.STORYBOOK
      ? '[local]' // readable in storybook
      : '[hash:base64:3][name]__[local]___[hash:base64:5]' // hashed in build
    },
    postcss: './postcss.config.js'
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'KahitSanDesignSystem',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['solid-js', 'solid-js/web', 'lucide-solid'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return '[name][extname]';
          }
          return 'assets/[name][extname]';
        },
        globals: {
          'solid-js': 'SolidJS',
          'solid-js/web': 'SolidJSWeb',
          'lucide-solid': 'LucideSolid'
        }
      }
    },
    cssCodeSplit: true,
    minify: 'terser'
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  }
});