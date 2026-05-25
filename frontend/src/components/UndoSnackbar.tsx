import { Snackbar, Button } from '@mui/material';

interface Props {
  open: boolean;
  message: string;
  autoHideMs: number;
  onUndo: () => void;
  onClose: () => void;
}

export function UndoSnackbar({ open, message, autoHideMs, onUndo, onClose }: Props) {
  return (
    <Snackbar
      open={open}
      message={message}
      autoHideDuration={autoHideMs}
      onClose={(_e, reason) => {
        if (reason === 'clickaway') return;
        onClose();
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      action={
        <Button color="secondary" size="small" onClick={onUndo}>
          UNDO
        </Button>
      }
    />
  );
}
