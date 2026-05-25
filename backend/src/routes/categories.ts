import { Router } from 'express';
import { db } from '../db';
import { Category } from '../types';

const router = Router();

router.get('/', (_req, res) => {
  const categories = db
    .prepare('SELECT id, name FROM categories ORDER BY id')
    .all() as Category[];
  res.json(categories);
});

export default router;
