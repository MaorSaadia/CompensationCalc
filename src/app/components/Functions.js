import { femaleDeath, maleDeath } from "../data/death";
import { discountRate1 } from "../data/discountRate";

const SALARY_GROWTH_RATE = 0.03;

export function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
}

export function getDateFromString(dateString) {
  const [day, month, year] = dateString?.split("/").map(Number);
  return new Date(year, month - 1, day);
}

export function getYearFromDate(dateString) {
  const dateParts = dateString?.split("/");
  let year = parseInt(dateParts[2], 10);

  if (year < 100) {
    year += year < 40 ? 2000 : 1900;
  }
  return year;
}

export function calcAge(birthDate) {
  return Number(2023 - getYearFromDate(birthDate));
}

// export function section14(year, person) {
//   if (person.section14Date) {
//     if (Number(year) < Number(getYearFromDate(person.section14Date))) {
//       return 0;
//     } else {
//       return person.section14Rate;
//     }
//   } else {
//     return 0;
//   }
// }

// export function seniority(startDate, leaveDate) {
//   const start = getDateFromString(startDate);
//   const leave = getDateFromString(leaveDate);

//   const diffTime = Math.abs(start - leave);
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//   const years = diffDays / 365.25; // Using 365.25 to account for leap years
//   return Number(years.toFixed(1));
// }

export function seniority(startDate, leaveDate) {
  const startYear = getYearFromDate(startDate);
  const leaveYear = leaveDate ? getYearFromDate(leaveDate) : 2023;

  return Number(leaveYear - startYear);
}

export function section14RateDifference(startDate, getYear) {
  const startWork = getYearFromDate(startDate);
  const getYear14 = getYearFromDate(getYear);

  return getYear14 - startWork;
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

  let diff = 0;
  const w = person.gender === "M" ? 67 : 64;
  const x = calcAge(person.birthDate);
  let sen = Math.floor(seniority(person.startDate, person.leaveDate));
  let section14Rate = person.section14Rate;

  if (person.section14Date) {
    diff = section14RateDifference(person.startDate, person.section14Date);
    if (diff !== 0) {
      sen = diff;
      section14Rate = 0;
    }
  }

  for (let t = 0; t <= w - x - 2; t++) {
    const currentProbability = probabilityToKeepWork(x + t + 1, person.gender);
    probabilityCalc *= currentProbability;

    sum +=
      (firstFormula(person.salary, sen, section14Rate) *
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

  let diff = 0;
  const w = person.gender === "M" ? 67 : 64;
  const x = calcAge(person.birthDate);
  let sen = Math.floor(seniority(person.startDate, person.leaveDate));
  let section14Rate = person.section14Rate;

  if (person.section14Date) {
    diff = section14RateDifference(person.startDate, person.section14Date);
    if (diff !== 0) {
      sen = diff;
      section14Rate = 0;
    }
  }

  for (let t = 0; t <= w - x - 2; t++) {
    const currentProbability = probabilityToKeepWork(x + t + 1, person.gender);
    probabilityCalc *= currentProbability;
    sum +=
      (firstFormula(person.salary, sen, section14Rate) *
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

  let diff = 0;
  const w = person.gender === "M" ? 67 : 64;
  const x = calcAge(person.birthDate);
  let sen = Math.floor(seniority(person.startDate, person.leaveDate));
  let section14Rate = person.section14Rate;

  if (person.section14Date) {
    diff = section14RateDifference(person.startDate, person.section14Date);
    if (diff !== 0) {
      sen = diff;
      section14Rate = 0;
    }
  }

  for (let t = x - 1; t <= x + w - x - 1; t++) {
    const currentProbability = probabilityToKeepWork(t, person.gender);
    probabilityCalc *= currentProbability;
  }
  sum +=
    (firstFormula(person.salary, sen, section14Rate) *
      (1 + SALARY_GROWTH_RATE) ** (w - x + 0.5) *
      probabilityCalc *
      probabilityToFired(w - 1)) /
    (1 + discountRate(w - x)) ** (w - x + 0.5);
  return sum;
}

export function lineFour1(person) {
  let sum = 0;
  let probabilityCalc = 1;

  let diff = 0;
  const w = person.gender === "M" ? 67 : 64;
  const x = calcAge(person.birthDate);
  let sen = Math.floor(seniority(person.startDate, person.leaveDate));
  let section14Rate = person.section14Rate;

  if (person.section14Date) {
    diff = section14RateDifference(person.startDate, person.section14Date);
    if (diff !== 0) {
      sen = diff;
      section14Rate = 0;
    }
  }

  for (let t = x - 1; t <= x + w - x - 1; t++) {
    const currentProbability = probabilityToKeepWork(t, person.gender);
    probabilityCalc *= currentProbability;
  }
  sum +=
    (firstFormula(person.salary, sen, section14Rate) *
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
  let diff = 0;

  const w = person.gender === "M" ? 67 : 64;
  const x = calcAge(person.birthDate);
  let sen = Math.floor(seniority(person.startDate, person.leaveDate));
  let section14Rate = person.section14Rate;

  if (person.section14Date) {
    diff = section14RateDifference(person.startDate, person.section14Date);
    if (diff !== 0) {
      sen = diff;
      section14Rate = 0;
    }
  }

  sum +=
    (firstFormula(person.salary, sen, section14Rate) *
      (1 + SALARY_GROWTH_RATE) ** (w - x) *
      probabilityToKeepWork(x + w - x - 1, person.gender) *
      (1 -
        probabilityToFired(w - 1) -
        probabilityToResign(w - 1) -
        probabilityToDie(w - 1, person.gender))) /
    (1 + discountRate(w - x)) ** (w - x);
  return sum;
}

//// Part - 2

export function actuarialFactor(
  presentValueOfTheEmployeeLiability,
  lastSalary,
  sen,
  section14Rate
) {
  if (section14Rate === 1) return 0;

  let actuarialFactor =
    presentValueOfTheEmployeeLiability /
    (lastSalary * sen * (1 - section14Rate));
  return actuarialFactor;
}

export function onGoingServiceCost(lastSalary, partOfYear, section14Rate) {
  const onGoingServiceCost = lastSalary * partOfYear * (1 - section14Rate);

  return onGoingServiceCost;
}

export function capitalizationCost() {}

export function calculation1(person, result) {
  let diff = 0;

  const presentValueOfTheEmployeeLiability = result;
  const lastSalary = person.salary;
  let sen = Math.floor(seniority(person.startDate, person.leaveDate));
  let section14Rate = person.section14Rate;

  if (person.section14Date) {
    diff = section14RateDifference(person.startDate, person.section14Date);
    if (diff !== 0) {
      sen = diff;
      section14Rate = 0;
    }
  }

  // console.log("presentValueOfTheEmployeeLiability", result);
  // console.log("lastSalary: ", person.salary);
  // console.log("section14Rate: ", section14Rate);
  // console.log("sen: ", sen);
  // console.log(
  //   "actuarialFactor:",
  //   actuarialFactor(
  //     presentValueOfTheEmployeeLiability,
  //     person.salary,
  //     sen,
  //     section14Rate
  //   )
  // );

  let calculation1 =
    onGoingServiceCost(lastSalary, 1, section14Rate) *
    actuarialFactor(
      presentValueOfTheEmployeeLiability,
      person.salary,
      sen,
      section14Rate
    );

  return calculation1;
}
export function calculation2(person) {}
export function calculation3(person) {}
export function calculation4(person) {}
export function calculation5(person) {}
