import { TextField, MenuItem, InputAdornment } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
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
      size="small"
      value={value === 'all' ? 'all' : String(value)}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === 'all' ? 'all' : Number(v));
      }}
      sx={{ minWidth: 190 }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <FilterListIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </InputAdornment>
          ),
        },
      }}
    >
      <MenuItem value="all">All categories</MenuItem>
      {categories.map((c) => (
        <MenuItem key={c.id} value={String(c.id)}>
          {c.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
