#ifndef PRINTER_ERROR_H
#define PRINTER_ERROR_H

#include <stdexcept>
#include <string>

enum class PrinterErrorCode
{
    NO_PRINTER_SPECIFIED,
    PRINTER_NOT_FOUND,
    PRINTER_OPEN_FAILED,
    PRINTER_ENUM_FAILED,
    DEFAULT_PRINTER_LOOKUP_FAILED,
    JOB_CREATION_FAILED,
    JOB_ENUM_FAILED,
    JOB_CANCEL_FAILED,
    DOCUMENT_START_FAILED,
    DOCUMENT_FINISH_FAILED,
    PAGE_START_FAILED,
    DATA_WRITE_FAILED,
};

inline std::string to_string(PrinterErrorCode code)
{
    switch (code)
    {
    case PrinterErrorCode::NO_PRINTER_SPECIFIED:
        return "NO_PRINTER_SPECIFIED";
    case PrinterErrorCode::PRINTER_NOT_FOUND:
        return "PRINTER_NOT_FOUND";
    case PrinterErrorCode::PRINTER_OPEN_FAILED:
        return "PRINTER_OPEN_FAILED";
    case PrinterErrorCode::PRINTER_ENUM_FAILED:
        return "PRINTER_ENUM_FAILED";
    case PrinterErrorCode::DEFAULT_PRINTER_LOOKUP_FAILED:
        return "DEFAULT_PRINTER_LOOKUP_FAILED";
    case PrinterErrorCode::JOB_CREATION_FAILED:
        return "JOB_CREATION_FAILED";
    case PrinterErrorCode::JOB_ENUM_FAILED:
        return "JOB_ENUM_FAILED";
    case PrinterErrorCode::JOB_CANCEL_FAILED:
        return "JOB_CANCEL_FAILED";
    case PrinterErrorCode::DOCUMENT_START_FAILED:
        return "DOCUMENT_START_FAILED";
    case PrinterErrorCode::DOCUMENT_FINISH_FAILED:
        return "DOCUMENT_FINISH_FAILED";
    case PrinterErrorCode::PAGE_START_FAILED:
        return "PAGE_START_FAILED";
    case PrinterErrorCode::DATA_WRITE_FAILED:
        return "DATA_WRITE_FAILED";
    }
    return "UNKNOWN";
}

class PrinterError : public std::runtime_error
{
public:
    PrinterError(
        PrinterErrorCode code,
        const std::string& message,
        const std::string& nativeDetail = ""
    )
        : std::runtime_error(message), code_(code), native_(nativeDetail)
    {
    }

    PrinterErrorCode code() const noexcept { return code_; }
    const std::string& native() const noexcept { return native_; }

private:
    PrinterErrorCode code_;
    std::string native_;
};

#endif
