import dayjs from "dayjs";
import { InsuranceType } from "~/context/QuoteProvider";

const loyaltyDiscounts = {};
const basePrices = {
  life: 15,
  automotive: 50,
  home: 10
}

const multiplierByAgeRange = {
  "18-29": 2,
  "30-49": 1.5,
  "50+": 3
}

export const getMultiplier = (age: number): number => {
  const multiplier = Object.entries(multiplierByAgeRange).filter((range) => {
    const v = range[0]; // "18-29"
    const [bottomend, topend] = v.split("-");

    if (!topend) {
      // assume 50+
      return true;
    }
    return age >= Number(bottomend) && age <= Number(topend)
  });

  return multiplier[0][1];
}

export const calculateInsuranceRate = (age: number, type: InsuranceType): number => {
  const base = basePrices[type];
  const multipler = getMultiplier(age);
  const rate = base * multipler;

  return rate;
}

export const calculateAge = (dob: string): number => {
  const year = dayjs().diff(dob, 'year');
  console.log(`Your calculated age is ${year}`);
  return year;
}
