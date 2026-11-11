import AppLayout from "@/app/AppLayout";
import WorkspacePage from "@/features/workspace/WorkspacePage";

/** Single page: seluruh fitur tampil di satu layar, Pengaturan dan Tentang lewat modal. */
export default function App() {
  return (
    <AppLayout>
      <WorkspacePage />
    </AppLayout>
  );
}
