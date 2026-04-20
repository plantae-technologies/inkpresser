import { defineConfig } from 'vitest/config';
import { builtinModules } from 'node:module';
import dts from 'vite-plugin-dts';
import pkg from './package.json' with { type: 'json' };

/**
 * Rollup plugin that fixes Vite's broken CJS shim for `import.meta.url`.
 *
 * Vite replaces `import.meta.url` with `{}.url` during the transform phase,
 * which evaluates to `undefined` at runtime. This plugin runs after code
 * generation (`renderChunk`) and replaces the broken shim with the standard
 * Node.js CJS equivalent: `require('node:url').pathToFileURL(__filename).href`.
 */
function cjsImportMetaUrl() {
    const CJS_SHIM = `require('node:url').pathToFileURL(__filename).href`;
    return {
        name: 'cjs-import-meta-url',
        renderChunk(code: string, _chunk: unknown, options: { format: string }) {
            if (options.format === 'cjs') {
                return code.replaceAll('{}.url', CJS_SHIM);
            }
            return null;
        },
    };
}

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es', 'cjs'],
            fileName: 'index',
        },
        rollupOptions: {
            external: [
                ...builtinModules,
                ...builtinModules.map((m) => `node:${m}`),
                ...Object.keys(pkg.dependencies),
            ],
        },
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true,
        target: 'node20',
        minify: false,
    },
    plugins: [
        dts({ rollupTypes: true }),
        cjsImportMetaUrl(),
    ],
    test: {
        globals: true,
        environment: 'node',
        clearMocks: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
            include: ['src'],
        },
    },
});
