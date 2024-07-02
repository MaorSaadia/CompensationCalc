export function getYearFromDate(dateString) {
  const date = new Date(dateString);
  return date.getFullYear();
}

export function seniority(startDate, leaveDate) {
  const startYear = getYearFromDate(startDate);
  const leaveYear = leaveDate ? getYearFromDate(leaveDate) : "2023";

  return leaveYear - startYear;
}

export function firstFormula(salary, seniority) {
  return salary * seniority;
}

export function func(person) {
  return firstFormula(
    person.salary,
    seniority(person.startDate, person.leaveDate)
  );
}
