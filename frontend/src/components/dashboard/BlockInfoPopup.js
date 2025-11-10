import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BlockInfoPopup.css';

const BlockInfoPopup = ({ blockName, onClose }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlockInfo = async () => {
      if (!blockName) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        // This is the API call to your backend, e.g., /api/blocks/U-Block
        const res = await axios.get(`http://localhost:5000/api/blocks/${blockName}`, config);
        setInfo(res.data);
      } catch (error) {
        console.error("Failed to fetch block info:", error);
        setInfo(null); // Clear info on error
      } finally {
        setLoading(false);
      }
    };

    fetchBlockInfo();
  }, [blockName]); // This effect re-runs whenever the blockName prop changes

  if (loading) {
    return (
      <div className="block-info-container">
        <p className="status">Loading details...</p>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="block-info-container">
        <button className="close-button" onClick={onClose}>×</button>
        <h4>{blockName}</h4>
        <p>No additional details are available for this location.</p>
      </div>
    );
  }

  return (
    <div className="block-info-container">
      <button className="close-button" onClick={onClose}>×</button>
      
      {info.imageUrl && <img src={info.imageUrl} alt={info.blockName} className="block-image" />}
      
      <h4>{info.blockName}</h4>
      
      {/* --- THIS IS THE FIX --- */}
      {/* This paragraph will now display the description from your database */}
      {info.description && <p className="description">{info.description}</p>}
      
      {info.faculty?.length > 0 && (
        <div className="info-section">
          <h5>Key Faculty</h5>
          <ul>
            {info.faculty.map((person, i) => <li key={i}>{person.name} ({person.department})</li>)}
          </ul>
        </div>
      )}

      {info.keyLocations?.length > 0 && (
        <div className="info-section">
          <h5>Key Locations</h5>
          <ul>
            {info.keyLocations.map((loc, i) => <li key={i}>{loc}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BlockInfoPopup;

