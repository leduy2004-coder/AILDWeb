import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getErrorMessage, isError, setValues } from '@/modules/shared/utils';
import { string } from 'yup';
import { TFunction } from 'i18next';

export const createLoginSchema = (t: TFunction) =>
  yup.object({
    email: string()
      .required(t('common.validation.required', { fieldName: t('login.username.title') })),
    password: string().required(t('common.validation.required', { fieldName: t('login.password.title') })),
    // .matches(
    //   /^[a-zA-Z0-9!@#$%^&*()\-=+[\]{}|;:'",.<>?/]{8,32}$/,
    //   `${t('en.user.validation.password')}`,
    // ),
  });

export type LoginSchema = yup.InferType<ReturnType<typeof createLoginSchema>>;

export function useFormLogin() {
  const { t, i18n } = useTranslation();

  const schema = useMemo(() => createLoginSchema(t), [i18n.language]);

  const form = useForm<LoginSchema>({
    reValidateMode: 'onChange',
    mode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitted) {
      form.clearErrors();
      form.trigger();
    }
  }, [i18n.language]);

  return {
    ...form,
    setValues: setValues<LoginSchema>(form),
    isError: isError<LoginSchema>(form),
    getErrorMessage: getErrorMessage<LoginSchema>(form),
  };
}
