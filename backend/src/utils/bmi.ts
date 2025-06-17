export function calculateBMI(weight: number, height: number): number {
  if (height <= 0) {
    throw new Error("Height must be greater than zero");
  }

  const bmi = weight / (height * height);
  return parseFloat(bmi.toFixed(2)); // round to 2 decimal places
}

