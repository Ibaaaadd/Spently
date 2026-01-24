import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, FolderOpen, TrendingUp, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import UserDropdown from './UserDropdown';
import Swal from 'sweetalert2';

const Sidebar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/expenses', icon: Receipt, label: 'Pengeluaran' },
    { path: '/categories', icon: FolderOpen, label: 'Kategori' },
  ];

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
        
        // Toast notification
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
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 h-screen bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border fixed left-0 top-0 flex-col transition-colors duration-200">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Spently</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Expense Tracker</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-cardHover transition-colors"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-glow'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-cardHover hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-gray-200 dark:border-dark-border">
          <UserDropdown />
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
            © 2026 Spently
          </p>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border z-50 transition-colors duration-200">
        <nav className="flex justify-around items-center py-2">
          {/* Dashboard */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all duration-200 flex-1 ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${
                  isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <span className={`text-[10px] sm:text-xs font-medium ${
                  isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Dashboard
                </span>
              </>
            )}
          </NavLink>
          
          {/* Pengeluaran */}
          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all duration-200 flex-1 ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Receipt className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${
                  isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <span className={`text-[10px] sm:text-xs font-medium ${
                  isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Expenses
                </span>
              </>
            )}
          </NavLink>

          {/* Kategori */}
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all duration-200 flex-1 ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <FolderOpen className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${
                  isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <span className={`text-[10px] sm:text-xs font-medium ${
                  isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Kategori
                </span>
              </>
            )}
          </NavLink>

          {/* Profile */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all duration-200 flex-1 ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <User className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${
                  isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <span className={`text-[10px] sm:text-xs font-medium ${
                  isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Profil
                </span>
              </>
            )}
          </NavLink>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all duration-200 flex-1 text-gray-500 dark:text-gray-400"
          >
            {isDark ? <Sun className="w-5 h-5 sm:w-6 sm:h-6 mb-1" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />}
            <span className="text-[10px] sm:text-xs font-medium">Theme</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
