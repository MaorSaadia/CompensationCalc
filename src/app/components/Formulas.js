import React from "react";
import {
  calcAge,
  calculateServiceLife,
  calculation1,
  calculation2,
  calculation3,
  formatDate,
  lineFive,
  lineFour1,
  lineFour2,
  lineOne,
  lineThree,
  lineTwo1,
  lineTwo2,
  onGoingServiceCost,
} from "./Functions";
import * as XLSX from "xlsx";
import { openingBalances } from "../data/openingBalances";

// const Formulas = ({ data }) => {
//   const handleExport = () => {
//     const exportData = data.map((row, index) => {
//       const person = {
//         firstName: row["שם"],
//         lastName: row["שם משפחה"],
//         gender: row["מין"],
//         birthDate: formatDate(row["תאריך לידה"]),
//         startDate: formatDate(row["תאריך תחילת עבודה"]),
//         salary: parseFloat(row["שכר"]?.replace(/,/g, "")),
//         section14Date: formatDate(row["תאריך  קבלת סעיף 14"]),
//         section14Rate: (row["אחוז סעיף 14"] ?? 0) / 100,
//         assetsValue: parseFloat(row["שווי נכס"]?.replace(/,/g, "")) ?? 0,
//         deposits: row["הפקדות"],
//         leaveDate: formatDate(row["תאריך עזיבה"] ?? "31/12/23"),
//         assetsPayment: row["תשלום מהנכס"],
//         check: row["השלמה בצ'ק"] ?? 0,
//         leavingReason: row["סיבת עזיבה"],
//       };
//       const firstConnected = Number(lineOne(person));
//       const secondConnected = Number(lineTwo1(person));
//       const thirdConnected = Number(lineTwo2(person));
//       const fourConnected = Number(lineThree(person));
//       const fiveConnected = Number(lineFour1(person));
//       const sixConnected = Number(lineFour2(person));
//       const sevenConnected = Number(lineFive(person));
//       let part1Result =
//         firstConnected +
//         secondConnected +
//         thirdConnected +
//         fourConnected +
//         fiveConnected +
//         sixConnected +
//         sevenConnected;

//       if (
//         person.leavingReason === "פרישה לגמלאות" ||
//         person.leavingReason === "פיטורין" ||
//         person.leavingReason === "מוות"
//       ) {
//         part1Result *= 1.15;
//       }
//       return {
//         Id: index + 1,
//         "שם מלא": `${person.firstName} ${person.lastName}`,
//         גיל: calcAge(person.birthDate),
//         "סכום הפיצוי": `${part1Result.toFixed(0)}`,
//       };
//     });

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     XLSX.writeFile(workbook, "CompensationAmount.xlsx");
//   };

//   return (
//     <div className="p-1">
//       {data.length > 0 && (
//         <div className="flex justify-center mb-4">
//           <button
//             onClick={handleExport}
//             className="p-2 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-200"
//           >
//             Export The Compensation To Excel
//           </button>
//         </div>
//       )}

//       <table className="min-w-full bg-white border rounded-lg shadow-md my-4">
//         <thead>
//           <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
//             <th className="py-3 px-6 text-center text-lg">סכום הפיצוי</th>
//             <th className="py-3 px-6 text-center text-lg">גיל</th>
//             <th className="py-3 px-6 text-center text-lg">שם מלא</th>
//             <th className="py-3 px-6 text-center text-lg"></th>
//           </tr>
//         </thead>
//         <tbody className="text-gray-600 text-sm font-light">
//           {data.map((row, index) => {
//             const person = {
//               firstName: row["שם"],
//               lastName: row["שם משפחה"],
//               gender: row["מין"],
//               birthDate: formatDate(row["תאריך לידה"]),
//               startDate: formatDate(row["תאריך תחילת עבודה"]),
//               salary: parseFloat(row["שכר"]?.replace(/,/g, "")),
//               section14Date: formatDate(row["תאריך  קבלת סעיף 14"]),
//               section14Rate: (row["אחוז סעיף 14"] ?? 0) / 100,
//               assetsValue: parseFloat(row["שווי נכס"]?.replace(/,/g, "")) ?? 0,
//               leavingReason: row["סיבת עזיבה"],
//               check: row["השלמה בצ'ק"],
//               assetsPayment: row["תשלום מהנכס"],
//               leaveDate: formatDate(row["תאריך עזיבה"] ?? "31/12/23"),
//               deposits: row["הפקדות"],
//             };

//             const firstConnected = Number(lineOne(person));
//             const secondConnected = Number(lineTwo1(person));
//             const thirdConnected = Number(lineTwo2(person));
//             const fourConnected = Number(lineThree(person));
//             const fiveConnected = Number(lineFour1(person));
//             const sixConnected = Number(lineFour2(person));
//             const sevenConnected = Number(lineFive(person));
//             let part1Result =
//               firstConnected +
//               secondConnected +
//               thirdConnected +
//               fourConnected +
//               fiveConnected +
//               sixConnected +
//               sevenConnected;

//             if (
//               person.leavingReason === "פרישה לגמלאות" ||
//               person.leavingReason === "פיטורין" ||
//               person.leavingReason === "מוות"
//             ) {
//               part1Result *= 1.15;
//             }

//             return (
//               <tr
//                 key={index}
//                 className="border-b border-gray-200 hover:bg-gray-100"
//               >
//                 <td className="py-3 px-6 text-center whitespace-nowrap">
//                   {part1Result.toFixed(0)}₪
//                 </td>
//                 <td className="py-3 px-6 text-center whitespace-nowrap">
//                   {calcAge(person.birthDate)}
//                 </td>
//                 <td className="py-3 px-6 text-center whitespace-nowrap">
//                   {person.firstName} {person.lastName}
//                 </td>
//                 <td className="py-3 px-6 text-center whitespace-nowrap">
//                   {index + 1}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

const Formulas = ({ data }) => {
  if (data.length > 0) {
    const firstPerson = data[2];
    // const openingBalance = openingBalances[2].commitment;
    // const assets = openingBalances[2].assets;
    // console.log("openingBalance:", openingBalance);
    // console.log("assets:", assets);

    const person = {
      firstName: firstPerson["שם"],
      lastName: firstPerson["שם משפחה"],
      gender: firstPerson["מין"],
      birthDate: formatDate(firstPerson["תאריך לידה"]),
      startDate: formatDate(firstPerson["תאריך תחילת עבודה"]),
      salary: parseFloat(firstPerson["שכר"]?.replace(/,/g, "")),
      section14Date: formatDate(firstPerson["תאריך  קבלת סעיף 14"]),
      section14Rate: (firstPerson["אחוז סעיף 14"] ?? 0) / 100,
      assetsValue: parseFloat(firstPerson["שווי נכס"]?.replace(/,/g, "")) ?? 0,
      deposits: parseFloat(firstPerson["הפקדות"]?.replace(/,/g, "")) ?? 0,
      leaveDate: formatDate(firstPerson["תאריך עזיבה"] ?? "31/12/23"),
      assetsPayment:
        parseFloat(firstPerson["תשלום מהנכס"]?.replace(/,/g, "")) ?? 0,
      check: parseFloat(firstPerson["השלמה בצ'ק"]?.replace(/,/g, "")) || 0,
      leavingReason: firstPerson["סיבת עזיבה"] || null,

      // Part - 2
      openingBalance: openingBalances[2]?.commitment,
      assets: openingBalances[2]?.assets,
    };

    const firstConnected = Number(lineOne(person));
    const secondConnected = Number(lineTwo1(person));
    const thirdConnected = Number(lineTwo2(person));
    const fourConnected = Number(lineThree(person));
    const fiveConnected = Number(lineFour1(person));
    const sixConnected = Number(lineFour2(person));
    const sevenConnected = Number(lineFive(person));

    let part1Result =
      firstConnected +
      secondConnected +
      thirdConnected +
      fourConnected +
      fiveConnected +
      sixConnected +
      sevenConnected;

    if (
      person.leavingReason === "פרישה לגמלאות" ||
      person.leavingReason === "פיטורין" ||
      person.leavingReason === "מוות"
    ) {
      part1Result *= 1.15;
    }
    console.log("Person Details:");
    console.log("First Name: ", person.firstName);
    console.log("Last Name: ", person.lastName);
    console.log("Gender: ", person.gender);
    console.log("Birth Date: ", person.birthDate);
    console.log("Start Date: ", person.startDate);
    console.log("Salary: ", person.salary);
    console.log("Section 14 Date: ", person.section14Date);
    console.log("Section 14 Rate: ", person.section14Rate);
    console.log("Assets Value: ", person.assetsValue);
    console.log("Deposits: ", person.deposits);
    console.log("Leave Date: ", person.leaveDate);
    console.log("Assets Payment: ", person.assetsPayment);
    console.log("Check: ", person.check);
    console.log("Leaving Reason: ", person.leavingReason);
    console.log("sum: ", part1Result.toFixed(0));

    //// Part - 2 ////
    // console.log("Opening Balance: ", person.openingBalance);
    // console.log("Assets: ", person.assets);

    //// Part - 2 ////
    const firstCalculation = Number(
      calculation1(person, part1Result.toFixed(0))
    );
    const secondCalculation = Number(calculation2(person, part1Result));
    const thirdCalculation = Number(calculation3(person, part1Result));

    console.log("firstCalculation: ", firstCalculation.toFixed());
    console.log("secondCalculation: ", secondCalculation.toFixed());
    console.log("thirdCalculation: ", thirdCalculation.toFixed());
  }
};

export default Formulas;
