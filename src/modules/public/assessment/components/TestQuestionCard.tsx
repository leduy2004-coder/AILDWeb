import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Paper,
  Chip,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IconShieldCheck } from '@tabler/icons-react';
import { IOptionDto } from '@/apis/assessment/assessment.api';

interface TestQuestionCardProps {
  domainName: string;
  levelName: string;
  content: string;
  type?: string;
  options: IOptionDto[];
  onNext: (selectedOptionId: number | null, answerText?: string) => void;
  isSubmitting: boolean;
}

export const TestQuestionCard: React.FC<TestQuestionCardProps> = ({
  domainName,
  levelName,
  content,
  type,
  options,
  onNext,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState<string>('');

  const handleNextClick = () => {
    onNext(selectedValue, answerText);
    setSelectedValue(null); // Reset for next question
    setAnswerText('');
  };

  const isNextDisabled = isSubmitting || (type === 'PRACTICAL' ? !answerText.trim() : !selectedValue);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Chip
          icon={<IconShieldCheck size={16} />}
          label={`${domainName} • ${levelName}`}
          sx={{
            backgroundColor: '#CCFBF1',
            color: '#0F766E',
            fontWeight: 700,
            borderRadius: '8px',
            '& .MuiChip-icon': {
              color: '#0F766E',
            },
          }}
        />
      </Box>

      <Typography variant="h5" fontWeight={700} color="text.primary" mb={4} sx={{ lineHeight: 1.5 }}>
        {content}
      </Typography>

      {type === 'PRACTICAL' ? (
        <TextField
          fullWidth
          multiline
          minRows={4}
          variant="outlined"
          placeholder={t('assessment.essayPlaceholder', 'Nhập câu trả lời của bạn vào đây...')}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          }}
        />
      ) : (
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            value={selectedValue}
            onChange={(e) => setSelectedValue(Number(e.target.value))}
          >
            {options.map((option) => (
              <Paper
                key={option.id}
                elevation={0}
                sx={{
                  mb: 2,
                  p: 1.5,
                  border: '1px solid',
                  borderColor: selectedValue === option.id ? '#1E3A8A' : '#E2E8F0',
                  backgroundColor: selectedValue === option.id ? '#EFF6FF' : '#FFFFFF',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#1E3A8A',
                    backgroundColor: '#EFF6FF',
                  },
                }}
                onClick={() => setSelectedValue(option.id)}
              >
                <FormControlLabel
                  value={option.id}
                  control={<Radio color="primary" />}
                  label={
                    <Typography variant="body1" color="text.primary" sx={{ fontWeight: selectedValue === option.id ? 600 : 400 }}>
                      {option.content}
                    </Typography>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>
            ))}
          </RadioGroup>
        </FormControl>
      )}

      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextClick}
          disabled={isNextDisabled}
          sx={{ px: 4, py: 1.2, borderRadius: '8px', fontWeight: 700, textTransform: 'none' }}
        >
          {t('assessment.nextQuestion', 'Câu tiếp theo')}
        </Button>
      </Box>
    </Paper>
  );
};
