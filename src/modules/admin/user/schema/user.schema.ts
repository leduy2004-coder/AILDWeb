import { z } from 'zod';

export const getUserSchema = (t: (key: string) => string, isEdit?: boolean) => {
  return z.object({
    name: z.string().min(1, { message: t('form.validation.nameRequired') }),
    email: isEdit
      ? z.string().optional()
      : z
          .string()
          .min(1, { message: t('form.validation.emailRequired') })
          .email({ message: t('form.validation.emailInvalid') }),
    password: isEdit
      ? z
          .string()
          .optional()
          .refine((val) => !val || val === '********' || val.length >= 6, {
            message: t('form.validation.passwordMin'),
          })
      : z
          .string()
          .min(1, { message: t('form.validation.passwordRequired') })
          .min(6, { message: t('form.validation.passwordMin') }),
    roleCode: z.string().min(1, { message: t('form.validation.roleRequired') }),
    status: z.boolean(),
  });
};

export type UserFormValues = z.infer<ReturnType<typeof getUserSchema>>;
