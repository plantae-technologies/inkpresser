import { describe, it, expect, beforeAll } from 'vitest';
import { Job, Printer, PrintManager } from '../../src/index';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const TEST_PRINTER = process.env.INKPRESSER_TEST_PRINTER ?? '';

describe('Integration: Print System', () => {
    let printer: Printer;

    beforeAll(async () => {
        const manager = new PrintManager();
        const printers = await manager.getPrinters();
        const match = printers.find((p) => p.name === TEST_PRINTER);

        if (!match) {
            throw new Error(
                `Printer "${TEST_PRINTER}" not found. ` +
                    `Available: ${printers.map((p) => p.name).join(', ') || 'none'}. ` +
                    `Set INKPRESSER_TEST_PRINTER to a valid printer name.`,
            );
        }

        printer = match;
    });

    it('should list printers including the test printer', async () => {
        const manager = new PrintManager();

        const printers = await manager.getPrinters();
        const names = printers.map((p) => p.name);

        expect(names).toContain(TEST_PRINTER);
    });

    it('should retrieve the default printer', async () => {
        const manager = new PrintManager();

        const defaultPrinter = await manager.getDefaultPrinter();

        expect(defaultPrinter).toBeInstanceOf(Printer);
        expect(defaultPrinter.name).toBe(TEST_PRINTER);
    });

    it('should send a print job', async () => {
        const fixturePath = resolve('tests/fixtures/fast.txt');
        const fixtureContent = readFileSync(fixturePath);

        const documentName = `test-${Date.now()}`;
        const jobId = await printer.printRaw(fixtureContent, documentName);

        expect(jobId).toBeTypeOf('number');
        expect(jobId).toBeGreaterThan(0);
    });

    it('should retrieve a job by ID', async () => {
        const content = Buffer.from('job-lookup-test');
        const docName = `lookup-${Date.now()}`;
        const jobId = await printer.printRaw(content, docName);

        expect(jobId).toBeTypeOf('number');
        expect(jobId).toBeGreaterThan(0);

        // Job may complete instantly on file:// backends, so getJob can return null
        const job = await printer.getJob(jobId);

        if (job) {
            expect(job).toBeInstanceOf(Job);
            expect(job.document).toBe(docName);
        }
    });

    it('should list jobs for the printer', async () => {
        const content = Buffer.from('list-jobs-test');
        const docName = `list-${Date.now()}`;
        await printer.printRaw(content, docName);

        const jobs = await printer.getJobs();

        expect(jobs).toBeInstanceOf(Array);
    });

    it('should cancel a print job', async () => {
        const content = Buffer.from('cancel-test');
        const docName = `cancel-${Date.now()}`;
        const jobId = await printer.printRaw(content, docName);

        expect(jobId).toBeTypeOf('number');
        expect(jobId).toBeGreaterThan(0);

        // Job may already be completed on fast backends — cancel only if still in queue
        const job = await printer.getJob(jobId);

        if (job) {
            const cancelled = await job.cancel();
            expect(cancelled).toBe(true);
        }
    });

    it('should return null for a non-existent job ID', async () => {
        const job = await printer.getJob(999999);

        expect(job).toBeNull();
    });
});
