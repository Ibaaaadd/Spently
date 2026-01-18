import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, FolderOpen, TrendingUp, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const { isDark, toggleTheme } = useTheme();
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/expenses', icon: Receipt, label: 'Pengeluaran' },
    { path: '/categories', icon: FolderOpen, label: 'Kategori' },
  ];

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
        <div className="mt-auto p-6 border-t border-gray-200 dark:border-dark-border">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            © 2026 Spently
          </p>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border z-50 transition-colors duration-200">
        <nav className="flex justify-around items-center py-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 flex-1 ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-6 h-6 mb-1 ${
                    isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  <span className={`text-xs font-medium ${
                    isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 flex-1 text-gray-500 dark:text-gray-400"
          >
            {isDark ? <Sun className="w-6 h-6 mb-1" /> : <Moon className="w-6 h-6 mb-1" />}
            <span className="text-xs font-medium">Theme</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
