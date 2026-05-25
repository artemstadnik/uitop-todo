import { api } from './client';
import type { Category, Todo, CreateTodoInput } from '../types';

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/categories');
  return data;
}

export async function getTodos(categoryId?: number): Promise<Todo[]> {
  const { data } = await api.get<Todo[]>('/todos', {
    params: categoryId ? { category: categoryId } : undefined,
  });
  return data;
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const { data } = await api.post<Todo>('/todos', input);
  return data;
}

export async function updateTodoStatus(id: number, completed: boolean): Promise<Todo> {
  const { data } = await api.patch<Todo>(`/todos/${id}`, { completed });
  return data;
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`);
}

export async function bulkUpdateStatus(ids: number[], completed: boolean): Promise<Todo[]> {
  const { data } = await api.patch<Todo[]>('/todos/bulk', { ids, completed });
  return data;
}
