import React from "react";
import {
  mainFunction,
  firstFormula,
  seniority,
  calcAge,
  probabilityToDie,
  lineOne,
} from "./Functions";

// const Formulas = ({ data }) => {
//   data.forEach((row) => {
//     const person = {
//       firstName: row["שם"],
//       lastName: row["שם משפחה"],
//       gender: row["מין"],
//       birthDate: row["תאריך לידה"],
//       startDate: row["תאריך תחילת עבודה"],
//       salary: parseFloat(row["שכר"].replace(/,/g, "")),
//       section14Date: row["תאריך קבלת סעיף 14"],
//       section14Rate: (row["אחוז סעיף 14"] ?? 0) / 100,
//       propertyValue: row["שווי נכס"],
//       leavingReason: row["סיבת עזיבה"],
//       check: row["השלמה בצ'ק"],
//       propertyPayment: row["תשלום מהנכס"],
//       leaveDate: row["תאריך עזיבה"],
//       deposits: row["הפקדות"],
//     };
//     console.log(lineOne(person));
//   });
// };

const Formulas = ({ data }) => {
  if (data.length > 0) {
    const firstPerson = data[3]; // Selecting the first person from the data array

    const person = {
      firstName: firstPerson["שם"],
      lastName: firstPerson["שם משפחה"],
      gender: firstPerson["מין"],
      birthDate: firstPerson["תאריך לידה"],
      startDate: firstPerson["תאריך תחילת עבודה"],
      salary: parseFloat(firstPerson["שכר"].replace(/,/g, "")),
      section14Date: firstPerson["תאריך קבלת סעיף 14"],
      section14Rate: (firstPerson["אחוז סעיף 14"] ?? 0) / 100,
      propertyValue: firstPerson["שווי נכס"],
      leavingReason: firstPerson["סיבת עזיבה"],
      check: firstPerson["השלמה בצ'ק"],
      propertyPayment: firstPerson["תשלום מהנכס"],
      leaveDate: firstPerson["תאריך עזיבה"],
      deposits: firstPerson["הפקדות"],
    };

    console.log(lineOne(person)); // Printing the details of the first person
  }
};

export default Formulas;
