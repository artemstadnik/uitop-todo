import { useCallback, useEffect, useRef, useState } from 'react';
import type { Category, Todo } from '../types';
import { getCategories, getTodos } from '../api/todos';

export type CategoryFilter = number | 'all';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilterState] = useState<CategoryFilter>('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const didInit = useRef(false);

  const loadTodos = useCallback(async (currentFilter: CategoryFilter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTodos(currentFilter === 'all' ? undefined : currentFilter);
      setTodos(data);
    } catch {
      setError('Failed to load tasks. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    void getCategories()
      .then(setCategories)
      .catch(() => setError('Failed to load categories.'));
    void loadTodos('all');
  }, [loadTodos]);

  const setFilter = useCallback(
    (next: CategoryFilter) => {
      setFilterState(next);
      void loadTodos(next);
    },
    [loadTodos]
  );

  return {
    todos,
    setTodos,
    categories,
    filter,
    setFilter,
    loading,
    error,
    reload: () => loadTodos(filter),
  };
}
