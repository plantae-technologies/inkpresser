import { defineConfig } from 'vitest/config';
import { builtinModules } from 'node:module';
import dts from 'vite-plugin-dts';
import pkg from './package.json' with { type: 'json' };

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
