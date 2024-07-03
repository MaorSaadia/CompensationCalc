"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import Formulas from "./Formulas";

const ExcelReader = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
        cellDates: true, // Enable cellDates option
      });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        header: 1, // Read the first row for headers
        range: 1, // Start reading from the second row
      });

      // Separate headers and data
      const rawHeaders = jsonData[0];
      const headers = rawHeaders.map((header) => header.trim()); // Trim the headers
      const data = jsonData.slice(1);

      // Format dates in the data
      const formattedData = data.map((row) => {
        const formattedRow = {};
        row.forEach((cell, index) => {
          const header = headers[index];
          if (cell instanceof Date) {
            formattedRow[header] = cell.toLocaleDateString();
          } else {
            formattedRow[header] = cell;
          }
        });
        return formattedRow;
      });

      setData(formattedData);
      setHeaders(headers);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col items-center py-10">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4 p-2 border rounded-lg shadow-sm cursor-pointer"
      />
      <Formulas data={data} />
      {/* <div className="w-full max-w-6xl overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Data from Excel file:</h3>
        {data.length > 0 ? (
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead>
              <tr>
                {headers.map((key) => (
                  <th
                    key={key}
                    className="py-2 px-4 border-b bg-gray-200 text-left"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-gray-100">
                  {headers.map((header) => (
                    <td key={header} className="py-2 px-4 border-b">
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Add Excel File.</p>
        )}
      </div> */}
    </div>
  );
};

export default ExcelReader;
