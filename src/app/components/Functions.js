import { femaleDeath, maleDeath } from "../data/death";

export function getYearFromDate(dateString) {
  const date = new Date(dateString);
  return date.getFullYear();
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
  if (age >= 18 && age <= 29) return 0.17;
  if (age >= 30 && age <= 39) return 0.1;
  if (age >= 40 && age <= 49) return 0.1;
  if (age >= 50 && age <= 59) return 0.07;
  if (age >= 60 && age <= 67) return 0.02;
}

export function probabilityToFired(age) {
  if (age >= 18 && age <= 29) return 0.12;
  if (age >= 30 && age <= 39) return 0.08;
  if (age >= 40 && age <= 49) return 0.05;
  if (age >= 50 && age <= 59) return 0.04;
  if (age >= 60 && age <= 67) return 0.02;
}

export function probabilityToDie(age, gender) {
  console.log(age, gender);
  if (gender === "M") {
    const entry = maleDeath.find((item) => item.age === age);
    return entry ? entry.qx : null;
  } else {
    const entry = femaleDeath.find((item) => item.age === age);
    return entry ? entry.qx : null;
  }
}

export function lineOne(person) {
  //   const seniority1 = seniority(person.startDate, person.leaveDate);
  //   return firstFormula(person.salary, seniority1, person.section14Rate);

  let sum = 0;
  const w = person.gender === "M" ? 67 : 64;
  const x = calcAge(person.birthDate);
  const sen = seniority(person.startDate, person.leaveDate);
  for (t = 0; w - x - 2; t++) {
    // sum += (firstFormula(person.salary,sen, person.section14Rate) * ((1 + 0.04)**(t+0.5)) * probabilityToKeepWork(x,person.gender) * probabilityToFired(x)/(1+));
  }
}
