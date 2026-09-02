import { TableContainer } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import type { DataGridProps } from '@mui/x-data-grid';
import { CSSProperties } from 'react';

import { useTableLocale } from '../../hooks';
import { CustomNoResultOverlay } from './NoRowsOverlay';
import { CustomDataGrid } from './styled';

type SimpleTableProps<T> = {
  columns: GridColDef[];
  rows: T[];
  isShowToolbar?: boolean;
  containerStyle?: CSSProperties;
} & Partial<Omit<DataGridProps, 'pagination'>>;

export function SimpleTable<T>({
  columns,
  rows,
  containerStyle,
  ...props
}: SimpleTableProps<T>) {
  const localeText = useTableLocale();

  return (
    <TableContainer style={containerStyle}>
      <CustomDataGrid
        showCellVerticalBorder
        hideFooterPagination
        disableColumnMenu
        disableRowSelectionOnClick
        columns={columns}
        rows={rows}
        rowHeight={42}
        localeText={localeText}
        {...props}
        autoHeight={rows.length > 0}
        slots={{
          noRowsOverlay: CustomNoResultOverlay,
          noResultsOverlay: CustomNoResultOverlay,
          ...props.slots,
        }}
      />
    </TableContainer>
  );
}
