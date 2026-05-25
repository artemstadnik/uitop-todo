import { Box, Button, Typography, Checkbox } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';

interface Props {
  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  onToggleSelectAll: (checked: boolean) => void;
  onMarkDone: () => void;
  onClear: () => void;
}

export function BulkActionsBar({
  selectedCount,
  allSelected,
  onToggleSelectAll,
  onMarkDone,
  onClear,
}: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.5,
        mb: 1.5,
        borderRadius: 2,
        bgcolor: 'rgba(79, 70, 229, 0.08)',
        border: '1px solid rgba(79, 70, 229, 0.2)',
      }}
    >
      <Checkbox
        size="small"
        checked={allSelected}
        indeterminate={selectedCount > 0 && !allSelected}
        onChange={(e) => onToggleSelectAll(e.target.checked)}
        slotProps={{ input: { 'aria-label': 'select all tasks' } }}
      />
      <Typography variant="body2" sx={{ fontWeight: 600, flexGrow: 1 }}>
        {selectedCount} selected
      </Typography>
      <Button size="small" startIcon={<DoneAllIcon />} variant="contained" onClick={onMarkDone}>
        Mark done
      </Button>
      <Button size="small" onClick={onClear}>
        Clear
      </Button>
    </Box>
  );
}
