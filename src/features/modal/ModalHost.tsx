import { useModalStore } from "@/features/modal/store";
import SettingsModal from "@/features/settings/SettingsModal";

/** Merender modal yang sedang aktif. Dipasang sekali di AppLayout. */
export default function ModalHost() {
  const active = useModalStore((s) => s.active);

  if (active === "settings") return <SettingsModal />;
  return null;
}
