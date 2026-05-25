import { ListItem, ListItemText, Checkbox, IconButton, Chip, Box } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import type { Todo } from '../types';

interface Props {
  todo: Todo;
  selected: boolean;
  onSelect: (id: number, selected: boolean) => void;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function TodoItem({ todo, selected, onSelect, onToggle, onDelete }: Props) {
  return (
    <ListItem
      divider
      sx={{ borderRadius: 2, bgcolor: selected ? 'rgba(79, 70, 229, 0.04)' : 'transparent' }}
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={() => onDelete(todo)}>
          <DeleteOutlinedIcon />
        </IconButton>
      }
    >
      <Checkbox
        edge="start"
        checked={selected}
        onChange={(e) => onSelect(todo.id, e.target.checked)}
        slotProps={{ input: { 'aria-label': 'select task' } }}
      />

      <ListItemText
        onClick={() => onToggle(todo)}
        sx={{ cursor: 'pointer', userSelect: 'none' }}
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
      <Chip label={todo.categoryName} size="small" variant="outlined" sx={{ mr: 5 }} />
    </ListItem>
  );
}
