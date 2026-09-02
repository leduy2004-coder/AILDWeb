export const useBreadcrumbs = (t: (key: string) => string) => [
  { to: '/', title: t('bread_crumb.system') },
  { title: t('bread_crumb.navigation') },
];
