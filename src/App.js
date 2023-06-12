
import React, { useState } from 'react';
import './App.css';
import Table from './Table';


function App() {
  const [showTable, setShowTable] = useState(false);

  const handleTableButtonClick = () => {
    setShowTable(true);
  };

  return (
    <div className="App">
      <div className="sidebar-section">
        <Sidebar onTableButtonClick={handleTableButtonClick} />
      </div>
      {showTable && (
        <div className="table-section">
          <Table />
          
        </div>
      )}
    </div>
  );
}

function Sidebar({ onTableButtonClick }) {
  return (
    <div className="Sidebar">
      <button className="button" onClick={onTableButtonClick}>
        Show Table
      </button>
    </div>
  );
}

export default App;
