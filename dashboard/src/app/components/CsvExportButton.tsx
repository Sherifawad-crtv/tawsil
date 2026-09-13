import { Download } from "lucide-react";

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
      className="flex items-center gap-2 px-3.5 py-2 rounded-[var(--radius-control)] border border-border bg-white text-xs font-semibold text-navy cursor-pointer hover:border-blue/40 transition-colors"
      style={{ fontFamily: "var(--font-sub)" }}
    >
      <Download size={14} />
      Export CSV
    </button>
  );
}
