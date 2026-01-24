import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
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

  const handleProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const getAvatarUrl = () => {
    if (user?.avatar) {
      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8000';
      return `${baseUrl}/storage/${user.avatar}`;
    }
    return null;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-cardHover transition-all duration-200 group"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user?.name || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-card"></div>
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.name || 'User'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user?.email || ''}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg overflow-hidden animate-fadeIn">
          <button
            onClick={handleProfile}
            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-cardHover transition-colors text-left"
          >
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Profil
            </span>
          </button>
          <div className="border-t border-gray-200 dark:border-dark-border"></div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
          >
            <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-600 dark:text-red-400">
              Logout
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
