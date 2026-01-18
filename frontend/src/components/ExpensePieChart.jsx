import React from 'react';
import Chart from 'react-apexcharts';
import { formatRupiah } from '../utils/helpers';

const ExpensePieChart = ({ data }) => {
  // Extract labels, series, and colors
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
        const percentage = data[opts.seriesIndex]?.percentage || val.toFixed(1);
        return percentage + '%';
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
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  return (
    <div className="w-full">
      <Chart
        options={options}
        series={series}
        type="pie"
        height={300}
      />
    </div>
  );
};

export default ExpensePieChart;
