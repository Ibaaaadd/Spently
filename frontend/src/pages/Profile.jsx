import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Camera, Trash2, Save, LogOut, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import Swal from 'sweetalert2';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
      });
      
      if (user.avatar) {
        const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8000';
        setAvatarPreview(`${baseUrl}/storage/${user.avatar}`);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        if (formData.password !== formData.password_confirmation) {
          throw new Error('Konfirmasi password tidak sesuai');
        }
        dataToSend.password = formData.password;
        dataToSend.password_confirmation = formData.password_confirmation;
      }

      console.log('Data yang dikirim:', {
        ...dataToSend,
        password: dataToSend.password ? '***' : undefined,
        password_confirmation: dataToSend.password_confirmation ? '***' : undefined
      });

      const response = await api.put('/profile', dataToSend);

      if (response.data.success) {
        updateUser(response.data.data);

        setFormData({
          ...formData,
          password: '',
          password_confirmation: '',
        });

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: response.data.message,
          confirmButtonColor: '#6366F1',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.response?.data?.message || error.message || 'Terjadi kesalahan',
        confirmButtonColor: '#6366F1',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2048 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Terlalu Besar',
        text: 'Ukuran maksimal gambar adalah 2MB',
        confirmButtonColor: '#6366F1',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'File Tidak Valid',
        text: 'File harus berupa gambar',
        confirmButtonColor: '#6366F1',
      });
      return;
    }

    setAvatarLoading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        updateUser(response.data.data.user);
        
        const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8000';
        setAvatarPreview(`${baseUrl}/storage/${response.data.data.user.avatar}`);

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: response.data.message,
          confirmButtonColor: '#6366F1',
        });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.response?.data?.message || 'Terjadi kesalahan saat upload gambar',
        confirmButtonColor: '#6366F1',
      });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    const result = await Swal.fire({
      title: 'Hapus Avatar',
      text: 'Apakah Anda yakin ingin menghapus avatar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    });

    if (!result.isConfirmed) return;

    setAvatarLoading(true);

    try {
      const response = await api.delete('/profile/avatar');

      if (response.data.success) {
        updateUser(response.data.data);
        
        setAvatarPreview(null);

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: response.data.message,
          confirmButtonColor: '#6366F1',
        });
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.response?.data?.message || 'Terjadi kesalahan saat menghapus avatar',
        confirmButtonColor: '#6366F1',
      });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: 'Apakah Anda yakin ingin keluar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366F1',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/login');
        
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        
        Toast.fire({
          icon: 'success',
          title: 'Berhasil logout 👋'
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Profil Pengguna
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola informasi profil dan keamanan akun Anda
            </p>
          </div>
          {/* Logout Button - Visible on mobile */}
          <button
            onClick={handleLogout}
            className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* Avatar Section */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Foto Profil
          </h2>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {avatarLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                ) : avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                JPG, PNG atau GIF. Maksimal 2MB.
              </p>
              <div className="flex space-x-3">
                <label className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors cursor-pointer inline-flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Upload Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={avatarLoading}
                  />
                </label>
                {avatarPreview && (
                  <button
                    onClick={handleDeleteAvatar}
                    disabled={avatarLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Informasi Pribadi
          </h2>

          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                placeholder="Masukkan nama lengkap"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                placeholder="Masukkan email"
              />
            </div>
          </div>

          {/* Change Password Section */}
          <div className="border-t border-gray-200 dark:border-dark-border pt-6 mt-6">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
              Ubah Password (Opsional)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Anda sudah login, jadi bisa langsung ganti password baru tanpa perlu memasukkan password lama.
            </p>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                  placeholder="Masukkan password baru (min. 8 karakter)"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                  placeholder="Konfirmasi password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
