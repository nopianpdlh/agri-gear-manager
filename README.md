Agri-Gear Manager
Modernisasi Manajemen Aset Pertanian Anda

Agri-Gear Manager adalah sistem manajemen inventaris dan peralatan pertanian berbasis web yang dirancang untuk membantu petani, kelompok tani, atau koperasi dalam mengelola aset mereka secara efisien. Aplikasi ini dibangun dengan tumpukan teknologi modern untuk memastikan performa, keamanan, dan pengalaman pengguna yang optimal.

✨ Fitur yang Telah Diimplementasikan
Manajemen Peralatan (CRUD): Tambah, lihat, edit, dan hapus data peralatan lengkap dengan foto.

Sistem Pendaftaran Multi-Langkah: Formulir pendaftaran komprehensif dengan validasi real-time dan dropdown dinamis untuk alamat.

Autentikasi Aman: Login/Registrasi menggunakan email & password serta penyedia OAuth (Google).

Manajemen Peminjaman: Alur kerja lengkap mulai dari pengajuan, persetujuan/penolakan oleh admin, hingga pengembalian alat.

Pelacakan Biaya Operasional: Catat dan kelola semua biaya yang terkait dengan setiap peralatan (servis, bahan bakar, dll).

Manajemen Suku Cadang: Lacak stok suku cadang untuk setiap peralatan, lengkap dengan fungsionalitas CRUD.

Kontrol Akses Berbasis Peran (RBAC): Perbedaan hak akses dan tampilan antara peran Admin dan Anggota.

Dashboard Dinamis: Tampilan ringkasan data real-time dengan statistik dan visualisasi data (grafik).

Pencarian & Filter Lanjutan: Kemampuan untuk mencari dan memfilter daftar peralatan berdasarkan nama, kategori, dan kondisi.

Ekspor Data: Unduh laporan inventaris, riwayat penggunaan, dan data lainnya ke format Excel (.xlsx) dan PDF (.pdf).

🚀 Tumpukan Teknologi (Tech Stack)
Framework: Next.js (App Router)

Bahasa: TypeScript

Styling: Tailwind CSS

Komponen UI: Shadcn/UI

Backend & Database: Supabase (PostgreSQL, Auth, Storage)

Deployment: Vercel

⚙️ Panduan Instalasi Lokal
Untuk menjalankan proyek ini di lingkungan lokal, ikuti langkah-langkah berikut:

Clone Repositori:

git clone [URL_REPOSITORI_ANDA]
cd agri-gear-manager


Instal Dependensi:

npm install


Siapkan Environment Variables:

Buat file .env.local di root proyek.

Salin isi dari .env.example (jika ada) atau isi dengan variabel berikut:

# Kunci Publik Supabase (Aman untuk diekspos)
NEXT_PUBLIC_SUPABASE_URL=URL_PROYEK_SUPABASE_ANDA
NEXT_PUBLIC_SUPABASE_ANON_KEY=KUNCI_ANON_PUBLIC_ANDA

# Kunci Rahasia Supabase (Hanya untuk server)
SUPABASE_SERVICE_ROLE_KEY=KUNCI_SERVICE_ROLE_ANDA

# URL Situs (Untuk OAuth Redirect)
NEXT_PUBLIC_SITE_URL=http://localhost:3000


Anda bisa mendapatkan semua kunci ini dari Project Settings > API di dashboard Supabase Anda.

Jalankan Server Pengembangan:

npm run dev


Buka http://localhost:3000 di browser Anda.
