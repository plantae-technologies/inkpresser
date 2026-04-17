import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PrinterError, PrinterErrorCode } from './errors';

const require = createRequire(import.meta.url);

// node-gyp-build looks for prebuilds/ relative to the directory passed to it.
// Since bindings.ts compiles to dist/index.js, we pass the package root (one level up).
const raw = require('node-gyp-build')(join(dirname(fileURLToPath(import.meta.url)), '..'));

function wrap<T>(fn: (...args: unknown[]) => T): (...args: unknown[]) => T {
    return (...args: unknown[]): T => {
        try {
            return fn(...args);
        } catch (e) {
            if (e instanceof Error) {
                const code = (e as unknown as Record<string, unknown>).code;
                if (typeof code === 'string' && code in PrinterErrorCode) {
                    throw new PrinterError(e as Error & { code: string; native?: string });
                }
            }
            throw e;
        }
    };
}

const bindings = new Proxy(raw, {
    get(target, prop: string | symbol) {
        const value = target[prop];
        return typeof value === 'function' ? wrap(value.bind(target)) : value;
    },
});

export default bindings;
