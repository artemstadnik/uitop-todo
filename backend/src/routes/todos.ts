import { Router } from 'express';
import { db, MAX_TODOS_PER_CATEGORY } from '../db';
import { Todo } from '../types';

const router = Router();

interface TodoRow {
  id: number;
  text: string;
  category_id: number;
  category_name: string;
  completed: number;
  created_at: string;
}

function mapTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    text: row.text,
    categoryId: row.category_id,
    categoryName: row.category_name,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
  };
}

const SELECT_TODO = `
  SELECT t.id, t.text, t.category_id, t.completed, t.created_at, c.name AS category_name
  FROM todos t
  JOIN categories c ON c.id = t.category_id
`;

router.get('/', (req, res) => {
  const { category } = req.query;

  if (category !== undefined) {
    const categoryId = Number(category);
    if (!Number.isInteger(categoryId)) {
      return res.status(400).json({ error: 'category must be a valid id' });
    }
    const rows = db
      .prepare(`${SELECT_TODO} WHERE t.category_id = ? ORDER BY t.created_at DESC`)
      .all(categoryId) as TodoRow[];
    return res.json(rows.map(mapTodo));
  }

  const rows = db
    .prepare(`${SELECT_TODO} ORDER BY t.created_at DESC`)
    .all() as TodoRow[];
  res.json(rows.map(mapTodo));
});

router.post('/', (req, res) => {
  const { text, categoryId } = req.body ?? {};

  if (typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'text is required' });
  }
  if (!Number.isInteger(categoryId)) {
    return res.status(400).json({ error: 'categoryId is required' });
  }
  const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(categoryId);
  if (!category) {
    return res.status(400).json({ error: 'category does not exist' });
  }

  const { count } = db
    .prepare('SELECT COUNT(*) AS count FROM todos WHERE category_id = ?')
    .get(categoryId) as { count: number };
  if (count >= MAX_TODOS_PER_CATEGORY) {
    return res
      .status(400)
      .json({ error: `Category limit reached (max ${MAX_TODOS_PER_CATEGORY} tasks)` });
  }

  const info = db
    .prepare('INSERT INTO todos (text, category_id) VALUES (?, ?)')
    .run(text.trim(), categoryId);
  const row = db.prepare(`${SELECT_TODO} WHERE t.id = ?`).get(info.lastInsertRowid) as TodoRow;
  res.status(201).json(mapTodo(row));
});

router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { completed } = req.body ?? {};

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'completed (boolean) is required' });
  }
  const existing = db.prepare('SELECT id FROM todos WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'todo not found' });
  }
  db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(completed ? 1 : 0, id);
  const row = db.prepare(`${SELECT_TODO} WHERE t.id = ?`).get(id) as TodoRow;
  res.json(mapTodo(row));
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'todo not found' });
  }
  res.status(204).send();
});

export default router;
