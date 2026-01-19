import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, Send, Moon, Sun } from 'lucide-react';
import Swal from 'sweetalert2';
import { useTheme } from '../context/ThemeContext';

const ForgotPassword = () => {
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement actual forgot password API call
      // const response = await forgotPassword(email);
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSent(true);
      Swal.fire({
        icon: 'success',
        title: 'Email Terkirim!',
        text: 'Silakan cek email Anda untuk reset password',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim Email',
        text: error.response?.data?.message || 'Terjadi kesalahan',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        {/* Theme & Back Button */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Kembali ke Login</span>
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-cardHover transition-all duration-200 shadow-sm"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Logo & Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-2xl mb-3 sm:mb-4 shadow-glow">
            <span className="text-2xl sm:text-3xl font-bold text-white">$</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Lupa Password?</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {sent 
              ? 'Link reset password telah dikirim ke email Anda'
              : 'Masukkan email Anda untuk reset password'
            }
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card border border-gray-200 dark:border-dark-border p-6 sm:p-8 transition-colors duration-200">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 text-sm sm:text-base transition-colors duration-200"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
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
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Kirim Link Reset</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-5 sm:space-y-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base">
                  Kami telah mengirimkan link reset password ke:
                </p>
                <p className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">{email}</p>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Tidak menerima email?{' '}
                <button
                  onClick={() => setSent(false)}
                  className="text-primary hover:text-primary-hover font-medium"
                >
                  Kirim ulang
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-gray-600 dark:text-gray-500 text-xs sm:text-sm">
          <p>&copy; 2026 Spently. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
