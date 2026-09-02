// src/modules/shared/utils/toastHelper.ts
import { toast } from 'react-toastify';
import CustomToast from './CustomToast/CustomToast';
import React from 'react';

export const showSuccessToast = (title: string, message: string) => {
  toast.success(<CustomToast title={title} message={message} />, {
    closeOnClick: true,
  });
};

let isShowError = false;

export const showErrorToast = (title: string, message: string) => {
  if (isShowError) return;
  isShowError = true;
  setTimeout(() => {
    isShowError = false;
  }, 300);

  toast.error(<CustomToast title={title} message={message} />, {
    closeOnClick: true,
  });
};
