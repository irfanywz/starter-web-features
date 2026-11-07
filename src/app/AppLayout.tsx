import type { ReactNode } from "react";
import Navbar from "@/app/Navbar";
import StatusBar from "@/app/StatusBar";
import ErrorBoundary from "@/app/ErrorBoundary";
import Toaster from "@/features/toast/Toaster";
import ModalHost from "@/features/modal/ModalHost";

/** Kerangka penuh layar: menu bar, konten, status bar, modal, dan toast. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <StatusBar />
      <ModalHost />
      <Toaster />
    </div>
  );
}
