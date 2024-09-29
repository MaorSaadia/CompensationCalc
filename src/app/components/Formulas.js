/* eslint-disable react/no-unescaped-entities */
import React from "react";
import {
  calculation1,
  calculation2,
  calculation3,
  calculation4,
  calculation5,
  formatDate,
  lineOne,
  lineTwo1,
  lineTwo2,
  lineThree,
  lineFour1,
  lineFour2,
  lineFive,
  benefitsPaid,
} from "./Functions";
import { openingBalances } from "../data/openingBalances";
import * as XLSX from "xlsx";

const Formulas = ({ data }) => {
  const handleExport = () => {
    // Create workbook and worksheets
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.aoa_to_sheet([]);
    const ws2 = XLSX.utils.aoa_to_sheet([]);

    // Headers for the first table
    XLSX.utils.sheet_add_aoa(
      ws1,
      [
        [
          "מס עובד",
          "שווי התחייבות-יתרת פתיחה",
          "עלות שירות שוטף",
          "עלות היוון",
          "סך ההטבות ששולמו מהנכס+תשלום בצ'ק",
          "שווי התחייבות-יתרת סגירה",
          "הפסד/(רווח)אקטוארי",
        ],
      ],
      { origin: "A1" }
    );

    // Headers for the second table
    XLSX.utils.sheet_add_aoa(
      ws2,
      [
        [
          "מס עובד",
          "שווי הנכסים - יתרת פתיחה",
          "הפקדות",
          "תשואה צפויה על נכסי התוכנית",
          "הטבות ששולמו מנכסי התוכנית",
          "שווי הנכסים - יתרת סגירה",
          "הפסד/(רווח)אקטוארי",
        ],
      ],
      { origin: "A1" }
    );

    // Populate data for both tables
    data.forEach((row, index) => {
      const person = {
        firstName: row["שם"],
        lastName: row["שם משפחה"],
        gender: row["מין"],
        birthDate: formatDate(row["תאריך לידה"]),
        startDate: formatDate(row["תאריך תחילת עבודה"]),
        salary: parseFloat(row["שכר"]?.replace(/,/g, "") || 0),
        section14Date: formatDate(row["תאריך  קבלת סעיף 14"]),
        section14Rate: (row["אחוז סעיף 14"] ?? 0) / 100,
        assetsValue: parseFloat(row["שווי נכס"]?.replace(/,/g, "")) || 0,
        deposits: parseFloat(row["הפקדות"]?.replace(/,/g, "")) || 0,
        leaveDate: formatDate(row["תאריך עזיבה"] ?? "31/12/23"),
        assetsPayment: parseFloat(row["תשלום מהנכס"]?.replace(/,/g, "")) || 0,
        check: parseFloat(row["השלמה בצ'ק"]?.replace(/,/g, "")) || 0,
        leavingReason: row["סיבת עזיבה"] || null,
        openingBalance: openingBalances[index]?.commitment,
        assets: openingBalances[index]?.assets,
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

      let calcBenefitsPaid = 0;
      const assetsPayment = person.assetsPayment;
      const completionByCheck = person.check;

      const firstCalculation = Number(
        calculation1(person, part1Result.toFixed(0))
      );
      const secondCalculation = Number(calculation2(person, part1Result));
      const thirdCalculation = Number(calculation3(person, part1Result));
      const fourthCalculation = Number(calculation4(person));
      const fifthCalculation = Number(calculation5(person));
      if (person.leavingReason) {
        calcBenefitsPaid = benefitsPaid(assetsPayment, completionByCheck);
      }

      // Add row to the first table
      XLSX.utils.sheet_add_aoa(
        ws1,
        [
          [
            index + 1,
            person.openingBalance,
            firstCalculation.toFixed(),
            secondCalculation.toFixed(),
            calcBenefitsPaid,
            part1Result.toFixed(),
            thirdCalculation.toFixed(),
          ],
        ],
        { origin: -1 }
      );

      // Add row to the second table
      XLSX.utils.sheet_add_aoa(
        ws2,
        [
          [
            index + 1,
            person.assets,
            person.deposits,
            fourthCalculation.toFixed(),
            calcBenefitsPaid,
            person.assetsValue,
            fifthCalculation.toFixed(),
          ],
        ],
        { origin: -1 }
      );
    });

    // Add the worksheets to the workbook
    XLSX.utils.book_append_sheet(wb, ws1, "Table 1");
    XLSX.utils.book_append_sheet(wb, ws2, "Table 2");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, "compensation_tables.xlsx");
  };

  const TableHeader = ({ children }) => (
    <th className="py-3 px-6 text-right bg-gray-200 border text-gray-600 text-sm leading-normal">
      {children}
    </th>
  );

  const TableCell = ({ children }) => (
    <td className="py-3 px-6 text-right border whitespace-nowrap">
      {children}
    </td>
  );

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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-md my-4">
          <thead>
            <tr>
              <TableHeader>מס עובד</TableHeader>
              <TableHeader>שווי התחייבות-יתרת פתיחה</TableHeader>
              <TableHeader>עלות שירות שוטף</TableHeader>
              <TableHeader>עלות היוון</TableHeader>
              <TableHeader>סך ההטבות ששולמו מהנכס+תשלום בצ'ק</TableHeader>
              <TableHeader>שווי התחייבות-יתרת סגירה</TableHeader>
              <TableHeader>הפסד/(רווח)אקטוארי</TableHeader>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const person = {
                firstName: row["שם"],
                lastName: row["שם משפחה"],
                gender: row["מין"],
                birthDate: formatDate(row["תאריך לידה"]),
                startDate: formatDate(row["תאריך תחילת עבודה"]),
                salary: parseFloat(row["שכר"]?.replace(/,/g, "") || 0),
                section14Date: formatDate(row["תאריך  קבלת סעיף 14"]),
                section14Rate: (row["אחוז סעיף 14"] ?? 0) / 100,
                assetsValue:
                  parseFloat(row["שווי נכס"]?.replace(/,/g, "")) || 0,
                deposits: parseFloat(row["הפקדות"]?.replace(/,/g, "")) || 0,
                leaveDate: formatDate(row["תאריך עזיבה"] ?? "31/12/23"),
                assetsPayment:
                  parseFloat(row["תשלום מהנכס"]?.replace(/,/g, "")) || 0,
                check: parseFloat(row["השלמה בצ'ק"]?.replace(/,/g, "")) || 0,
                leavingReason: row["סיבת עזיבה"] || null,
                openingBalance: openingBalances[index]?.commitment,
                assets: openingBalances[index]?.assets,
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

              let calcBenefitsPaid = 0;
              const assetsPayment = person.assetsPayment;
              const completionByCheck = person.check;

              const firstCalculation = Number(
                calculation1(person, part1Result.toFixed(0))
              );
              const secondCalculation = Number(
                calculation2(person, part1Result)
              );
              const thirdCalculation = Number(
                calculation3(person, part1Result)
              );
              if (person.leavingReason) {
                calcBenefitsPaid = benefitsPaid(
                  assetsPayment,
                  completionByCheck
                );
              }

              return (
                <tr key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{person.openingBalance}</TableCell>
                  <TableCell>{firstCalculation.toFixed()}</TableCell>
                  <TableCell>{secondCalculation.toFixed()}</TableCell>
                  <TableCell>{calcBenefitsPaid}</TableCell>
                  <TableCell>{part1Result.toFixed()}</TableCell>
                  <TableCell>{thirdCalculation.toFixed()}</TableCell>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-md my-4">
          <thead>
            <tr>
              <TableHeader>מס עובד</TableHeader>
              <TableHeader>שווי הנכסים - יתרת פתיחה</TableHeader>
              <TableHeader>הפקדות</TableHeader>
              <TableHeader>תשואה צפויה על נכסי התוכנית</TableHeader>
              <TableHeader>הטבות ששולמו מנכסי התוכנית</TableHeader>
              <TableHeader>שווי הנכסים - יתרת סגירה</TableHeader>
              <TableHeader>הפסד/(רווח)אקטוארי</TableHeader>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const person = {
                firstName: row["שם"],
                lastName: row["שם משפחה"],
                gender: row["מין"],
                birthDate: formatDate(row["תאריך לידה"]),
                startDate: formatDate(row["תאריך תחילת עבודה"]),
                salary: parseFloat(row["שכר"]?.replace(/,/g, "")),
                section14Date: formatDate(row["תאריך  קבלת סעיף 14"]),
                section14Rate: (row["אחוז סעיף 14"] ?? 0) / 100,
                assetsValue:
                  parseFloat(row["שווי נכס"]?.replace(/,/g, "")) || 0,
                deposits: parseFloat(row["הפקדות"]?.replace(/,/g, "")) || 0,
                leaveDate: formatDate(row["תאריך עזיבה"] ?? "31/12/23"),
                assetsPayment:
                  parseFloat(row["תשלום מהנכס"]?.replace(/,/g, "")) || 0,
                check: parseFloat(row["השלמה בצ'ק"]?.replace(/,/g, "")) || 0,
                leavingReason: row["סיבת עזיבה"] || null,
                openingBalance: openingBalances[index]?.commitment,
                assets: openingBalances[index]?.assets,
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
              let calcBenefitsPaid = 0;
              const assetsPayment = person.assetsPayment;
              const completionByCheck = person.check;

              if (person.leavingReason) {
                calcBenefitsPaid = benefitsPaid(
                  assetsPayment,
                  completionByCheck
                );
              }

              const fourthCalculation = Number(calculation4(person));
              const fifthCalculation = Number(calculation5(person));

              return (
                <tr key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{person.assets}</TableCell>
                  <TableCell>{person.deposits}</TableCell>
                  <TableCell>{fourthCalculation.toFixed()}</TableCell>
                  <TableCell>{calcBenefitsPaid}</TableCell>
                  <TableCell>{person.assetsValue}</TableCell>
                  <TableCell>{fifthCalculation.toFixed()}</TableCell>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Formulas;
