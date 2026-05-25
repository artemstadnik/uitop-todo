import { Container, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useTodos } from './hooks/useTodos';
import { usePendingAction } from './hooks/usePendingAction';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { CategoryFilter } from './components/CategoryFilter';
import { UndoSnackbar } from './components/UndoSnackbar';
import { Loader } from './components/states/Loader';
import { ErrorBox } from './components/states/ErrorBox';
import { createTodo, updateTodoStatus, deleteTodo } from './api/todos';
import type { CreateTodoInput, Todo } from './types';

function App() {
  const { todos, setTodos, categories, filter, setFilter, loading, error, reload } = useTodos();
  const { pending, schedule, undo, dismiss, undoTimeoutMs } = usePendingAction();

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

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Todo Manager
      </Typography>

      <TodoForm categories={categories} onCreate={handleCreate} />

      <CategoryFilter categories={categories} value={filter} onChange={setFilter} />

      <Paper variant="outlined" sx={{ p: 1 }}>
        {loading && <Loader />}
        {!loading && error && <ErrorBox message={error} onRetry={reload} />}
        {!loading && !error && (
          <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
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
