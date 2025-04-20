import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
// import ResourceDashboard from "./components/Resources/ResourceDashboard";
import TasksPage from "./pages/TasksPage";
import Resources from "./pages/Resources";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import ReportDisaster from "./pages/ReportDisaster";
import GroupedAlerts from "./pages/GroupedAlerts";
import AlertDetails from "./pages/AlertDetails";
import Teams from "./pages/Teams";
import Events from "./pages/Events";
import EventPage from "./pages/EventDetailsPage";
import EventDashboardPage from "./pages/EventsDashboardPage";
import CreateEvent from "./pages/CreateEvent";
import CitizenDashboard from "./pages/CitizenDashboard";
import MyReportStatus from "./pages/MyReportStatus"; // ✅ Import added
// import ResponderDashboardPage from "./pages/ResponderDashboardPage";
import LayoutWrapper from "./components/LayoutWrapper";
import ResponderDashboardPage from "./pages/ResponderDashboardPage";
import ResponderTaskPage from "./pages/ResponderTaskPage";
import ResponderAssignedAlertsPage from "./pages/ResponderAssignedAlertsPage";
import ResponderResourcesPage from "./pages/ResponderResourcesPage";
import RequestResourceForm from "./components/Responders/RequestResourceForm";
import "./index.css";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* ✅ Fixed Navbar Positioning */}
        <Navbar />

        <div className="flex flex-grow">
          {/* ✅ Sidebar */}
          <Sidebar />

          {/* ✅ Main Content Area */}
          <div className="flex-grow overflow-auto ml-[250px] mt-[60px] p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/events" replace />} />

              <Route
                path="/citizen-dashboard"
                element={
                  <LayoutWrapper>
                    <CitizenDashboard />
                  </LayoutWrapper>
                }
              />
              <Route path="/my-reports" element={<MyReportStatus />} /> {/* ✅ New Route */}
              <Route path="/responder/dashboard" element={<ResponderDashboardPage />} />
              <Route path="/responder/tasks" element={<ResponderTaskPage />} />
              <Route path="/responder/alerts" element={<ResponderAssignedAlertsPage />} />
              <Route path="/responder/resources" element={<ResponderResourcesPage />} />
              <Route path="/responder/request-resource" element={<RequestResourceForm />} />

              <Route path="/events" element={<Events />} />
              <Route path="/tasks" element={<TasksPage />} />
              {/* <Route path="/resources" element={<Resources />} /> */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/report-disaster" element={<ReportDisaster />} />
              <Route path="/alerts" element={<GroupedAlerts />} />
              <Route path="/alert-details/:alertId" element={<AlertDetails />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/events/:eventId" element={<EventPage />} />
              <Route path="/events/:eventId/dashboard" element={<EventDashboardPage />} />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/resources" element={<Resources />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
