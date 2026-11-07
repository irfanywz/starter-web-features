import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  useLogStore,
  type LogEntry,
  type LogFilter,
  type LogLevel,
} from "@/features/logs/store";

const levelStyle: Record<LogLevel, string> = {
  info: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  warn: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  error: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const filters: { value: LogFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "info", label: "Info" },
  { value: "warn", label: "Peringatan" },
  { value: "error", label: "Error" },
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", { hour12: false });
}

function LogRow({ entry }: { entry: LogEntry }) {
  return (
    <details className="border-b border-slate-200 last:border-0 dark:border-slate-800">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-900">
        <span className="shrink-0 text-slate-400">{formatTime(entry.time)}</span>
        <span
          className={cn(
            "shrink-0 rounded px-1.5 py-px text-[10px] font-semibold uppercase",
            levelStyle[entry.level]
          )}
        >
          {entry.level}
        </span>
        <span className="truncate">{entry.message}</span>
      </summary>
      {entry.detail && (
        <pre className="overflow-x-auto bg-white px-3 py-2 text-[11px] whitespace-pre-wrap text-slate-600 dark:bg-slate-900 dark:text-slate-400">
          {entry.detail}
        </pre>
      )}
    </details>
  );
}

/** Daftar log yang update langsung saat ada log baru. Klik baris untuk melihat detail. */
export default function LogViewer() {
  const entries = useLogStore((s) => s.entries);
  const filter = useLogStore((s) => s.filter);
  const setFilter = useLogStore((s) => s.setFilter);
  const listRef = useRef<HTMLDivElement>(null);

  const visible = filter === "all" ? entries : entries.filter((e) => e.level === filter);

  // Ikuti log terbaru: scroll ke bawah setiap ada entri baru
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visible.length]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full px-3 py-1 text-xs transition",
              filter === f.value
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
          {visible.length} tampil
        </span>
      </div>

      <div
        ref={listRef}
        aria-live="polite"
        className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 font-mono text-xs dark:border-slate-800 dark:bg-slate-950"
      >
        {visible.length === 0 ? (
          <p className="p-4 text-center text-slate-400 dark:text-slate-500">Belum ada log.</p>
        ) : (
          visible.map((entry, i) => <LogRow key={`${entry.time}-${i}`} entry={entry} />)
        )}
      </div>
    </div>
  );
}
