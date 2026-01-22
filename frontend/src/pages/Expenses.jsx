import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Receipt, Calendar, Wallet, Download } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import Toast from '../utils/toast';
import Card from '../components/Card';
import Modal from '../components/Modal';
import DataTable from '../components/DataTable';
import { getExpenses, createExpense, updateExpense, deleteExpense, getCategories, exportExpenses } from '../services/api';
import { formatRupiah, formatDate, formatShortDate, getCurrentMonthYear, getMonthName } from '../utils/helpers';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentMonthYear());
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [filters, setFilters] = useState({
    categoryId: ''
  });
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
    total_sum: 0
  });
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
    setCurrentPage(1);
    fetchExpenses(1);
  }, [selectedPeriod, startDate, endDate, filters]);

  useEffect(() => {
    fetchExpenses(currentPage);
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchExpenses = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        ...selectedPeriod,
        page: page,
        per_page: 10,
        ...(startDate && { start_date: startDate.toISOString().split('T')[0] }),
        ...(endDate && { end_date: endDate.toISOString().split('T')[0] }),
        ...(filters.categoryId && { category_id: filters.categoryId })
      };
      const response = await getExpenses(params);
      setExpenses(response.data.data);
      setPaginationMeta(response.data.meta);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setDateRange([null, null]);
    setFilters({
      categoryId: ''
    });
  };

  const handleExport = async () => {
    try {
      const params = {
        ...selectedPeriod,
        ...(startDate && { start_date: startDate.toISOString().split('T')[0] }),
        ...(endDate && { end_date: endDate.toISOString().split('T')[0] }),
        ...(filters.categoryId && { category_id: filters.categoryId })
      };
      
      const response = await exportExpenses(params);
      
      // Extract filename from Content-Disposition header if available
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'Pengeluaran_Spently.xlsx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      Toast.fire({
        icon: 'success',
        title: 'Data berhasil diexport!'
      });
    } catch (error) {
      console.error('Error exporting expenses:', error);
      Toast.fire({
        icon: 'error',
        title: 'Gagal export data'
      });
    }
  };

  const totalExpenses = paginationMeta.total_sum || 0;

  // Define table columns
  const columns = [
    {
      header: 'Tanggal',
      field: 'date',
      headerClassName: 'whitespace-nowrap',
      cellClassName: 'text-gray-600 dark:text-gray-300 whitespace-nowrap',
      render: (expense) => (
        <>
          <span className="md:hidden">{formatShortDate(expense.date)}</span>
          <span className="hidden md:inline">{formatDate(expense.date)}</span>
        </>
      )
    },
    {
      header: 'Kategori',
      field: 'category',
      headerClassName: 'hidden md:table-cell whitespace-nowrap',
      cellClassName: 'hidden md:table-cell',
      render: (expense) => (
        <div className="flex items-center space-x-2">
          <div 
            className="w-2 h-2 md:w-3 md:h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: expense.category.color }}
          />
          <span className="text-gray-900 dark:text-white text-xs md:text-sm whitespace-nowrap">
            {expense.category.name}
          </span>
        </div>
      )
    },
    {
      header: 'Deskripsi',
      field: 'description',
      cellClassName: 'text-gray-600 dark:text-gray-300',
      render: (expense) => (
        <div className="max-w-[90px] md:max-w-none truncate">{expense.description}</div>
      )
    },
    {
      header: 'Jumlah',
      field: 'amount',
      align: 'right',
      headerClassName: 'whitespace-nowrap',
      cellClassName: 'text-gray-900 dark:text-white font-semibold whitespace-nowrap',
      render: (expense) => formatRupiah(expense.amount)
    },
    {
      header: 'Aksi',
      field: 'actions',
      align: 'center',
      headerClassName: 'whitespace-nowrap',
      render: (expense) => (
        <div className="flex items-center justify-center space-x-1 md:space-x-2">
          <button
            onClick={() => handleEdit(expense)}
            className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
          </button>
          <button
            onClick={() => handleDelete(expense.id)}
            className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">Pengeluaran</h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Kelola pengeluaran harian Anda</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-initial px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-initial btn-primary flex items-center space-x-2 justify-center"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Period, Total & Filters */}
      <Card className="mb-4 lg:mb-6">
        <div className="space-y-4">
          {/* Period & Total Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Period Display */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {startDate && endDate 
                  ? `${startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} - ${endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
                  : `${getMonthName(selectedPeriod.month)} ${selectedPeriod.year}`
                }
              </span>
            </div>
            
            {/* Total */}
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold text-primary">{formatRupiah(totalExpenses)}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-dark-border"></div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Rentang Tanggal
              </label>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                isClearable={true}
                placeholderText="Pilih rentang tanggal"
                dateFormat="dd/MM/yyyy"
                className="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                wrapperClassName="w-full"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Kategori
              </label>
              <select
                value={filters.categoryId}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <button
                onClick={handleResetFilters}
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-dark-cardHover dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors text-sm font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Expenses Table */}
      <Card>
        <DataTable
          columns={columns}
          data={expenses}
          itemsPerPage={10}
          loading={loading}
          emptyMessage="Belum ada pengeluaran bulan ini"
          emptyIcon={Receipt}
          emptyAction={
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              Tambah Pengeluaran
            </button>
          }
          serverSide={true}
          totalItems={paginationMeta.total}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
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
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-dark-cardHover dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors"
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
