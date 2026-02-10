# 🔐 Setup Google OAuth untuk Spently

Panduan singkat untuk mengintegrasikan Google OAuth "Sign in with Google".

## 🚀 Langkah Setup

### 1️⃣ Buat OAuth Client di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. **Create Project** (jika belum ada) → nama: `Spently`
3. Menu **APIs & Services** → **OAuth consent screen**:
   - Pilih **External** → **Create**
   - **App name**: `Spently`
   - **User support email**: email Anda
   - **Developer contact**: email Anda
   - **Save and Continue** (biarkan scope default)
   - **Test users**: tambahkan email untuk testing
   - **Save and Continue** hingga selesai

4. Menu **Credentials** → **+ Create Credentials** → **OAuth client ID**:
   - Application type: **Web application**
   - Name: `Spently`
   - **Authorized JavaScript origins**:
     - `http://localhost:5173`
   - **Authorized redirect URIs**:
     - `http://localhost:5173`
     - `http://localhost:8000/auth/google/callback`
   - **Create**
   - **COPY** Client ID dan Client Secret

### 2️⃣ Konfigurasi Backend

Edit `backend/.env`:

```env
GOOGLE_CLIENT_ID=188651843939-m6ag2e3r7fcb314rn5k064ofbbhabs5t.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

⚠️ **PENTING**: Ganti `GOOGLE_CLIENT_SECRET` dengan Client Secret asli dari Google Console!

### 3️⃣ Konfigurasi Frontend

Sudah configured di `frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=188651843939-m6ag2e3r7fcb314rn5k064ofbbhabs5t.apps.googleusercontent.com
```

✅ Client ID sudah benar, pastikan sama dengan backend!

### 4️⃣ Restart Aplikasi

```powershell
# Backend
cd backend
php artisan config:clear
php artisan serve

# Frontend (terminal baru)
cd frontend
npm run dev
```

## ✅ Testing

1. Buka `http://localhost:5173`
2. Klik **Login** → **Sign in with Google**
3. Login dengan email yang ada di Test Users
4. Seharusnya redirect ke Dashboard ✨

## 🔧 Troubleshooting

| Error | Solusi |
|-------|--------|
| **401: invalid_client** | • Pastikan `CLIENT_SECRET` sudah diisi (bukan `YOUR_CLIENT_SECRET_HERE`)<br>• Pastikan Client ID sama di frontend & backend |
| **redirect_uri_mismatch** | • Tambahkan `http://localhost:8000/auth/google/callback` ke Authorized redirect URIs di Google Console<br>• Tambahkan `http://localhost:5173` juga |
| **Access blocked** | • Tambahkan email Anda ke Test Users di OAuth consent screen |

## 📝 Checklist

- [ ] Project created di Google Cloud Console
- [ ] OAuth consent screen configured
- [ ] OAuth Client ID created
- [ ] **Client Secret** disalin ke `backend/.env`
- [ ] Authorized redirect URIs sudah lengkap:
  - [ ] `http://localhost:5173`
  - [ ] `http://localhost:8000/auth/google/callback`
- [ ] Test user ditambahkan
- [ ] Backend & frontend sudah restart
- [ ] Test login berhasil

## 🛡️ Security

- ⛔ **JANGAN** commit `.env` ke Git
- ⛔ **JANGAN** share Client Secret
- ✅ `.env` sudah ada di `.gitignore`

---

**Happy Coding! 🚀**
