import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  open: boolean;
  imageUrl?: string;
  loading: boolean;
  onClose: () => void;
};

const DEFAULT_IMAGE = '/images/no-image.jpg';

export const ImagePreviewModal = ({
  open,
  imageUrl,
  loading,
  onClose,
}: Props) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
      }}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      }}
    >
      <DialogTitle sx={{ mb: 1 }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 5, top: 5, color: '#ffffff' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        onClick={onClose}
        sx={{
          minHeight: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          cursor: 'pointer',
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt="preview"
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxWidth: '100%',
              maxHeight: '70vh',
              objectFit: 'contain',
              borderRadius: '0px',
              cursor: 'default',
            }}
          />
        ) : (
          <>
            <Box
              component="img"
              src={DEFAULT_IMAGE}
              alt="no-image"
              sx={{
                width: 160,
                opacity: 0.6,
                mb: 2,
              }}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
