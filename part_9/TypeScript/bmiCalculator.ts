function bmiCalculator(heightCm: number, weightKg: number): string {
  if (heightCm <= 0 || weightKg <= 0) {
    return 'Invalid input'
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi < 25) {
    return 'Normal range';
  } else if (bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
}

console.log(bmiCalculator(180, 74));