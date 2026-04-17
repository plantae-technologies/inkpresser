import { describe, it, expect, vi } from 'vitest';
import { PrintManager } from '../../src/print-manager';
import { Printer } from '../../src/printer';

vi.mock('../../src/bindings', () => ({
    default: {
        getPrinters: vi.fn(() => [{
            name: 'Printer1',
            isDefault: true,
        },
        {
            name: 'Printer2',
            isDefault: false,
        }]),
        getDefaultPrinterName: vi.fn(() => 'DefaultPrinter'),
    },
}));

describe('PrintManager', () => {

    it('should return a list of "Printer" instances', async () => {
        const printManager = new PrintManager();
        const printers = await printManager.getPrinters();
        const [printer1, printer2] = printers;

        expect(printer1).toBeInstanceOf(Printer);
        expect(printer1?.name).toBe('Printer1');
        expect(printer1?.isDefault).toBe(true);

        expect(printer2).toBeInstanceOf(Printer);
        expect(printer2?.name).toBe('Printer2');
        expect(printer2?.isDefault).toBe(false);
    });

    it('should return the default printer as an instance of "Printer"', async () => {
        const printManager = new PrintManager();
        const defaultPrinter = await printManager.getDefaultPrinter();

        expect(defaultPrinter).toBeInstanceOf(Printer);
        expect(defaultPrinter.name).toBe('DefaultPrinter');
        expect(defaultPrinter.isDefault).toBe(true);
    });
});
