import React from "react";
import {
  calcAge,
  lineFive,
  lineFour1,
  lineFour2,
  lineOne,
  lineThree,
  lineTwo1,
  lineTwo2,
} from "./Functions";
import * as XLSX from "xlsx";

const Formulas = ({ data }) => {
  console.log(data);
  const handleExport = () => {
    const exportData = data.map((row, index) => {
      const person = {
        firstName: row["שם"],
        lastName: row["שם משפחה"],
        gender: row["מין"],
        birthDate: row["תאריך לידה"],
        startDate: row["תאריך תחילת עבודה"],
        salary: parseFloat(row["שכר"].replace(/,/g, "")),
        section14Date: row["תאריך קבלת סעיף 14"],
        section14Rate: (row["אחוז סעיף 14"] ?? 0) / 100,
        assetsValue: parseFloat(row["שווי נכס"]?.replace(/,/g, "")) ?? 0,
        leavingReason: row["סיבת עזיבה"],
        check: row["השלמה בצ'ק"],
        assetsPayment: row["תשלום מהנכס"],
        leaveDate: row["תאריך עזיבה"],
        deposits: row["הפקדות"],
      };
      const firstConnected = Number(lineOne(person));
      const secondConnected = Number(lineTwo1(person));
      const thirdConnected = Number(lineTwo2(person));
      const fourConnected = Number(lineThree(person));
      const fiveConnected = Number(lineFour1(person));
      const sixConnected = Number(lineFour2(person));
      const sevenConnected = Number(lineFive(person));
      const result =
        firstConnected +
        secondConnected +
        thirdConnected +
        fourConnected +
        fiveConnected +
        sixConnected +
        sevenConnected;

      return {
        "שם מלא": `${person.firstName} ${person.lastName}`,
        גיל: calcAge(person.birthDate),
        "סכום הפיצוי": `${result.toFixed(0)}₪`,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "CompensationAmount.xlsx");
  };

  return (
    <div className="p-1">
      {data.length > 0 && (
        <div className="flex justify-center mb-4">
          <button
            onClick={handleExport}
            className="p-2 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-200"
          >
            Export The Compensation To Excel
          </button>
        </div>
      )}

      <table className="min-w-full bg-white border rounded-lg shadow-md my-4">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-center text-lg">סכום הפיצוי</th>
            <th className="py-3 px-6 text-center text-lg">גיל</th>
            <th className="py-3 px-6 text-center text-lg">שם מלא</th>
            <th className="py-3 px-6 text-center text-lg"></th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {data.map((row, index) => {
            const person = {
              firstName: row["שם"],
              lastName: row["שם משפחה"],
              gender: row["מין"],
              birthDate: row["תאריך לידה"],
              startDate: row["תאריך תחילת עבודה"],
              salary: parseFloat(row["שכר"].replace(/,/g, "")),
              section14Date: row["תאריך קבלת סעיף 14"],
              section14Rate: (row["אחוז סעיף 14"] ?? 0) / 100,
              assetsValue: parseFloat(row["שווי נכס"]?.replace(/,/g, "")) ?? 0,
              leavingReason: row["סיבת עזיבה"],
              check: row["השלמה בצ'ק"],
              assetsPayment: row["תשלום מהנכס"],
              leaveDate: row["תאריך עזיבה"],
              deposits: row["הפקדות"],
            };
            const firstConnected = Number(lineOne(person));
            const secondConnected = Number(lineTwo1(person));
            const thirdConnected = Number(lineTwo2(person));
            const fourConnected = Number(lineThree(person));
            const fiveConnected = Number(lineFour1(person));
            const sixConnected = Number(lineFour2(person));
            const sevenConnected = Number(lineFive(person));
            const result =
              firstConnected +
              secondConnected +
              thirdConnected +
              fourConnected +
              fiveConnected +
              sixConnected +
              sevenConnected;
            return (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  {result.toFixed(0)}₪
                </td>
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  {calcAge(person.birthDate)}
                </td>
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  {person.firstName} {person.lastName}
                </td>
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  {index + 1}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// const Formulas = ({ data }) => {
//   if (data.length > 0) {
//     const firstPerson = data[3]; // Selecting the first person from the data array

//     const person = {
//       firstName: firstPerson["שם"],
//       lastName: firstPerson["שם משפחה"],
//       gender: firstPerson["מין"],
//       birthDate: firstPerson["תאריך לידה"],
//       startDate: firstPerson["תאריך תחילת עבודה"],
//       salary: parseFloat(firstPerson["שכר"].replace(/,/g, "")),
//       section14Date: firstPerson["תאריך קבלת סעיף 14"],
//       section14Rate: (firstPerson["אחוז סעיף 14"] ?? 0) / 100,
//       assetsValue: parseFloat(firstPerson["שווי נכס"]?.replace(/,/g, "")) ?? 0,
//       leavingReason: firstPerson["סיבת עזיבה"],
//       check: firstPerson["השלמה בצ'ק"],
//       assetsPayment: firstPerson["תשלום מהנכס"],
//       leaveDate: firstPerson["תאריך עזיבה"],
//       deposits: firstPerson["הפקדות"],
//     };

//     const firstConnected = Number(lineOne(person));
//     const secondConnected = Number(lineTwo1(person));
//     const thirdConnected = Number(lineTwo2(person));
//     const fourConnected = Number(lineThree(person));
//     const fiveConnected = Number(lineFour1(person));
//     const sixConnected = Number(lineFour2(person));
//     const sevenConnected = Number(lineFive(person));

//     const result =
//       firstConnected +
//       secondConnected +
//       thirdConnected +
//       fourConnected +
//       fiveConnected +
//       sixConnected +
//       sevenConnected;
//     console.log(person.lastName);
//     console.log("sum: ", sevenConnected.toFixed(2));
//   }
// };

export default Formulas;
