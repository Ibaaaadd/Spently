import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, FolderOpen, TrendingUp } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/expenses', icon: Receipt, label: 'Pengeluaran' },
    { path: '/categories', icon: FolderOpen, label: 'Kategori' },
  ];

  return (
    <div className="w-64 h-screen bg-dark-card border-r border-dark-border fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-white">Spently</h1>
            <p className="text-xs text-gray-400">Expense Tracker</p>
          </div>
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
                  : 'text-gray-400 hover:bg-dark-cardHover hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-dark-border">
        <p className="text-xs text-gray-500 text-center">
          © 2026 Spently
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
