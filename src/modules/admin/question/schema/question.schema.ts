import { z } from 'zod';

export const getQuestionSchema = (t: (key: string, options?: any) => string) => {
  return z.object({
    content: z.string().optional(),
    domainId: z.number({ message: t('form.validation.domainRequired') }),
    levelId: z.number({ message: t('form.validation.levelRequired') }),
    type: z.enum(['MULTIPLE_CHOICE', 'PRACTICAL']),
    rubric: z.string().optional(),
    status: z.string(),
    options: z.array(
      z.object({
        id: z.number().optional(),
        content: z.string().optional(),
        isCorrect: z.boolean(),
        displayOrder: z.number()
      })
    ).optional(),
    correctOptionIndex: z.number().nullable().optional(),
    difficultyIndex: z.number().nullable().optional(),
  }).superRefine((data, ctx) => {
    if (data.status === 'PUBLISHED') {
      if (!data.content || data.content.trim() === '') {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('form.validation.contentRequired'), path: ['content'] });
      }
      if (data.difficultyIndex === null || data.difficultyIndex === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('form.validation.difficultyRequired'), path: ['difficultyIndex'] });
      }
      if (data.type === 'MULTIPLE_CHOICE') {
        if (!data.options || data.options.length < 2) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('form.validation.optionsRequired'), path: ['options'] });
        } else {
          data.options.forEach((opt, idx) => {
            if (!opt.content || opt.content.trim() === '') {
              ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('form.validation.contentRequired'), path: ['options', idx, 'content'] });
            }
          });
        }
        if (data.correctOptionIndex === null || data.correctOptionIndex === undefined) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('form.validation.oneCorrectRequired'), path: ['correctOptionIndex'] });
        }
      }
      if (data.type === 'PRACTICAL') {
        if (!data.rubric || data.rubric.trim() === '') {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('form.validation.contentRequired'), path: ['rubric'] });
        }
      }
    }
  });
};

// Dummy schema for type inference
const dummySchema = getQuestionSchema((key) => key);
export type QuestionFormValues = z.infer<typeof dummySchema>;
