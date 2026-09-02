import React from 'react';
import { DateFieldProps } from '@mui/x-date-pickers';
import {
  DatePicker as DatePickerLib,
  DatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import {
  DISPLAY_DATE_FORMAT_PICKER,
  FORMAT_DATE_SERACH,
  VI_LOCALE,
} from '../../constants';
import { getSelectedLanguage } from '../../utils';

type Props = {
  isDefaultValue?: boolean;
} & DatePickerProps &
  DateFieldProps &
  React.RefAttributes<HTMLDivElement>;

export const DatePicker = ({
  isDefaultValue,
  ...props
}: Props) => {

  return (
    <DatePickerLib
      dayOfWeekFormatter={(date) =>
        date.format('dd')
      }
      {...props}
      format={
        getSelectedLanguage() === VI_LOCALE
          ? FORMAT_DATE_SERACH
          : DISPLAY_DATE_FORMAT_PICKER
      }
      slotProps={{
        toolbar: {
          sx: {
            display: 'none',
          },
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root.Mui-disabled': {
          background: '#e6e6e6',
          borderRadius: '11px',
        },
        '& .MuiOutlinedInput-input.Mui-disabled': {
          WebkitTextFillColor: '#000000',
        },
        ...(isDefaultValue && {
          '& .MuiOutlinedInput-root': {
            borderColor: '#00ff05',
            borderWidth: '1px',
          },
        }),
      }}
    />
  );
};