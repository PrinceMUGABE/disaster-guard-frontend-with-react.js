/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  UserGroupIcon,
  ChartBarIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
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
  ArcElement
);
import DynamicTrendChart from "./DynamicTrendChart.jsx";

function AdminHome() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [preventions, setPreventions] = useState([]);
  const [filteredPreventions, setFilteredPreventions] = useState([]);
  const navigate = useNavigate();

  // Define base chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  // Define line chart specific options
  const lineChartOptions = {
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
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchUserData(),
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
  }, []); // Empty dependency array since we only want to fetch once on mount

  const fetchUserData = async () => {
    const storedUserData = localStorage.getItem("userData");
    const token = localStorage.getItem("token");
    const accessToken = storedUserData
      ? JSON.parse(storedUserData).access_token
      : null;

    if (!accessToken) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.users) {
        setUsersData(response.data.users);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      throw new Error(err.message || "Failed to load user data");
    }
  };

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
      if (
        response.data &&
        (Array.isArray(response.data) || Array.isArray(response.data.data))
      ) {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        setPreventions(data);
        setFilteredPreventions(data);
      } else {
        throw new Error("Unexpected response format. Expected an array.");
      }
    } catch (err) {
      throw new Error(
        err.response?.data?.Error ||
          err.message ||
          "Failed to fetch prevention strategies"
      );
    }
  };

  const processChartData = () => {
    const adminCount = usersData.filter((user) => user.role === "admin").length;
    const regularUserCount = usersData.filter(
      (user) => user.role === "user"
    ).length;

    // Process individual user registration dates
  const userRegistrationDates = usersData.map((user) => {
    const date = new Date(user.created_at); // Parse date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }); // Format the date
  });

  // Count registrations per specific date
  const registrationsByDate = userRegistrationDates.reduce((acc, date) => {
    acc[date] = (acc[date] || 0) + 1; // Increment the count for this date
    return acc;
  }, {});

  // Sort dates chronologically
  const sortedDates = Object.keys(registrationsByDate).sort(
    (a, b) => new Date(a) - new Date(b)
  );



    // Process registration data by month
  const registrationsByMonth = usersData.reduce((acc, user) => {
    const date = new Date(user.created_at); // Ensure the date is parsed correctly
    const monthYear = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    acc[monthYear] = (acc[monthYear] || 0) + 1; // Increment registration count for the month
    return acc;
  }, {});

  // Sort the months chronologically
  const sortedMonths = Object.keys(registrationsByMonth).sort((a, b) => {
    const [monthA, yearA] = a.split(" ");
    const [monthB, yearB] = b.split(" ");
    return (
      new Date(`${yearA}-${monthA}-01`).getTime() -
      new Date(`${yearB}-${monthB}-01`).getTime()
    );
  });

    // Process predictions and preventions by date
    const predictionsByDate = predictions.reduce((acc, pred) => {
      const date = new Date(pred.created_at);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      acc[formattedDate] = (acc[formattedDate] || 0) + 1;
      return acc;
    }, {});

    const preventionsByDate = preventions.reduce((acc, prev) => {
      const date = new Date(prev.created_at);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      acc[formattedDate] = (acc[formattedDate] || 0) + 1;
      return acc;
    }, {});

    // Get all unique dates and sort them chronologically
    const allDates = [
      ...new Set([
        ...Object.keys(predictionsByDate),
        ...Object.keys(preventionsByDate),
      ]),
    ].sort((a, b) => new Date(a) - new Date(b));

    return {
      roles: {
      labels: ["Administrators", "Regular Users"],
      datasets: [
        {
          data: [adminCount, regularUserCount],
          backgroundColor: ["#2F4F4F", "#00FFFF"],
          borderWidth: 1,
        },
      ],
    },
    registrations: {
      labels: sortedDates, // Use sorted individual dates
      datasets: [
        {
          label: "User Registrations",
          data: sortedDates.map((date) => registrationsByDate[date]),
          backgroundColor: "#4CAF50",
          borderColor: "#4CAF50",
          borderWidth: 1,
        },
      ],
    },
      trendsOverTime: {
        labels: allDates,
        datasets: [
          {
            label: "Predictions",
            data: allDates.map((date) => predictionsByDate[date] || 0),
            borderColor: "#483D8B",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            tension: 0.4,
          },
          {
            label: "Preventions",
            data: allDates.map((date) => preventionsByDate[date] || 0),
            borderColor: "#36A2EB",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            tension: 0.4,
          },
        ],
      },
    };
  };

  const getTodayPredictions = () => {
    const today = new Date().toISOString().split("T")[0];
    return predictions.filter((pred) => pred.created_at.startsWith(today))
      .length;
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const chartData = processChartData();
  const totalUsers = usersData.length;
  const activeUsers = usersData.filter((user) => user.role === "user").length;
  const adminUsers = usersData.filter((user) => user.role === "admin").length;

  return (
    <div className="p-6">
      {/* User Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">Total Users</p>
              <h3 className="text-white text-2xl font-bold">{totalUsers}</h3>
              <p className="text-blue-100 text-xs mt-2">
                Active Users: {activeUsers}
              </p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-white opacity-75" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">Regular Users</p>
              <h3 className="text-white text-2xl font-bold">{activeUsers}</h3>
              <p className="text-green-100 text-xs mt-2">User Accounts</p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-white opacity-75" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-sky-800 to-sky-900 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">Administrators</p>
              <h3 className="text-white text-2xl font-bold">{adminUsers}</h3>
              <p className="text-purple-100 text-xs mt-2">Admin Accounts</p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-white opacity-75" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-800 font-semibold mb-4">
            User Registrations Over Time
          </h3>
          <div className="h-64">
            <Bar data={chartData.registrations} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-800 font-semibold mb-4">
            User Role Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={chartData.roles} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Prediction and Prevention Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gradient-to-r from-sky-800 to-sky-900 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">Total Predictions</p>
              <h3 className="text-white text-2xl font-bold">
                {predictions.length}
              </h3>
              <p className="text-amber-100 text-xs mt-2">
                Today Predictions: {getTodayPredictions()}
              </p>
            </div>
            <ChartBarIcon className="h-12 w-12 text-white opacity-75" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">Total Preventions</p>
              <h3 className="text-white text-2xl font-bold">
                {preventions.length}
              </h3>
              <p className="text-teal-100 text-xs mt-2">
                Active Prevention Strategies
              </p>
            </div>
            <ShieldExclamationIcon className="h-12 w-12 text-white opacity-75" />
          </div>
        </div>
      </div>

      {/* Charts Container */}
<div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Trends Chart */}
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h3 className="text-gray-800 font-semibold mb-4">
      Daily Predictions and Preventions Trends
    </h3>
    <div className="h-64">
      <Line data={chartData.trendsOverTime} options={lineChartOptions} />
    </div>
  </div>
  
  {/* Dynamic Trend Chart */}
  <div className="h-full">
    <DynamicTrendChart
      predictions={predictions}
      preventions={preventions}
      usersData={usersData}
    />
  </div>
</div>
    </div>
  );
}

export default AdminHome;
