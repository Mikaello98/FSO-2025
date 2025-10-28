"use strict";
function calculateExercises(dailyHours, target) {
    if (dailyHours.length === 0) {
        throw new Error('Please provide at least one day of exercise data');
    }
    if (isNaN(target) || target <= 0) {
        throw new Error('Target must be a positive number');
    }
    var periodLength = dailyHours.length;
    var trainingDays = dailyHours.filter(function (h) { return h > 0; }).length;
    var average = dailyHours.reduce(function (a, b) { return a + b; }, 0) / periodLength;
    var success = average >= target;
    var rating;
    var ratingDescription;
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
        ratingDescription = 'you need to push harder';
    }
    return {
        periodLength: periodLength,
        trainingDays: trainingDays,
        success: success,
        rating: rating,
        ratingDescription: ratingDescription,
        target: target,
        average: average
    };
}
try {
    var args = process.argv.slice(2);
    if (args.length < 2) {
        throw new Error('Please provide a target and at least one day of exercise hours.');
    }
    var target = Number(args[0]);
    var dailyHours = args.slice(1).map(function (n) {
        var value = Number(n);
        if (isNaN(value))
            throw new Error('All daily exercise values must be numbers.');
        return value;
    });
    console.log(calculateExercises(dailyHours, target));
}
catch (error) {
    if (error instanceof Error) {
        console.log('Error:', error.message);
    }
    else {
        console.log('An unknown error occured.');
    }
}
