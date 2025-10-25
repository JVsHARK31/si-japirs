# 🤖 ChatAnywhere AI Integration

## ✨ Fitur Utama

Sistem AI Si-JAPIRS sekarang menggunakan **ChatAnywhere API** dengan 3 pilihan model AI canggih:

1. **Claude Sonnet 4.5** - Model terbaik untuk tugas umum
2. **Claude Sonnet 4.5 (Thinking)** - Model dengan kemampuan reasoning tinggi  
3. **GPT-5** - Model generasi terbaru dengan kemampuan advanced

## 🚀 Cara Penggunaan

### Untuk Pengguna Website

1. Buka halaman **AI Consultation** 
2. Pilih **Model AI** dari dropdown di sidebar
3. Pilih **Mode Konsultasi** (Umum/ELI5/Akademik)
4. Mulai chat dengan AI!

### Untuk Developer

#### Setup Environment

Tambahkan ke file `.env.local`:

```env
OPENAI_API_KEY=sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte
OPENAI_API_BASE=https://api.chatanywhere.tech/v1
```

#### Test API

**JavaScript/Node.js:**
```bash
node test-chatanywhere.js
```

**Python:**
```bash
# Install openai jika belum
pip install openai

# Run test
python test_chatanywhere.py
```

## 📝 Contoh Kode

### TypeScript/JavaScript

```typescript
import { aiClient } from '@/lib/ai-client'

// Ganti model
aiClient.setModel('claude-thinking')

// Chat dengan AI
const response = await aiClient.chatCompletion({
  messages: [
    { role: 'user', content: 'Jelaskan konsep machine learning' }
  ],
  mode: 'eli5',  // atau 'general', 'academic'
  model: 'gpt-5' // opsional
})
```

### Python

```python
import openai

client = openai.OpenAI(
    api_key="sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte",
    base_url="https://api.chatanywhere.tech/v1"
)

response = client.chat.completions.create(
    model="claude-sonnet-4-5-20250929",
    messages=[
        {"role": "user", "content": "Halo!"}
    ]
)

print(response.choices[0].message.content)
```

## 🎯 Pemilihan Model

### Claude Sonnet 4.5 (`claude-sonnet`)
✅ **Cocok untuk:**
- Tugas akademik umum
- Penulisan artikel dan makalah
- Analisis dan ringkasan teks
- Pertanyaan sehari-hari

### Claude Sonnet 4.5 Thinking (`claude-thinking`)
✅ **Cocok untuk:**
- Problem solving kompleks
- Soal matematika dan logika
- Analisis mendalam
- Debugging kode

### GPT-5 (`gpt-5`)
✅ **Cocok untuk:**
- Tugas kreatif
- Generasi konten advanced
- Research synthesis
- Inovasi dan brainstorming

## 🛠️ API Endpoints

### Get Models
```http
GET /api/ai/models
```

### Set Model  
```http
POST /api/ai/models
{
  "model": "claude-sonnet" | "claude-thinking" | "gpt-5"
}
```

### Chat
```http
POST /api/ai/chat
{
  "messages": [...],
  "mode": "general" | "eli5" | "academic",
  "model": "claude-sonnet"  // opsional
}
```

## ⚡ Performa & Limits

- **Timeout:** 60 detik per request
- **Max Tokens:** 2000 tokens default
- **Rate Limit:** Tergantung API key
- **Error Handling:** Otomatis dengan retry logic

## 🔧 Troubleshooting

### Error: "Invalid API key"
```bash
# Cek API key di .env.local
OPENAI_API_KEY=sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte
```

### Error: "Rate limit exceeded"
- Tunggu beberapa saat sebelum request berikutnya
- Gunakan delay antar request

### Error: "Model not found"  
- Pastikan menggunakan nama model yang benar
- Cek typo pada nama model

## 📊 Status & Monitoring

Jalankan test untuk cek status:

```bash
# Quick test
node test-chatanywhere.js

# Detailed test dengan Python
python test_chatanywhere.py
```

## 🔐 Keamanan

- API key disimpan di environment variables
- Tidak pernah commit API key ke git
- Input validation otomatis
- Rate limiting protection

## 📚 Dokumentasi Lengkap

Lihat [CHATANYWHERE_AI_SETUP.md](./CHATANYWHERE_AI_SETUP.md) untuk dokumentasi teknis lengkap.

## 💡 Tips

1. **Hemat Token:** Gunakan prompt yang jelas dan spesifik
2. **Model Switching:** Ganti model sesuai kebutuhan task
3. **Error Handling:** Selalu handle error di production
4. **Caching:** Implementasi caching untuk response yang sama

## 🆘 Support

Jika ada masalah:
1. Cek console browser untuk error details
2. Jalankan test script untuk validasi API
3. Pastikan environment variables sudah benar
4. Cek status API di ChatAnywhere

---

**Version:** 1.0.0  
**Last Updated:** October 2025  
**API Key:** `sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte`
