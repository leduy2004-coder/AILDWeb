import { z } from 'zod';
import { TFunction } from 'i18next';

export const getDomainSchema = (t: TFunction) =>
  z.object({
    code: z.string().min(1, t('validation.codeRequired', 'Vui lòng nhập mã')),
    name: z.string().min(1, t('validation.nameRequired', 'Vui lòng nhập tên')),
    description: z.string().optional(),
    displayOrder: z.coerce.number().min(1, t('validation.orderRequired', 'Vui lòng nhập thứ tự hiển thị')),
  });

export type DomainFormValues = z.infer<ReturnType<typeof getDomainSchema>>;

export const getLevelSchema = (t: TFunction) =>
  z.object({
    code: z.string().min(1, t('validation.codeRequired', 'Vui lòng nhập mã')),
    name: z.string().min(1, t('validation.nameRequired', 'Vui lòng nhập tên')),
    displayOrder: z.coerce.number().min(1, t('validation.orderRequired', 'Vui lòng nhập thứ tự hiển thị')),
  });

export type LevelFormValues = z.infer<ReturnType<typeof getLevelSchema>>;
