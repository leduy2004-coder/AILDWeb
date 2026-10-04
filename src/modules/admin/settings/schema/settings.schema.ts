import { z } from 'zod';
import { SETTING_KEYS } from '../constants/settings.constant';

export const getSettingsSchema = (t: (key: string) => string) => {
  return z.object({
    [SETTING_KEYS.CHAT_MAX_TURNS]: z.coerce
      .number({ message: t('admin_settings.validation.chat_max_turns.invalid') })
      .min(1, { message: t('admin_settings.validation.chat_max_turns.min') })
      .max(20, { message: t('admin_settings.validation.chat_max_turns.max') }),
    
    [SETTING_KEYS.CHAT_SYSTEM_PROMPT]: z
      .string()
      .min(1, { message: t('admin_settings.validation.chat_system_prompt.required') })
      .max(2000, { message: t('admin_settings.validation.chat_system_prompt.maxLength') }),
      
    [SETTING_KEYS.MCQ_WEIGHT]: z.coerce
      .number({ message: t('admin_settings.validation.mcq_weight.invalid') })
      .min(0, { message: t('admin_settings.validation.mcq_weight.min') })
      .max(1, { message: t('admin_settings.validation.mcq_weight.max') }),
      
    [SETTING_KEYS.INTERVIEW_WEIGHT]: z.coerce
      .number({ message: t('admin_settings.validation.interview_weight.invalid') })
      .min(0, { message: t('admin_settings.validation.interview_weight.min') })
      .max(1, { message: t('admin_settings.validation.interview_weight.max') }),
      
    [SETTING_KEYS.ASSESSMENT_QUESTION_COUNT]: z.coerce
      .number({ message: t('admin_settings.validation.question_count.invalid') })
      .min(5, { message: t('admin_settings.validation.question_count.min') })
      .max(50, { message: t('admin_settings.validation.question_count.max') }),
      
    [SETTING_KEYS.ASSESSMENT_DURATION_MINUTES]: z.coerce
      .number({ message: t('admin_settings.validation.duration_minutes.invalid') })
      .min(5, { message: t('admin_settings.validation.duration_minutes.min') })
      .max(180, { message: t('admin_settings.validation.duration_minutes.max') }),
  }).refine(
    (data) => {
      const sum = data[SETTING_KEYS.MCQ_WEIGHT] + data[SETTING_KEYS.INTERVIEW_WEIGHT];
      return Math.abs(sum - 1.0) < 0.0001;
    },
    {
      message: t('admin_settings.validation.weights_sum'),
      path: [SETTING_KEYS.INTERVIEW_WEIGHT],
    }
  );
};

export type SettingsFormValues = z.infer<ReturnType<typeof getSettingsSchema>>;
