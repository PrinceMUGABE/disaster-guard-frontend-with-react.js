/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  ChartBarIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Red_Cross_Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [preventions, setPreventions] = useState([]);
  const navigate = useNavigate();

  // Define base chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        font: {
          size: 14
        }
      }
    },
  };

  // Area chart specific options
  const areaChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Trend Analysis Over Time',
        font: {
          size: 14
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchPredictions(),
          fetchPreventions(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/prediction/predictions/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPredictions(data || []);
      } else {
        throw new Error("Failed to fetch predictions");
      }
    } catch (err) {
      throw new Error("Error fetching predictions");
    }
  };

  const fetchPreventions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/prevention/preventions/"
      );
      if (response.data && (Array.isArray(response.data) || Array.isArray(response.data.data))) {
        const data = Array.isArray(response.data) ? response.data : response.data.data;
        setPreventions(data);
      } else {
        throw new Error("Unexpected response format. Expected an array.");
      }
    } catch (err) {
      throw new Error(err.response?.data?.Error || err.message || "Failed to fetch prevention strategies");
    }
  };

  const processChartData = () => {
    // Process predictions by date for area chart
    const predictionsByDate = predictions.reduce((acc, pred) => {
      const date = new Date(pred.created_at);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[formattedDate] = (acc[formattedDate] || 0) + 1;
      return acc;
    }, {});

    // Process preventions by date for area chart
    const preventionsByDate = preventions.reduce((acc, prev) => {
      const date = new Date(prev.created_at);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[formattedDate] = (acc[formattedDate] || 0) + 1;
      return acc;
    }, {});

    // Get all unique dates and sort them
    const allDates = [...new Set([
      ...Object.keys(predictionsByDate),
      ...Object.keys(preventionsByDate),
    ])].sort((a, b) => new Date(a) - new Date(b));

    // Prepare cumulative data for area charts
    let cumulativePredictions = 0;
    let cumulativePreventions = 0;
    const cumulativePredictionData = [];
    const cumulativePreventionData = [];

    allDates.forEach(date => {
      cumulativePredictions += predictionsByDate[date] || 0;
      cumulativePreventions += preventionsByDate[date] || 0;
      cumulativePredictionData.push(cumulativePredictions);
      cumulativePreventionData.push(cumulativePreventions);
    });

    return {
      predictionsTrend: {
        labels: allDates,
        datasets: [{
          label: 'Cumulative Predictions',
          data: cumulativePredictionData,
          fill: true,
          backgroundColor: 'rgba(72, 61, 139, 0.2)',
          borderColor: '#483D8B',
          tension: 0.4,
        }]
      },
      preventionsTrend: {
        labels: allDates,
        datasets: [{
          label: 'Cumulative Preventions',
          data: cumulativePreventionData,
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: '#36A2EB',
          tension: 0.4,
        }]
      },
      comparison: {
        labels: ['Predictions', 'Preventions'],
        datasets: [{
          label: 'Total Count',
          data: [predictions.length, preventions.length],
          backgroundColor: ['rgba(72, 61, 139, 0.8)', 'rgba(54, 162, 235, 0.8)'],
          borderColor: ['#483D8B', '#36A2EB'],
          borderWidth: 1,
        }]
      }
    };
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const chartData = processChartData();

  return (
    <div className="p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-sky-800 to-sky-900 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">Total Predictions</p>
              <h3 className="text-white text-2xl font-bold">{predictions.length}</h3>
              <p className="text-amber-100 text-xs mt-2">
                Trend Analysis and Monitoring
              </p>
            </div>
            <ChartBarIcon className="h-12 w-12 text-white opacity-75" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">Total Preventions</p>
              <h3 className="text-white text-2xl font-bold">{preventions.length}</h3>
              <p className="text-teal-100 text-xs mt-2">
                Active Prevention Strategies
              </p>
            </div>
            <ShieldExclamationIcon className="h-12 w-12 text-white opacity-75" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Predictions Area Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-800 font-semibold mb-4">
            Cumulative Predictions Growth
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This chart shows the cumulative growth of predictions over time, 
            helping identify trends and patterns in prediction frequency.
          </p>
          <div className="h-64">
            <Line data={chartData.predictionsTrend} options={areaChartOptions} />
          </div>
        </div>

        {/* Preventions Area Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-800 font-semibold mb-4">
            Cumulative Preventions Growth
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This visualization tracks the accumulation of prevention strategies over time,
            showing the growth in implemented preventive measures.
          </p>
          <div className="h-64">
            <Line data={chartData.preventionsTrend} options={areaChartOptions} />
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
          <h3 className="text-gray-800 font-semibold mb-4">
            Predictions vs Preventions Comparison
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This chart provides a direct comparison between the total number of predictions
            and implemented prevention strategies, highlighting the relationship between
            identified risks and preventive measures.
          </p>
          <div className="h-64">
            <Bar data={chartData.comparison} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Red_Cross_Home;