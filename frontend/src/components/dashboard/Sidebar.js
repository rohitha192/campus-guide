import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onDestinationSelect }) => {
  const navigate = useNavigate();

  // This is the "brain" of the search bar, containing all known locations and their types.
  const [locations] = useState({
    'ublock': { name: 'U-Block', type: 'block', coords: [16.233264, 80.550674] },
    'nblock': { name: 'N-Block', type: 'block', coords: [16.233900, 80.550148] },
    'convocationhall': { name: 'Convocation Hall', type: 'poi', coords: [16.233808, 80.551433] },
    'volleyballcourt': { name: 'Volleyball Court', type: 'poi', coords: [16.234168, 80.551533] },
    'maincanteen': { name: 'MHP, Main Canteen', type: 'food', coords: [16.233540, 80.549958] },
    'mhp': { name: 'MHP, Main Canteen', type: 'food', coords: [16.233540, 80.549958] },
    'zestcanteen': { name: 'Zest Canteen', type: 'food', coords: [16.233221, 80.549741] },
    'hblock': { name: 'H-Block', type: 'block', coords: [16.232420, 80.548821] },
    'ablock': { name: 'A-Block', type: 'block', coords: [16.232772, 80.547450] },
    'library': { name: 'Library', type: 'library', coords: [16.233166, 80.548408] },
    'boyshostel': { name: 'Boys Hostel', type: 'poi', coords: [16.231438, 80.550095] },
    'pharmacycollege': { name: 'Pharmacy College', type: 'block', coords: [16.230294, 80.550942] },
    'laracanteen': { name: 'Lara Canteen', type: 'food', coords: [16.231889, 80.553303] },
    "vignanslaracollege": { name: "Vignan's Lara College", type: 'block', coords: [16.231592, 80.554107] },
    'girlshostel': { name: "Priyadarshini Vignan's Girls Hostel", type: 'poi', coords: [16.233332, 80.554215] },
    'vignanpond': { name: 'Vignan Pond', type: 'poi', coords: [16.233332, 80.554215] },
  });

  const [userInput, setUserInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const query = userInput.toLowerCase().replace(/[\s-]/g, '');
    const foundLocation = locations[query];

    if (foundLocation) {
      onDestinationSelect(foundLocation);
      navigate('/dashboard/map');
      setUserInput('');
    } else {
      alert(`Location "${userInput}" not found.`);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Vignan's Guide</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard/map">Map Navigator</NavLink>
        <NavLink to="/dashboard/events">Events</NavLink>
        <NavLink to="/dashboard/queries">Campus Queries</NavLink>
      </nav>
      <div className="sidebar-section">
        <h3>Find a Location</h3>
        <form onSubmit={handleSearch} className="sidebar-search-form">
          <input
            type="text"
            placeholder="e.g., 'library' or 'ublock'"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button type="submit">Go</button>
        </form>
      </div>
    </aside>
  );
};

export default Sidebar;