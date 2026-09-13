import { DownloadIcon } from "@solar-icons/react/linear";

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
    <button
      onClick={handleExport}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-control)] border border-border bg-white text-[12px] font-semibold text-navy cursor-pointer hover:border-blue/40 transition-colors"
      style={{ fontFamily: "var(--font-sub)" }}
    >
      <DownloadIcon size={13} />
      Export CSV
    </button>
  );
}
