import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, UserPlus, Moon, Sun } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
  });
  const [loading, setLoading] = useState(false);

  // Redirect jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.password_confirmation) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      
      Toast.fire({
        icon: 'error',
        title: 'Password tidak cocok'
      });
      return;
    }

    if (formData.password.length < 8) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      
      Toast.fire({
        icon: 'error',
        title: 'Password minimal 8 karakter'
      });
      return;
    }

    if (!formData.terms) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      
      Toast.fire({
        icon: 'warning',
        title: 'Harap setujui syarat dan ketentuan'
      });
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      
      // Toast notification
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      
      Toast.fire({
        icon: 'success',
        title: 'Registrasi berhasil! Silakan login 🎉'
      });
      
      // Redirect ke login
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (error) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      
      Toast.fire({
        icon: 'error',
        title: error.message || 'Registrasi gagal'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // TODO: Implement Google OAuth
    Swal.fire({
      icon: 'info',
      title: 'Google Register',
      text: 'Fitur registrasi dengan Google akan segera tersedia',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg flex items-center justify-center p-4 py-8 transition-colors duration-200">
      <div className="w-full max-w-md">
        {/* Theme Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-cardHover transition-all duration-200 shadow-sm"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Logo & Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-2xl mb-3 sm:mb-4 shadow-glow">
            <span className="text-2xl sm:text-3xl font-bold text-white">$</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Spently</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Mulai kelola keuangan Anda hari ini</p>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg dark:shadow-card border border-gray-200 dark:border-dark-border p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Daftar Akun</h2>

          {/* Google Register Button */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-white dark:bg-gray-100 hover:bg-gray-50 dark:hover:bg-gray-200 text-gray-900 font-medium px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 mb-4 sm:mb-6 text-sm sm:text-base shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Daftar dengan Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-5 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-dark-border"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400">Atau daftar dengan email</span>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 text-sm sm:text-base transition-colors duration-200"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 text-sm sm:text-base transition-colors duration-200"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 text-sm sm:text-base transition-colors duration-200"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Minimal 8 karakter</p>
            </div>

            {/* Password Confirmation Input */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 text-sm sm:text-base transition-colors duration-200"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="w-4 h-4 mt-1 bg-gray-50 dark:bg-dark-bg border-gray-300 dark:border-dark-border rounded text-primary focus:ring-2 focus:ring-primary"
                required
              />
              <label htmlFor="terms" className="ml-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Saya menyetujui{' '}
                <a href="#" className="text-primary hover:text-primary-hover">
                  syarat dan ketentuan
                </a>{' '}
                serta{' '}
                <a href="#" className="text-primary hover:text-primary-hover">
                  kebijakan privasi
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-medium px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Daftar</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-5 sm:mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary hover:text-primary-hover font-medium">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-gray-600 dark:text-gray-500 text-xs sm:text-sm">
          <p>&copy; 2026 Spently. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
