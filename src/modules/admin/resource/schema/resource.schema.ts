import { z } from 'zod';

export const getResourceSchema = (t: (key: string) => string) => {
  return z.object({
    title: z.string().min(1, { message: t('form.validation.titleRequired') }),
    url: z.string().min(1, { message: t('form.validation.urlRequired') }).url({ message: t('form.validation.urlInvalid') }),
    domainId: z.number({ message: t('form.validation.domainRequired') }).min(1, { message: t('form.validation.domainRequired') }),
    targetLevelId: z.number({ message: t('form.validation.levelRequired') }).min(1, { message: t('form.validation.levelRequired') }),
    description: z.string().optional(),
  });
};
