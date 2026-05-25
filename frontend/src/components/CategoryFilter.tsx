import { TextField, MenuItem } from '@mui/material';
import type { Category } from '../types';
import type { CategoryFilter as Filter } from '../hooks/useTodos';

interface Props {
  categories: Category[];
  value: Filter;
  onChange: (value: Filter) => void;
}

export function CategoryFilter({ categories, value, onChange }: Props) {
  return (
    <TextField
      select
      label="Filter by category"
      size="small"
      value={value === 'all' ? 'all' : String(value)}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === 'all' ? 'all' : Number(v));
      }}
      sx={{ minWidth: 200, mb: 2 }}
    >
      <MenuItem value="all">All</MenuItem>
      {categories.map((c) => (
        <MenuItem key={c.id} value={String(c.id)}>
          {c.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
