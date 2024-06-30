import React from "react";

const Formulas = ({ data }) => {
  const startwork = data[3]?.["תאריך תחילת עבודה"];
  const leave = data[3]?.["תאריך עזיבה"];

  const getYearFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const startYear = startwork ? getYearFromDate(startwork) : null;
  const leaveYear = leave ? getYearFromDate(leave) : null;

  const yearDifference = startYear && leaveYear ? leaveYear - startYear : null;

  console.log(`Start Year: ${startYear}`);
  console.log(`Leave Year: ${leaveYear}`);
  console.log(`Year Difference: ${yearDifference}`);

  return <div>{`Year Difference: ${yearDifference}`}</div>;
};

export default Formulas;
