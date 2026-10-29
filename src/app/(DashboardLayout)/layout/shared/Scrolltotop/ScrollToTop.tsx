'use client';

import { Box, Fab, Tooltip, Zoom, useScrollTrigger } from '@mui/material';
import { IconChevronUp } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export function ScrollTop() {
  const { t } = useTranslation();
  // Only show once the user has scrolled down a bit, nothing to go back to at the top
  const visible = useScrollTrigger({ disableHysteresis: true, threshold: 300 });

  const handleTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={visible}>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, md: 20 },
          right: { xs: 16, md: 26 },
          zIndex: 1000,
        }}
      >
        <Tooltip title={t('button.back_to_top')}>
          <Fab
            color="primary"
            aria-label={t('button.back_to_top')}
            onClick={handleTop}
            sx={{ width: { xs: 44, md: 48 }, height: { xs: 44, md: 48 } }}
          >
            <IconChevronUp stroke={2} />
          </Fab>
        </Tooltip>
      </Box>
    </Zoom>
  );
}
