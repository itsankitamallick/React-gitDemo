import React, { useState, useRef } from 'react';
import './Table.css';

const Table = () => {
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(2);
  const [tableData, setTableData] = useState([['', ''], ['', '']]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const startCellRef = useRef(null);

  const handleAddRow = () => {
    setRows(rows + 1);
    setTableData((prevData) => [...prevData, Array(columns).fill('')]);
  };

  const handleAddColumn = () => {
    setColumns(columns + 1);
    setTableData((prevData) => prevData.map((row) => [...row, '']));
  };

  const handleCellChange = (rowIndex, colIndex, event) => {
    const updatedData = tableData.map((row, i) => {
      if (i === rowIndex) {
        return row.map((cell, j) =>
          j === colIndex ? event.target.value : cell
        );
      }
      return row;
    });
    setTableData(updatedData);
  };

  const handleDeleteSelectedCells = () => {
    const updatedData = tableData.map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        isSelectedCell(rowIndex, colIndex) ? '' : cell
      )
    );
    setTableData(updatedData);
    setSelectedCells([]);
  };

  const handleCellMouseDown = (rowIndex, colIndex) => {
    setIsMouseDown(true);
    startCellRef.current = { rowIndex, colIndex };
    setSelectedCells([{ rowIndex, colIndex }]);
  };

  const handleCellMouseEnter = (rowIndex, colIndex) => {
    if (isMouseDown) {
      const startCell = startCellRef.current;
      const endCell = { rowIndex, colIndex };
      const selected = getSelectedCells(startCell, endCell);
      setSelectedCells(selected);
    }
  };

  const handleCellMouseUp = () => {
    setIsMouseDown(false);
    startCellRef.current = null;
  };

  const handleMergeCells = () => {
    if (selectedCells.length < 2) {
      // You need at least two cells selected for merging
      return;
    }

    const minX = Math.min(...selectedCells.map((cell) => cell.rowIndex));
    const maxX = Math.max(...selectedCells.map((cell) => cell.rowIndex));
    const minY = Math.min(...selectedCells.map((cell) => cell.colIndex));
    const maxY = Math.max(...selectedCells.map((cell) => cell.colIndex));

    const mergedValue = tableData[minX][minY];
    const mergedRowSpan = maxX - minX + 1;
    const mergedColSpan = maxY - minY + 1;

    const mergedCell = {
      rowIndex: minX,
      colIndex: minY,
      rowSpan: mergedRowSpan,
      colSpan: mergedColSpan,
      value: mergedValue,
    };

    const updatedData = tableData.map((row, rowIndex) => {
      if (rowIndex >= minX && rowIndex <= maxX) {
        return row.map((cell, colIndex) => {
          if (colIndex >= minY && colIndex <= maxY) {
            return colIndex === minY && rowIndex === minX ? mergedValue : null;
          }
          return cell;
        });
      }
      return row;
    });

    const mergedCells = [
      mergedCell,
      ...selectedCells.filter(
        (cell) => cell.rowIndex !== minX || cell.colIndex !== minY
      ),
    ];

    // Update the `tableData` state
    setTableData(updatedData);

    // Set the `selectedCells` state to the merged cells
    setSelectedCells(mergedCells);
  };

  const getSelectedCells = (startCell, endCell) => {
    const minX = Math.min(startCell.rowIndex, endCell.rowIndex);
    const maxX = Math.max(startCell.rowIndex, endCell.rowIndex);
    const minY = Math.min(startCell.colIndex, endCell.colIndex);
    const maxY = Math.max(startCell.colIndex, endCell.colIndex);

    const selected = [];
    for (let i = minX; i <= maxX; i++) {
      for (let j = minY; j <= maxY; j++) {
        selected.push({ rowIndex: i, colIndex: j });
      }
    }
    return selected;
  };

  const renderTable = () => {
    return tableData.map((row, rowIndex) => {
      const rowData = row.map((cellData, colIndex) => (
        <td
          key={colIndex}
          onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
          onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
          onMouseUp={handleCellMouseUp}
          rowSpan={getRowSpan(rowIndex, colIndex)}
          colSpan={getColSpan(rowIndex, colIndex)}
          className={isSelectedCell(rowIndex, colIndex) ? 'selected' : ''}
        >
          <input
            type="text"
            value={cellData || ''}
            onChange={(event) => handleCellChange(rowIndex, colIndex, event)}
          />
        </td>
      ));
      return <tr key={rowIndex}>{rowData}</tr>;
    });
  };

  const isSelectedCell = (rowIndex, colIndex) => {
    return selectedCells.some(
      (cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex
    );
  };

  const getRowSpan = (rowIndex, colIndex) => {
    const cell = selectedCells.find(
      (cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex
    );
    return cell ? cell.rowSpan : 1;
  };

  const getColSpan = (rowIndex, colIndex) => {
    const cell = selectedCells.find(
      (cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex
    );
    return cell ? cell.colSpan : 1;
  };

  return (
    <div className="table-container">
      <button className="add-column-button" onClick={handleAddColumn}>
        +
      </button>
      <table className="thread-table">
        <tbody>{renderTable()}</tbody>
      </table>
      <button className="add-row-button" onClick={handleAddRow}>
        +
      </button>
     
        <button className="delete-cell-button" onClick={handleDeleteSelectedCells}>
          Delete
        </button>
     
      <button className="merge-cell-button" onClick={handleMergeCells}>
        Merge
      </button>
    </div>
  );
};

export default Table;

