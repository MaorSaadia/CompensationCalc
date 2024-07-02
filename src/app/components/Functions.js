export function getYearFromDate(dateString) {
  const date = new Date(dateString);
  return date.getFullYear();
}

export function seniority(startDate, leaveDate) {
  const startYear = getYearFromDate(startDate);
  const leaveYear = leaveDate ? getYearFromDate(leaveDate) : 2023;

  return Number(leaveYear - startYear);
}

export function firstFormula(salary, seniority) {
  // Remove commas from the salary string and convert it to a number
  const numericSalary = parseFloat(salary.replace(/,/g, ""));
  return numericSalary * seniority;
}
