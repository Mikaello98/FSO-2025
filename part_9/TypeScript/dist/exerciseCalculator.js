"use strict";
function calculateExercises(dailyHours, target) {
    if (dailyHours.length === 0) {
        throw new Error('Daily hours array cannot be empty');
    }
    if (target <= 0) {
        throw new Error('Target must be a positive number');
    }
    const periodLength = dailyHours.length;
    const trainingDays = dailyHours.filter(h => h > 0).length;
    const totalHours = dailyHours.reduce((sum, h) => sum + h, 0);
    const average = totalHours / periodLength;
    const success = average >= target;
    let rating;
    let ratingDescription;
    if (average >= target) {
        rating = 3;
        ratingDescription = 'great job, target met!';
    }
    else if (average >= target * 0.75) {
        rating = 2;
        ratingDescription = 'not too bad but could be better';
    }
    else {
        rating = 1;
        ratingDescription = 'you need to pus harder';
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
const result = calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2);
console.log(result);
