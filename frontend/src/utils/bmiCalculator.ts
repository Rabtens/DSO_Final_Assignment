export function calculateBMI(height: number, weight: number): number | null {
    if (!height || !weight || height <= 0 || weight <= 0) return null;
    return +(weight / (height * height)).toFixed(1);
  }
  
  export function getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  