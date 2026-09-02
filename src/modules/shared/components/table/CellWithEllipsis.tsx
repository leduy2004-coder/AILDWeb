import { useMemo } from 'react';
import { Tooltip } from '@mui/material';

interface CellWithEllipsisProps {
  value?: string | number | null;
  sx?: React.CSSProperties;
}

const CellWithEllipsis = ({ value, sx }: CellWithEllipsisProps) => {
  const displayValue = useMemo(() => value?.toString() ?? '', [value]);

  const defaultStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    fontSize: '13px',
    lineHeight: '1.2',
    minWidth: 0,
    maxWidth: '100%',
    verticalAlign: 'middle',
  };

  return (
    <Tooltip title={displayValue} arrow>
      <div style={{ ...defaultStyle, ...sx }}>{displayValue}</div>
    </Tooltip>
  );
};

export default CellWithEllipsis;
