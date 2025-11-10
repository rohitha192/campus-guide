import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './dashboard.css';

const DashboardLayout = () => {
  // This state holds the destination and is shared with the child components.
  const [destination, setDestination] = useState(null);

  return (
    <div className="dashboard-container">
      {/* It passes the 'setDestination' function down to the Sidebar,
        so the sidebar can tell this parent when a location is selected.
      */}
      <Sidebar onDestinationSelect={setDestination} />
      
      <main className="main-content">
        {/* It passes the 'destination' state down to the active page (MapNavigator),
          so the map knows where to navigate.
        */}
        <Outlet context={{ destination, setDestination }} />
      </main>
    </div>
  );
};

export default DashboardLayout;

