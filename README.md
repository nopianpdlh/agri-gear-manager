# 🌾 Agri-Gear Manager

<div align="center">
  <img src="public/rice-field-amico.svg" alt="Agri-Gear Manager Logo" width="200" height="200">
  
  <h3>Modernisasi Manajemen Aset Pertanian Anda</h3>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
</div>

## 📋 Deskripsi

**Agri-Gear Manager** adalah sistem manajemen inventaris dan peralatan pertanian berbasis web yang dirancang untuk membantu petani, kelompok tani, atau koperasi dalam mengelola aset mereka secara efisien. Aplikasi ini dibangun dengan teknologi modern untuk memastikan performa, keamanan, dan pengalaman pengguna yang optimal.

### 🎯 Target Pengguna
- 👨‍🌾 Petani individu dan kelompok tani
- 🏢 Koperasi pertanian
- 🏭 Perusahaan agribisnis
- 📊 Manajer aset pertanian

## ✨ Fitur Utama

### 🔧 Manajemen Peralatan
- ➕ **CRUD Lengkap**: Tambah, lihat, edit, dan hapus data peralatan
- 📸 **Upload Foto**: Dokumentasi visual peralatan
- 🔍 **Pencarian & Filter**: Filter berdasarkan nama, kategori, dan kondisi
- 📊 **Tracking Status**: Monitor status peralatan (Tersedia, Dipinjam, Dalam Perawatan)

### 👥 Sistem Pengguna
- 🔐 **Autentikasi Aman**: Login/Registrasi dengan email & password + OAuth Google
- 👑 **Role-Based Access Control (RBAC)**: Pembedaan akses Admin dan Member
- 📝 **Pendaftaran Multi-Step**: Formulir komprehensif dengan validasi real-time
- 🗺️ **Dropdown Alamat Dinamis**: Integrasi data wilayah Indonesia

### 📦 Manajemen Peminjaman
- 📋 **Workflow Lengkap**: Pengajuan → Persetujuan → Pengembalian
- ⏰ **Notifikasi Real-time**: Update status peminjaman
- 📈 **Riwayat Penggunaan**: Tracking lengkap aktivitas peminjaman
- 🎯 **Dashboard Requests**: Manajemen persetujuan untuk admin

### 🔧 Maintenance & Spare Parts
- 📅 **Penjadwalan Maintenance**: Sistem reminder perawatan berkala
- 🔩 **Manajemen Suku Cadang**: Tracking stok dan threshold minimum
- 💰 **Pelacakan Biaya**: Catat semua biaya operasional (servis, bahan bakar, dll)
- 📊 **Analisis Biaya**: Laporan biaya per peralatan

### 📊 Dashboard & Analitik
- 📈 **Dashboard Real-time**: Statistik dan visualisasi data
- 🏆 **Grafik Equipment Populer**: Analisis penggunaan peralatan
- 📋 **Aktivitas Terbaru**: Timeline aktivitas sistem
- 📊 **Statistik Komprehensif**: Total equipment, peminjaman, maintenance

### 📄 Ekspor & Laporan
- 📊 **Export Excel**: Download data dalam format .xlsx
- 📄 **Export PDF**: Laporan professional dalam format PDF
- 📈 **Multiple Report Types**: Inventaris, riwayat, maintenance, costs

## 🚀 Tech Stack

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| **Frontend** | Next.js (App Router) | 15.3.5 |
| **Language** | TypeScript | Latest |
| **Styling** | Tailwind CSS | 4.0 |
| **UI Components** | Shadcn/UI | Latest |
| **Backend** | Supabase | Latest |
| **Database** | PostgreSQL (Supabase) | Latest |
| **Authentication** | Supabase Auth | Latest |
| **Storage** | Supabase Storage | Latest |
| **Deployment** | Vercel | Latest |

### 📦 Dependencies Utama
```json
{
  "dependencies": {
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.51.0",
    "react-hook-form": "^7.60.0",
    "zod": "^4.0.5",
    "recharts": "^2.15.4",
    "jspdf": "^3.0.1",
    "xlsx": "^0.18.5",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.525.0"
  }
}
```

## ⚙️ Instalasi & Setup

### 🔧 Prerequisites
- Node.js 18+ 
- npm atau yarn
- Akun Supabase

### 📝 Langkah Instalasi

1. **Clone Repository**
```bash
git clone https://github.com/nopianpdlh/agri-gear-manager.git
cd agri-gear-manager
```

2. **Install Dependencies**
```bash
npm install
# atau
yarn install
```

3. **Setup Environment Variables**

Buat file `.env.local` di root project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> 💡 **Tip**: Dapatkan kunci Supabase dari Project Settings > API di dashboard Supabase

4. **Jalankan Development Server**
```bash
npm run dev
# atau
yarn dev
```

5. **Akses Aplikasi**
Buka [http://localhost:3000](http://localhost:3000) di browser

## 🗄️ Database Schema

### 📊 Tabel Utama

#### `users`
```sql
- id: uuid (Primary Key)
- full_name: text
- role: enum ('admin', 'member')
- avatar_url: text
- created_at: timestamp
```

#### `equipment`
```sql
- id: uuid (Primary Key)
- name: text
- brand: text
- model: text
- purchase_year: integer
- condition: enum ('Baik', 'Perlu Perbaikan', 'Rusak')
- category: enum ('Alat Berat', 'Mesin', 'Alat Tangan')
- status: enum ('Tersedia', 'Dipinjam', 'Dalam Perawatan')
- photo_urls: text[]
- created_at: timestamp
```

#### `borrowing_requests`
```sql
- id: uuid (Primary Key)
- user_id: uuid (Foreign Key)
- equipment_id: uuid (Foreign Key)
- start_date: date
- end_date: date
- purpose: text
- status: enum ('Tertunda', 'Disetujui', 'Ditolak', 'Dikembalikan')
- created_at: timestamp
```

#### `maintenance_schedules`
```sql
- id: uuid (Primary Key)
- equipment_id: uuid (Foreign Key)
- due_date: date
- description: text
- status: enum ('Dijadwalkan', 'Selesai', 'Dibatalkan')
- created_at: timestamp
```

#### `spare_parts`
```sql
- id: uuid (Primary Key)
- equipment_id: uuid (Foreign Key)
- name: text
- specification: text
- stock: integer
- stock_threshold: integer
- created_at: timestamp
```

#### `costs`
```sql
- id: uuid (Primary Key)
- equipment_id: uuid (Foreign Key)
- description: text
- cost_type: text
- amount: decimal
- date: date
- created_at: timestamp
```

### 🔍 Views
- `detailed_borrowing_requests`: Join view untuk request dengan detail user dan equipment
- `detailed_usage_history`: Historical view untuk analisis penggunaan

## 🏗️ Struktur Project

```
agri-gear-manager/
├── 📁 app/                     # Next.js App Router
│   ├── 📄 actions.ts          # Server Actions
│   ├── 📄 globals.css         # Global Styles
│   ├── 📄 layout.tsx          # Root Layout
│   ├── 📁 (auth)/             # Auth Route Group
│   │   ├── 📁 login/
│   │   ├── 📁 register/
│   │   └── 📁 reset-password/
│   ├── 📁 (dashboard)/        # Dashboard Route Group
│   │   ├── 📄 layout.tsx      # Dashboard Layout
│   │   ├── 📁 dashboard/      # Main Dashboard
│   │   ├── 📁 equipment/      # Equipment Management
│   │   ├── 📁 borrowing/      # Borrowing System
│   │   ├── 📁 maintenance/    # Maintenance Schedules
│   │   ├── 📁 requests/       # Borrowing Requests
│   │   ├── 📁 history/        # Usage History
│   │   └── 📁 users/          # User Management
│   └── 📁 (marketing)/        # Marketing Pages
├── 📁 components/             # React Components
│   ├── 📁 shared/             # Shared Components
│   └── 📁 ui/                 # UI Components (Shadcn)
├── 📁 lib/                    # Utilities & Types
│   ├── 📄 types.ts           # TypeScript Types
│   ├── 📄 utils.ts           # Utility Functions
│   └── 📁 supabase/          # Supabase Configuration
└── 📁 public/                # Static Assets
```

## 🚦 Getting Started

### 🎯 Akun Default
Setelah setup, buat akun admin pertama melalui halaman registrasi, kemudian ubah role di database Supabase menjadi `admin`.

### 📱 Fitur Berdasarkan Role

#### 👑 Admin
- ✅ Semua fitur member
- ✅ Manajemen pengguna
- ✅ Approve/reject borrowing requests
- ✅ Manajemen maintenance schedules
- ✅ Export semua data
- ✅ Dashboard analytics lengkap

#### 👤 Member
- ✅ View equipment catalog
- ✅ Submit borrowing requests
- ✅ View borrowing history
- ✅ Basic dashboard statistics

## 🔧 Scripts Available

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 Deployment

### 🚀 Vercel (Recommended)

1. **Connect Repository**
   - Import project di Vercel
   - Connect dengan GitHub repository

2. **Environment Variables**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

3. **Deploy**
   - Vercel akan auto-deploy setiap push ke main branch

## 🔒 Security Features

- 🛡️ **Row Level Security (RLS)**: Database-level security
- 🔐 **JWT Authentication**: Secure token-based auth
- 👥 **Role-based Access**: Granular permission control
- 🔒 **Environment Variables**: Sensitive data protection
- 📝 **Input Validation**: Zod schema validation
- 🚫 **SQL Injection Protection**: Supabase built-in protection

## 📊 Performance Features

- ⚡ **Server Side Rendering (SSR)**: Better SEO dan performance
- 🔄 **Static Site Generation (SSG)**: Optimized loading
- 📱 **Progressive Web App (PWA)**: Mobile-first approach
- 🖼️ **Image Optimization**: Next.js Image component
- 📦 **Code Splitting**: Automatic bundle optimization

## 🛠️ Development Guidelines

### 📁 File Naming Convention
- **Components**: PascalCase (`UserProfile.tsx`)
- **Pages**: kebab-case (`user-profile/page.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

### 🏗️ Component Structure
```tsx
// components/shared/ExampleComponent.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ExampleComponentProps {
  title: string;
  onSubmit: (data: any) => void;
}

export function ExampleComponent({ title, onSubmit }: ExampleComponentProps) {
  // Component logic here
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

## 🤝 Contributing

1. **Fork Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit Changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open Pull Request**

### 📋 Contribution Guidelines
- ✅ Follow coding standards
- ✅ Add tests for new features
- ✅ Update documentation
- ✅ Use conventional commits

## 🐛 Troubleshooting

### ❌ Common Issues

**1. Supabase Connection Error**
```bash
Error: Invalid API key
```
**Solution**: Check `.env.local` file dan pastikan semua keys benar

**2. Build Error**
```bash
Error: Module not found
```
**Solution**: Jalankan `npm install` dan check import paths

**3. Authentication Issues**
```bash
Error: No session found
```
**Solution**: Clear browser cookies dan login ulang

## 📄 License

Project ini menggunakan **MIT License**. Lihat file [LICENSE](LICENSE) untuk detail lengkap.

## 👥 Tim Pengembang

- **Lead Developer**: [Nopian](https://github.com/nopianpdlh)
- **UI/UX Design**: [Contributors Welcome]
- **Testing**: [Contributors Welcome]

## 🔗 Links Penting

- 🌐 **Live Demo**: [https://agri-gear-manager.vercel.app](https://agri-gear-manager.vercel.app)
- 📚 **Documentation**: [Wiki Pages](https://github.com/nopianpdlh/agri-gear-manager/wiki)
- 🐛 **Issues**: [GitHub Issues](https://github.com/nopianpdlh/agri-gear-manager/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/nopianpdlh/agri-gear-manager/discussions)

## 🎯 Roadmap

### 🚀 Version 2.0 (Coming Soon)
- [ ] 📱 Mobile App (React Native)
- [ ] 📧 Email Notifications
- [ ] 📊 Advanced Analytics Dashboard
- [ ] 🔔 Push Notifications
- [ ] 📦 Inventory Alerts
- [ ] 🌍 Multi-language Support
- [ ] 📊 Custom Reports Builder

### 🌟 Version 1.1 (Current)
- [x] ✅ Equipment Management
- [x] ✅ Borrowing System
- [x] ✅ Maintenance Scheduling
- [x] ✅ User Management
- [x] ✅ Export Features
- [x] ✅ Dashboard Analytics

## 📞 Support

Butuh bantuan? Hubungi kami melalui:

- 📧 **Email**: [support@agri-gear-manager.com](mailto:support@agri-gear-manager.com)
- 💬 **GitHub Issues**: [Report Bug](https://github.com/nopianpdlh/agri-gear-manager/issues/new?template=bug_report.md)
- 💡 **Feature Request**: [Request Feature](https://github.com/nopianpdlh/agri-gear-manager/issues/new?template=feature_request.md)

---

<div align="center">
  <p>Made with ❤️ for Indonesian Agricultural Community</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
