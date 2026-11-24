'use client';
import { ClipboardEvent, KeyboardEvent, useRef } from 'react';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';

interface OtpInputProps {
  /** One entry per box, '' when empty */
  value: string[];
  onChange: (value: string[]) => void;
  /** Called once every box is filled */
  onComplete?: (code: string) => void;
  disabled?: boolean;
  error?: boolean;
}

/** One box per digit: typing moves forward, Backspace moves back, pasting a code fills every box */
export default function OtpInput({ value, onChange, onComplete, disabled, error }: OtpInputProps) {
  const { t } = useTranslation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const length = value.length;

  const focusBox = (index: number) => {
    const target = inputRefs.current[Math.max(0, Math.min(index, length - 1))];
    target?.focus();
    target?.select();
  };

  const fillFrom = (startIndex: number, digits: string) => {
    const next = [...value];
    let index = startIndex;
    for (const digit of digits) {
      if (index >= length) break;
      next[index] = digit;
      index += 1;
    }
    onChange(next);
    focusBox(index);
    if (next.every(Boolean)) onComplete?.(next.join(''));
  };

  const handleChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      const next = [...value];
      next[index] = '';
      onChange(next);
      return;
    }
    // Typing into a filled box gives its old digit plus the new one: keep only the new one.
    // Anything longer comes from autofill (one-time-code) and fills the following boxes.
    const isOverwrite = digits.length === 2 && Boolean(value[index]);
    fillFrom(index, isOverwrite ? digits.replace(value[index], '') || digits[1] : digits);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !value[index] && index > 0) {
      event.preventDefault();
      const next = [...value];
      next[index - 1] = '';
      onChange(next);
      focusBox(index - 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    const digits = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!digits) return;
    event.preventDefault();
    fillFrom(index, digits);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1, sm: 1.5 } }}>
      {value.map((digit, index) => (
        <CustomTextField
          key={index}
          value={digit}
          disabled={disabled}
          error={error}
          autoFocus={index === 0}
          inputRef={(el: HTMLInputElement | null) => {
            inputRefs.current[index] = el;
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
          onPaste={(e: ClipboardEvent<HTMLInputElement>) => handlePaste(index, e)}
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
          inputProps={{
            inputMode: 'numeric',
            autoComplete: index === 0 ? 'one-time-code' : 'off',
            'aria-label': t('authFlow.verifyOtp.digitLabel', { index: index + 1 }),
            style: { textAlign: 'center', fontSize: 22, fontWeight: 600, padding: '12px 0' },
          }}
          sx={{ width: { xs: 44, sm: 52 } }}
        />
      ))}
    </Box>
  );
}
