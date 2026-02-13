import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ExpensePieChart from '../components/ExpensePieChart';
import ExpenseBarChart from '../components/ExpenseBarChart';
import { getSummary, getYearlySummary } from '../services/api';
import { formatRupiah, getCurrentMonthYear, getMonthName } from '../utils/helpers';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [yearlySummary, setYearlySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [yearlyLoading, setYearlyLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentMonthYear());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Show success toast after login
  useEffect(() => {
    // Check for login success from navigation state
    if (location.state?.loginSuccess) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      
      Toast.fire({
        icon: 'success',
        title: location.state?.message || 'Login berhasil! 👋'
      });
      
      // Clear state to prevent showing toast on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
    
    // Check for login success from sessionStorage (for Google login with reload)
    const loginSuccess = sessionStorage.getItem('loginSuccess');
    if (loginSuccess) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      
      Toast.fire({
        icon: 'success',
        title: loginSuccess
      });
      
      // Clear sessionStorage
      sessionStorage.removeItem('loginSuccess');
    }
  }, [location, navigate]);

  useEffect(() => {
    fetchSummary();
  }, [selectedPeriod]);

  useEffect(() => {
    fetchYearlySummary();
  }, [selectedYear]);

  // Refresh data when user navigates to dashboard
  useEffect(() => {
    // Check if coming from another page
    const fromOtherPage = sessionStorage.getItem('needsDashboardRefresh');
    if (fromOtherPage) {
      fetchSummary();
      fetchYearlySummary();
      sessionStorage.removeItem('needsDashboardRefresh');
    }
  }, [location]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await getSummary(selectedPeriod.month, selectedPeriod.year);
      setSummary(response.data.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal memuat data dashboard',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchYearlySummary = async () => {
    try {
      setYearlyLoading(true);
      const response = await getYearlySummary(selectedYear);
      setYearlySummary(response.data.data);
    } catch (error) {
      console.error('Error fetching yearly summary:', error);
    } finally {
      setYearlyLoading(false);
    }
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
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Dashboard</h1>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">Ringkasan pengeluaran bulanan Anda</p>
      </div>

      {/* Period Selector */}
      <Card className="mb-3 sm:mb-4 lg:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
            <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white whitespace-nowrap">
              {getMonthName(selectedPeriod.month)} {selectedPeriod.year}
            </span>
          </div>
          <div className="flex space-x-1.5 sm:space-x-2 w-full sm:w-auto">
            <button
              onClick={() => handleMonthChange(-1)}
              className="flex-1 sm:flex-none px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gray-700 dark:bg-dark-cardHover hover:bg-primary rounded-lg transition-colors text-xs sm:text-sm lg:text-base text-white font-medium"
            >
              ← Prev
            </button>
            <button
              onClick={() => setSelectedPeriod(getCurrentMonthYear())}
              className="flex-1 sm:flex-none px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gray-700 dark:bg-dark-cardHover hover:bg-primary rounded-lg transition-colors text-xs sm:text-sm lg:text-base text-white font-medium"
            >
              Today
            </button>
            <button
              onClick={() => handleMonthChange(1)}
              className="flex-1 sm:flex-none px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gray-700 dark:bg-dark-cardHover hover:bg-primary rounded-lg transition-colors text-xs sm:text-sm lg:text-base text-white font-medium"
            >
              Next →
            </button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <StatCard
          icon={TrendingUp}
          label="Total Pengeluaran"
          value={formatRupiah(summary?.total_bulanan || 0)}
          color="primary"
        />
        <StatCard
          icon={AlertCircle}
          label="Kategori Paling Boros"
          value={summary?.kategori_paling_boros?.name || '-'}
          color="danger"
        />
        <StatCard
          icon={Calendar}
          label="Jumlah Kategori"
          value={summary?.breakdown_per_kategori?.length || 0}
          color="success"
        />
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Pie Chart */}
        <Card>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Komposisi Pengeluaran</h3>
          {summary?.breakdown_per_kategori && summary.breakdown_per_kategori.length > 0 ? (
            <ExpensePieChart data={summary.breakdown_per_kategori} />
          ) : (
            <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base">Belum ada data pengeluaran</p>
            </div>
          )}
        </Card>

        {/* Top 3 Categories */}
        <Card>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Top 3 Kategori Terbesar</h3>
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {summary?.top_3_kategori?.map((category, index) => (
              <div 
                key={category.id}
                className="flex items-center justify-between p-2.5 sm:p-3 md:p-4 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-gray-100 dark:hover:bg-dark-cardHover transition-colors"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 min-w-0">
                  <div 
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-xs sm:text-sm md:text-base"
                    style={{ backgroundColor: category.color }}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm md:text-base truncate">{category.name}</p>
                    <p className="text-xs sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">{category.count} transaksi</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm md:text-base whitespace-nowrap">{formatRupiah(category.total)}</p>
                  <p className="text-xs sm:text-xs md:text-sm text-primary">{category.percentage}%</p>
                </div>
              </div>
            ))}
            {(!summary?.top_3_kategori || summary.top_3_kategori.length === 0) && (
              <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm sm:text-base">Belum ada data kategori</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Yearly Bar Chart */}
      <Card className="mt-3 sm:mt-4 lg:mt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">Pengeluaran Tahunan</h3>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={() => setSelectedYear(prev => prev - 1)}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-700 dark:bg-dark-cardHover hover:bg-primary rounded-lg transition-colors text-xs sm:text-sm text-white font-medium"
            >
              ←
            </button>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-dark-bg rounded-lg text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
              {selectedYear}
            </span>
            <button
              onClick={() => setSelectedYear(prev => prev + 1)}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-700 dark:bg-dark-cardHover hover:bg-primary rounded-lg transition-colors text-xs sm:text-sm text-white font-medium"
            >
              →
            </button>
          </div>
        </div>
        {yearlyLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : yearlySummary?.monthly_breakdown && yearlySummary.monthly_breakdown.length > 0 ? (
          <ExpenseBarChart data={yearlySummary.monthly_breakdown} />
        ) : (
          <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p className="text-sm sm:text-base">Belum ada data pengeluaran untuk tahun {selectedYear}</p>
          </div>
        )}
      </Card>

      {/* All Categories Breakdown */}
      {summary?.breakdown_per_kategori?.length > 0 && (
        <Card className="mt-3 sm:mt-4 lg:mt-6">
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Breakdown Semua Kategori</h3>
          <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:mx-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-border">
                  <th className="text-left py-2 sm:py-2.5 lg:py-3 px-2 sm:px-3 lg:px-4 text-gray-500 dark:text-gray-400 font-semibold text-xs sm:text-xs lg:text-sm whitespace-nowrap">Kategori</th>
                  <th className="text-right py-2 sm:py-2.5 lg:py-3 px-2 sm:px-3 lg:px-4 text-gray-500 dark:text-gray-400 font-semibold text-xs sm:text-xs lg:text-sm whitespace-nowrap">Transaksi</th>
                  <th className="text-right py-2 sm:py-2.5 lg:py-3 px-2 sm:px-3 lg:px-4 text-gray-500 dark:text-gray-400 font-semibold text-xs sm:text-xs lg:text-sm whitespace-nowrap">Total</th>
                  <th className="text-right py-2 sm:py-2.5 lg:py-3 px-2 sm:px-3 lg:px-4 text-gray-500 dark:text-gray-400 font-semibold text-xs sm:text-xs lg:text-sm whitespace-nowrap">%</th>
                </tr>
              </thead>
              <tbody>
                {summary.breakdown_per_kategori.map((category) => (
                  <tr 
                    key={category.id}
                    className="border-b border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-cardHover transition-colors"
                  >
                    <td className="py-2 sm:py-2.5 lg:py-3 px-2 sm:px-3 lg:px-4">
                      <div className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3">
                        <div 
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-gray-900 dark:text-white text-xs sm:text-sm lg:text-base whitespace-nowrap">{category.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-2 sm:py-2.5 lg:py-3 px-2 sm:px-3 lg:px-4 text-gray-600 dark:text-gray-300 text-xs sm:text-sm lg:text-base">{category.count}</td>
                    <td className="text-right py-2 sm:py-2.5 lg:py-3 px-2 sm:px-3 lg:px-4 text-gray-900 dark:text-white font-semibold text-xs sm:text-sm lg:text-base whitespace-nowrap">
                      {formatRupiah(category.total)}
                    </td>
                    <td className="text-right py-2 sm:py-2.5 lg:py-3 px-2 sm:px-3 lg:px-4 text-primary font-semibold text-xs sm:text-sm lg:text-base">
                      {category.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
