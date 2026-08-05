# Cara Pasang Patch v5.7.2

1. Pastikan branch `development` aktif dan working tree bersih.
2. Backup folder project aktif.
3. Salin seluruh isi patch ke root project dan pilih Replace/Timpa.
4. Patch sengaja tidak menyertakan `src/assets/js/site-config.js`; nomor WhatsApp dan data bisnis yang sudah benar tidak akan tertimpa.
5. Jalankan `npm run qa`, lalu `npm run dev`.
6. Setelah review lokal, commit dan push ke branch `development`.
