# Changelog

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/). Versi mengikuti [SemVer](https://semver.org/lang/id/).

## [0.8.1] - 2026-11-07
### Diubah
- Semua file test dipindah ke folder `tests/` yang mengikuti struktur `src/`. `src/` sekarang hanya berisi kode aplikasi.

## [0.8.0] - 2026-11-07
### Ditambahkan
- Backup dan restore data dalam file JSON, lewat tab Data di Pengaturan (`lib/backup.ts`, `features/backup`).
- Daftar sumber backup di `features/backup/sources.ts`. Fitur baru yang punya data penting cukup menambah satu entri.
- Komponen `SegmentedControl` (grup tombol) untuk pilihan tema.

### Diubah
- Tombol Tentang dipindah ke tab Tentang di dalam Pengaturan. Navbar sekarang hanya berisi tema dan Pengaturan.
- Pilihan tema memakai grup tombol, bukan select.
- Toast muncul di tengah bawah layar.

### Dihapus
- Modal Tentang terpisah (`features/about`).

## [0.7.0] - 2026-11-07
### Ditambahkan
- Log live di modal Pengaturan (`features/logs/LogViewer.tsx`): log baru muncul langsung, bisa difilter per level, scroll otomatis ke log terbaru, dan detail tiap log bisa dibuka dengan klik.
- `features/logs/store.ts` (`useLogStore`) sebagai sumber log di memori. Log tetap disimpan ke IndexedDB.
- Status bar menampilkan jumlah error.
- Log dimuat dari IndexedDB saat aplikasi start (`hydrateLogs`).

### Diubah
- Modal Pengaturan: tab Log sekarang menampilkan LogViewer, dengan tombol Unduh dan Hapus.

## [0.6.0] - 2026-11-07
### Diubah
- Layout penuh layar seperti aplikasi desktop: `html`, `body`, dan root setinggi layar, dan scroll hanya di area konten.
- Navbar menjadi menu bar tipis (40px). Ditambahkan StatusBar di bawah (24px) yang menampilkan status folder dan versi.
- WorkspacePage memakai toolbar di atas dan daftar isi folder yang mengisi sisa layar.
- Modal Pengaturan menjadi jendela dengan title bar dan navigasi kategori di kiri.
- Modal Tentang menjadi kartu kecil di tengah dengan ikon aplikasi dan badge versi.
- `user-select` dimatikan di UI, tetap aktif di input.

### Ditambahkan
- `app/StatusBar.tsx`.
- Prop `layout` pada `components/ui/Modal.tsx` (`center` atau `window`).

## [0.5.0] - 2026-11-07
### Diubah
- Aplikasi menjadi single page: routing dihapus, dan `react-router-dom` tidak lagi dipakai.
- Halaman Pengaturan dan Tentang diubah menjadi modal (`features/modal`).
- Navbar sekarang berisi tombol tema, Pengaturan, dan Tentang.
- Halaman utama langsung menampilkan Workspace.

### Dihapus
- `app/AppRouter.tsx`, `app/NotFoundPage.tsx`, `features/settings/SettingsPage.tsx`, `features/about/AboutPage.tsx`.

### Ditambahkan
- Komponen `components/ui/Modal.tsx` dengan dukungan tombol Escape.

## [0.4.0] - 2026-11-07
### Diubah
- Struktur folder dari `pages/` dan `stores/` ke **feature-based**: `app/`, `features/<nama>/`, dan `workers/`.
- Tiap fitur menyimpan store, komponen, dan helper-nya di satu folder.

### Ditambahkan
- Contoh Web Worker di `workers/example.worker.ts`.

## [0.3.0] - 2026-11-07
### Ditambahkan
- Halaman Pengaturan: pilihan tema, status penyimpanan persisten, unduh dan hapus log, versi aplikasi.
- Permintaan penyimpanan persisten saat aplikasi dibuka (`navigator.storage.persist`).
- Logger yang menyimpan log di IndexedDB (maksimal 300 entri) dan bisa diunduh sebagai file .txt.
- Penangkap error global (`window.onerror` dan `unhandledrejection`) yang mencatat ke log.
- Favicon SVG yang disisipkan langsung di `index.html`, dan judul halaman mengikuti `VITE_APP_NAME`.
- Versi aplikasi diambil otomatis dari `package.json` (`__APP_VERSION__`).
- Perintah `npm run release` yang menjalankan lint, format check, test, build, lalu menyalin hasil ke `release/`.
- Dokumen `ARCHITECTURE.md` dan `CHANGELOG.md`.

### Diubah
- Halaman utama sekarang Workspace (pilih dan kelola folder kerja), menggantikan halaman todo contoh.
- ErrorBoundary sekarang mencatat error ke log.

### Dihapus
- Halaman todo contoh dan store `useAppStore`.
- Folder `types/` yang kosong.

## [0.2.0] - 2026-11-07
### Ditambahkan
- Akses folder lewat File System Access API (`showDirectoryPicker`).
- Penyimpanan handle folder di IndexedDB (`lib/idb.ts`) dengan permintaan izin ulang saat aplikasi dibuka.
- Store `useWorkspaceStore` dan halaman Workspace.

### Diubah
- Data todo sekarang disimpan lewat `persist` di localStorage.

## [0.1.0] - 2026-11-07
### Ditambahkan
- Fondasi aplikasi: React 18, TypeScript, Vite 5, Tailwind CSS v4, Zustand.
- Routing dengan HashRouter dan AppLayout.
- Layer API (`lib/api.ts`) dan konfigurasi environment (`lib/env.ts`).
- ErrorBoundary.
- Tema terang, gelap, dan ikuti sistem, dengan toast notifikasi.
- ESLint (flat config), Prettier, dan Vitest dengan Testing Library.
- Build single-file lewat `vite-plugin-singlefile` dan `npm run dist`.
