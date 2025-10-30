export interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export function calculateExercises(dailyHours: number[], target: number): ExerciseResult {
  if (dailyHours.length === 0) {
    throw new Error('Please provide at least one day of exercise data');
  }
  if (isNaN(target) || target <= 0) {
    throw new Error('Target must be a positive number');
  }

  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(h => h > 0).length;
  const average = dailyHours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = 'great job, target met!';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating =1;
    ratingDescription = 'you need to push harder';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2);

    if (args.length < 2) {
      throw new Error('Please provide a target and at least one day of exercise hours.');
    }

    const target = Number(args[0]);
    const dailyHours = args.slice(1).map(n => {
      const value = Number(n);
      if (isNaN(value)) throw new Error('All daily exercise values must be numbers.');
      return value;
    });

    console.log(calculateExercises(dailyHours, target));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error:', error.message);
    } else {
      console.log('An unknown error occured.');
    }
  }
}