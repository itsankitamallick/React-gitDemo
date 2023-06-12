import React, { useState } from 'react';
import Table from './Table';

function Sidebar() {
  const [showTable, setShowTable] = useState(false);

  const handleTableButtonClick = () => {
    setShowTable(true);
  };

  return (
    <div className="Sidebar">
      <button className="button" onClick={handleTableButtonClick}>
        Show Table
      </button>
      {showTable && (
        <div className="content-section">
          <Table />
          
        </div>
       
      )}
      
    </div>
    
  );
}

export default Sidebar;
