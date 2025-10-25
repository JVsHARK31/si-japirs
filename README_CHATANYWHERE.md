# 🤖 ChatAnywhere AI Integration

## ✨ Fitur Utama

Sistem AI Si-JAPIRS menggunakan **ChatAnywhere API** dengan 6 model AI yang tersedia (Free Tier):

1. **GPT-5** - Model AI terbaru dan paling canggih (5 request/hari)
2. **GPT-4o** - Model optimal dengan kecerdasan tinggi  
3. **GPT-4o Mini** - Versi ringan GPT-4o
4. **DeepSeek R1** - Khusus untuk reasoning dan logika kompleks
5. **DeepSeek V3** - Model umum dengan performa baik
6. **GPT-3.5 Turbo** - Cepat dan efisien (unlimited)

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
aiClient.setModel('gpt-5') // atau 'gpt-4o', 'deepseek-r1', 'gpt-3.5'

// Chat dengan AI
const response = await aiClient.chatCompletion({
  messages: [
    { role: 'user', content: 'Jelaskan konsep machine learning' }
  ],
  mode: 'eli5',  // atau 'general', 'academic'
  model: 'gpt-5' // opsional, akan fallback ke gpt-3.5 jika limit tercapai
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
    model="gpt-5",  # atau "gpt-4o", "gpt-3.5-turbo", "deepseek-r1"
    messages=[
        {"role": "user", "content": "Halo!"}
    ]
)

print(response.choices[0].message.content)
```

## 🎯 Pemilihan Model

### GPT-5 (`gpt-5`) ⭐ Recommended
✅ **Cocok untuk:**
- Tugas kompleks dan analisis mendalam
- Penulisan akademik berkualitas tinggi
- Research dan synthesis
- **Limit:** 5 request per hari (otomatis fallback ke GPT-3.5)

### GPT-4o (`gpt-4o`)
✅ **Cocok untuk:**
- Tugas yang memerlukan kecerdasan tinggi
- Problem solving
- Analisis data
- Penulisan formal

### DeepSeek R1 (`deepseek-r1`)
✅ **Cocok untuk:**
- Soal matematika dan logika
- Step-by-step reasoning
- Problem solving kompleks
- Debugging kode

### GPT-3.5 Turbo (`gpt-3.5`)
✅ **Cocok untuk:**
- Tugas umum dan sederhana
- Chat casual
- **Unlimited requests** - tidak ada batasan
- Fallback otomatis dari model lain

## 🛠️ API Endpoints

### Get Models
```http
GET /api/ai/models
```

### Set Model  
```http
POST /api/ai/models
{
  "model": "gpt-5" | "gpt-4o" | "gpt-3.5" | "deepseek-r1" | "deepseek-v3"
}
```

### Chat
```http
POST /api/ai/chat
{
  "messages": [...],
  "mode": "general" | "eli5" | "academic",
  "model": "gpt-5"  // opsional, default: gpt-5
}
```

## ⚡ Performa & Limits

- **Timeout:** 60 detik per request
- **Max Tokens:** 2000 tokens default
- **Rate Limits (Free Tier):**
  - GPT-5: 5 request per hari
  - GPT-4o: Limited
  - GPT-3.5 Turbo: Unlimited
  - DeepSeek models: Limited
- **Auto Fallback:** Jika model premium mencapai limit, otomatis switch ke GPT-3.5
- **Error Handling:** Otomatis dengan retry logic dan fallback mechanism

## 🔧 Troubleshooting

### Error: "Invalid API key"
```bash
# Cek API key di .env.local
OPENAI_API_KEY=sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte
```

### Error: "Rate limit exceeded" / "限制每日5次请求"
- GPT-5 memiliki limit 5x per hari pada free tier
- Sistem akan otomatis fallback ke GPT-3.5 Turbo
- Tunggu hingga jam 00:00 untuk reset limit harian
- Atau gunakan model lain seperti GPT-3.5 Turbo (unlimited)

### Error: "Model not found"  
- Pastikan menggunakan nama model yang benar
- Model tersedia: gpt-5, gpt-4o, gpt-3.5, deepseek-r1, deepseek-v3
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

1. **Model Selection Strategy:**
   - Gunakan GPT-5 untuk tugas penting (ingat limit 5x/hari)
   - GPT-3.5 Turbo untuk chat casual (unlimited)
   - DeepSeek R1 untuk matematika dan logika
2. **Hemat Quota:** 
   - Mulai dengan GPT-3.5 untuk testing
   - Simpan GPT-5 untuk tugas final/penting
3. **Error Handling:** Sistem sudah ada auto-fallback ke GPT-3.5
4. **Best Practice:** Test dulu dengan model gratis sebelum deploy

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
