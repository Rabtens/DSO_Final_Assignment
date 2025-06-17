import { calculateBMI, getBMICategory } from '../bmiCalculator';

describe('BMI Calculator Logic', () => {
  test('should return correct BMI value for valid height and weight', () => {
    expect(calculateBMI(1.75, 70)).toBe(22.9);
  });

  test('should return null for zero height or weight', () => {
    expect(calculateBMI(0, 70)).toBeNull();
    expect(calculateBMI(1.75, 0)).toBeNull();
  });

  test('should return null for negative height or weight', () => {
    expect(calculateBMI(-1.75, 70)).toBeNull();
    expect(calculateBMI(1.75, -70)).toBeNull();
  });

  test('should return number type for valid input', () => {
    const result = calculateBMI(1.75, 70);
    expect(typeof result).toBe('number');
  });

  test('should return correct category for Underweight', () => {
    expect(getBMICategory(17)).toBe('Underweight');
  });

  test('should return correct category for Normal', () => {
    expect(getBMICategory(22)).toBe('Normal');
  });

  test('should return correct category for Overweight', () => {
    expect(getBMICategory(27)).toBe('Overweight');
  });

  test('should return correct category for Obese', () => {
    expect(getBMICategory(32)).toBe('Obese');
  });
});