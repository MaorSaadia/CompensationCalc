import { femaleDeath, maleDeath } from "../data/death";
import { discountRate1 } from "../data/discountRate";

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
  if (age >= 18 && age <= 29) return 0.2;
  if (age >= 30 && age <= 39) return 0.13;
  if (age >= 40 && age <= 49) return 0.1;
  if (age >= 50 && age <= 59) return 0.07;
  if (age >= 60 && age <= 67) return 0.03;
}

export function probabilityToFired(age) {
  if (age >= 18 && age <= 29) return 0.15;
  if (age >= 30 && age <= 39) return 0.1;
  if (age >= 40 && age <= 49) return 0.04;
  if (age >= 50 && age <= 59) return 0.05;
  if (age >= 60 && age <= 67) return 0.03;
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
  const w = person.gender === "M" ? 67 : 64;
  const x = calcAge(person.birthDate);
  const sen = seniority(person.startDate, person.leaveDate);
  for (let t = 0; t <= w - x - 2; t++) {
    sum +=
      (firstFormula(person.salary, sen, person.section14Rate) *
        (1 + 0.04) ** (t + 0.5) *
        probabilityToKeepWork(x + t + 1, person.gender) *
        probabilityToFired(x + t + 1)) /
      (1 + discountRate(t + 1)) ** (t + 0.5);
  }
  return sum;
}

// export function lineOne(person) {
//   let sum = 0;
//   const w = person.gender === "M" ? 67 : 64;
//   const x = calcAge(person.birthDate);
//   const sen = seniority(person.startDate, person.leaveDate);
//   console.log("w ", w);
//   console.log("x ", x);
//   console.log("sen ", sen);
//   // let t = 0;
//   console.log(person.salary);
//   console.log(person.section14Rate);
//   console.log(firstFormula(person.salary, sen, person.section14Rate));
//   console.log(probabilityToKeepWork(x, person.gender));
//   console.log(probabilityToFired(x));
//   console.log(discountRate(1));
//   for (let t = 0; t <= w - x - 2; t++) {
//     sum +=
//       (firstFormula(person.salary, sen, person.section14Rate) *
//         (1 + 0.04) ** (t + 0.5) *
//         probabilityToKeepWork(x, person.gender) *
//         probabilityToFired(x)) /
//       (1 + discountRate(t + 1)) ** (t + 0.5);
//   }
//   return sum;
// }
