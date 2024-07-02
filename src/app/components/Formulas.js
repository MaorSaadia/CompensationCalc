import React from "react";
import { mainFunction, firstFormula, seniority, calcAge } from "./Functions";

const Formulas = ({ data }) => {
  data.forEach((row) => {
    const person = {
      firstName: row["שם"],
      lastName: row["שם משפחה"],
      gender: row["מין"],
      birthDate: row["תאריך לידה"],
      startDate: row["תאריך תחילת עבודה"],
      salary: parseFloat(row["שכר"].replace(/,/g, "")),
      section14Date: row["תאריך קבלת סעיף 14"],
      section14Rate: (row["אחוז סעיף 14"] ?? 0) / 100,
      propertyValue: row["שווי נכס"],
      leavingReason: row["סיבת עזיבה"],
      check: row["השלמה בצ'ק"],
      propertyPayment: row["תשלום מהנכס"],
      leaveDate: row["תאריך עזיבה"],
      deposits: row["הפקדות"],
    };

    console.log(calcAge(person.birthDate));
  });
};

export default Formulas;
