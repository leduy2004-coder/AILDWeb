import { z } from 'zod';

export const getUploadDocumentSchema = (t: (key: string) => string) => {
  return z.object({
    title: z.string().max(200, { message: t('upload.validation.titleMax') }).optional(),
    sourceName: z.string().max(200, { message: t('upload.validation.sourceNameMax') }).optional(),
    publishedYear: z
      .number({ message: t('upload.validation.yearInvalid') })
      .int({ message: t('upload.validation.yearInvalid') })
      .min(1900, { message: t('upload.validation.yearInvalid') })
      .max(2100, { message: t('upload.validation.yearInvalid') })
      .optional(),
  });
};

export type UploadDocumentFormValues = z.infer<ReturnType<typeof getUploadDocumentSchema>>;
