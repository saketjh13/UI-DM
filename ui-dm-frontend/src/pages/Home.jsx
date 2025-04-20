import React from "react";

import EventsDashboard from "../components/Events/EventsDashboard";

const Home = () => {
  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <div className="pt-20 pl-60">
          <EventsDashboard />
        </div>
      </div>
    </div>
  );
};

export default Home;
