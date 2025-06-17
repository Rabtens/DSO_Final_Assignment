import { Router, Request, Response } from 'express';
import { errorHandler } from '../utils';
import knex from 'knex';
import { databaseConfig } from '../config';

const router = Router();
const db = knex(databaseConfig);

// GET all BMI records
router.get('/user/bmi', errorHandler(async (req: Request, res: Response) => {
  const records = await db('bmi_records').select('*').orderBy('created_at', 'desc');
  res.json(records);
}));

// POST to calculate BMI
router.post('/calculate-bmi', errorHandler(async (req: Request, res: Response) => {
  const { height, weight, age } = req.body;
  if (!height || !weight || !age) {
    return res.status(400).json({ message: 'Missing height, weight, or age' });
  }
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  res.json({ bmi });
}));

// POST new BMI record
router.post('/create/bmi', errorHandler(async (req: Request, res: Response) => {
  const { height, weight, age } = req.body;

  // Basic validation
  if (!height || !weight) {
    return res.status(400).json({ message: 'Height and weight are required' });
  }

  const heightNum = parseFloat(height);
  const weightNum = parseFloat(weight);

  // Validate that the inputs are numbers
  if (isNaN(heightNum)) return res.status(400).json({ message: 'Height must be a number' });
  if (isNaN(weightNum)) return res.status(400).json({ message: 'Weight must be a number' });
  if (heightNum <= 0) return res.status(400).json({ message: 'Height must be positive' });
  if (weightNum <= 0) return res.status(400).json({ message: 'Weight must be positive' });

  // Calculate BMI
  const bmi = (weightNum / (heightNum * heightNum)).toFixed(2);

  try {
    // Save the BMI record to the database
    const [record] = await db('bmi_records')
      .insert({ 
        height: heightNum, 
        weight: weightNum, 
        age: age ? parseInt(age) : null, 
        bmi: parseFloat(bmi),
        created_at: db.fn.now()
      })
      .returning('*');

    res.status(201).json(record);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Failed to save BMI record' });
  }
}));

// DELETE a BMI record
router.delete('/user/bmi/:id', errorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await db('bmi_records').where({ id }).del();
  res.status(204).send();
}));

export default router;