/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/Dialog";
import { X, AlertTriangle } from "lucide-react";

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
  // State for dropdown selections
  const [selectedProvince, setSelectedProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setPredictionResult(null);
    setFormData({ district: "", sector: "" });
    setSelectedProvince("");
    setDistricts([]);
    setSectors([]);
  };


  // JSON Data for districts and sectors
  const locationData = {
    "Kigali_City": {
      "Gasabo": {
        "sectors": [
          "Bumbogo",
          "Gatsata",
          "Gikomero",
          "Gisozi",
          "Jabana",
          "Jali",
          "Kacyiru",
          "Kimihurura",
          "Kimironko",
          "Kinyinya",
          "Ndera",
          "Nduba",
          "Remera",
          "Rusororo",
          "Rutunga"
        ]
      },
      "Kicukiro": {
        "sectors": [
          "Gahanga",
          "Gatenga",
          "Gikondo",
          "Kagarama",
          "Kanombe",
          "Kicukiro",
          "Kigarama",
          "Masaka",
          "Niboye",
          "Nyarugunga"
        ]
      },
      "Nyarugenge": {
        "sectors": [
          "Gitega",
          "Kanyinya",
          "Kigali",
          "Kimisagara",
          "Mageragere",
          "Muhima",
          "Nyakabanda",
          "Nyamirambo",
          "Nyarugenge",
          "Rwezamenyo"
        ]
      }
    },
    
    "Eastern_Province": {
      "Bugesera": {
        "sectors": [
          "Gashora",
          "Juru",
          "Kamabuye",
          "Ntarama",
          "Mareba",
          "Musenyi",
          "Mwogo",
          "Ngeruka",
          "Ntarama",
          "Nyamata",
          "Rilima",
          "Ruhuha",
          "Shyara"
        ]
      },
      "Gatsibo": {
        "sectors": [
          "Gasange",
          "Gatsibo",
          "Gitoki",
          "Kabarore",
          "Kageyo",
          "Kiramuruzi",
          "Kiziguro",
          "Muhura",
          "Murambi",
          "Ngarama",
          "Remera",
          "Rugarama",
          "Rwimbogo"
        ]
      },
      "Kayonza": {
        "sectors": [
          "Gahini",
          "Kabare",
          "Kabarondo",
          "Mukarange",
          "Murama",
          "Mwiri",
          "Nyamirama",
          "Ndego",
          "Rukara",
          "Ruramira",
          "Rwinkwavu"
        ]
      },
      "Kirehe": {
        "sectors": [
          "Gahara",
          "Gatore",
          "Kigarama",
          "Kirehe",
          "Mahama",
          "Mpanga",
          "Musaza",
          "Mushikiri",
          "Nasho",
          "Nyamugari",
          "Nyarubuye"
        ]
      },
      "Ngoma": {
        "sectors": [
          "Gashanda",
          "Jarama",
          "Karembo",
          "Kazo",
          "Kibungo",
          "Mugesera",
          "Murama",
          "Mutenderi",
          "Remera",
          "Rukira",
          "Rukumberi",
          "Sake",
          "Zaza"
        ]
      },
      "Nyagatare": {
        "sectors": [
          "Gatunda",
          "Karama",
          "Karangazi",
          "Katabagemu",
          "Kiyombe",
          "Matimba",
          "Mimuli",
          "Mukama",
          "Musheli",
          "Nyagatare",
          "Rukomo",
          "Rwempasha",
          "Rwimiyaga",
          "Tabagwe"
        ]
      },
      "Rwamagana": {
        "sectors": [
          "Fumbwe",
          "Gahengeri",
          "Gishari",
          "Karenge",
          "Kigabiro",
          "Muhazi",
          "Munyaga",
          "Munyiginya",
          "Musha",
          "Muyumbu",
          "Nzige",
          "Rubona"
        ]
      }
    },
    
    "Southern_Province": {
      "Gisagara": {
        "sectors": [
          "Gikonko",
          "Gishubi",
          "Kansi",
          "Kibirizi",
          "Kigembe",
          "Mamba",
          "Muganza",
          "Mukindo",
          "Musha",
          "Ndora",
          "Nyanza",
          "Save"
        ]
      },
      "Huye": {
        "sectors": [
          "Gishamvu",
          "Huye",
          "Karama",
          "Kigoma",
          "Kinazi",
          "Maraba",
          "Mbazi",
          "Mukura",
          "Ngoma",
          "Ruhashya",
          "Rusatira",
          "Rwaniro",
          "Simbi",
          "Tumba"
        ]
      },
      "Kamonyi": {
        "sectors": [
          "Gacurabwenge",
          "Karama",
          "Kayenzi",
          "Kayumbu",
          "Mugina",
          "Musambira",
          "Ngamba",
          "Nyamiyaga",
          "Nyarubaka",
          "Rugarika",
          "Rukoma",
          "Runda"
        ]
      },
      "Muhanga": {
        "sectors": [
          "Cyeza",
          "Kabacuzi",
          "Kibangu",
          "Kiyumba",
          "Muhanga",
          "Mushishiro",
          "Nyabinoni",
          "Nyamabuye",
          "Nyarusange",
          "Rongi",
          "Rugendabari",
          "Shyogwe"
        ]
      },
      "Nyamagabe": {
        "sectors": [
          "Buruhukiro",
          "Cyarubare",
          "Gasaka",
          "Gatare",
          "Kaduha",
          "Kamegeri",
          "Kibumbwe",
          "Kitabi",
          "Mbazi",
          "Mugano",
          "Musange",
          "Musebeya",
          "Nkomane",
          "Tare",
          "Uwinkingi"
        ]
      },
      "Nyanza": {
        "sectors": [
          "Busasamana",
          "Busoro",
          "Cyabakamyi",
          "Kibilizi",
          "Kigoma",
          "Mukingo",
          "Muyira",
          "Ntyazo",
          "Nyagisozi",
          "Rwabicuma"
        ]
      },
      "Nyaruguru": {
        "sectors": [
          "Busanze",
          "Cyahinda",
          "Kibeho",
          "Kivu",
          "Mata",
          "Muganza",
          "Munini",
          "Ngera",
          "Ngoma",
          "Nyabimata",
          "Nyagisozi",
          "Ruheru",
          "Ruramba",
          "Rusenge"
        ]
      },
      "Ruhango": {
        "sectors": [
          "Byimana",
          "Kinihira",
          "Kinazi",
          "Mbuye",
          "Mwendo",
          "Ntongwe",
          "Ruhango",
          "Rugendabari"
        ]
      }
    },
    
    "Western_Province": {
      "Karongi": {
        "sectors": [
          "Bwishyura",
          "Gishyita",
          "Gisovu",
          "Gitesi",
          "Mubuga",
          "Murambi",
          "Murundi",
          "Mutuntu",
          "Rubengera",
          "Rugabano",
          "Ruganda",
          "Twumba"
        ]
      },
      "Ngororero": {
        "sectors": [
          "Bwira",
          "Gatumba",
          "Hindiro",
          "Kabaya",
          "Kageyo",
          "Kavumu",
          "Matyazo",
          "Muhanda",
          "Ndaro",
          "Ngororero",
          "Nyange",
          "Sovu"
        ]
      },
      "Nyabihu": {
        "sectors": [
          "Bigogwe",
          "Jenda",
          "Jomba",
          "Kabatwa",
          "Karago",
          "Kintobo",
          "Mukamira",
          "Mulinga",
          "Rambura",
          "Rugera",
          "Rurembo",
          "Shyira"
        ]
      },
      "Nyamasheke": {
        "sectors": [
          "Banda",
          "Bushenge",
          "Bushekeri",
          "Cyato",
          "Gihombo",
          "Kagano",
          "Kanjongo",
          "Karambi",
          "Karengera",
          "Kirimbi",
          "Macuba",
          "Mahembe",
          "Nyabitekeri",
          "Rangiro",
          "Ruharambuga",
          "Shangi"
        ]
      },
      "Rubavu": {
        "sectors": [
          "Bugeshi",
          "Busasamana",
          "Cyanzarwe",
          "Gisenyi",
          "Kanama",
          "Mudende",
          "Nyakiriba",
          "Nyamyumba",
          "Rugerero",
          "Rubavu"
        ]
      },
      "Rusizi": {
        "sectors": [
          "Bugarama",
          "Butare",
          "Gashonga",
          "Giheke",
          "Gihundwe",
          "Gitambi",
          "Kamembe",
          "Muganza",
          "Mururu",
          "Nkanka",
          "Nkombo",
          "Nkungu",
          "Nyakabuye",
          "Nyakarenzo",
          "Nzahaha",
          "Rwimbogo"
        ]
      },
      "Rutsiro": {
        "sectors": [
          "Boneza",
          "Gihango",
          "Kigeyo",
          "Kivumu",
          "Manihira",
          "Mukura",
          "Murunda",
          "Musasa",
          "Mushonyi",
          "Mushubati",
          "Nyabirasi",
          "Rusebeya"
        ]
      }
    },
    
    "Northern_Province": {
      "Burera": {
        "sectors": [
          "Bungwe",
          "Butaro",
          "Cyanika",
          "Cyeru",
          "Gahunga",
          "Gatebe",
          "Gitovu",
          "Kagogo",
          "Kinoni",
          "Kinyababa",
          "Kivuye",
          "Nemba",
          "Rugarama",
          "Rugengabari",
          "Ruhunde",
          "Rusarabuge"
        ]
      },
      "Gakenke": {
        "sectors": [
          "Busengo",
          "Coko",
          "Cyabingo",
          "Gakenke",
          "Gashenyi",
          "Janja",
          "Kamubuga",
          "Karambo",
          "Kivuruga",
          "Mataba",
          "Minazi",
          "Muhondo",
          "Muyongwe",
          "Muzo",
          "Nemba",
          "Ruli",
          "Rusasa",
          "Rushashi"
        ]
      },
      "Gicumbi": {
        "sectors": [
          "Bukure",
          "Bwisige",
          "Byumba",
          "Cyumba",
          "Giti",
          "Kageyo",
          "Kaniga",
          "Manyagiro",
          "Miyove",
          "Mukarange",
          "Muko",
          "Mutete",
          "Nyamiyaga",
          "Nyankenke",
          "Rubaya",
          "Rukomo",
          "Rushaki",
          "Rutare",
          "Ruvune",
          "Shangasha"
        ]
      },
      "Musanze": {
        "sectors": [
          "Busogo",
          "Cyuve",
          "Gacaca",
          "Gashaki",
          "Gataraga",
          "Kimonyi",
          "Kinigi",
          "Muhoza",
          "Muko",
          "Nkotsi",
          "Nyange",
          "Remera",
          "Rwaza",
          "Shingiro"
        ]
      },
      "Rulindo": {
        "sectors": [
          "Base",
          "Burega",
          "Bushoki",
          "Buyoga",
          "Cyinzuzi",
          "Cyungo",
          "Kinihira",
          "Kisaro",
          "Masoro",
          "Mbogo",
          "Murambi",
          "Ntarabana",
          "Rukozo",
          "Rusiga",
          "Shyorongi",
          "Tumba"
        ]
      }
    }
  };

  // Get all province names
  const provinces = Object.keys(locationData);
  
  // Handle province change
  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setFormData({ ...formData, district: "", sector: "" });
    
    if (province) {
      // Get districts for selected province
      const districtNames = Object.keys(locationData[province]);
      setDistricts(districtNames);
      setSectors([]);
    } else {
      setDistricts([]);
      setSectors([]);
    }
  };
  
  // Handle district change
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setFormData({ ...formData, district: district, sector: "" });
    
    if (district && selectedProvince) {
      // Get sectors for selected district
      const sectorNames = locationData[selectedProvince][district].sectors;
      setSectors(sectorNames);
    } else {
      setSectors([]);
    }
  };
  
  // Handle sector change
  const handleSectorChange = (e) => {
    const sector = e.target.value;
    setFormData({ ...formData, sector: sector });
  };

  return (
    <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
      <DialogContent className="max-h-[90vh] overflow-y-auto pt-16">
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

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}


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
              <label className="block text-sm font-medium text-gray-700">Province</label>
              <select
                value={selectedProvince}
                onChange={handleProvinceChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">District</label>
              <select
                value={formData.district}
                onChange={handleDistrictChange}
                required
                disabled={!selectedProvince}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Sector</label>
              <select
                value={formData.sector}
                onChange={handleSectorChange}
                required
                disabled={!formData.district}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Sector</option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
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
                disabled={isLoading || !formData.district || !formData.sector}
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