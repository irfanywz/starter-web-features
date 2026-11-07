import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { useToastStore, type ToastType } from "@/features/toast/store";
import { cn } from "@/lib/utils";

const styles: Record<ToastType, string> = {
  success:
    "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  error:
    "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
  warning:
    "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
  info: "border-slate-300 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
};

const icons: Record<ToastType, typeof IconInfoCircle> = {
  success: IconCircleCheck,
  error: IconAlertCircle,
  warning: IconAlertTriangle,
  info: IconInfoCircle,
};

/** Dirender sekali di AppLayout. Toast dipanggil lewat `toast.success(...)` dari mana saja. */
export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 left-1/2 z-50 flex w-80 -translate-x-1/2 flex-col gap-2"
    >
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            role={t.type === "error" ? "alert" : "status"}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border p-3 text-sm shadow-lg",
              styles[t.type]
            )}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1">{t.message}</p>
            <button
              type="button"
              aria-label="Tutup notifikasi"
              onClick={() => dismiss(t.id)}
              className="opacity-60 hover:opacity-100"
            >
              <IconX size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
