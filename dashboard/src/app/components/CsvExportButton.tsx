import { DownloadIcon } from "@solar-icons/react/bold-duotone";
import { Button } from "./Button";

export default function CsvExportButton({ filename, rows, headers }: { filename: string; rows: (string | number)[][]; headers: string[] }) {
  function handleExport() {
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="secondary" size="small" leadingIcon={DownloadIcon} onClick={handleExport}>
      Export CSV
    </Button>
  );
}
