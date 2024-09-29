import React, { useState, useEffect } from "react";

const CompensationTable = ({ data }) => {
  const [calculatedData, setCalculatedData] = useState([]);

  useEffect(() => {
    // Perform calculations here
    const newData = data.map((employee) => ({
      ...employee,
      calculation1: 0, // Replace with actual calculation
      calculation2: 0, // Replace with actual calculation
      calculation3: 0, // Replace with actual calculation
      calculation4: 0, // Replace with actual calculation
      calculation5: 0, // Replace with actual calculation
    }));
    setCalculatedData(newData);
  }, [data]);

  const TableHeader = ({ children }) => (
    <th className="px-4 py-2 text-right bg-gray-200 border">{children}</th>
  );

  const TableCell = ({ children }) => (
    <td className="px-4 py-2 text-right border">{children}</td>
  );

  return (
    <div className="p-4 overflow-x-auto">
      <table className="w-full mb-8 border-collapse border">
        <thead>
          <tr>
            <TableHeader>מס עובד</TableHeader>
            <TableHeader>הפסד(רווח) אקטוארי</TableHeader>
            <TableHeader>שווי התחייבות-יתרת סגירה</TableHeader>
            <TableHeader>סך ההטבות ששולמו מהנכס+תשלום בצק</TableHeader>
            <TableHeader>עלות שירות שוטף</TableHeader>
            <TableHeader>עלות ריבית</TableHeader>
            <TableHeader>שווי התחייבות-יתרת פתיחה</TableHeader>
          </tr>
        </thead>
        <tbody>
          {calculatedData.map((employee, index) => (
            <tr key={index}>
              <TableCell>{employee.id}</TableCell>
              <TableCell>{employee.calculation3}</TableCell>
              <TableCell>חושב באקטואר</TableCell>
              <TableCell>נתון בקובץ הנתונים</TableCell>
              <TableCell>{employee.calculation2}</TableCell>
              <TableCell>{employee.calculation1}</TableCell>
              <TableCell>נתון</TableCell>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <TableHeader>מס עובד</TableHeader>
            <TableHeader>הפסד(רווח) אקטוארי</TableHeader>
            <TableHeader>שווי הנכסים - יתרת סגירה</TableHeader>
            <TableHeader>הטבות ששולמו מנכסי התוכנית</TableHeader>
            <TableHeader>תשואה צפויה על נכסי התוכנית</TableHeader>
            <TableHeader>הפקדות</TableHeader>
            <TableHeader>שווי הנכסים - יתרת פתיחה</TableHeader>
          </tr>
        </thead>
        <tbody>
          {calculatedData.map((employee, index) => (
            <tr key={index}>
              <TableCell>{employee.id}</TableCell>
              <TableCell>{employee.calculation5}</TableCell>
              <TableCell>נתון</TableCell>
              <TableCell>נתון בקובץ הנתונים</TableCell>
              <TableCell>{employee.calculation4}</TableCell>
              <TableCell>נתון בקובץ הנתונים</TableCell>
              <TableCell>נתון</TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompensationTable;
