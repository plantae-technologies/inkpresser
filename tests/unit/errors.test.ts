import { describe, it, expect } from 'vitest';
import { PrinterError, PrinterErrorCode } from '../../src/errors';

describe('PrinterErrorCode', () => {

    it('should expose the stable catalogue of error codes', () => {
        expect(PrinterErrorCode.NO_PRINTER_SPECIFIED).toBe('NO_PRINTER_SPECIFIED');
        expect(PrinterErrorCode.PRINTER_NOT_FOUND).toBe('PRINTER_NOT_FOUND');
        expect(PrinterErrorCode.PRINTER_OPEN_FAILED).toBe('PRINTER_OPEN_FAILED');
        expect(PrinterErrorCode.PRINTER_ENUM_FAILED).toBe('PRINTER_ENUM_FAILED');
        expect(PrinterErrorCode.DEFAULT_PRINTER_LOOKUP_FAILED).toBe('DEFAULT_PRINTER_LOOKUP_FAILED');
        expect(PrinterErrorCode.JOB_CREATION_FAILED).toBe('JOB_CREATION_FAILED');
        expect(PrinterErrorCode.JOB_ENUM_FAILED).toBe('JOB_ENUM_FAILED');
        expect(PrinterErrorCode.JOB_CANCEL_FAILED).toBe('JOB_CANCEL_FAILED');
        expect(PrinterErrorCode.DOCUMENT_START_FAILED).toBe('DOCUMENT_START_FAILED');
        expect(PrinterErrorCode.DOCUMENT_FINISH_FAILED).toBe('DOCUMENT_FINISH_FAILED');
        expect(PrinterErrorCode.PAGE_START_FAILED).toBe('PAGE_START_FAILED');
        expect(PrinterErrorCode.DATA_WRITE_FAILED).toBe('DATA_WRITE_FAILED');
    });
});

describe('PrinterError', () => {

    it('should build from a raw Error carrying code and native', () => {
        const raw = Object.assign(new Error('Failed to open printer.'), {
            code: 'PRINTER_OPEN_FAILED',
            native: 'EPSON LX-300',
        });

        const error = new PrinterError(raw);

        expect(error).toBeInstanceOf(PrinterError);
        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe('PrinterError');
        expect(error.message).toBe('Failed to open printer.');
        expect(error.code).toBe(PrinterErrorCode.PRINTER_OPEN_FAILED);
        expect(error.native).toBe('EPSON LX-300');
    });

    it('should preserve the original stack trace', () => {
        const raw = Object.assign(new Error('boom'), { code: 'DATA_WRITE_FAILED' });
        const originalStack = raw.stack;

        const error = new PrinterError(raw);

        expect(error.stack).toBe(originalStack);
    });

    it('should accept errors without native', () => {
        const raw = Object.assign(new Error('no default'), {
            code: 'NO_PRINTER_SPECIFIED',
        });

        const error = new PrinterError(raw);

        expect(error.code).toBe(PrinterErrorCode.NO_PRINTER_SPECIFIED);
        expect(error.native).toBeUndefined();
    });

    it('should be catchable via instanceof', () => {
        const raw = Object.assign(new Error('boom'), { code: 'JOB_CANCEL_FAILED' });

        try {
            throw new PrinterError(raw);
        } catch (e) {
            expect(e instanceof PrinterError).toBe(true);
            if (e instanceof PrinterError) {
                expect(e.code).toBe(PrinterErrorCode.JOB_CANCEL_FAILED);
            }
        }
    });
});
