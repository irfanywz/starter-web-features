import { useEffect, type ReactNode } from "react";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export type ModalLayout = "center" | "window";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /**
   * center: kartu kecil di tengah, tanpa bar judul (mirip dialog splash/about).
   * window: jendela besar dengan title bar, seperti jendela preferensi desktop.
   */
  layout?: ModalLayout;
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      aria-label="Tutup"
      onClick={onClose}
      className="rounded-md p-1 text-slate-500 transition hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
    >
      <IconX size={16} />
    </button>
  );
}

/** Dialog generik. Tutup dengan tombol X, klik area gelap, atau tombol Escape. */
export default function Modal({ title, onClose, children, layout = "center" }: ModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const isWindow = layout === "window";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "relative flex flex-col overflow-hidden border border-slate-300 bg-white text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
          isWindow
            ? "h-[min(640px,90vh)] w-[min(760px,95vw)] rounded-lg"
            : "w-full max-w-xs rounded-2xl"
        )}
      >
        {isWindow ? (
          <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-100 pr-1 pl-3 dark:border-slate-800 dark:bg-slate-800">
            <h2 id="modal-title" className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {title}
            </h2>
            <CloseButton onClose={onClose} />
          </div>
        ) : (
          <>
            <h2 id="modal-title" className="sr-only">
              {title}
            </h2>
            <div className="absolute top-3 right-3">
              <CloseButton onClose={onClose} />
            </div>
          </>
        )}
        <div className={cn("min-h-0 flex-1", isWindow && "flex")}>{children}</div>
      </div>
    </div>
  );
}
