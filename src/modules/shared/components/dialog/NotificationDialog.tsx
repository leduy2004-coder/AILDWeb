import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import { useSelector } from '@/store/hooks';
import { AppState } from '@/store/store';
import { useTranslation } from 'react-i18next';

export type NotificationDialogProps = {
  title?: string;
  description?: string;
  onAgree?: () => void;
};

export const NotificationDialog = ({
  title,
  description,
  onAgree,
}: NotificationDialogProps) => {
  const theme = useTheme();

  const customizer = useSelector((state: AppState) => state.customizer);

  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = () => {
    handleClose();
    onAgree?.();
  };
  const formattedDescription = description
    ? description.split('\n').map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ))
    : '';
  const { t } = useTranslation();
  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          sx={{
            color: theme.palette.primary.contrastText,
            background:
              customizer.activeTheme === 'LINEAR_THEME'
                ? 'linear-gradient(to right, #0067B3, #0095DA, #00ADEF)'
                : theme.palette.primary.main,
          }}
          mb={2}
          id="alert-dialog-title"
        >
          {title}
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <DialogContentText id="alert-dialog-description">
            {formattedDescription}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button variant="contained" onClick={handleAgree} autoFocus>
            {t('button.ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
