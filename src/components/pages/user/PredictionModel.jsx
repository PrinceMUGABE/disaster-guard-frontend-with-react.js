/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/Dialog";
import { X } from "lucide-react";

const PredictionModal = ({
  showCreateModal,
  setShowCreateModal,
  predictionResult,
  formData,
  setFormData,
  setPredictionResult,
  handleCreatePrediction,
  isLoading,
}) => {
  const handleClose = () => {
    setShowCreateModal(false);
    setPredictionResult(null);
    setFormData({ district: "", sector: "" });
  };

  return (
    <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
      <DialogContent className="max-h-[90vh] overflow-y-auto pt-96">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-sky-950 focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader>
          <DialogTitle className="text-sky-900">
            {predictionResult ? "Prediction Result" : "Create New Prediction"}
          </DialogTitle>
        </DialogHeader>
        {predictionResult ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Location Information */}
              <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sky-900 mb-2">
                  Location Details
                </h3>
                <p className="text-gray-700">
                  District: {predictionResult.prediction.district}
                </p>
                <p className="text-gray-700">
                  Sector: {predictionResult.prediction.sector}
                </p>
              </div>

              {/* Weather Conditions */}
              <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sky-900 mb-2">
                  Weather Conditions
                </h3>
                <p className="text-gray-700">
                  Temperature: {predictionResult.prediction.temperature}
                </p>
                <p className="text-gray-700">
                  Wind Speed: {predictionResult.prediction.wind_speed}
                </p>
                <p className="text-gray-700">
                  Humidity: {predictionResult.prediction.humidity}
                </p>
                <p className="text-gray-700">
                  Rainfall: {predictionResult.prediction.rainfall}
                </p>
              </div>

              {/* Prediction Results */}
              <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sky-900 mb-2">
                  Prediction Results
                </h3>
                <p className="text-gray-700">
                  Most Likely Disaster:{" "}
                  {predictionResult.prediction.most_likely_disaster}
                </p>
                <p className="text-gray-700">
                  Risk Level: {predictionResult.prediction.risk_level}
                </p>
                <p className="text-gray-700">
                  Confidence Score:{" "}
                  {predictionResult.prediction.confidence_score}
                </p>
              </div>

              {/* Prevention Strategies */}
              {predictionResult.prevention_strategies?.length > 0 && (
                <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-sky-900 mb-2">
                    Prevention Strategies
                  </h3>
                  <p className="text-gray-700">
                          Action:
                        </p> <br />
                  {predictionResult.prevention_strategies.map(
                    (strategy, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-2"
                      >
                        
                        <span className="text-blue-700">* {strategy.action}</span>
                        <p className="text-gray-700">
                          Description: {strategy.description}
                        </p>
                        <p className="text-gray-700">
                          Priority: {strategy.priority}
                        </p>
                        <p className="text-gray-700">
                          Timeframe: {strategy.timeframe}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sky-900 mb-2">
                  To see more about preventions for this disaster, go to preventions dashboard
                </h3>
              </div> */}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-white bg-sky-900 rounded-md hover:bg-sky-800"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreatePrediction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sector</label>
              <input
                type="text"
                value={formData.sector}
                onChange={(e) =>
                  setFormData({ ...formData, sector: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-sky-900 rounded-md hover:bg-sky-800 disabled:opacity-50"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Prediction"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PredictionModal;