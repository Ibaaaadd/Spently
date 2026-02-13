import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { formatRupiah } from '../utils/helpers';

const ExpensePieChart = ({ data }) => {
  // Use useMemo to recalculate everything when data changes
  const { labels, series, colors, options } = useMemo(() => {
    const labels = data?.map(item => item.name) || [];
    const series = data?.map(item => parseFloat(item.total)) || [];
    const colors = data?.map(item => item.color) || [];
    
    const options = {
      chart: {
        type: 'pie',
        background: 'transparent',
        fontFamily: 'inherit',
      },
      labels: labels,
      colors: colors,
      legend: {
        position: 'bottom',
        labels: {
          colors: '#9CA3AF',
        },
        fontSize: '14px',
        fontWeight: 500,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          // Use percentage from backend data, with fallback to calculated value
          const item = data?.[opts.seriesIndex];
          const percentage = item?.percentage;
          
          // If percentage exists in backend data, use it; otherwise use ApexCharts calculated value
          if (percentage !== undefined && percentage !== null && !isNaN(percentage)) {
            return Number(percentage).toFixed(1) + '%';
          }
          return val.toFixed(1) + '%';
        },
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          colors: ['#fff']
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          opacity: 0.5
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function(value) {
            return formatRupiah(value);
          }
        },
        style: {
          fontSize: '14px',
        }
      },
      plotOptions: {
        pie: {
          expandOnClick: true,
          donut: {
            labels: {
              show: false
            }
          }
        }
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              width: '100%',
              height: 280
            },
            legend: {
              position: 'bottom',
              fontSize: '12px',
              itemMargin: {
                horizontal: 8,
                vertical: 4
              }
            },
            dataLabels: {
              enabled: true,
              style: {
                fontSize: '12px'
              }
            }
          }
        },
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
              height: 260
            },
            legend: {
              position: 'bottom',
              fontSize: '11px',
              itemMargin: {
                horizontal: 6,
                vertical: 3
              }
            },
            dataLabels: {
              enabled: true,
              style: {
                fontSize: '11px'
              }
            }
          }
        },
        {
          breakpoint: 375,
          options: {
            chart: {
              width: '100%',
              height: 240
            },
            legend: {
              position: 'bottom',
              fontSize: '10px',
              itemMargin: {
                horizontal: 4,
                vertical: 2
              }
            },
            dataLabels: {
              enabled: false
            }
          }
        }
      ]
    };
    
    return { labels, series, colors, options };
  }, [data]);

  // Create stable key based on data content
  const chartKey = useMemo(() => {
    return data?.map(d => `${d.id}-${d.total}`).join(',') || 'empty';
  }, [data]);

  return (
    <div className="w-full">
      <Chart
        key={chartKey} // Force rerender when data truly changes
        options={options}
        series={series}
        type="pie"
        height="auto"
      />
    </div>
  );
};

export default ExpensePieChart;
