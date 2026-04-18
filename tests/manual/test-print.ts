import { intro, select, spinner, note, outro, cancel, isCancel } from '@clack/prompts';
import { readdirSync, readFileSync } from 'fs';
import { resolve, basename } from 'path';
import { PrintManager } from '../../src/index';

const FIXTURES_DIR = resolve('tests/fixtures');

async function main() {
    intro('inkpresser — manual print test');

    const manager = new PrintManager();
    const printers = await manager.getPrinters();

    if (printers.length === 0) {
        cancel('No printers found on this system.');
        process.exit(1);
    }

    const printerName = await select({
        message: 'Select a printer',
        options: printers.map((p) => ({
            value: p.name,
            label: p.name,
            hint: p.isDefault ? 'default' : undefined,
        })),
    });

    if (isCancel(printerName)) {
        cancel('Cancelled.');
        process.exit(0);
    }

    const fixtures = readdirSync(FIXTURES_DIR).filter((f) => f.endsWith('.txt'));

    const fixtureName = await select({
        message: 'Select a fixture to print',
        options: fixtures.map((f) => ({
            value: f,
            label: f,
            hint: f === 'fast.txt' ? 'quick ESC/POS test' : undefined,
        })),
        initialValue: 'fast.txt',
    });

    if (isCancel(fixtureName)) {
        cancel('Cancelled.');
        process.exit(0);
    }

    const printer = printers.find((p) => p.name === printerName)!;
    const fixturePath = resolve(FIXTURES_DIR, fixtureName as string);
    const content = readFileSync(fixturePath);
    const docName = `test-${basename(fixtureName as string, '.txt')}-${Date.now()}`;

    const s = spinner();
    s.start(`Sending "${fixtureName}" to "${printerName}"...`);

    const jobId = await printer.printRaw(content, docName);

    s.stop(`Job #${jobId} sent successfully`);

    note(
        [
            `Printer : ${printerName}`,
            `Fixture : ${fixtureName}`,
            `Document: ${docName}`,
            `Job ID  : ${jobId}`,
        ].join('\n'),
        'Print details',
    );

    outro('Done! Check the printer output.');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
