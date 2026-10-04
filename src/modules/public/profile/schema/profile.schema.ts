import { z } from 'zod';
import { TFunction } from 'i18next';

export const getProfileSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('profile.validation.nameRequired', 'Vui lòng nhập họ và tên')),
    age: z.coerce
      .number({ message: t('profile.validation.ageInvalid', 'Vui lòng nhập tuổi hợp lệ') })
      .min(1, t('profile.validation.ageMin', 'Tuổi không hợp lệ'))
      .max(100, t('profile.validation.ageMax', 'Tuổi không hợp lệ'))
      .optional()
      .or(z.literal('')),
    major: z.string().optional().or(z.literal('')),
  });

export type ProfileFormValues = {
  name: string;
  age?: number | '';
  major?: string;
};
