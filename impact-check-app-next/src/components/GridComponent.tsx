// components/GridComponent.tsx
"use client";

import { AgGridReact } from 'ag-grid-react';
import React, { useEffect, useState, useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const GridComponent = () => {
  const [rowData, setRowData] = useState<any[]>([]);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitCellContents' as 'fitCellContents',
    };
  }, []);

  const enableCellSpan = true;

  useEffect(() => {
    fetch("/data/sample_kan2.json") // Fetch data from server
      .then((result) => result.json()) // Convert to JSON
      .then((rowData) => setRowData(rowData)); // Update state of `rowData`

    fetch("/data/sample_kab2_column.json") // Fetch column definitions from server
      .then((result) => result.json()) // Convert to JSON
      .then((columnDefs) => setColumnDefs(columnDefs)); // Update state of `columnDefs`
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        autoSizeStrategy={autoSizeStrategy}
        enableCellSpan={enableCellSpan}
      />
    </div>
  );
};

export default GridComponent;
// Remove the incorrect useMemo function definition

