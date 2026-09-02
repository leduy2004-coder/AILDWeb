import { Checkbox, TableContainer } from '@mui/material';
import { GridColDef, GridSortModel, GridToolbar, DataGridProps } from '@mui/x-data-grid';

import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE,
  // ColumnMenuLocale,
} from '../../constants';
import { CustomNoResultOverlay } from './NoRowsOverlay';
import { CustomDataGrid } from './styled';
import { useTableLocale } from '../../hooks';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { useMemo, useCallback } from 'react';
import { AnyType } from '@/types/shared';

type TableProps<T> = {
  columns: GridColDef[];
  rows: T[];
  isShowToolbar?: boolean;
  onSortModelChange?: (sortModel: GridSortModel) => void;
} & Partial<Omit<DataGridProps, 'pagination'>>;

export function Table<T>({
  columns,
  rows,
  isShowToolbar = false,
  onSortModelChange,
  ...props
}: TableProps<T>) {
  const { t } = useTranslation();

  const ColumnMenuLocale = {
    columnMenuSortAsc: t('column_menu_locale.column_menu_sort_asc'),
    columnMenuSortDesc: t('column_menu_locale.column_menu_sort_desc'),
    columnMenuFilter: t('column_menu_locale.column_menu_filter'),
    columnMenuHideColumn: t('column_menu_locale.column_menu_hide_column'),
    columnMenuManageColumns: t('column_menu_locale.column_menu_manage_columns'),
  };
  const localeTextTable = useTableLocale();
  const localizedTextsMap = ColumnMenuLocale;
  const localeText = { ...localeTextTable, ...localizedTextsMap };

  const handleSortModelChange = (model: GridSortModel) => {
    onSortModelChange?.(model);
  };

  const {
    sx,
    isRowSelectable,
    slots: externalSlots,
    rowSelectionModel,
    checkboxSelection,
    onRowClick,
    getRowId,
    ...otherProps
  } = props;

  const resolveRowId = useCallback(
    (row: T) => {
      if (getRowId) {
        return getRowId(row);
      }

      return (row as AnyType).id;
    },
    [getRowId],
  );

  const isAllRowsDisabled = useMemo(() => {
    if (!isRowSelectable || rows.length === 0) return false;
    return rows.every((row) => {
      return !isRowSelectable({
        row,
        id: resolveRowId(row),
        model: row,
      } as AnyType);
    });
  }, [rows, isRowSelectable, resolveRowId]);

  // Calculate pagination-aware selection state for header checkbox
  const headerCheckboxState = useMemo(() => {
    if (!checkboxSelection || rows.length === 0) {
      return { checked: false, indeterminate: false };
    }

    const selectionSet = new Set(
      Array.isArray(rowSelectionModel)
        ? rowSelectionModel.map((id) => String(id))
        : [],
    );

    // Get selectable rows on current page
    const selectableRows = rows.filter((row) => {
      if (!isRowSelectable) return true;
      return isRowSelectable({
        row,
        id: resolveRowId(row),
        model: row,
      } as AnyType);
    });

    if (selectableRows.length === 0) {
      return { checked: false, indeterminate: false };
    }

    // Count how many selectable rows on current page are selected
    const selectedOnPage = selectableRows.filter((row) =>
      selectionSet.has(String(resolveRowId(row))),
    ).length;

    const allSelected = selectedOnPage === selectableRows.length;
    const someSelected = selectedOnPage > 0 && !allSelected;

    return {
      checked: allSelected,
      indeterminate: someSelected,
    };
  }, [
    rows,
    rowSelectionModel,
    isRowSelectable,
    checkboxSelection,
    resolveRowId,
  ]);

  // Custom checkbox component to properly handle indeterminate state
  const CustomBaseCheckbox = useCallback(
    (checkboxProps: AnyType) => {
      const {
        indeterminate: _originalIndeterminate,
        checked: _originalChecked,
        ...rest
      } = checkboxProps;

      // Header checkbox has indeterminate prop explicitly set (true or false), row checkboxes don't
      const isHeaderCheckbox = _originalIndeterminate !== undefined;

      if (isHeaderCheckbox) {
        // For header checkbox, use our calculated state
        if (isAllRowsDisabled) {
          return <Checkbox checked={false} disabled={true} />;
        }
        return (
          <Checkbox
            checked={headerCheckboxState.checked}
            indeterminate={headerCheckboxState.indeterminate}
            {...rest}
          />
        );
      }

      // For row checkboxes, use original props
      return (
        <Checkbox
          indeterminate={_originalIndeterminate}
          checked={_originalChecked}
          {...rest}
        />
      );
    },
    [headerCheckboxState, isAllRowsDisabled],
  );

  return (
    <Stack display="grid" gap={1}>
      <TableContainer>
        <CustomDataGrid
          disableRowSelectionOnClick
          disableColumnMenu
          showCellVerticalBorder
          filterMode="server"
          paginationMode="server"
          sortingMode={onSortModelChange ? 'server' : 'client'}
          onSortModelChange={handleSortModelChange || ''}
          columns={columns}
          rows={rows}
          pageSizeOptions={PAGE_SIZE}
          pagination
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: DEFAULT_PAGE_SIZE },
            },
          }}
          {...otherProps}
          getRowId={getRowId}
          rowSelectionModel={checkboxSelection ? rowSelectionModel : undefined}
          autoHeight={rows.length > 0}
          rowHeight={42}
          localeText={localeText}
          checkboxSelection={!!checkboxSelection}
          rowSelection={!!checkboxSelection}
          onRowClick={onRowClick}
          keepNonExistentRowsSelected
          isRowSelectable={isRowSelectable}
          slots={{
            noRowsOverlay: CustomNoResultOverlay,
            noResultsOverlay: CustomNoResultOverlay,
            toolbar: isShowToolbar ? GridToolbar : undefined,
            baseCheckbox: CustomBaseCheckbox,
            ...externalSlots,
          }}
          sx={{
            ...sx,
            '& .MuiDataGrid-row': {
              minHeight: '42px !important',
            },
            '& .MuiDataGrid-cell': {
              minHeight: '42px !important',
            },
            ...(isAllRowsDisabled
              ? {
                  '& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root': {
                    color: '#00000042',
                    pointerEvents: 'none',
                    '&.Mui-checked': {
                      color: '#00000042',
                    },
                  },
                }
              : {}),
          }}
        />
      </TableContainer>
    </Stack>
  );
}
