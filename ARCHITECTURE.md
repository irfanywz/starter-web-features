# Arsitektur

Dokumen ini menjelaskan struktur dan aturan proyek. Dibaca bersama `README.md` dan `CHANGELOG.md`.

## Ringkasan
- Aplikasi web **offline/portable** dengan **satu halaman**. Hasil build satu file `dist/index.html` yang bisa dibuka langsung di browser.
- Tidak ada routing. Pengaturan dan Tentang tampil sebagai **modal** di atas halaman utama.
- Stack: React 18, TypeScript, Vite 5, Tailwind CSS v4, Zustand, Tabler Icons.
- Struktur **feature-based**: kode dikelompokkan per fitur.
- Target browser utama: Chrome dan Edge (File System Access API).
- Semua data disimpan di browser: localStorage (zustand `persist`) dan IndexedDB.
- Tidak ada backend. Layer API (`lib/api.ts`) disediakan tapi belum dipakai.

## Layar

Aplikasi berjalan penuh layar, seperti aplikasi desktop:

```
┌────────────────────────────────────────────────────┐
│ [ikon] Nama App                 [tema] [⚙] [ⓘ]    │  Navbar: menu bar 40px
├────────────────────────────────────────────────────┤
│                                                    │
│   WorkspacePage: toolbar + daftar isi folder       │  Konten: mengisi sisa layar
│                                                    │
├────────────────────────────────────────────────────┤
│ Nama folder · 12 item                       v0.6.0 │  StatusBar: 24px
└────────────────────────────────────────────────────┘
```

Gaya tiap modal berbeda:
- **Pengaturan** memakai `layout="window"`: jendela besar dengan title bar, navigasi kategori di kiri, dan isi di kanan.
- **Tentang** memakai `layout="center"`: kartu kecil di tengah tanpa title bar, dengan ikon aplikasi dan badge versi.

## Peta folder
```
src/
├── App.tsx                  Root: AppLayout + WorkspacePage
├── main.tsx                 Entry point: init tema, error handler, persist storage, render
├── index.css                Tailwind + variant dark
├── vite-env.d.ts            Tipe env VITE_* dan __APP_VERSION__
├── app/                     Kerangka aplikasi (shell)
│   ├── AppLayout.tsx        Navbar + konten + StatusBar + ModalHost + Toaster
│   ├── Navbar.tsx           Menu bar: nama app, tema, Pengaturan, Tentang
│   ├── StatusBar.tsx        Status folder kerja dan versi
│   └── ErrorBoundary.tsx
├── features/
│   ├── workspace/           Folder kerja (File System Access)
│   │   ├── WorkspacePage.tsx
│   │   ├── store.ts         useWorkspaceStore
│   │   └── fsAccess.ts      Helper File System Access API
│   ├── modal/               Pengelola modal
│   │   ├── store.ts         useModalStore: active, open(name), close()
│   │   └── ModalHost.tsx    Merender modal yang aktif
│   ├── settings/            Isi modal Pengaturan
│   │   └── SettingsModal.tsx
│   ├── backup/              Ekspor dan impor data (UI + daftar sumber)
│   │   ├── BackupPanel.tsx
│   │   └── sources.ts       Daftar data yang ikut backup
│   ├── theme/               Tema terang, gelap, sistem
│   │   ├── ThemeToggle.tsx
│   │   ├── store.ts         useThemeStore
│   │   └── theme.ts         Menerapkan class dark ke <html>
│   ├── toast/               Notifikasi
│   │   ├── Toaster.tsx
│   │   └── store.ts         useToastStore + helper toast.*
│   └── logs/                Log aplikasi
│       └── logger.ts
├── components/
│   └── ui/                  Komponen reusable tanpa logika fitur: Button, Card, Modal
├── lib/                     Helper murni tanpa React: env, idb, api, storage, download, utils
├── workers/                 Web Worker untuk pekerjaan berat
└── tests/setup.ts            Setup Vitest
```

Semua test ada di folder `tests/` dan mengikuti struktur `src/`. Contoh: `src/services/idb.ts` diuji oleh `tests/services/idb.test.ts`.

## Aturan ketergantungan
- `app/` boleh mengimpor dari `features/`, `components/`, dan `lib/`.
- `features/` boleh mengimpor dari `components/`, `lib/`, serta `features/toast/` dan `features/modal/` (dianggap global).
- `features/` sebaiknya **tidak** mengimpor fitur lain secara langsung. Kalau dua fitur perlu berbagi sesuatu, pindahkan ke `lib/` atau `components/`.
- `components/ui/` dan `lib/` tidak boleh mengimpor dari `features/` atau `app/`.

## Alur data

**Modal**: `features/modal/store.ts` menyimpan satu nilai `active` (`settings` | `null`). Navbar memanggil `open(name)`. `ModalHost` merender komponen yang sesuai. Modal menutup lewat `close()`, tombol X, klik area gelap, atau Escape. Untuk menambah modal baru: tambah nama ke `ModalName`, buat komponennya, lalu tambah satu baris di `ModalHost`.

**Tema**: `features/theme/store.ts` menyimpan mode (system/light/dark) di localStorage key `theme`. `features/theme/theme.ts` menerapkan class `dark` ke `<html>` dan memantau preferensi OS. `index.html` memasang class yang sama sebelum React jalan supaya tidak ada kilatan.

**Toast**: `features/toast/store.ts` menyimpan toast di memori. Panggil `toast.success/error/info/warning(pesan)` dari mana saja. Dirender oleh `Toaster` di `AppLayout`. Hilang otomatis setelah 4 detik.

**Folder kerja**: `features/workspace/store.ts` mengatur status (`unsupported`, `empty`, `needs-permission`, `ready`). Handle `FileSystemDirectoryHandle` disimpan di IndexedDB (key `workspace-dir`) lewat `lib/idb.ts`. Setelah dibuka ulang, izin harus diminta lewat klik user.

**Log**: `features/logs/logger.ts` menyimpan maksimal 300 entri di IndexedDB (key `app-logs`) lewat antrean tulis. Sumbernya: `app/ErrorBoundary`, error global di `main.tsx`, dan pemanggilan manual. Bisa diunduh atau dihapus dari modal Pengaturan.

**Penyimpanan persisten**: `lib/storage.ts` meminta `navigator.storage.persist()` saat start. Statusnya tampil di modal Pengaturan.

**Database**: `lib/idb.ts` adalah wrapper IndexedDB key-value (`get`, `set`, `del`) tanpa dependency.

**Web Worker**: `workers/example.worker.ts` adalah contoh. Impor dengan `?worker&inline` supaya tetap menjadi satu file.

## Aturan dan konvensi
- Import memakai alias `@/`.
- Baca environment hanya lewat `env` di `lib/env.ts`.
- Panggil backend hanya lewat `api` di `lib/api.ts`.
- Logika state global ada di `store.ts` tiap fitur. Komponen hanya membaca state dan memanggil action.
- Setiap file komponen hanya export default satu komponen (aturan `react-refresh`).
- Warna selalu disertai varian `dark:`.
- Teks UI dalam Bahasa Indonesia.
- Setiap fitur baru minimal punya test untuk logika utamanya, diletakkan di folder fitur itu.

## Cara menambah fitur
- **Fitur dengan layar utama**: buat `features/nama/NamaPage.tsx`, lalu tampilkan di `App.tsx`.
- **Fitur dengan dialog**: tambah nama ke `ModalName`, buat `features/nama/NamaModal.tsx`, lalu daftarkan di `ModalHost`. Buka dengan `useModalStore.getState().open("nama")`.
- **Tombol aksi**: tambah di `app/Navbar.tsx`.

## Build dan rilis
- `npm run dev`: development server.
- `npm run build` atau `npm run dist`: typecheck, lalu build ke `dist/index.html`.
- `npm run test`: semua test.
- `npm run release`: format, lint, test, build, lalu salin ke `release/<nama>-v<versi>.html`. Pakai `-- --skip-test` untuk melewati test.

## Batasan
- File System Access API hanya ada di Chromium. Firefox dan Safari menampilkan pesan tidak didukung.
- Izin folder diminta ulang setiap aplikasi dibuka. Ini batasan browser.
- Environment variable di-bake saat build.
- localStorage terbatas sekitar 5 MB. Data besar disimpan di IndexedDB.
- Dengan `vite-plugin-singlefile`, worker yang diimpor tanpa `?inline` menjadi file terpisah dan tidak ikut satu file HTML. Karena itu gunakan `?worker&inline`.
