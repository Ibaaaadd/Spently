import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ExpensePieChart from '../components/ExpensePieChart';
import { getSummary } from '../services/api';
import { formatRupiah, getCurrentMonthYear, getMonthName } from '../utils/helpers';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentMonthYear());

  useEffect(() => {
    fetchSummary();
  }, [selectedPeriod]);

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
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-sm lg:text-base text-gray-400">Ringkasan pengeluaran bulanan Anda</p>
      </div>

      {/* Period Selector */}
      <Card className="mb-4 lg:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
            <span className="text-base lg:text-lg font-semibold text-white">
              {getMonthName(selectedPeriod.month)} {selectedPeriod.year}
            </span>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <button
              onClick={() => handleMonthChange(-1)}
              className="flex-1 sm:flex-none px-3 lg:px-4 py-2 bg-dark-cardHover hover:bg-primary rounded-lg transition-colors text-sm lg:text-base"
            >
              ← Prev
            </button>
            <button
              onClick={() => setSelectedPeriod(getCurrentMonthYear())}
              className="flex-1 sm:flex-none px-3 lg:px-4 py-2 bg-dark-cardHover hover:bg-primary rounded-lg transition-colors text-sm lg:text-base"
            >
              Today
            </button>
            <button
              onClick={() => handleMonthChange(1)}
              className="flex-1 sm:flex-none px-3 lg:px-4 py-2 bg-dark-cardHover hover:bg-primary rounded-lg transition-colors text-sm lg:text-base"
            >
              Next →
            </button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6 mb-6 lg:mb-8">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4">Komposisi Pengeluaran</h3>
          {summary?.breakdown_per_kategori?.length > 0 ? (
            <ExpensePieChart data={summary.breakdown_per_kategori} />
          ) : (
            <div className="text-center py-12 text-gray-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada data pengeluaran</p>
            </div>
          )}
        </Card>

        {/* Top 3 Categories */}
        <Card>
          <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Top 3 Kategori Terbesar</h3>
          <div className="space-y-3 md:space-y-4">
            {summary?.top_3_kategori?.map((category, index) => (
              <div 
                key={category.id}
                className="flex items-center justify-between p-3 md:p-4 bg-dark-bg rounded-lg hover:bg-dark-cardHover transition-colors"
              >
                <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
                  <div 
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm md:text-base"
                    style={{ backgroundColor: category.color }}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white text-sm md:text-base truncate">{category.name}</p>
                    <p className="text-xs md:text-sm text-gray-400">{category.count} transaksi</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="font-bold text-white text-sm md:text-base">{formatRupiah(category.total)}</p>
                  <p className="text-xs md:text-sm text-primary">{category.percentage}%</p>
                </div>
              </div>
            ))}
            {(!summary?.top_3_kategori || summary.top_3_kategori.length === 0) && (
              <div className="text-center py-8 text-gray-400">
                <p>Belum ada data kategori</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* All Categories Breakdown */}
      {summary?.breakdown_per_kategori?.length > 0 && (
        <Card className="mt-4 md:mt-6">
          <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Breakdown Semua Kategori</h3>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-2 md:py-3 px-3 md:px-4 text-gray-400 font-semibold text-xs md:text-sm whitespace-nowrap">Kategori</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-gray-400 font-semibold text-xs md:text-sm whitespace-nowrap">Transaksi</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-gray-400 font-semibold text-xs md:text-sm whitespace-nowrap">Total</th>
                  <th className="text-right py-2 md:py-3 px-3 md:px-4 text-gray-400 font-semibold text-xs md:text-sm whitespace-nowrap">Persentase</th>
                </tr>
              </thead>
              <tbody>
                {summary.breakdown_per_kategori.map((category) => (
                  <tr 
                    key={category.id}
                    className="border-b border-dark-border hover:bg-dark-cardHover transition-colors"
                  >
                    <td className="py-2 md:py-3 px-3 md:px-4">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div 
                          className="w-3 h-3 md:w-4 md:h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-white text-sm md:text-base whitespace-nowrap">{category.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-2 md:py-3 px-3 md:px-4 text-gray-300 text-sm md:text-base">{category.count}</td>
                    <td className="text-right py-2 md:py-3 px-3 md:px-4 text-white font-semibold text-sm md:text-base whitespace-nowrap">
                      {formatRupiah(category.total)}
                    </td>
                    <td className="text-right py-2 md:py-3 px-3 md:px-4 text-primary font-semibold text-sm md:text-base">
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
