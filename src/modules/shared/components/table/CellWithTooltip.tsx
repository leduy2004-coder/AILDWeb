 
import { Box, Tooltip } from '@mui/material';

type CellWithTooltipProps = {
  value: string | number | null | undefined;
};

const CellWithTooltip: React.FC<CellWithTooltipProps> = ({ value }) => {
  const displayValue = value?.toString() ?? '';

  return (
    <Tooltip title={displayValue} arrow>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          lineHeight: '1.2',
        }}
      >
        {displayValue}
      </Box>
    </Tooltip>
  );
};

export default CellWithTooltip;
