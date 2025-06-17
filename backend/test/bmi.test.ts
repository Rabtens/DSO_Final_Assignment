import { calculateBMI } from '../src/utils/bmi'

describe('BMI Calculator', () => {
  it('calculates BMI correctly for valid input', () => {
    const bmi = calculateBMI(70, 1.75); // weight: 70kg, height: 1.75m
    expect(bmi).toBeCloseTo(22.86, 2);
  });

  it('returns a number', () => {
    const bmi = calculateBMI(65, 1.7);
    expect(typeof bmi).toBe('number');
  });

  it('throws error when height is zero', () => {
    expect(() => calculateBMI(70, 0)).toThrow("Height must be greater than zero");
  });

  it('throws error when height is negative', () => {
    expect(() => calculateBMI(70, -1.75)).toThrow("Height must be greater than zero");
  });
});
