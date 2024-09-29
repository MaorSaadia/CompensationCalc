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

//// Part - 2 ////

//פקטור אקטוארי
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

//עלות שירות שוטף
export function onGoingServiceCost(lastSalary, partOfYear, section14Rate) {
  const onGoingServiceCost = lastSalary * partOfYear * (1 - section14Rate);

  return onGoingServiceCost;
}

//חישוב חלק שעובד עבד
export function calculateServiceLife(startAge, gender, retirement) {
  let serviceLife = 0;
  let cumulativeProbability = 1;

  for (let currentAge = startAge; currentAge <= retirement; currentAge++) {
    const probabilityToStay = probabilityToKeepWork(currentAge, gender);
    serviceLife += cumulativeProbability * probabilityToStay;
    cumulativeProbability *= probabilityToStay;
  }

  return Number(serviceLife.toFixed());
}

//פיצויים ששולמו
export function benefitsPaid(assetsPayment, completionByCheck) {
  return assetsPayment + completionByCheck;
}

export function calculation1(person, part1Result) {
  let diff = 0;

  const presentValueOfTheEmployeeLiability = part1Result;
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

  const ongoingServiceCost = onGoingServiceCost(lastSalary, 1, section14Rate);
  const actuarialFactorValue = actuarialFactor(
    presentValueOfTheEmployeeLiability,
    person.salary,
    sen,
    section14Rate
  );

  // console.log(
  //   `Calculation1 = onGoingServiceCost(${lastSalary}, 1, ${section14Rate}) * actuarialFactor(${presentValueOfTheEmployeeLiability}, ${person.salary}, ${sen}, ${section14Rate})`
  // );

  const calculation1 = ongoingServiceCost * actuarialFactorValue;

  return calculation1;
}

export function calculation2(person, part1Result) {
  let calcBenefitsPaid = 0;
  const openingBalance = person.openingBalance;
  const gender = person.gender;
  const startAge = calcAge(person.birthDate);
  const retirement = person.gender === "M" ? 67 : 64;
  const assetsPayment = person.assetsPayment;
  const completionByCheck = person.check;

  const changeOfCommitment = person.commitment;

  const expectedServiceLife = calculateServiceLife(
    startAge,
    gender,
    retirement
  );
  const serviceLifeDiscountRate = discountRate(expectedServiceLife);

  if (person.leavingReason) {
    calcBenefitsPaid = benefitsPaid(assetsPayment, completionByCheck);
  }

  const calc1Result = calculation1(person, part1Result);

  // console.log(
  //   `CapitalizationCost = ${openingBalance} * ${serviceLifeDiscountRate} + ((${calc1Result} - ${calcBenefitsPaid}) * ${serviceLifeDiscountRate}) / 2`
  // );

  const capitalizationCost =
    openingBalance * serviceLifeDiscountRate +
    ((calc1Result - calcBenefitsPaid) * serviceLifeDiscountRate) / 2;

  return capitalizationCost;
}

export function calculation3(person, part1Result) {
  let calcBenefitsPaid = 0;
  const closingBalance = part1Result;
  const openingBalance = person.openingBalance;
  const assetsPayment = person.assetsPayment;
  const completionByCheck = person.check;

  const ongoingServiceCost = calculation1(person, part1Result);
  const capitalizationCost = calculation2(person, part1Result);

  if (person.leavingReason) {
    calcBenefitsPaid = benefitsPaid(assetsPayment, completionByCheck);
  }

  // console.log(
  //   `Calculation3 = ${closingBalance} - ${openingBalance} - ${ongoingServiceCost} - ${capitalizationCost} + ${calcBenefitsPaid}`
  // );

  const calculation3 =
    closingBalance -
    openingBalance -
    ongoingServiceCost -
    capitalizationCost +
    calcBenefitsPaid;

  return calculation3;
}

export function calculation4(person) {
  let calcBenefitsPaid = 0;
  const openingBalance = person.assets;
  const gender = person.gender;
  const startAge = calcAge(person.birthDate);
  const retirement = person.gender === "M" ? 67 : 64;
  const deposits = person.deposits;
  const assetsPayment = person.assetsPayment;
  const completionByCheck = person.check;

  const expectedServiceLife = calculateServiceLife(
    startAge,
    gender,
    retirement
  );
  const serviceLifeDiscountRate = discountRate(expectedServiceLife);

  if (person.leavingReason) {
    calcBenefitsPaid = benefitsPaid(assetsPayment, completionByCheck);
  }

  // console.log(
  //   `ExpectedReturnOnPlanAssets = ${openingBalance} * ${serviceLifeDiscountRate} + ((${deposits} - ${calcBenefitsPaid}) * ${serviceLifeDiscountRate}) / 2`
  // );

  return (
    openingBalance * serviceLifeDiscountRate +
    ((deposits - calcBenefitsPaid) * serviceLifeDiscountRate) / 2
  );
}

export function calculation5(person) {
  let calcBenefitsPaid = 0;

  const assetsValue = person.assetsValue;
  const openingBalance = person.assets;
  const expectedReturn = calculation4(person);
  const deposits = person.deposits;
  const assetsPayment = person.assetsPayment;
  const completionByCheck = person.check;

  if (person.leavingReason) {
    calcBenefitsPaid = benefitsPaid(assetsPayment, completionByCheck);
  }

  console.log(
    `Calculation5 = ${assetsValue} - ${openingBalance} - ${expectedReturn} - ${deposits} + ${calcBenefitsPaid}`
  );

  return (
    assetsValue - openingBalance - expectedReturn - deposits + calcBenefitsPaid
  );
}
