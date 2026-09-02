import { GridLocaleText } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

export function useTableLocale(): Partial<GridLocaleText> {
  const { t } = useTranslation();

  return {
    paginationDisplayedRows: ({ from, to, count }) => {
      to = isNaN(to) ? 0 : to;
      from = to > 0 ? from : to;

      return `${from} - ${to} ${t('label.of')} ${
        count === -1
          ? `${t('label.more_than')} ${to}`
          : count ?? 0
      } ${t('label.rows')}`;
    },

    paginationRowsPerPage: t('label.row_of_page'),

    noRowsLabel: t('label.no_data'),

    noResultsOverlayLabel: t('label.no_data'),

    footerRowSelected: () => '',
  };
}