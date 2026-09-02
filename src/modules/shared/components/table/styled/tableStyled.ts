import { styled } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';

export const CustomDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-toolbarContainer': {
    marginBottom: '10px',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: '800',
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: theme.palette.grey[300], // Custom background color using the primary color from the theme
    color: theme.palette.primary.main,
    borderColor: theme.palette.grey[100],
    borderWidth: 1,

    '&:focus-within': {
      outline: 'none', // Remove the outline when column header is focused
    },
  },
  '& .MuiDataGrid-cell': {
    borderColor: theme.palette.grey[100],
    borderWidth: 1,
    padding: '0 8px',

    overflow: 'unset',
    whiteSpace: 'unset',
    lineHeight: 'unset',
    display: 'flex',
    alignItems: 'center',

    '&:focus': {
      outline: 'none', // Remove the outline when column header is focused
    },

    '&:focus-within': {
      outline: 'none', // Remove the outline when column header is focused
    },

    '&.dis-editable': {
      backgroundColor: '#f1f1f1',
    },
  },
  '& .MuiDataGrid-overlayWrapper': {
    minHeight: '300px',
  },
  '& .MuiDataGrid-cell--editing': {
    '&:focus-within': {
      outline: 'none !important',
    },
  },
  '& .MuiDataGrid-cell--editable': {
    '& input': {
      borderColor: theme.palette.primary.main,
      backgroundColor: 'white',
      borderWidth: '1.5px',
      borderStyle: 'solid',
    },
  },
  '& .MuiDataGrid-row:hover': {
    '& .MuiDataGrid-cell': {
      backgroundColor: '#d1d1d1 !important',
    },
  },

  '& .MuiTablePagination-input': {
    display: 'flex !important',
    alignItems: 'center',
  },
}));
