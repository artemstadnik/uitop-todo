import { List, Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import type { Todo } from '../types';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  selectedIds: Set<number>;
  onSelect: (id: number, selected: boolean) => void;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function TodoList({ todos, selectedIds, onSelect, onToggle, onDelete }: Props) {
  if (todos.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 6 }}>
        <InboxIcon sx={{ fontSize: 48, opacity: 0.5 }} />
        <Typography sx={{ mt: 1 }}>No tasks yet</Typography>
      </Box>
    );
  }

  return (
    <List>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selected={selectedIds.has(todo.id)}
          onSelect={onSelect}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
}
