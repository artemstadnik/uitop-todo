process.env.DB_PATH = ':memory:';

import request from 'supertest';
import { createApp } from './app';

const app = createApp();

describe('GET /categories', () => {
  it('returns the 5 seeded categories', async () => {
    const res = await request(app).get('/categories');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(5);
    expect(res.body[0]).toHaveProperty('name');
  });
});

describe('POST /todos', () => {
  it('creates a todo and returns it', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ text: 'Write tests', categoryId: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      text: 'Write tests',
      categoryId: 1,
      completed: false,
    });
    expect(res.body).toHaveProperty('id');
  });

  it('rejects an empty text with 400', async () => {
    const res = await request(app).post('/todos').send({ text: '   ', categoryId: 1 });
    expect(res.status).toBe(400);
  });

  it('rejects a non-existent category with 400', async () => {
    const res = await request(app).post('/todos').send({ text: 'X', categoryId: 999 });
    expect(res.status).toBe(400);
  });

  it('enforces the 5-tasks-per-category limit (6th returns 400)', async () => {
    for (let i = 1; i <= 5; i++) {
      const ok = await request(app).post('/todos').send({ text: `Task ${i}`, categoryId: 2 });
      expect(ok.status).toBe(201);
    }
    const sixth = await request(app).post('/todos').send({ text: 'Task 6', categoryId: 2 });
    expect(sixth.status).toBe(400);
    expect(sixth.body.error).toMatch(/limit/i);
  });
});

describe('PATCH /todos/:id', () => {
  it('updates the completed status', async () => {
    const created = await request(app).post('/todos').send({ text: 'Toggle me', categoryId: 3 });
    const id = created.body.id;

    const res = await request(app).patch(`/todos/${id}`).send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('returns 404 for a non-existent todo', async () => {
    const res = await request(app).patch('/todos/999999').send({ completed: true });
    expect(res.status).toBe(404);
  });
});

describe('PATCH /todos/bulk', () => {
  it('updates multiple todos in one request', async () => {
    const a = await request(app).post('/todos').send({ text: 'Bulk A', categoryId: 4 });
    const b = await request(app).post('/todos').send({ text: 'Bulk B', categoryId: 4 });
    const ids = [a.body.id, b.body.id];

    const res = await request(app).patch('/todos/bulk').send({ ids, completed: true });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.every((t: { completed: boolean }) => t.completed)).toBe(true);
  });

  it('rejects an empty ids array with 400', async () => {
    const res = await request(app).patch('/todos/bulk').send({ ids: [], completed: true });
    expect(res.status).toBe(400);
  });
});

describe('GET /todos with category filter', () => {
  it('returns only todos from the requested category', async () => {
    await request(app).post('/todos').send({ text: 'Filter me', categoryId: 5 });
    const res = await request(app).get('/todos').query({ category: 5 });

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((t: { categoryId: number }) => t.categoryId === 5)).toBe(true);
  });
});

describe('DELETE /todos/:id', () => {
  it('deletes a todo and returns 204', async () => {
    const created = await request(app).post('/todos').send({ text: 'Delete me', categoryId: 1 });
    const id = created.body.id;

    const del = await request(app).delete(`/todos/${id}`);
    expect(del.status).toBe(204);
  });

  it('returns 404 when deleting a non-existent todo', async () => {
    const res = await request(app).delete('/todos/999999');
    expect(res.status).toBe(404);
  });
});
