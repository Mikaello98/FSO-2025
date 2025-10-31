import express from 'express';
import { bmiCalculator } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  const heightNum = Number(height);
  const weightNum = Number(weight);

  if (!height || !weight || isNaN(heightNum) || isNaN(weightNum)) {
    return res.status(400).json({ error: 'malformatted parameters'});
  }

  try {
    const bmi = bmiCalculator(heightNum, weightNum);
    return res.json({
      height: heightNum,
      weight: weightNum,
      bmi
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'unknown error' });
  }
});

app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || target === undefined) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  if (
    !Array.isArray(daily_exercises) ||
    isNaN(Number(target)) ||
    !daily_exercises.every((n: unknown) => typeof n === 'number' && !isNaN(n))
  ) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  try {
    const result = calculateExercises(daily_exercises, Number(target));
    return res.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'unknown error' });
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});