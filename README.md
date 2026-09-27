# SortLink

Layanan short-link sederhana berbasis GitHub Pages + Google Apps Script + Google Sheets.

## Struktur
- `index.html` — halaman utama.
- `404.html` — resolver untuk URL seperti `/sortlink/abc123`.
- `config.js` — alamat Web App Google Apps Script.
- `gas/Code.gs` — mesin API yang dijalankan di Google Apps Script.

## Alur
1. Pengguna memasukkan URL.
2. Google Apps Script membuat kode pendek dan menyimpannya di Google Sheets.
3. Link pendek dibuka melalui GitHub Pages.
4. `404.html` meminta URL tujuan ke Apps Script lalu melakukan redirect.

Sebelum digunakan, isi `SORTLINK_API_URL` di `config.js` dengan URL Web App Apps Script.
