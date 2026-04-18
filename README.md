# 🖨️ InkPresser

InkPresser is a native Node.js library for managing printers and print jobs. It provides seamless integration with Node.js and Electron applications, supporting multiple operating systems.

## 📋 Supported Platforms

| Platform | Architecture | Backend |
|----------|-------------|---------|
| Linux    | x64         | CUPS    |
| macOS    | x64, arm64  | CUPS    |
| Windows  | x64         | Win32   |

Prebuilt binaries are included for all platforms above. If your platform isn't listed, it will fall back to compiling from source via `node-gyp`.

We use `node-gyp` for building native bindings during installation. Ensure your environment has the necessary dependencies:

- **Node.js** >= 20.0.0
- **Linux**: `libcups2-dev` (build from source only)
- **macOS**: Xcode Command Line Tools (build from source only)
- **Windows**: Visual Studio Build Tools (build from source only)

For detailed instructions, refer to the [node-gyp documentation](https://github.com/nodejs/node-gyp).

## 🚀 Installation

```bash
npm install @plantae-tech/inkpresser
```

## 📖 Usage

Here's how you can use InkPresser in your project:

### List Available Printers

```typescript
import { PrintManager } from '@plantae-tech/inkpresser';

const manager = new PrintManager();
const printers = await manager.getPrinters();
// [
//   Printer { name: "HP LaserJet", isDefault: false },
//   Printer { name: "EPSON TM-T20", isDefault: true }
// ]
```

### Get the Default Printer

```typescript
const printer = await manager.getDefaultPrinter();
// Printer { name: "EPSON TM-T20", isDefault: true }
```

### Print a Document

```typescript
const data = Buffer.from('\x1B\x40Hello, printer!\n');
const jobId = await printer.printRaw(data, 'my-document');
// 42
```

### Manage Print Jobs

```typescript
const jobs = await printer.getJobs();
// [
//   Job { id: 1, document: "report.pdf", status: "printing", user: "john" },
//   Job { id: 2, document: "receipt.txt", status: "queued", user: "john" }
// ]

const job = await printer.getJob(jobId);
// Job { id: 42, document: "my-document", status: "queued", user: "john" }

await job?.cancel();
// true
```

## 📚 API Reference

### `PrintManager`

| Method | Returns | Description |
|--------|---------|-------------|
| `getPrinters()` | `Promise<Printer[]>` | Lists all available printers |
| `getDefaultPrinter()` | `Promise<Printer>` | Returns the system default printer |

### `Printer`

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Printer name |
| `isDefault` | `boolean \| null` | Whether this is the default printer |

| Method | Returns | Description |
|--------|---------|-------------|
| `printRaw(data, documentName)` | `Promise<number>` | Sends raw data to the printer. Returns job ID |
| `getJobs()` | `Promise<Job[]>` | Lists all jobs for this printer |
| `getJob(jobId)` | `Promise<Job \| null>` | Gets a job by ID, or `null` if not found |

**Parameters:**
- `data`: `Uint8Array` — raw bytes to send (ESC/POS, PCL, plain text, etc.)
- `documentName`: `string` — document name shown in the print queue

### `Job`

| Property | Type | Description |
|----------|------|-------------|
| `id` | `number` | Job ID |
| `printer` | `Printer` | Printer that owns this job |
| `document` | `string` | Document name |
| `status` | `string` | Job status (`queued`, `printing`, `completed`, etc.) |
| `user` | `string` | User who submitted the job |

| Method | Returns | Description |
|--------|---------|-------------|
| `cancel()` | `Promise<boolean>` | Cancels the job. Returns `true` on success |

### `PrinterError`

Thrown on native printing failures. Extends `Error`.

| Property | Type | Description |
|----------|------|-------------|
| `code` | `PrinterErrorCode` | Machine-readable error code |
| `native` | `string \| undefined` | Underlying OS error message |

### `PrinterErrorCode`

| Code | Description |
|------|-------------|
| `NO_PRINTER_SPECIFIED` | No printer name provided |
| `PRINTER_NOT_FOUND` | Printer does not exist |
| `PRINTER_OPEN_FAILED` | Could not open printer handle |
| `PRINTER_ENUM_FAILED` | Failed to enumerate printers |
| `DEFAULT_PRINTER_LOOKUP_FAILED` | Could not determine default printer |
| `JOB_CREATION_FAILED` | Failed to create print job |
| `JOB_ENUM_FAILED` | Failed to enumerate jobs |
| `JOB_CANCEL_FAILED` | Failed to cancel job |
| `DOCUMENT_START_FAILED` | Failed to start document |
| `DOCUMENT_FINISH_FAILED` | Failed to finish document |
| `PAGE_START_FAILED` | Failed to start page |
| `DATA_WRITE_FAILED` | Failed to write data to printer |

```typescript
import { PrinterError, PrinterErrorCode } from '@plantae-tech/inkpresser';

try {
    await printer.printRaw(data, 'doc');
} catch (err) {
    if (err instanceof PrinterError) {
        console.error(err.code);   // e.g. PrinterErrorCode.PRINTER_NOT_FOUND
        console.error(err.native);  // OS-level error detail
    }
}
```

## 🧪 Manual Printer Testing

ESC/POS fixtures are included in `tests/fixtures/` for testing with real printers. Use the interactive script to select a printer and fixture:

```bash
npm run test:print
```

This launches a CLI that lists available printers and fixtures, then sends the selected file to the printer.
