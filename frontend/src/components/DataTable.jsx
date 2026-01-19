import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({ 
  columns, 
  data, 
  itemsPerPage = 10,
  emptyMessage = 'Tidak ada data',
  emptyIcon: EmptyIcon = null,
  emptyAction = null,
  loading = false,
  // Server-side pagination props
  serverSide = false,
  totalItems = 0,
  currentPage = 1,
  onPageChange = null
}) => {
  const [localPage, setLocalPage] = useState(1);

  // Use server-side page if available, otherwise use local state
  const activePage = serverSide ? currentPage : localPage;

  // Calculate pagination for client-side
  const clientTotalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (localPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const clientData = data.slice(startIndex, endIndex);

  // Calculate pagination for server-side
  const serverTotalPages = Math.ceil(totalItems / itemsPerPage);
  const serverStartIndex = (activePage - 1) * itemsPerPage + 1;
  const serverEndIndex = Math.min(activePage * itemsPerPage, totalItems);

  // Determine which values to use
  const totalPages = serverSide ? serverTotalPages : clientTotalPages;
  const currentData = serverSide ? data : clientData;
  const showingFrom = serverSide ? serverStartIndex : startIndex + 1;
  const showingTo = serverSide ? serverEndIndex : Math.min(endIndex, data.length);
  const total = serverSide ? totalItems : data.length;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      if (serverSide && onPageChange) {
        onPageChange(page);
      } else {
        setLocalPage(page);
      }
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 5; 

    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (activePage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (activePage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(activePage - 1);
        pages.push(activePage);
        pages.push(activePage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div>
      {data.length > 0 || loading ? (
        <>
          {/* Table */}
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-border">
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className={`text-${column.align || 'left'} py-2 md:py-3 px-3 md:px-4 text-gray-500 dark:text-gray-400 font-semibold text-xs md:text-sm ${column.headerClassName || ''}`}
                      style={column.headerStyle}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-gray-400">Memuat data...</p>
                    </td>
                  </tr>
                ) : (
                  currentData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-cardHover transition-colors"
                    >
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className={`py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm ${column.cellClassName || ''}`}
                          style={column.cellStyle}
                        >
                          {column.render ? column.render(row) : row[column.field]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
              {/* Info */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Menampilkan {showingFrom} - {showingTo} dari {total} data
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => goToPage(activePage - 1)}
                  disabled={activePage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    activePage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-cardHover'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="px-3 py-1 text-gray-600 dark:text-gray-400">...</span>
                      ) : (
                        <button
                          onClick={() => goToPage(page)}
                          className={`px-3 py-1 rounded-lg transition-colors text-sm ${
                            activePage === page
                              ? 'bg-primary text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-cardHover'
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => goToPage(activePage + 1)}
                  disabled={activePage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    activePage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-cardHover'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          {EmptyIcon && <EmptyIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />}
          <p className="text-gray-400 mb-4">{emptyMessage}</p>
          {emptyAction}
        </div>
      )}
    </div>
  );
};

export default DataTable;
