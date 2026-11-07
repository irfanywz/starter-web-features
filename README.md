# Web Starter

Starter aplikasi web **offline/portable**. Hasil build berupa satu file `dist/index.html` yang bisa dibuka langsung di browser, ditaruh di flashdisk, atau di-host sebagai static site.

Dokumentasi lengkap ada di:
- [ARCHITECTURE.md](./ARCHITECTURE.md): struktur folder, alur data, dan aturan proyek.
- [CHANGELOG.md](./CHANGELOG.md): riwayat perubahan per versi.

## Stack
React 18 · TypeScript · Vite 5 · Tailwind CSS v4 · Zustand · Tabler Icons · Vitest · ESLint · Prettier

## Mulai
```bash
npm install
cp .env.example .env   # isi VITE_APP_NAME jika perlu
npm run dev
```

## Perintah
| Perintah | Fungsi |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm run dist` | Typecheck dan build ke `dist/` |
| `npm run preview` | Jalankan hasil build di localhost |
| `npm run test` | Jalankan semua test |
| `npm run test:watch` | Test dalam mode watch |
| `npm run lint` | Cek ESLint |
| `npm run format` | Rapikan kode dengan Prettier |
| `npm run format:check` | Cek format tanpa mengubah file |
| `npm run release` | Lint, format check, test, build, lalu salin ke `release/<nama>-v<versi>.html` |

## Menjalankan hasil build
- **Double-click** `dist/index.html` (Chrome atau Edge disarankan).
- **Localhost**: `npm run preview`, atau server statis apa pun pada folder `dist`.
- **Hosting**: upload folder `dist` ke Netlify, GitHub Pages, atau sejenisnya.

Fitur folder kerja hanya berjalan di Chrome dan Edge.

## Rilis
1. Naikkan `version` di `package.json`.
2. Catat perubahan di `CHANGELOG.md`.
3. Jalankan `npm run release`.
4. Ambil file `release/<nama>-v<versi>.html`.
