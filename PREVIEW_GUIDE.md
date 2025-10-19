# 📸 PREVIEW GUIDE - Website Si-JAPIR 

## 🌐 Cara Akses Website
1. Buka browser (Chrome/Firefox/Edge)
2. Ketik: **http://localhost:3000**
3. Website sudah siap digunakan!

---

## 🎨 PREVIEW TAMPILAN SETIAP HALAMAN

### 1️⃣ **LANDING PAGE** (http://localhost:3000)
**Komponen yang Terlihat:**
```
┌─────────────────────────────────────────┐
│ NAVBAR                                  │
│ [Logo Si-JAPIR] [Menu] [Masuk][Mulai]  │
├─────────────────────────────────────────┤
│                                         │
│      AI ACADEMIC ASSISTANT             │
│   Platform AI terlengkap untuk...      │
│   [Mulai Gratis] [Lihat Fitur]        │
│                                         │
│        [LOGO Si-JAPIR BESAR]           │
│                                         │
├─────────────────────────────────────────┤
│  10,000+   50,000+   100+      98%     │
│  Pengguna  Dokumen   Univ   Kepuasan   │
├─────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│ │Writer│ │Summary│ │Research│ │Chat │  │
│ └──────┘ └──────┘ └──────┘ └──────┘  │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│ │Slides│ │Plagia│ │Stats │ │Dash │   │
│ └──────┘ └──────┘ └──────┘ └──────┘  │
├─────────────────────────────────────────┤
│         TESTIMONIALS                    │
│  [Card 1] [Card 2] [Card 3]            │
├─────────────────────────────────────────┤
│           FOOTER                        │
└─────────────────────────────────────────┘
```

**Visual Elements:**
- Background: Gradient biru ke putih
- Hero: Logo Si-JAPIR (hiu dengan topi toga)
- Cards: 8 fitur dengan ikon warna-warni
- Animations: Smooth fade-in saat scroll

---

### 2️⃣ **LOGIN PAGE** (http://localhost:3000/auth/sign-in)
**Tampilan:**
```
┌─────────────────────────────────────────┐
│                                         │
│         ┌─────────────────┐           │
│         │   [LOGO SIJAPIR] │           │
│         │                   │           │
│         │  Selamat Datang   │           │
│         │  di Si-JAPIR  │           │
│         │                   │           │
│         │ [G] Masuk dengan  │           │
│         │     Google        │           │
│         │                   │           │
│         │  Terms | Privacy  │           │
│         │  [← Kembali]      │           │
│         └─────────────────┘           │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3️⃣ **DASHBOARD** (http://localhost:3000/dashboard)
*Perlu login dulu*

**Layout:**
```
┌─────────────────────────────────────────┐
│ Selamat datang, [Nama User]! 👋        │
│ Sunday, 19 October 2024                 │
│                         [+ Dokumen Baru]│
├─────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│ │12 Docs│ │8 Done│ │45 Cite│ │6 Stats│ │
│ └──────┘ └──────┘ └──────┘ └──────┘  │
├─────────────────────────────────────────┤
│ AKSI CEPAT:                            │
│ [📝 Tulis] [Upload] [🔍 Cari] [💬 Chat] │
├─────────────────────────────────────────┤
│ TUGAS MENDATANG │ AKTIVITAS TERBARU    │
│ • Proposal      │ • Ringkasan ML       │
│ • Revisi Bab 2  │ • Draft Bab 3        │
│ • Seminar       │                      │
├─────────────────────────────────────────┤
│ 💡 Pro Tip: Gunakan AI Writer untuk... │
└─────────────────────────────────────────┘
```

---

### 4️⃣ **AI WRITER** (http://localhost:3000/writer)
**3-Step Process:**

**Step 1 - Informasi Dasar:**
```
[1]━━━━━ [2]------ [3]------

┌─────────────────────────────────────────┐
│ Informasi Dasar Dokumen                │
│                                         │
│ Judul: [___________________]           │
│ Jenis: [Dropdown Skripsi v]            │
│ Bidang: [___________________]          │
│ Sitasi: [APA v] Bahasa: [ID v]        │
│ Target: [5000] kata                    │
│                                         │
│              [Generate Outline →]       │
└─────────────────────────────────────────┘
```

**Step 2 - Outline:**
```
[1]✓━━━━ [2]━━━━━ [3]------

┌─────────────────────────────────────────┐
│ Outline Dokumen                        │
│                                         │
│ □ Abstrak                              │
│ □ BAB I: PENDAHULUAN                   │
│   □ Latar Belakang                     │
│   □ Rumusan Masalah                    │
│ □ BAB II: TINJAUAN PUSTAKA             │
│ □ BAB III: METODOLOGI                  │
│                                         │
│ [← Back] [Edit] [Generate Draft →]     │
└─────────────────────────────────────────┘
```

---

### 5️⃣ **AI CHAT** (http://localhost:3000/consult)
**Layout Dua Kolom:**
```
┌──────────┬──────────────────────────────┐
│ MODE:    │ Si-JAPIR AI Assistant         │
│ • General│ Mode: [General]               │
│ • ELI5   ├──────────────────────────────┤
│ • Academic│                              │
│          │ 🤖: Halo! Saya Si-JAPIR...   │
│ POPULAR: │                              │
│ • Quest 1│     User: Pertanyaan saya     │
│ • Quest 2│                              │
│ • Quest 3│ 🤖: Jawaban dari AI...        │
│          │                              │
│ [Reset]  │ [_______________] [Send]      │
└──────────┴──────────────────────────────┘
```

---

### 6️⃣ **RESEARCH HELPER** (http://localhost:3000/research)
**Search & Results:**
```
┌─────────────────────────────────────────┐
│ [Search_______________] [Filter] [🔍]   │
│                                         │
│ Format: [APA] [MLA] [IEEE] [BibTeX]    │
├─────────────────────────────────────────┤
│ Hasil Pencarian (20)                   │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ Title of Research Paper [↗]     │    │
│ │ Authors • 2024 • Journal         │    │
│ │ Cited 42x                        │    │
│ │ "Snippet of the paper..."        │    │
│ │ [Copy Citation] [Save] [Open]    │    │
│ └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## 🎨 **Design Features yang Terlihat:**

### Colors:
- **Primary**: Biru tua (#0B1E3A)
- **Secondary**: Cyan neon (#2AE0FF)
- **Background**: Putih/Abu-abu terang
- **Cards**: Putih dengan shadow lembut

### Animations:
- Fade-in saat scroll
- Hover effects pada cards
- Loading spinners
- Toast notifications (kanan atas)

### Responsive:
- Mobile: Single column
- Tablet: 2 columns
- Desktop: Full layout

---

## 🔧 **Fitur yang Bisa Dicoba:**

1. **Landing Page**:
   - Klik "Mulai Gratis" → Login
   - Scroll untuk lihat semua sections
   - Hover pada feature cards

2. **Login**:
   - Klik "Masuk dengan Google"
   - Akan redirect ke Google OAuth

3. **Dashboard**:
   - Klik quick actions
   - Lihat tasks & activities

4. **AI Writer**:
   - Isi form → Generate Outline
   - Edit outline → Generate Draft
   - Grammar check & Export

5. **Chat**:
   - Pilih mode (General/ELI5/Academic)
   - Ketik pertanyaan
   - Klik suggested questions

6. **Research**:
   - Search papers
   - Save citations
   - Export references

---

## 📱 **Mobile View:**
Buka Chrome DevTools (F12) → Toggle device toolbar
- Responsive design
- Touch-friendly buttons
- Collapsible menus

---

## 🚀 **Performance:**
- Fast page loads
- Smooth animations
- Real-time updates
- No blocking errors

Website Si-JAPIR sudah 100% functional dan siap digunakan! 
