import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import Swal from 'sweetalert2';
import Toast from '../utils/toast';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '#6366F1' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Toast.fire({
        icon: 'error',
        title: 'Gagal memuat data kategori'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        Toast.fire({
          icon: 'success',
          title: 'Kategori berhasil diupdate!'
        });
      } else {
        await createCategory(formData);
        Toast.fire({
          icon: 'success',
          title: 'Kategori berhasil ditambahkan!'
        });
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      Toast.fire({
        icon: 'error',
        title: error.response?.data?.message || 'Gagal menyimpan kategori'
      });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, color: category.color });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: "Kategori ini akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(id);
        Toast.fire({
          icon: 'success',
          title: 'Kategori berhasil dihapus!'
        });
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        Toast.fire({
          icon: 'error',
          title: 'Gagal menghapus kategori'
        });
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', color: '#6366F1' });
  };

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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">Kategori</h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Kelola kategori pengeluaran Anda</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-6">
        {categories.map((category) => (
          <Card key={category.id} hover>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: category.color }}
                >
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{category.color}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-cardHover rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-primary" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-cardHover rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Transaksi</span>
                <span className="text-gray-900 dark:text-white font-semibold">{category.expenses_count || 0}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">Belum ada kategori</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            Tambah Kategori Pertama
          </button>
        </Card>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nama Kategori
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              placeholder="Contoh: Makanan, Transport, dll"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Warna
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="flex-1 px-4 py-2 rounded-lg"
                placeholder="#6366F1"
                pattern="^#[0-9A-Fa-f]{6}$"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Format: #RRGGBB</p>
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
              {editingCategory ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
