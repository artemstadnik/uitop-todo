import { useForm, Controller } from 'react-hook-form';
import { Box, TextField, MenuItem, Button } from '@mui/material';
import type { Category, CreateTodoInput } from '../types';

interface Props {
  categories: Category[];
  onCreate: (input: CreateTodoInput) => Promise<void>;
}

interface FormValues {
  text: string;
  categoryId: string;
}

export function TodoForm({ categories, onCreate }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { text: '', categoryId: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await onCreate({ text: values.text.trim(), categoryId: Number(values.categoryId) });
      reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError('categoryId', { type: 'server', message });
    }
  });

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        mb: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5,
        alignItems: 'flex-start',
      }}
    >
      <Controller
        name="text"
        control={control}
        rules={{
          required: 'Task text is required',
          maxLength: { value: 200, message: 'Max 200 characters' },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Task"
            size="small"
            fullWidth
            error={!!errors.text}
            helperText={errors.text?.message}
          />
        )}
      />

      <Controller
        name="categoryId"
        control={control}
        rules={{ required: 'Select a category' }}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Category"
            size="small"
            sx={{ minWidth: { xs: '100%', sm: 160 } }}
            error={!!errors.categoryId}
            helperText={errors.categoryId?.message}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={String(c.id)}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ height: 40, px: 3 }}>
        Add
      </Button>
    </Box>
  );
}