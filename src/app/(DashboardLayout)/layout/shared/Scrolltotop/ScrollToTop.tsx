import { Fab, Tooltip } from '@mui/material';
import { IconChevronUp } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export function ScrollTop() {
  const handleTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const { t } = useTranslation();
  return (
    <>
      <Tooltip title={t('button.back_to_top')}>
        <Fab
          style={{
            color: 'primary',
            position: 'fixed',
            bottom: 20,
            right: 26,
            zIndex: 1300,
          }}
          onClick={handleTop}
        >
          <IconChevronUp stroke={2} />
        </Fab>
      </Tooltip>
    </>
  );
}
