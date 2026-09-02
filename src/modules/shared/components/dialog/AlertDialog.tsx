import React, { useMemo } from 'react';
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

export type AlertDialogProps = {
  title?: string;
  description?: string;
  isBreakClose?: boolean;
  onDisagree?: () => void;
  onAgree?: () => void;
  isHide?: boolean;
};

export const AlertDialog = ({
  title,
  description,
  isBreakClose,
  onDisagree,
  onAgree,
  isHide,
}: AlertDialogProps) => {
  const theme = useTheme();

  // OPTIMIZATION: Only select the specific value needed instead of entire customizer object
  const activeTheme = useSelector(
    (state: AppState) => state.customizer.activeTheme,
  );

  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDisagree = () => {
    if (!isBreakClose) {
      handleClose();
    }
    onDisagree?.();
  };

  const handleAgree = () => {
    if (!isBreakClose) {
      handleClose();
    }
    onAgree?.();
  };
  // OPTIMIZATION: Memoize description formatting to avoid recalculation on each render
  const formattedDescription = useMemo(() => {
    return description
      ? description.split('\n').map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ))
      : '';
  }, [description]);

  // OPTIMIZATION: Memoize background style calculation
  const titleBackground = useMemo(() => {
    return activeTheme === 'LINEAR_THEME'
      ? 'linear-gradient(to right, #0067B3, #0095DA, #00ADEF)'
      : theme.palette.primary.main;
  }, [activeTheme, theme.palette.primary.main]);
  const { t } = useTranslation();
  return (
    <>
      <Dialog
        open={open}
        onClose={handleDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        transitionDuration={0}
      >
        <DialogTitle
          sx={{
            color: theme.palette.primary.contrastText,
            background: titleBackground,
          }}
          mb={2}
          id="alert-dialog-title"
        >
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {formattedDescription}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ color: theme.palette.text.primary }}
            variant="outlined"
            color="secondary"
            onClick={handleDisagree}
          >
            {t('common.popup_confirm.button.close')}
          </Button>
          {!isHide && (
            <Button variant="contained" onClick={handleAgree} autoFocus>
              {t('common.popup_confirm.button.agree')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
