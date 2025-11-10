import React from 'react';
import './InfoPanel.css';

// Import the specific detail components
import LibrarySearch from './LibrarySearch';
import BlockInfoPopup from './BlockInfoPopup';

const InfoPanel = ({ destination, onClose }) => {
  // If no destination is selected, the panel does not appear
  if (!destination) {
    return null;
  }

  // This function decides which content to show inside the panel
  const renderContent = () => {
    switch (destination.type) {
      case 'library':
        return <LibrarySearch />;
      case 'block':
        return <BlockInfoPopup blockName={destination.name} onClose={onClose} />;
      default:
        // A default view for other points of interest
        return (
          <div className="default-info">
            <h4>{destination.name}</h4>
            <p>More information about this location will be available soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="info-panel">
      <button className="info-panel-close-btn" onClick={onClose}>×</button>
      <div className="info-panel-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default InfoPanel;