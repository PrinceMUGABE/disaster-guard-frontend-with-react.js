/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  Trash2,
  X,
  Download,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/Dialog";
import * as XLSX from "xlsx";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import PredictionModal from "./PredictionModel.jsx";

import jsPDF from "jspdf";
import "jspdf-autotable";

const AdminManageDisasterPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    district: "",
    sector: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const downloadRef = useRef(null);
  const [predictionResult, setPredictionResult] = useState(null);
  

  // Download functions moved inside component scope
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Disaster Predictions Report", 14, 15);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    doc.autoTable({
      startY: 35,
      head: [["District", "Sector", "Disaster", "Risk Level", "Created At"]],
      body: filteredPredictions.map((p) => [
        p.district || "N/A",
        p.sector || "N/A",
        p.most_likely_disaster || "N/A",
        p.risk_level || "N/A",
        formatDate(p.created_at),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [23, 37, 84] },
    });

    doc.save("disaster-predictions.pdf");
  };

  const downloadExcel = () => {
    const dataToExport = filteredPredictions.map((p) => ({
      District: p.district || "N/A",
      Sector: p.sector || "N/A",
      Disaster: p.most_likely_disaster || "N/A",
      "Risk Level": p.risk_level || "N/A",
      "Created At": formatDate(p.created_at),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Predictions");
    XLSX.writeFile(wb, "disaster-predictions.xlsx");
  };

  const downloadCSV = () => {
    const headers = ["District,Sector,Disaster,Risk Level,Created At\n"];
    const csv = filteredPredictions
      .map((p) =>
        [
          p.district || "N/A",
          p.sector || "N/A",
          p.most_likely_disaster || "N/A",
          p.risk_level || "N/A",
          formatDate(p.created_at),
        ].join(",")
      )
      .join("\n");

    const blob = new Blob([headers + csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.href = url;
    a.download = "disaster-predictions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setShowDownloadOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Rows per page options
  const rowsOptions = [5, 10, 30, 50, 100];

  useEffect(() => {
    fetchPredictions();
  }, []);

  // Fix 2: Update the filtering to handle null values
  const filteredPredictions = predictions.filter(
    (pred) =>
      (pred?.district || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pred?.sector || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pred?.most_likely_disaster || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPredictions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPredictions = filteredPredictions.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const fetchPredictions = async () => {
    setLoading(true);
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
        // Fix 1: Directly use the array from the response instead of accessing .predictions
        setPredictions(data || []);
      } else {
        setError("Failed to fetch predictions");
      }
    } catch (err) {
      setError("Error fetching predictions");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update handleCreatePrediction function
  const handleCreatePrediction = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear any previous errors

    try {
      const response = await fetch(
        "http://localhost:8000/prediction/predict/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle error response
        const errorMessage = data.Error || data.error || "Failed to create prediction";
        console.error("Error creating prediction:", errorMessage);

        // If there's a next_available date in the response
        if (data.next_available) {
          const nextDate = new Date(data.next_available);
          setError(`${errorMessage}. Next available: ${nextDate.toLocaleDateString()} at ${nextDate.toLocaleTimeString()}`);
        } else {
          setError(errorMessage);
        }
      } else {
        console.log("Returned result after predicting: ", data);
        setPredictionResult(data);
        await fetchPredictions();
        // Don't close the modal here
      }
    } catch (error) {
      console.error("Network error:", error);
      setError(error.message || "Network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this prediction?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/prediction/delete/${id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          await fetchPredictions();
        } else {
          throw new Error("Failed to delete prediction");
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fix 3: Update the chart data processing to handle numerical values
  const renderCharts = () => {
    const temperatureData = predictions.map((p) => ({
      location: `${p.district}-${p.sector}`,
      temperature: parseFloat(p.temperature?.replace("°C", "") || 0),
      disaster: p.most_likely_disaster,
    }));

    const riskData = predictions.map((p) => ({
      location: `${p.district}-${p.sector}`,
      risk: p.risk_level === "High" ? 3 : p.risk_level === "Medium" ? 2 : 1,
    }));

    // Calculate pagination based on filtered predictions
    const totalPages = Math.ceil(filteredPredictions.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedPredictions = filteredPredictions.slice(
      startIndex,
      startIndex + rowsPerPage
    );

    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow h-64">
          <h3 className="text-sm font-semibold mb-2 text-black">
            Temperature Distribution
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="location"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#3b82f6"
                name="Temperature (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow h-64">
          <h3 className="text-sm font-semibold mb-2 text-black">
            Risk Level Distribution
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="location"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 10 }}
              />
              <YAxis domain={[0, 3]} ticks={[1, 2, 3]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="risk"
                stroke="#183562"
                name="Risk Level"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Fix 4: Add loading and error states to the component return
  if (loading) {
    return <div className="text-center p-4">Loading predictions...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="w-full px-12 ml-4">
      <h1 className="text-xl font-bold mb-4 text-sky-900 text-center">
        DISASTER PREDICTIONS MANAGEMENT
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-sky-900 text-white rounded-md flex items-center space-x-2 hover:bg-black"
          >
            <Plus className="h-4 w-4" />
            <span>New Prediction</span>
          </button>
        </div>

        <div className="relative group">
          <button
            onClick={() => setShowDownloadOptions(!showDownloadOptions)} // Add this line
            className="px-4 py-2 bg-sky-900 text-white rounded-md flex items-center space-x-2 hover:bg-black"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          {showDownloadOptions && (
            <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => {
                    downloadPDF();
                    setShowDownloadOptions(false); // Changed to false to close dropdown after click
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Download as PDF
                </button>
                <button
                  onClick={() => {
                    downloadExcel();
                    setShowDownloadOptions(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Download as Excel
                </button>
                <button
                  onClick={() => {
                    downloadCSV();
                    setShowDownloadOptions(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Download as CSV
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search predictions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-auto pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-sky-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    District/Sector
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Weather Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Disaster Risk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPredictions.map((prediction) => (
                  <tr key={prediction.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {prediction.district}
                      </div>
                      <div className="text-sm text-gray-500">
                        {prediction.sector}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        Temp: {prediction.temperature}
                      </div>
                      <div className="text-sm text-gray-500">
                        Wind: {prediction.wind_speed}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {prediction.most_likely_disaster}
                      </div>
                      <div
                        className={`text-sm ${
                          prediction.risk_level === "High"
                            ? "text-sky-900"
                            : prediction.risk_level === "Medium"
                            ? "text-yellow-600"
                            : prediction.risk_level === "Low"
                            ? "text-amber-400"
                            : "text-yellow-500"
                        }`}
                      >
                        Risk: {prediction.risk_level}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(prediction.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-center">
                      <button
                        onClick={() => {
                          setSelectedPrediction(prediction);
                          setShowViewModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mx-2"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prediction.id)}
                        className="text-green-900 hover:text-red-900 mx-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-md px-2 py-1 text-gray-700"
            >
              {rowsOptions.map((option) => (
                <option key={option} value={option}>
                  {option} rows
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5 text-blue-700" />
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {Math.max(1, totalPages)}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5 text-blue-700" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">{renderCharts()}</div>
      </div>



      <PredictionModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        predictionResult={predictionResult}
        formData={formData}
        setFormData={setFormData}
        setPredictionResult={setPredictionResult}
        handleCreatePrediction={handleCreatePrediction}
        isLoading={isLoading}
      />

      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-5/6">
          <DialogHeader>
            <DialogTitle className="text-sky-900">Prediction Details</DialogTitle>
          </DialogHeader>
          {selectedPrediction && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Location
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPrediction.district} - {selectedPrediction.sector}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Created At
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedPrediction.created_at)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Temperature
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPrediction.temperature}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Wind Speed
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPrediction.wind_speed}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Humidity
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPrediction.humidity}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Rainfall
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPrediction.rainfall}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Soil Type
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPrediction.soil_type}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Confidence Score
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPrediction.confidence_score}
                  </p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">
                    Prediction Result
                  </h4>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-900">
                      Most Likely Disaster:{" "}
                      {selectedPrediction.most_likely_disaster}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        selectedPrediction.risk_level === "High"
                          ? "text-sky-900"
                          : selectedPrediction.risk_level === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      Risk Level: {selectedPrediction.risk_level}
                    </p>
                  </div>
                  <div>
                  <h4 className="text-sm font-medium text-sky-900">
                      To view prevention strategies go to prevention strategy page
                  </h4>
                 
                </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-sky-900 rounded-md hover:bg-black"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManageDisasterPredictions;
