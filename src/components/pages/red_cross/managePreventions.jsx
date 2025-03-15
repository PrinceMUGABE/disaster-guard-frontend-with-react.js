/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/Dialog";

const Red_Cross_ManagePreventions = () => {
  const [preventions, setPreventions] = useState([]);
  const [filteredPreventions, setFilteredPreventions] = useState([]);
  const [error, setError] = useState("");
  const [selectedPrevention, setSelectedPrevention] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchPreventions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/prevention/preventions/");
        console.log("API Response:", response.data);

        if (response.data && (Array.isArray(response.data) || Array.isArray(response.data.data))) {
          const data = Array.isArray(response.data) ? response.data : response.data.data;
          
          // Filter only preventions with 'waiting' or 'pending' status
          const activePreventions = data.filter(prevention => 
            prevention.status === "waiting" || prevention.status === "pending"
          );
          
          setPreventions(activePreventions);
          setFilteredPreventions(activePreventions);
        } else {
          throw new Error("Unexpected response format. Expected an array.");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.Error || err.message || "Failed to fetch prevention strategies";
        setError(errorMessage);
        console.error("Error fetching prevention strategies:", err);
      }
    };

    fetchPreventions();
  }, []);

  // Update the filtering useEffect to handle all search cases
  useEffect(() => {
    const filteredData = preventions.filter((prevention) => {
      const searchLower = searchQuery.toLowerCase().trim();
      
      // Create a searchable object with all the fields we want to search
      const searchableData = {
        action: prevention.action || '',
        description: prevention.description || '',
        priority: prevention.priority || '',
        responsible_entity: prevention.responsible_entity || '',
        timeframe: prevention.timeframe || '',
        district: prevention.prediction?.district || '',
        sector: prevention.prediction?.sector || '',
        risk_level: prevention.prediction?.risk_level || '',
        most_likely_disaster: prevention.prediction?.most_likely_disaster || '',
        status: prevention.status || ''
      };

      // Check if any of the fields include the search query
      return Object.values(searchableData).some(value => 
        value.toString().toLowerCase().includes(searchLower)
      );
    });
    
    setFilteredPreventions(filteredData);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchQuery, preventions]);

  // Add delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prevention strategy?')) {
      return;
    }

    setIsDeleting(true);
    setDeletingId(id);

    try {
      await axios.delete(`http://localhost:8000/prevention/delete/${id}/`);
      
      // Update the local state to remove the deleted item
      const updatedPreventions = preventions.filter(prevention => prevention.id !== id);
      setPreventions(updatedPreventions);
      setFilteredPreventions(updatedPreventions);
      
      // Show success message
      alert('Prevention strategy deleted successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.Error || err.message || "Failed to delete prevention strategy";
      setError(errorMessage);
      console.error("Error deleting prevention strategy:", err);
      alert('Failed to delete prevention strategy');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  // Add status update handler
  const handleStatusUpdate = async (id, newStatus) => {
    setIsUpdatingStatus(true);
    setUpdatingId(id);

    try {
      const response = await axios.patch(`http://localhost:8000/prevention/${id}/status/`, {
        status: newStatus
      });
      
      // Update the local state with the new status
      const updatedPreventions = preventions.map(prevention => 
        prevention.id === id ? { ...prevention, status: newStatus } : prevention
      );
      
      setPreventions(updatedPreventions);
      setFilteredPreventions(updatedPreventions);
      
      // If the currently selected prevention is the one being updated, update it
      if (selectedPrevention && selectedPrevention.id === id) {
        setSelectedPrevention({ ...selectedPrevention, status: newStatus });
      }
      
      // Show success message
      alert(`Prevention strategy status updated to ${newStatus}`);
    } catch (err) {
      const errorMessage = err.response?.data?.Error || err.message || "Failed to update prevention status";
      setError(errorMessage);
      console.error("Error updating prevention status:", err);
      alert('Failed to update prevention status');
    } finally {
      setIsUpdatingStatus(false);
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      return dateString;
    }
  };

  const formatValue = (value) => {
    if (typeof value === "number") {
      return value.toFixed(2);
    }
    return value;
  };

  const handleViewMore = (prevention) => {
    setSelectedPrevention(prevention);
    setIsModalOpen(true);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-100 text-gray-800";
    
    if (status === "waiting") {
      bgColor = "bg-yellow-100 text-yellow-800";
    } else if (status === "pending") {
      bgColor = "bg-blue-100 text-blue-800";
    } else if (status === "finished") {
      bgColor = "bg-green-100 text-green-800";
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        {status || "N/A"}
      </span>
    );
  };

  // Status dropdown component
  const StatusDropdown = ({ id, currentStatus }) => {
    return (
      <div className="relative inline-block text-left">
        <select
          value={currentStatus || "waiting"}
          onChange={(e) => handleStatusUpdate(id, e.target.value)}
          disabled={isUpdatingStatus && updatingId === id}
          className="block w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
        >
          <option value="waiting">Waiting</option>
          <option value="pending">Pending</option>
          {/* <option value="finished">Finished</option> */}
        </select>
        {isUpdatingStatus && updatingId === id && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <svg className="animate-spin h-5 w-5 text-sky-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
    );
  };

  const PreventionDetailsModal = () => {
    if (!selectedPrevention) return null;
  
    const renderObjectProperties = (obj) => {
      if (!obj || typeof obj !== 'object') return null;
  
      // Parse JSON string if the value is a string
      const data = typeof obj === 'string' ? JSON.parse(obj) : obj;
  
      return Object.entries(data).map(([key, value]) => (
        <div key={key} className="bg-gray-50 p-3 rounded">
          <p className="font-medium text-gray-700 capitalize">
            {key.replace(/_/g, " ")}
          </p>
          <p className="text-gray-600">
            {typeof value === 'object' ? JSON.stringify(value) : value}
          </p>
        </div>
      ));
    };

    const renderResourceList = (data) => {
      // Parse JSON string if the value is a string
      const resourceData = typeof data === 'string' ? JSON.parse(data) : data;
      
      return (
        <ul className="space-y-2">
          {Object.entries(resourceData).map(([key, value]) => (
            <li key={key} className="flex justify-between items-center bg-gray-50 p-3 rounded">
              <span className="font-medium text-gray-700 capitalize">{key.replace(/_/g, " ")}</span>
              <span className="text-gray-600">{value}</span>
            </li>
          ))}
        </ul>
      );
    };
  
    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-full overflow-y-auto pt-96">
          <DialogHeader className="flex justify-between items-center mt-96 py-8">
            <DialogTitle>Prevention Strategy Details</DialogTitle>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6 text-sky-700 mt-64"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </DialogHeader>
          <div className="mt-8 space-y-6">
            <div className="bg-white p-6 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Strategy Overview</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <StatusDropdown 
                    id={selectedPrevention.id} 
                    currentStatus={selectedPrevention.status} 
                  />
                </div>
              </div>
              <p className="text-gray-700"><strong>Action:</strong> {selectedPrevention.action}</p>
              <p className="text-gray-700"><strong>Description:</strong> {selectedPrevention.description}</p>
              <p className="text-gray-700">
                <strong>Priority:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded ${
                    selectedPrevention.priority?.toLowerCase() === "high"
                      ? "bg-red-100 text-red-800"
                      : selectedPrevention.priority?.toLowerCase() === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedPrevention.priority}
                </span>
              </p>
              <p className="text-gray-700"><strong>Responsible Entity:</strong> {selectedPrevention.responsible_entity}</p>
              <p className="text-gray-700"><strong>Timeframe:</strong> {selectedPrevention.timeframe}</p>
            </div>
  
            {selectedPrevention.implementation_timeline && (
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Implementation Timeline</h3>
                <div className="space-y-2">{renderObjectProperties(selectedPrevention.implementation_timeline)}</div>
              </div>
            )}
  
            {selectedPrevention.resource_requirements && (
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Resource Requirements</h3>
                <div className="space-y-2">{renderObjectProperties(selectedPrevention.resource_requirements)}</div>
              </div>
            )}
  
            {selectedPrevention.human_resources && (
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Personnel Requirements</h3>
                <div className="space-y-2">
                  {renderResourceList(selectedPrevention.human_resources)}
                </div>
              </div>
            )}
  
            {selectedPrevention.equipment_resources && (
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Equipment Requirements</h3>
                <div className="space-y-2">
                  {renderResourceList(selectedPrevention.equipment_resources)}
                </div>
              </div>
            )}
  
            {selectedPrevention.budget && (
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Budget</h3>
                <p className="text-gray-700 text-xl">
                  ${Number(selectedPrevention.budget).toLocaleString()}
                </p>
              </div>
            )}
  
            <p className="text-gray-500 text-sm">
              Created on: {formatDate(selectedPrevention.created_at)}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const totalPages = Math.ceil(filteredPreventions.length / rowsPerPage);
  const paginatedData = filteredPreventions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-sky-900">Disaster Preventions</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border text-gray-700 px-4 py-2 rounded-md w-full md:w-1/3"
        />

        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1); // Reset to first page
          }}
          className="border px-4 py-2 rounded-md ml-4 text-gray-700"
        >
          {[6, 12, 25, 50, 100].map((rows) => (
            <option key={rows} value={rows}>{rows} rows</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.map((prevention) => (
          <div
            key={prevention.id}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col"
          >
            {prevention.prediction && (
              <>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">Prediction Details</h3>
                    <StatusBadge status={prevention.status} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700"><strong>District:</strong> {prevention.prediction.district}</p>
                    <p className="text-gray-700"><strong>Sector:</strong> {prevention.prediction.sector}</p>
                    <p className="text-gray-700">
                      <strong>Risk Level:</strong>
                      <span className={`ml-2 px-2 py-1 rounded ${
                        prevention.prediction.risk_level === "High" ? "bg-red-100 text-red-800" :
                        prevention.prediction.risk_level === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        prevention.prediction.risk_level === "Low" ? "bg-yellow-100 text-green-700" :
                        "bg-green-100 text-amber-600"
                      }`}>
                        {prevention.prediction.risk_level}
                      </span>
                    </p>
                    <p className="text-gray-700"><strong>Most Likely Disaster:</strong> {prevention.prediction.most_likely_disaster}</p>
                    <p className="text-gray-700"><strong>Confidence Score:</strong> {formatValue(prevention.prediction.confidence_score)}</p>
                  </div>
                </div>
                <div className="mt-auto space-y-2">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>

                    <p className="text-gray-700"><strong>Status:</strong> {formatValue(prevention.status)}</p>
                    
                  </div>
                  <button 
                    onClick={() => handleViewMore(prevention)}
                    className="w-full bg-sky-900 hover:bg-black text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    View Prevention Strategy
                  </button>
           
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredPreventions.length === 0 && !error && (
        <p className="text-gray-600 text-center">No predictions available.</p>
      )}

      {/* Pagination Controls */}
      {filteredPreventions.length > rowsPerPage && (
        <div className="flex justify-end mt-6 space-x-2">
          <button
            className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-sky-900 text-white"}`}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">Page {currentPage} of {totalPages}</span>
          <button
            className={`px-3 py-2 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-sky-900 text-white"}`}
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <div className="mt-32">
        <PreventionDetailsModal />
      </div>
    </div>
  );
};

export default Red_Cross_ManagePreventions;