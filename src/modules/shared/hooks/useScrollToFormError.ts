import { useCallback, useEffect, useRef } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';

interface UseScrollToFormErrorOptions {
  errors: FieldErrors<FieldValues>;
  isSubmitted: boolean;
  isValid: boolean;
  submitCount: number;
}

// Escape special characters in CSS selectors
const escapeSelector = (str: string): string => {
  return str.replace(/([.[\]#()>+~=|^$:*"'!@%&/\\])/g, '\\$1');
};

const findFieldElement = (fieldName: string): HTMLElement | null => {
  const escapedName = escapeSelector(fieldName);

  let element = document.querySelector(
    `[name="${escapedName}"]`,
  ) as HTMLElement | null;

  if (element) {
    const isHiddenInput =
      (element.tagName === 'INPUT' &&
        (element as HTMLInputElement).type === 'hidden') ||
      element.hasAttribute('hidden');

    if (isHiddenInput) {
      const parent = element.closest(
        '.MuiFormControl-root, .MuiGrid-item, [data-field-wrapper]',
      ) as HTMLElement | null;

      if (parent) {
        return parent;
      }

      const dataFieldElement = document.querySelector(
        `[data-field="${escapedName}"]`,
      ) as HTMLElement | null;

      if (dataFieldElement && dataFieldElement !== element) {
        return dataFieldElement;
      }

      return element;
    }

    return element;
  }

  element = document.getElementById(fieldName);
  if (element) return element;

  element = document.querySelector(
    `[data-field="${escapedName}"]`,
  ) as HTMLElement | null;
  if (element) return element;

  const datePickerInput = document.querySelector(
    `.MuiFormControl-root input[name="${escapedName}"]`,
  ) as HTMLElement | null;
  if (datePickerInput) {
    return datePickerInput.closest('.MuiFormControl-root') as HTMLElement;
  }

  const hiddenInput = document.querySelector(
    `input[name="${escapedName}"][type="hidden"]`,
  ) as HTMLElement | null;
  if (hiddenInput) {
    element = hiddenInput.closest('.MuiFormControl-root') as HTMLElement | null;
    if (element) return element;
  }

  element = document.querySelector(
    `[aria-labelledby*="${escapedName}"]`,
  ) as HTMLElement | null;
  if (element) return element;

  const labels = Array.from(document.querySelectorAll('label'));
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const labelFor = label.getAttribute('for');
    if (labelFor === fieldName) {
      element = document.getElementById(labelFor);
      if (element) return element;
    }
  }

  return null;
};

const getErrorPaths = (errors: FieldErrors<FieldValues>): string[] => {
  const paths: string[] = [];
  const search = (
    current: FieldErrors<FieldValues> | undefined,
    path: string[] = [],
  ) => {
    if (!current || typeof current !== 'object') return;
    if ('message' in current && typeof current.message === 'string') {
      paths.push(path.join('.'));
      return;
    }
    Object.entries(current).forEach(([key, value]) => {
      search(value as FieldErrors<FieldValues>, [...path, key]);
    });
  };
  search(errors);
  return paths;
};

const findFirstErrorElementInDOM = (): HTMLElement | null => {
  const errorElements = Array.from(
    document.querySelectorAll(
      '.Mui-error, .MuiFormHelperText-root.Mui-error, [class*="error"]:not(svg):not(path)',
    ),
  );

  if (errorElements.length === 0) return null;

  for (let i = 0; i < errorElements.length; i++) {
    const errorEl = errorElements[i];
    const formControl = errorEl.closest(
      '.MuiFormControl-root, .MuiGrid-item, [class*="FormControlWrap"]',
    ) as HTMLElement;
    if (formControl) return formControl;
    if ((errorEl as HTMLElement).offsetParent !== null) {
      return errorEl as HTMLElement;
    }
  }

  return errorElements[0] as HTMLElement;
};

export function useScrollToFormError({
  errors,
  isSubmitted,
  isValid,
  submitCount,
}: UseScrollToFormErrorOptions) {
  const scrollToFirstError = useCallback(() => {
    const errorPaths = getErrorPaths(errors);
    if (errorPaths.length === 0) return;

    const candidateElements: { element: HTMLElement; top: number }[] = [];

    for (const fieldName of errorPaths) {
      const el = findFieldElement(fieldName);
      if (el) {
        const rect = el.getBoundingClientRect();
        candidateElements.push({
          element: el,
          top: rect.top + window.scrollY,
        });
      }
    }

    let errorElement: HTMLElement | null = null;

    if (candidateElements.length > 0) {
      // Sort by vertical position and then horizontal
      candidateElements.sort((a, b) => a.top - b.top);
      errorElement = candidateElements[0].element;
    } else {
      errorElement = findFirstErrorElementInDOM();
    }

    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        const focusSelectors = [
          'input:not([type="hidden"])',
          'textarea',
          '.MuiSelect-select',
          '.MuiInputBase-input',
          'button:not([disabled])',
          '[role="button"]:not([aria-disabled="true"])',
          '[role="combobox"]',
          'input[type="checkbox"]',
          'input[type="radio"]',
          '[tabindex]:not([tabindex="-1"])',
        ];

        let focusableElement: HTMLElement | null = null;

        for (const selector of focusSelectors) {
          focusableElement = errorElement?.querySelector(
            selector,
          ) as HTMLElement | null;
          if (focusableElement) break;
        }

        if (focusableElement && focusableElement.focus) {
          focusableElement.focus();
          if (focusableElement.classList.contains('MuiSelect-select')) {
            focusableElement.click();
          }
        } else if (errorElement && errorElement.focus) {
          errorElement.focus();
        }
      }, 300);
    }
  }, [errors]);

  const lastSubmitCountRef = useRef(0);

  useEffect(() => {
    if (isSubmitted && !isValid && submitCount > lastSubmitCountRef.current) {
      lastSubmitCountRef.current = submitCount;
      const timer = setTimeout(() => {
        scrollToFirstError();
      }, 100);
      return () => clearTimeout(timer);
    }

    if (submitCount === 0) {
      lastSubmitCountRef.current = 0;
    }
  }, [isSubmitted, isValid, submitCount, scrollToFirstError]);

  return { scrollToFirstError };
}
