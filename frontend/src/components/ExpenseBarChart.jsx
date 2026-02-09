import React from 'react';
import Chart from 'react-apexcharts';

const ExpenseBarChart = ({ data }) => {
  const categories = data.map(item => item.month_name);
  const seriesData = data.map(item => item.total);

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 8,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      },
      offsetY: -20,
      style: {
        fontSize: '10px',
        colors: ['#6B7280'],
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(val);
        },
        style: {
          colors: '#9CA3AF',
          fontSize: '12px',
        },
      },
    },
    colors: ['#6366F1'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#818CF8'],
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.7,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function (val) {
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(val);
        },
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 300,
          },
          plotOptions: {
            bar: {
              columnWidth: '65%',
            },
          },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '9px',
            },
            offsetY: -15,
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '10px',
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '10px',
              },
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 280,
          },
          plotOptions: {
            bar: {
              columnWidth: '70%',
            },
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '9px',
              },
              rotate: -45,
              rotateAlways: true,
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '9px',
              },
              formatter: function (val) {
                // Shorter format for mobile
                if (val >= 1000000) {
                  return (val / 1000000).toFixed(1) + 'jt';
                } else if (val >= 1000) {
                  return (val / 1000).toFixed(0) + 'rb';
                }
                return val;
              },
            },
          },
        },
      },
      {
        breakpoint: 375,
        options: {
          chart: {
            height: 260,
          },
          plotOptions: {
            bar: {
              columnWidth: '75%',
            },
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '8px',
              },
              rotate: -45,
              rotateAlways: true,
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '8px',
              },
              formatter: function (val) {
                // Shorter format for mobile
                if (val >= 1000000) {
                  return (val / 1000000).toFixed(1) + 'jt';
                } else if (val >= 1000) {
                  return (val / 1000).toFixed(0) + 'rb';
                }
                return val;
              },
            },
          },
        },
      },
    ],
  };

  const series = [
    {
      name: 'Pengeluaran',
      data: seriesData,
    },
  ];

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default ExpenseBarChart;
