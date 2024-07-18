import { femaleDeath, maleDeath } from "../data/death";
import { discountRate1 } from "../data/discountRate";

const SALARY_GROWTH_RATE = 0.03;

export function getYearFromDate(dateString) {
  const dateParts = dateString.split("/");
  let year = parseInt(dateParts[2], 10);

  if (year < 100) {
    year += year < 40 ? 2000 : 1900;
  }
  return year;
}

export function calcAge(birthDate) {
  return Number(2023 - getYearFromDate(birthDate));
}

export function seniority(startDate, leaveDate) {
  const startYear = getYearFromDate(startDate);
  const leaveYear = leaveDate ? getYearFromDate(leaveDate) : 2023;

  return Number(leaveYear - startYear);
}

export function firstFormula(salary, seniority, section14Rate) {
  return salary * seniority * (1 - section14Rate);
}

export function probabilityToKeepWork(age, gender) {
  return (
    1 -
    (probabilityToResign(age) +
      probabilityToFired(age) +
      probabilityToDie(age, gender))
  );
}

export function probabilityToResign(age) {
  if (age >= 18 && age <= 29) return 0.2;
  if (age >= 30 && age <= 39) return 0.13;
  if (age >= 40 && age <= 49) return 0.1;
  if (age >= 50 && age <= 59) return 0.07;
  if (age >= 60 && age <= 67) return 0.03;
  else return 0;
}

export function probabilityToFired(age) {
  if (age >= 18 && age <= 29) return 0.15;
  if (age >= 30 && age <= 39) return 0.1;
  if (age >= 40 && age <= 49) return 0.04;
  if (age >= 50 && age <= 59) return 0.05;
  if (age >= 60 && age <= 67) return 0.03;
  else return 0;
}

export function probabilityToDie(age, gender) {
  // console.log(age, gender);
  if (gender === "M") {
    const entry = maleDeath.find((item) => item.age === age);
    return entry ? entry.qx : null;
  } else {
    const entry = femaleDeath.find((item) => item.age === age);
    return entry ? entry.qx : null;
  }
}

export function discountRate(year) {
  const entry = discountRate1.find((item) => item.year === year);
  return entry ? entry.discountRate : null;
}

export function lineOne(person) {
  let sum = 0;
  let probabilityCalc = 1;

  const w = person.gender === "M" ? 67 : 64;
  const x = calcAge(person.birthDate);
  const sen = seniority(person.startDate, person.leaveDate);
  for (let t = 0; t <= w - x - 2; t++) {
    const currentProbability = probabilityToKeepWork(x + t + 1, person.gender);
    probabilityCalc *= currentProbability;
    sum +=
      (firstFormula(person.salary, sen, person.section14Rate) *
        (1 + SALARY_GROWTH_RATE) ** (t + 0.5) *
        probabilityCalc *
        probabilityToFired(x + t + 1)) /
      (1 + discountRate(t + 1)) ** (t + 0.5);
  }
  return sum;
}

export function lineTwo1(person) {
  let sum = 0;
  let probabilityCalc = 1;

  const w = person.gender === "M" ? 67 : 64;
  const x = calcAge(person.birthDate);
  const sen = seniority(person.startDate, person.leaveDate);

  for (let t = 0; t <= w - x - 2; t++) {
    const currentProbability = probabilityToKeepWork(x + t + 1, person.gender);
    probabilityCalc *= currentProbability;
    sum +=
      (firstFormula(person.salary, sen, person.section14Rate) *
        (1 + SALARY_GROWTH_RATE) ** (t + 0.5) *
        probabilityCalc *
        probabilityToDie(x + t + 1, person.gender)) /
      (1 + discountRate(t + 1)) ** (t + 0.5);
  }
  return sum;
}

export function lineTwo2(person) {
  let sum = 0;
  let probabilityCalc = 1;

  const w = person.gender === "M" ? 67 : 64;
  const x = calcAge(person.birthDate);

  for (let t = 0; t <= w - x - 2; t++) {
    const currentProbability = probabilityToKeepWork(x + t + 1, person.gender);
    probabilityCalc *= currentProbability;
    sum +=
      person.assetsValue * probabilityCalc * probabilityToResign(x + t + 1);
  }
  return sum;
}

export function lineThree(person) {
  let sum = 0;
  let probabilityCalc = 1;

  const w = person.gender === "M" ? 67 : 64;
  const x = calcAge(person.birthDate);
  const sen = seniority(person.startDate, person.leaveDate);

  for (let t = x - 1; t <= x + w - x - 1; t++) {
    const currentProbability = probabilityToKeepWork(t, person.gender);
    probabilityCalc *= currentProbability;
  }
  sum +=
    (firstFormula(person.salary, sen, person.section14Rate) *
      (1 + SALARY_GROWTH_RATE) ** (w - x + 0.5) *
      probabilityCalc *
      probabilityToFired(w - 1)) /
    (1 + discountRate(w - x)) ** (w - x + 0.5);
  return sum;
}

export function lineFour1(person) {
  let sum = 0;
  let probabilityCalc = 1;

  const w = person.gender === "M" ? 67 : 64;
  const x = calcAge(person.birthDate);
  const sen = seniority(person.startDate, person.leaveDate);

  for (let t = x - 1; t <= x + w - x - 1; t++) {
    const currentProbability = probabilityToKeepWork(t, person.gender);
    probabilityCalc *= currentProbability;
  }
  sum +=
    (firstFormula(person.salary, sen, person.section14Rate) *
      (1 + SALARY_GROWTH_RATE) ** (w - x - 1 + 0.5) *
      probabilityCalc *
      probabilityToDie(w - 1, person.gender)) /
    (1 + discountRate(w - x)) ** (w - x - 1 + 0.5);
  return sum;
}

export function lineFour2(person) {
  let sum = 0;
  let probabilityCalc = 1;

  const w = person.gender === "M" ? 67 : 64;
  const x = calcAge(person.birthDate);

  for (let t = x - 1; t <= x + w - x - 1; t++) {
    const currentProbability = probabilityToKeepWork(t, person.gender);
    probabilityCalc *= currentProbability;
  }
  sum += person.assetsValue * probabilityCalc * probabilityToResign(w - 1);
  return sum;
}

export function lineFive(person) {
  let sum = 0;
  const w = person.gender === "M" ? 67 : 64;
  const x = calcAge(person.birthDate);
  const sen = seniority(person.startDate, person.leaveDate);
  sum +=
    (firstFormula(person.salary, sen, person.section14Rate) *
      (1 + SALARY_GROWTH_RATE) ** (w - x) *
      probabilityToKeepWork(x + w - x - 1, person.gender) *
      (1 -
        probabilityToFired(w - 1) -
        probabilityToResign(w - 1) -
        probabilityToDie(w - 1, person.gender))) /
    (1 + discountRate(w - x)) ** (w - x);
  return sum;
}
