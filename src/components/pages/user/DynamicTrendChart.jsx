/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { ArrowLeftRight } from 'lucide-react';

const DynamicTrendChart = ({ predictions, preventions, usersData }) => {
  const [isLineChart, setIsLineChart] = useState(false);

  const processData = () => {
    // Helper function to format date
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    // Process each dataset by date
    const dailyData = {};

    // Initialize dailyData with all unique dates
    const allDates = [
      ...predictions.map(p => formatDate(p.created_at)),
      ...preventions.map(p => formatDate(p.created_at)),
      ...usersData.map(u => formatDate(u.created_at))
    ];

    // Create unique sorted dates array
    const uniqueDates = [...new Set(allDates)].sort((a, b) => 
      new Date(a) - new Date(b)
    );

    // Initialize all dates with zero counts
    uniqueDates.forEach(date => {
      dailyData[date] = {
        predictions: 0,
        preventions: 0,
        users: 0
      };
    });

    // Count occurrences for each type by date
    predictions.forEach(pred => {
      const date = formatDate(pred.created_at);
      dailyData[date].predictions++;
    });

    preventions.forEach(prev => {
      const date = formatDate(prev.created_at);
      dailyData[date].preventions++;
    });

    usersData.forEach(user => {
      const date = formatDate(user.created_at);
      dailyData[date].users++;
    });

    return {
      labels: uniqueDates,
      datasets: [
        {
          label: 'Predictions',
          data: uniqueDates.map(date => dailyData[date].predictions),
          backgroundColor: 'rgba(152,251,152)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
          tension: isLineChart ? 0.3 : 0
        },
        {
          label: 'Preventions',
          data: uniqueDates.map(date => dailyData[date].preventions),
          backgroundColor: 'rgba(30,144,255)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1,
          tension: isLineChart ? 0.3 : 0
        },
        {
          label: 'Users',
          data: uniqueDates.map(date => dailyData[date].users),
          backgroundColor: 'rgba(0,0,205)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
          tension: isLineChart ? 0.3 : 0
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Daily Activity Distribution'
      },
      tooltip: {
        callbacks: {
          title: (context) => `Date: ${context[0].label}`,
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value} ${value === 1 ? 'item' : 'items'}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const data = processData();
  const ChartComponent = isLineChart ? Line : Bar;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-800 font-semibold">Daily Activity Distribution</h3>
        <button
          onClick={() => setIsLineChart(!isLineChart)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-800 text-white rounded hover:bg-sky-900 transition-colors"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Switch to {isLineChart ? 'Histogram' : 'Line'} View
        </button>
      </div>
      <div className="h-64">
        <ChartComponent data={data} options={chartOptions} />
      </div>
    </div>
  );
};

export default DynamicTrendChart;