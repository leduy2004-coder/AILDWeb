import React, { useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Radio,
  FormHelperText,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuestion, useCreateQuestion, useUpdateQuestion } from '@/apis/question/hook';
import { toast } from 'react-toastify';
import { getQuestionSchema, QuestionFormValues } from '../../schema/question.schema';
import AIGenerateDialog from '../modal/AIGenerateDialog';
import ConfirmCloseDialog from '../modal/ConfirmCloseDialog';
import ExpandFieldModal from '../modal/ExpandFieldModal';

interface Props {
  open: boolean;
  onClose: () => void;
  questionId: number | null;
  onAIGenerate?: (data: any) => void;
  aiGeneratedData?: any;
  onClearAIData?: () => void;
}

export default function QuestionFormModal({ open, onClose, questionId, onAIGenerate, aiGeneratedData, onClearAIData }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_question' });
  const { t: tDomain } = useTranslation('translation', { keyPrefix: 'admin_overview.domain.name' });
  const { t: tLevel } = useTranslation('translation', { keyPrefix: 'admin_overview.level.name' });
  
  const isEdit = !!questionId;

  const [aiDialogOpen, setAiDialogOpen] = React.useState(false);
  const [confirmCloseOpen, setConfirmCloseOpen] = React.useState(false);
  const [hasUnsavedAIData, setHasUnsavedAIData] = React.useState(false);
  const [expandModalField, setExpandModalField] = React.useState<'content' | 'rubric' | null>(null);

  const schema = getQuestionSchema(t);

  const { control, handleSubmit, reset, watch, setValue, getValues, formState: { errors, isDirty } } = useForm<QuestionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: '',
      domainId: 1,
      levelId: 1,
      type: 'MULTIPLE_CHOICE',
      status: 'DRAFT',
      options: [
        { content: '', isCorrect: false, displayOrder: 1 },
        { content: '', isCorrect: false, displayOrder: 2 },
      ],
      correctOptionIndex: 0,
      rubric: '',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options'
  });

  const watchType = watch('type');
  const watchCorrectIndex = watch('correctOptionIndex');

  const { data: detailData, isLoading: isLoadingDetail } = useQuestion(questionId as number);
  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();

  useEffect(() => {
    if (open) {
      if (isEdit && detailData?.result) {
        const q = detailData.result;
        let correctIdx = null;
        const mappedOptions = q.options?.map((opt, idx) => {
          if (opt.isCorrect) correctIdx = idx;
          return {
            id: opt.id !== undefined && opt.id !== null ? Number(opt.id) : undefined,
            content: opt.content || '',
            isCorrect: Boolean(opt.isCorrect),
            displayOrder: opt.displayOrder !== null && opt.displayOrder !== undefined ? Number(opt.displayOrder) : idx + 1,
          };
        }) || [];

        reset({
          content: q.content,
          domainId: q.domainId,
          levelId: q.levelId,
          type: q.type as 'MULTIPLE_CHOICE' | 'PRACTICAL',
          status: q.status,
          rubric: q.rubric || '',
          options: mappedOptions,
          correctOptionIndex: correctIdx !== null ? Number(correctIdx) : null,
          difficultyIndex: q.difficultyIndex !== null && q.difficultyIndex !== undefined ? Number(q.difficultyIndex) : undefined,
        });
      } else if (!isEdit) {
        reset({
          content: '',
          domainId: 1,
          levelId: 1,
          type: 'MULTIPLE_CHOICE',
          status: 'DRAFT',
          options: [
            { content: '', isCorrect: false, displayOrder: 1 },
            { content: '', isCorrect: false, displayOrder: 2 },
          ],
          correctOptionIndex: 0,
          rubric: '',
          difficultyIndex: undefined,
        });
        setHasUnsavedAIData(false);
      }
    }
  }, [open, isEdit, detailData, reset]);

  useEffect(() => {
    if (aiGeneratedData && open) {
      const generatedData = aiGeneratedData.data || aiGeneratedData;
      const isDuplicate = aiGeneratedData.isDuplicate || false;

      let correctIdx = 0;
      const mappedOptions = generatedData.options?.map((opt: any, idx: number) => {
        const isCorrect = String(opt.isCorrect).toLowerCase() === 'true';
        if (isCorrect) correctIdx = idx;
        return {
          content: opt.content || '',
          isCorrect: isCorrect,
          displayOrder: opt.displayOrder !== undefined && opt.displayOrder !== null ? Number(opt.displayOrder) : idx + 1,
        };
      }) || [
        { content: '', isCorrect: false, displayOrder: 1 },
        { content: '', isCorrect: false, displayOrder: 2 },
      ];

      const currentValues = getValues();
      reset({
        ...currentValues,
        domainId: aiGeneratedData.originalDomainId ?? currentValues.domainId,
        levelId: aiGeneratedData.originalLevelId ?? currentValues.levelId,
        type: aiGeneratedData.originalType ?? currentValues.type,
        content: generatedData.content || '',
        rubric: generatedData.rubric || '',
        options: mappedOptions,
        correctOptionIndex: correctIdx,
        status: 'DRAFT', // Always DRAFT when AI generated
      });
      
      setHasUnsavedAIData(true);
      if (onClearAIData) onClearAIData();
    }
  }, [aiGeneratedData, open, reset, onClearAIData]);

  const onSubmit = (data: QuestionFormValues) => {
    const payload = {
      ...data,
      options: data.type === 'MULTIPLE_CHOICE' ? data.options?.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === data.correctOptionIndex,
        displayOrder: idx + 1,
      })) : []
    };

    if (isEdit) {
      updateMutation.mutate({ id: questionId!, data: payload as any }, {
        onSuccess: () => {
          toast.success(t('form.successEdit'));
          onClose();
        },
        onError: () => toast.error(t('form.error'))
      });
    } else {
      createMutation.mutate(payload as any, {
        onSuccess: () => {
          toast.success(t('form.successAdd'));
          onClose();
        },
        onError: () => toast.error(t('form.error'))
      });
    }
  };

  const handleStartAI = (appArea: string, notes: string) => {
    if (onAIGenerate) {
      const currentValues = watch();
      onAIGenerate({
        domainId: currentValues.domainId,
        levelId: currentValues.levelId,
        type: currentValues.type,
        applicationArea: appArea,
        notes: notes
      });
      setAiDialogOpen(false);
      onClose(); // Close the form while generating
    }
  };

  const handleCloseRequest = () => {
    if (isDirty || hasUnsavedAIData) {
      setConfirmCloseOpen(true);
    } else {
      onClose();
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return;
        handleCloseRequest();
      }} 
      PaperProps={{ sx: { width: { xs: '100%', sm: 600 } } }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        {/* Header */}
        <Box px={3} py={2} display="flex" alignItems="center" justifyContent="space-between" borderBottom="1px solid" borderColor="divider">
          <Typography variant="h6" fontWeight={600}>
            {isEdit ? t('form.editTitle') : t('form.addTitle')}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {!isEdit && (
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<Icon icon="solar:magic-stick-3-bold-duotone" />}
                onClick={() => setAiDialogOpen(true)}
                color="secondary"
              >
                {t('ai.generateButton')}
              </Button>
            )}
            <IconButton onClick={handleCloseRequest} size="small">
              <Icon icon="solar:close-circle-line-duotone" width={24} />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box p={3} flexGrow={1} overflow="auto">
          {isLoadingDetail && isEdit ? (
            <Box display="flex" justifyContent="center" mt={5}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={3}>
              {/* Domain */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>{t('form.domain')}</Typography>
                <Controller
                  name="domainId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.domainId}>
                      <Select {...field}>
                        <MenuItem value={1}>{tDomain('1')}</MenuItem>
                        <MenuItem value={2}>{tDomain('2')}</MenuItem>
                        <MenuItem value={3}>{tDomain('3')}</MenuItem>
                        <MenuItem value={4}>{tDomain('4')}</MenuItem>
                      </Select>
                      {errors.domainId && <FormHelperText>{errors.domainId.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Box>

              {/* Level */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>{t('form.level')}</Typography>
                <Controller
                  name="levelId"
                  control={control}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      color="primary"
                      value={field.value}
                      exclusive
                      onChange={(_, newVal) => { if (newVal !== null) field.onChange(newVal) }}
                      fullWidth
                    >
                      <ToggleButton value={1}>{tLevel('1')}</ToggleButton>
                      <ToggleButton value={2}>{tLevel('2')}</ToggleButton>
                      <ToggleButton value={3}>{tLevel('3')}</ToggleButton>
                    </ToggleButtonGroup>
                  )}
                />
              </Box>

              {/* Content */}
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="subtitle2" fontWeight={600}>{t('form.content')}</Typography>
                  <IconButton size="small" onClick={() => setExpandModalField('content')}>
                    <Icon icon="solar:maximize-square-line-duotone" width={18} />
                  </IconButton>
                </Box>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      placeholder={t('form.contentPlaceholder')}
                      error={!!errors.content}
                      helperText={errors.content?.message}
                      InputProps={{ sx: { p: 1 } }}
                    />
                  )}
                />
              </Box>


              {/* Type */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>{t('form.type')}</Typography>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      color="primary"
                      value={field.value}
                      exclusive
                      onChange={(_, newVal) => { if (newVal !== null) field.onChange(newVal) }}
                      fullWidth
                    >
                      <ToggleButton value="MULTIPLE_CHOICE">{t('types.MULTIPLE_CHOICE')}</ToggleButton>
                      <ToggleButton value="PRACTICAL">{t('types.PRACTICAL')}</ToggleButton>
                    </ToggleButtonGroup>
                  )}
                />
              </Box>

              {/* Difficulty Index */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>{t('form.difficultyIndex')}</Typography>
                <Controller
                  name="difficultyIndex"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      placeholder="0.00 - 1.00"
                      inputProps={{ min: 0, max: 1, step: 0.01 }}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === '' ? undefined : Number(val));
                      }}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Box>

              {/* Options for MULTIPLE_CHOICE */}
              {watchType === 'MULTIPLE_CHOICE' && (
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" fontWeight={600}>{t('form.optionsTitle')}</Typography>
                    <Typography variant="caption" color="textSecondary">{t('form.optionsCorrectHint')}</Typography>
                  </Box>
                  <Stack spacing={2}>
                    {fields.map((item, index) => (
                      <Box key={item.id} display="flex" alignItems="center" gap={1}>
                        <Radio
                          checked={watchCorrectIndex === index}
                          onChange={() => setValue('correctOptionIndex', index, { shouldValidate: true })}
                        />
                        <Controller
                          name={`options.${index}.content`}
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              {...field}
                              fullWidth
                              size="small"
                              placeholder={t('form.optionPlaceholder')}
                              error={!!error}
                              helperText={error?.message}
                            />
                          )}
                        />
                        <IconButton color="error" onClick={() => remove(index)} disabled={fields.length <= 2}>
                          <Icon icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Box>
                    ))}
                    {errors.options?.root?.message && <FormHelperText error>{errors.options.root.message}</FormHelperText>}
                    {/* Fallback in case RHF puts it directly on options */}
                    {errors.options?.message && <FormHelperText error>{errors.options.message}</FormHelperText>}
                    {errors.correctOptionIndex && <FormHelperText error>{errors.correctOptionIndex.message}</FormHelperText>}
                    
                    <Button
                      startIcon={<Icon icon="solar:add-circle-linear" />}
                      onClick={() => append({ content: '', isCorrect: false, displayOrder: fields.length + 1 })}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      {t('form.addOption')}
                    </Button>
                  </Stack>
                </Box>
              )}

              {/* Rubric for PRACTICAL */}
              {watchType === 'PRACTICAL' && (
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="subtitle2" fontWeight={600}>{t('form.rubric')}</Typography>
                    <IconButton size="small" onClick={() => setExpandModalField('rubric')}>
                      <Icon icon="solar:maximize-square-line-duotone" width={18} />
                    </IconButton>
                  </Box>
                  <Controller
                    name="rubric"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        placeholder={t('form.rubricPlaceholder')}
                        InputProps={{ sx: { p: 1 } }}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Box>
              )}

              {/* Status */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>{t('form.status')}</Typography>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <Select {...field}>
                        <MenuItem value="DRAFT">{t('status.DRAFT')}</MenuItem>
                        <MenuItem value="PUBLISHED">{t('status.PUBLISHED')}</MenuItem>
                        <MenuItem value="REJECTED">{t('status.REJECTED')}</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>

            </Stack>
          )}
        </Box>

        {/* Footer */}
        <Box px={3} py={2} borderTop="1px solid" borderColor="divider" display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={handleCloseRequest} color="inherit" disabled={isSaving}>
            {t('form.cancel')}
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary" disabled={isSaving || isLoadingDetail}>
            {isSaving ? <CircularProgress size={24} color="inherit" /> : t('form.save')}
          </Button>
        </Box>
      </Box>

      {/* Extracted Modals */}
      <AIGenerateDialog 
        open={aiDialogOpen} 
        onClose={() => setAiDialogOpen(false)} 
        onGenerate={handleStartAI} 
      />

      <ConfirmCloseDialog 
        open={confirmCloseOpen} 
        onClose={() => setConfirmCloseOpen(false)} 
        onConfirm={() => {
          setConfirmCloseOpen(false);
          onClose();
        }} 
      />

      {expandModalField && (
        <ExpandFieldModal
          open={Boolean(expandModalField)}
          onClose={() => setExpandModalField(null)}
          title={expandModalField === 'content' ? t('form.content') : t('form.rubric')}
          placeholder={expandModalField === 'content' ? t('form.contentPlaceholder') : t('form.rubricPlaceholder')}
          name={expandModalField}
          control={control}
        />
      )}
    </Drawer>
  );
}
