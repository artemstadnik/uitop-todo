import { Alert, Button } from '@mui/material';

interface Props {
  message: string;
  onRetry?: () => void;
}

export function ErrorBox({ message, onRetry }: Props) {
  return (
    <Alert
      severity="error"
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        ) : undefined
      }
    >
      {message}
    </Alert>
  );
}
