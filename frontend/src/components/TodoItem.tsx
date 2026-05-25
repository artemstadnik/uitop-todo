import {
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Chip,
  Box,
} from '@mui/material';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

import type { Todo } from '../types';

interface Props {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <ListItem
      divider
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(todo)}
        >
          <DeleteOutlineIcon />
        </IconButton>
      }
    >
      <Checkbox
        edge="start"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
      />

      <ListItemText
        primary={
          <Box
            component="span"
            sx={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? 'text.disabled' : 'text.primary',
            }}
          >
            {todo.text}
          </Box>
        }
      />

      <Chip
        label={todo.categoryName}
        size="small"
        variant="outlined"
        sx={{ mr: 5 }}
      />
    </ListItem>
  );
}
