import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Receipt, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import Toast from '../utils/toast';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { getExpenses, createExpense, updateExpense, deleteExpense, getCategories } from '../services/api';
import { formatRupiah, formatDate, formatShortDate, getCurrentMonthYear, getMonthName } from '../utils/helpers';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentMonthYear());
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category_id: '',
    description: '',
    amount: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [selectedPeriod]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await getExpenses(selectedPeriod);
      setExpenses(response.data.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      Toast.fire({
        icon: 'error',
        title: 'Gagal memuat data pengeluaran'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id),
      };

      if (editingExpense) {
        await updateExpense(editingExpense.id, data);
        Toast.fire({
          icon: 'success',
          title: 'Pengeluaran berhasil diupdate!'
        });
      } else {
        await createExpense(data);
        Toast.fire({
          icon: 'success',
          title: 'Pengeluaran berhasil ditambahkan!'
        });
      }
      closeModal();
      fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
      Toast.fire({
        icon: 'error',
        title: error.response?.data?.message || 'Gagal menyimpan pengeluaran'
      });
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    // Convert date to YYYY-MM-DD format for input type="date"
    const dateObj = new Date(expense.date);
    const formattedDate = dateObj.toISOString().split('T')[0];
    setFormData({
      date: formattedDate,
      category_id: expense.category_id.toString(),
      description: expense.description,
      amount: expense.amount.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: "Pengeluaran ini akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteExpense(id);
        Toast.fire({
          icon: 'success',
          title: 'Pengeluaran berhasil dihapus!'
        });
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        Toast.fire({
          icon: 'error',
          title: 'Gagal menghapus pengeluaran'
        });
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category_id: '',
      description: '',
      amount: '',
    });
  };

  const handleMonthChange = (direction) => {
    setSelectedPeriod(prev => {
      let newMonth = prev.month + direction;
      let newYear = prev.year;

      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }

      return { month: newMonth, year: newYear };
    });
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Pengeluaran</h1>
          <p className="text-sm lg:text-base text-gray-400">Kelola pengeluaran harian Anda</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Pengeluaran</span>
        </button>
      </div>

      {/* Period & Total */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6 mb-4 lg:mb-6">
        <Card>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              <span className="text-base lg:text-lg font-semibold text-white">
                {getMonthName(selectedPeriod.month)} {selectedPeriod.year}
              </span>
            </div>
            <div className="flex space-x-1 lg:space-x-2 w-full sm:w-auto">
              <button
                onClick={() => handleMonthChange(-1)}
                className="flex-1 sm:flex-none px-2 lg:px-3 py-1 bg-dark-cardHover hover:bg-primary rounded-lg transition-colors text-sm"
              >
                ←
              </button>
              <button
                onClick={() => setSelectedPeriod(getCurrentMonthYear())}
                className="flex-1 sm:flex-none px-2 lg:px-3 py-1 bg-dark-cardHover hover:bg-primary rounded-lg transition-colors text-sm"
              >
                Today
              </button>
              <button
                onClick={() => handleMonthChange(1)}
                className="flex-1 sm:flex-none px-2 lg:px-3 py-1 bg-dark-cardHover hover:bg-primary rounded-lg transition-colors text-sm"
              >
                →
              </button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm lg:text-base text-gray-400">Total Pengeluaran</span>
            <span className="text-lg lg:text-2xl font-bold text-primary">{formatRupiah(totalExpenses)}</span>
          </div>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-2 md:py-3 px-3 md:px-4 text-gray-400 font-semibold text-xs md:text-sm whitespace-nowrap">Tanggal</th>
                <th className="hidden md:table-cell text-left py-2 md:py-3 px-3 md:px-4 text-gray-400 font-semibold text-xs md:text-sm whitespace-nowrap">Kategori</th>
                <th className="text-left py-2 md:py-3 px-3 md:px-4 text-gray-400 font-semibold text-xs md:text-sm">Deskripsi</th>
                <th className="text-right py-2 md:py-3 px-3 md:px-4 text-gray-400 font-semibold text-xs md:text-sm whitespace-nowrap">Jumlah</th>
                <th className="text-center py-2 md:py-3 px-3 md:px-4 text-gray-400 font-semibold text-xs md:text-sm whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr 
                  key={expense.id}
                  className="border-b border-dark-border hover:bg-dark-cardHover transition-colors"
                >
                  <td className="py-2 md:py-3 px-3 md:px-4 text-gray-300 text-xs md:text-sm whitespace-nowrap">
                    <span className="md:hidden">{formatShortDate(expense.date)}</span>
                    <span className="hidden md:inline">{formatDate(expense.date)}</span>
                  </td>
                  <td className="hidden md:table-cell py-2 md:py-3 px-3 md:px-4">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-2 h-2 md:w-3 md:h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: expense.category.color }}
                      />
                      <span className="text-white text-xs md:text-sm whitespace-nowrap">{expense.category.name}</span>
                    </div>
                  </td>
                  <td className="py-2 md:py-3 px-3 md:px-4 text-gray-300 text-xs md:text-sm">
                    <div className="max-w-[90px] md:max-w-none truncate">{expense.description}</div>
                  </td>
                  <td className="text-right py-2 md:py-3 px-3 md:px-4 text-white font-semibold text-xs md:text-sm whitespace-nowrap">
                    {formatRupiah(expense.amount)}
                  </td>
                  <td className="py-2 md:py-3 px-3 md:px-4">
                    <div className="flex items-center justify-center space-x-1 md:space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-1.5 md:p-2 hover:bg-dark-bg rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-1.5 md:p-2 hover:bg-dark-bg rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {expenses.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Belum ada pengeluaran bulan ini</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              Tambah Pengeluaran
            </button>
          </div>
        )}
      </Card>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingExpense ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tanggal
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kategori
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deskripsi
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              placeholder="Contoh: Makan siang, Bensin, dll"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Jumlah (Rp)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              placeholder="50000"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-2 bg-dark-cardHover hover:bg-gray-700 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              {editingExpense ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
