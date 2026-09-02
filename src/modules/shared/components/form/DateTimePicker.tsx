import React from 'react';
import {
  DateTimePicker as DateTimePickerLib,
  DateTimePickerProps,
} from '@mui/x-date-pickers/DateTimePicker';

import { DISPLAY_DATE_TIME_FORMAT_PICKER } from '../../constants';

type Props = {
  isDefaultValue?: boolean;
} & DateTimePickerProps;

export const DateTimePicker = ({
  isDefaultValue,
  ...props
}: Props) => {
  return (
    <DateTimePickerLib
      dayOfWeekFormatter={(date) => date.format('dd')}
      {...props}
      format={DISPLAY_DATE_TIME_FORMAT_PICKER}
      ampm={false}
      slotProps={{
        toolbar: {
          sx: {
            display: 'none',
          },
        },
        ...props.slotProps,
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
        ...props.sx,
      }}
    />
  );
};