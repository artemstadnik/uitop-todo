import { useState } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import axios from 'axios';
import { useTodos } from './hooks/useTodos';
import { usePendingAction } from './hooks/usePendingAction';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { CategoryFilter } from './components/CategoryFilter';
import { BulkActionsBar } from './components/BulkActionsBar';
import { UndoSnackbar } from './components/UndoSnackbar';
import { Loader } from './components/states/Loader';
import { ErrorBox } from './components/states/ErrorBox';
import { createTodo, updateTodoStatus, deleteTodo, bulkUpdateStatus } from './api/todos';
import type { CreateTodoInput, Todo } from './types';

function App() {
  const { todos, setTodos, categories, filter, setFilter, loading, error, reload } = useTodos();
  const { pending, schedule, undo, dismiss, undoTimeoutMs } = usePendingAction();

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const handleSelect = (id: number, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleToggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(todos.map((t) => t.id)) : new Set());
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDone = () => {
    const idsToComplete = todos
      .filter((t) => selectedIds.has(t.id) && !t.completed)
      .map((t) => t.id);

    if (idsToComplete.length === 0) {
      clearSelection();
      return;
    }
    const changed = new Set(idsToComplete);

    setTodos((prev) => prev.map((t) => (changed.has(t.id) ? { ...t, completed: true } : t)));
    clearSelection();

    schedule({
      message: `${idsToComplete.length} task${idsToComplete.length > 1 ? 's' : ''} completed`,
      onCommit: () => {
        bulkUpdateStatus(idsToComplete, true).catch(() => reload());
      },
      onUndo: () => {
        setTodos((prev) => prev.map((t) => (changed.has(t.id) ? { ...t, completed: false } : t)));
      },
    });
  };

  const handleCreate = async (input: CreateTodoInput) => {
    try {
      await createTodo(input);
      reload();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error ?? 'Failed to create task';
        throw new Error(message, { cause: err });
      }
      throw new Error('Failed to create task', { cause: err });
    }
  };

  const handleToggle = (todo: Todo) => {
    const nextCompleted = !todo.completed;
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: nextCompleted } : t))
    );
    schedule({
      message: nextCompleted ? 'Task completed' : 'Task marked active',
      onCommit: () => {
        updateTodoStatus(todo.id, nextCompleted).catch(() => reload());
      },
      onUndo: () => {
        setTodos((prev) =>
          prev.map((t) => (t.id === todo.id ? { ...t, completed: todo.completed } : t))
        );
      },
    });
  };

  const handleDelete = (todo: Todo) => {
    const index = todos.findIndex((t) => t.id === todo.id);
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(todo.id);
      return next;
    });
    schedule({
      message: 'Task deleted',
      onCommit: () => {
        deleteTodo(todo.id).catch(() => reload());
      },
      onUndo: () => {
        setTodos((prev) => {
          const next = [...prev];
          const at = index < 0 ? 0 : Math.min(index, next.length);
          next.splice(at, 0, todo);
          return next;
        });
      },
    });
  };

  const allSelected = todos.length > 0 && selectedIds.size === todos.length;

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontSize: { xs: 32, sm: 40 } }}>
          Todo Manager
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Organize tasks by category — up to 5 per category.
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 2.5, borderRadius: 4 }}>
        <TodoForm categories={categories} onCreate={handleCreate} />
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Tasks
          </Typography>
          <CategoryFilter categories={categories} value={filter} onChange={setFilter} />
        </Box>

        {selectedIds.size > 0 && (
          <BulkActionsBar
            selectedCount={selectedIds.size}
            totalCount={todos.length}
            allSelected={allSelected}
            onToggleSelectAll={handleToggleSelectAll}
            onMarkDone={handleBulkDone}
            onClear={clearSelection}
          />
        )}

        {loading && <Loader />}
        {!loading && error && <ErrorBox message={error} onRetry={reload} />}
        {!loading && !error && (
          <TodoList
            todos={todos}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      </Paper>

      <UndoSnackbar
        open={pending !== null}
        message={pending?.message ?? ''}
        autoHideMs={undoTimeoutMs}
        onUndo={undo}
        onClose={dismiss}
      />
    </Container>
  );
}

export default App;
