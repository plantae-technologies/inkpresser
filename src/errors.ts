export enum PrinterErrorCode {
    NO_PRINTER_SPECIFIED = 'NO_PRINTER_SPECIFIED',
    PRINTER_NOT_FOUND = 'PRINTER_NOT_FOUND',
    PRINTER_OPEN_FAILED = 'PRINTER_OPEN_FAILED',
    PRINTER_ENUM_FAILED = 'PRINTER_ENUM_FAILED',
    DEFAULT_PRINTER_LOOKUP_FAILED = 'DEFAULT_PRINTER_LOOKUP_FAILED',
    JOB_CREATION_FAILED = 'JOB_CREATION_FAILED',
    JOB_ENUM_FAILED = 'JOB_ENUM_FAILED',
    JOB_CANCEL_FAILED = 'JOB_CANCEL_FAILED',
    DOCUMENT_START_FAILED = 'DOCUMENT_START_FAILED',
    DOCUMENT_FINISH_FAILED = 'DOCUMENT_FINISH_FAILED',
    PAGE_START_FAILED = 'PAGE_START_FAILED',
    DATA_WRITE_FAILED = 'DATA_WRITE_FAILED',
}

export class PrinterError extends Error {
    readonly code: PrinterErrorCode;
    readonly native?: string;

    constructor(source: Error & { code: string; native?: string }) {
        super(source.message);
        this.name = 'PrinterError';
        this.code = source.code as PrinterErrorCode;
        this.native = source.native;
        if (source.stack) this.stack = source.stack;
    }
}
