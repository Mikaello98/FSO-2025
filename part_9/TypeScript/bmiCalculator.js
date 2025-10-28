"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bmiCalculator = bmiCalculator;
function bmiCalculator(heightCm, weightKg) {
    if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) {
        throw new Error('Both height and weight must be positive numbers.');
    }
    var heightM = heightCm / 100;
    var bmi = weightKg / (heightM * heightM);
    if (bmi < 18.5) {
        return 'Underweight';
    }
    else if (bmi < 25) {
        return 'Normal range';
    }
    else if (bmi < 30) {
        return 'Overweight';
    }
    else {
        return 'Obese';
    }
}
if (require.main === module) {
    try {
        var args = process.argv.slice(2);
        if (args.length < 2) {
            throw new Error('Please provide both height (cm) and weight (kg).');
        }
        var height = Number(args[0]);
        var weight = Number(args[1]);
        console.log(bmiCalculator(height, weight));
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('Error:', error.message);
        }
        else {
            console.log('An unknown error occured.');
        }
    }
}
