import { useState, useEffect } from "react";
import axios from "axios";
import CreateResourceModal from "../components/Resources/CreateResourceModal";
import ResourceList from "../components/Resources/ResourcesList";
import ResourceDashboard from "../components/Resources/ResourceDashboard";

const Resources = () => {
  const [resources, setResources] = useState([]); // List of resources
  const [summaryData, setSummaryData] = useState({}); // Summary data for dashboard
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch the list of resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      const resData = await axios.get("http://localhost:5000/api/resources");
      console.log("Fetched resources:", resData.data); // Log the resources data
      setResources(Array.isArray(resData.data) ? resData.data : []); // Update resources list
    } catch (error) {
      console.error("Error fetching resources:", error);
      setError("Failed to load resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch the summary data for the resource dashboard
  const fetchResourceSummary = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/resources/summary");
      console.log("Fetched resource summary:", data); // Log the entire response
      if (data && data.data) {
        // Ensure the response has a `data` property
        let cleanedSummaryData = Object.keys(data.data)
          .filter((key) => key !== "null") // Remove the null key
          .reduce((obj, key) => {
            obj[key] = data.data[key];
            return obj;
          }, {});
          
        setSummaryData(cleanedSummaryData); // Correctly set summaryData from API response
        {console.log('Current summaryData:', cleanedSummaryData)} {/* Log summaryData here */}

      } else {
        console.error("Invalid summary data structure:", data);
        setSummaryData({}); // Reset summaryData if it's invalid
      }
    } catch (error) {
      console.error("Error fetching resource summary:", error);
      setSummaryData({}); // Reset in case of error
    }
  };

  useEffect(() => {
    fetchResources(); // Fetch resources on component mount
    fetchResourceSummary(); // Fetch resource summary on component mount
  }, []); // Empty dependency array ensures this runs only once when component mounts

  const handleModalClose = () => setShowModal(false); // Close modal handler

  const handleResourceCreated = () => {
    fetchResources(); // Refetch resources when new one is created
    fetchResourceSummary(); // Refetch summary data when new resource is created
    handleModalClose(); // Close modal after creation
  };

  return (
    <div className="p-6 space-y-6">
      {/* Resource Dashboard - Main View */}
      <h1 className="text-2xl font-bold">Resource Dashboard</h1>
      {/* Log summaryData here to track the state */}
      <div>
      </div>

      {/* </div> */}
      {/* //Ensure summaryData is available before passing to ResourceDashboard */}
      {summaryData && Object.keys(summaryData).length > 0 ? (
        <ResourceDashboard resources={summaryData} />
      ) : (
        <p>Loading resource summary...</p> // Show loading if data is not available
      )}

      {/* Manage Resources Section */}
      <div className="flex justify-between items-center pt-6 border-t">
        <h2 className="text-xl font-bold">Manage Resources</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          + Create Resource
        </button>
      </div>

      {/* List of Resources */}
      <ResourceList resources={resources} loading={loading} error={error} />

      {/* Create Resource Modal */}
      {showModal && (
        <CreateResourceModal
          onClose={handleModalClose}
          onResourceCreated={handleResourceCreated}
        />
      )}
    </div>
  );
};

export default Resources;
