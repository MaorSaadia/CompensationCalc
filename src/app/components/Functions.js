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

export function section14(year, person) {
  if (person.section14Date) {
    if (Number(year) < Number(getYearFromDate(person.section14Date))) {
      return 0;
    } else {
      return person.section14Rate;
    }
  } else {
    return 0;
  }
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
      (firstFormula(
        person.salary,
        sen,
        section14(getYearFromDate(person.startDate) + t + 1, person)
      ) *
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
      (firstFormula(
        person.salary,
        sen,
        section14(getYearFromDate(person.startDate) + t + 1, person)
      ) *
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

  for (let t = x - 1; t <= w - 1; t++) {
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

  for (let t = x - 1; t <= w - 1; t++) {
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

  for (let t = x - 1; t <= w - 1; t++) {
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

///Amir from here

// console.log(
//   "w - x - 2 :" + w + " - " + x + " - " + "2" + " = " + (w - x - 2)
// );

// const currentYear = getYearFrmDate(person.startDate) + t;

// console.log(
//   "Round: " +
//     t +
//     " age: " +
//     (x + t + 1) +
//     " Year: " +
//     currentYear +
//     " section14: " +
//     section14(currentYear, person)
// );

// export function Dismissal(t, x, person) {

//   // console.log("round t: " + t + " " + "age x: " + (x + t - 1));

//   const w = person.gender === "M" ? 67 : 64;
//   const sen = seniority(person.startDate, person.leaveDate);

//   // console.log(
//   //   "Formula:" +
//   //     firstFormula(person.salary, sen, person.section14Rate) +
//   //     " * " +
//   //     (1 + 0.04) +
//   //     " ** " +
//   //     (t + 0.5) +
//   //     " * " +
//   //     currentProbability +
//   //     " * " +
//   //     probabilityToFired(x + t + 1) +
//   //     " / " +
//   //     (1 + discountRate(t + 1)) +
//   //     " ** " +
//   //     (t + 0.5)
//   // );

//   return (
//     (firstFormula(person.salary, sen, person.section14Rate) *
//       (1 + SALARY_GROWTH_RATE) ** (t + 0.5) *
//       currentProbability *
//       probabilityToFired(x + t + 1)) /
//     (1 + discountRate(t + 1)) ** (t + 0.5)
//   );
// }
// export function Resignation(t, x, person) {
//   // console.log(
//   //   person.assetsValue +
//   //     " * " +
//   //     currentProbability +
//   //     " * " +
//   //     probabilityToResign(x + t - 1)
//   // );
//   return (
//     person.assetsValue * currentProbability * probabilityToResign(x + t + 1)
//   );
// }
// export function Death(t, x, person) {
//   const w = person.gender === "M" ? 67 : 64;
//   const sen = seniority(person.startDate, person.leaveDate);

//   // console.log(
//   //   "Formula:" +
//   //     firstFormula(person.salary, sen, person.section14Rate) +
//   //     " * " +
//   //     (1 + 0.04) +
//   //     " ** " +
//   //     (t + 0.5) +
//   //     " * " +
//   //     currentProbability +
//   //     " * " +
//   //     probabilityToDie(x + t, person.gender) +
//   //     " / " +
//   //     (1 + discountRate(t + 1)) +
//   //     " ** " +
//   //     (t + 0.5)
//   // );
//   return (
//     (firstFormula(person.salary, sen, person.section14Rate) *
//       (1 + SALARY_GROWTH_RATE) ** (t + 0.5) *
//       currentProbability *
//       probabilityToDie(x + t + 1, person.gender)) /
//     (1 + discountRate(t + 1)) ** (t + 0.5)
//   );
// }

// let currentProbability = 1;

// export function Sum(person) {
//   const sen = seniority(person.startDate, person.leaveDate);
//   let sum = 0;
//   const w = person.gender === "M" ? 67 : 64;
//   let x = calcAge(person.birthDate);
//   let t = 0;
//   for (t = 0; t < w; t++) {
//     //calc the probability to keep work
//     if (t == 0) {
//       currentProbability = 1;
//       // console.log("currentProbability: " + currentProbability);
//     } else {
//       currentProbability *= probabilityToKeepWork(x + t - 1, person.gender);
//       // console.log("currentProbability: " + currentProbability);
//     }
//     sum += Dismissal(t, x, person);
//     sum += Resignation(t, x, person);
//     sum += Death(t, x, person);
//   }

//   console.log("w: " + w + "x: " + x);

//   sum +=
//     (firstFormula(person.salary, sen, person.section14Rate) *
//       (1 + SALARY_GROWTH_RATE) ** (w - x + 0.5) *
//       currentProbability *
//       probabilityToFired(w - 1)) /
//     (1 + discountRate(t + 1)) ** (w - x + 0.5);

//   console.log(
//     "sum " +
//       "+= " +
//       (firstFormula(person.salary, sen, person.section14Rate) +
//         " * " +
//         (1 + SALARY_GROWTH_RATE) +
//         " ** " +
//         (w - x + 0.5) +
//         " * " +
//         currentProbability +
//         " * " +
//         probabilityToFired(w - 1)) +
//       " / " +
//       (1 + discountRate(t + 1)) +
//       " ** " +
//       (w - x + 0.5)
//   );

//   sum += person.assetsValue * currentProbability * probabilityToResign(w - 1);

//   console.log(
//     "sum += " +
//       person.assetsValue +
//       " * " +
//       currentProbability +
//       " * " +
//       probabilityToResign(w - 1)
//   );

//   sum +=
//     (firstFormula(person.salary, sen, person.section14Rate) *
//       (1 + SALARY_GROWTH_RATE) ** (w - x - 1 + 0.5) *
//       currentProbability *
//       probabilityToDie(w - 1, person.gender)) /
//     (1 + discountRate(t + 1)) ** (w - x - 1 + 0.5);

//   console.log(
//     "sum " +
//       " += " +
//       (firstFormula(person.salary, sen, person.section14Rate) +
//         " * " +
//         (1 + SALARY_GROWTH_RATE) +
//         " ** " +
//         (w - x - 1 + 0.5) +
//         " * " +
//         currentProbability +
//         " * " +
//         probabilityToDie(w - 1, person.gender)) +
//       " / " +
//       (1 + discountRate(t + 1)) +
//       " ** " +
//       (w - x - 1 + 0.5)
//   );

//   sum +=
//     (firstFormula(person.salary, sen, person.section14Rate) *
//       (1 + SALARY_GROWTH_RATE) ** (w - x) *
//       currentProbability *
//       (1 -
//         probabilityToFired(w - 1) -
//         probabilityToResign(w - 1) -
//         probabilityToDie(w - 1, person.gender))) /
//     (1 + discountRate(t + 1)) ** (w - x);

//   console.log(
//     "sum +=" +
//       (firstFormula(person.salary, sen, person.section14Rate) +
//         " * " +
//         (1 + SALARY_GROWTH_RATE) +
//         " ** " +
//         (w - x) +
//         " * " +
//         currentProbability +
//         " * " +
//         (" 1 " +
//           " - " +
//           probabilityToFired(w - 1) +
//           " - " +
//           probabilityToResign(w - 1) +
//           " - " +
//           probabilityToDie(w - 1, person.gender))) +
//       " / " +
//       (1 + discountRate(t + 1)) +
//       " ** " +
//       (w - x)
//   );
//   return sum;
// }
