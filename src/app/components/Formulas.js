import React from "react";
import { firstFormula, func, seniority } from "./Functions";

const Formulas = ({ data }) => {
  let person = {};
  data.forEach((row) => {
    person = {
      firstName: row["שם"],
      lastName: row["שם משפחה"],
      gender: row["מין"],
      birthDate: row["תאריך לידה"],
      startDate: row["תאריך תחילת עבודה"],
      salary: row["שכר"],
      section14Date: row["תאריך קבלת סעיף 14"],
      section14Rate: row["אחוז סעיף 14"],
      propertyValue: row["שווי נכס"],
      leavingReason: row["סיבת עזיבה"],
      check: row["השלמה בצ'ק"],
      propertyPayment: row["תשלום מהנכס"],
      leaveDate: row["תאריך עזיבה"],
      deposits: row["הפקדות"],
    };

    // const seniority1 = seniority(person.startDate, person.leaveDate);
    // // console.log(seniority1);
    // console.log(firstFormula(person.salary, seniority1));

    console.log(func(person));
  });
};

export default Formulas;
