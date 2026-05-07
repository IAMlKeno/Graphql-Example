import { describe, expect, it } from "vitest";
import { calculateInsuranceRate, getMultiplier } from "../utils";
import { InsuranceType } from "~/context/QuoteProvider";

describe('Quote utils', () => {
  it('gets a multipler', () => {
    expect(getMultiplier(18)).toEqual(2);
    expect(getMultiplier(30)).toEqual(1.5);
    expect(getMultiplier(50)).toEqual(3);
  });

  it('calculates insurance rate', () => {
    expect(calculateInsuranceRate(18, InsuranceType.life)).toEqual(30)
    expect(calculateInsuranceRate(18, InsuranceType.automotive)).toEqual(100)
    expect(calculateInsuranceRate(18, InsuranceType.home)).toEqual(20)
  })
});