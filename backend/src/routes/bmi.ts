import { Router, Request, Response } from 'express'
import { errorHandler } from '../utils'
import knex from 'knex'
import { databaseConfig } from '../config'

const router = Router()
const db = knex(databaseConfig)

// GET /api/user/bmi - fetch all BMI records
router.get('/user/bmi', errorHandler(async (req: Request, res: Response) => {
  const records = await db('bmi_records').select('*').orderBy('created_at', 'desc')
  res.json(records)
}))

// POST /api/create/bmi - create a new BMI record
router.post('/create/bmi', errorHandler(async (req: Request, res: Response) => {
  const { id, height, weight, age, bmi } = req.body;

  if (!id || !height || !weight || !age || !bmi) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const [record] = await db('bmi_records')
    .insert({ id, height, weight, age, bmi })
    .returning('*');

  res.status(201).json(record);
}))

// DELETE /api/user/bmi/:id - delete a specific BMI record
router.delete('/user/bmi/:id', errorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'BMI record ID is required' });
  }

  const deletedCount = await db('bmi_records')
    .where({ id })
    .del();

  if (deletedCount === 0) {
    return res.status(404).json({ message: 'BMI record not found' });
  }

  res.json({ message: 'BMI record deleted successfully' });
}))

// DELETE /api/user/bmi - delete all BMI records (optional - use with caution)
router.delete('/user/bmi', errorHandler(async (req: Request, res: Response) => {
  const deletedCount = await db('bmi_records').del();
  
  res.json({ 
    message: `${deletedCount} BMI records deleted successfully`,
    deletedCount 
  });
}))

export default router