export function calculateBMI(height: number, weight: number): number | null {
    if (!height || !weight || height <= 0 || weight <= 0) return null;
    const heightInMeters = height / 100;
    return +(weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
