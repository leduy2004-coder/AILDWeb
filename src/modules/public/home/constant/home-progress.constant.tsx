import React from 'react';
import { IconBrain, IconShieldCheck, IconCpu, IconHierarchy2 } from '@tabler/icons-react';

export const DEFAULT_DOMAINS = ['HCM', 'TECH', 'CRIT', 'ETHIC'];
export const DEFAULT_LEVELS = ['L1', 'L2', 'L3'];

export const DOMAIN_CHART_LABELS_MAP: Record<string, string> = {
  HCM: 'HCM',
  TECH: 'TECH',
  CRIT: 'CRIT',
  ETHIC: 'ETHIC',
};

export const DOMAIN_THEME_MAP: Record<
  string,
  { icon: React.ReactNode; bgGradient: string; textPrimary: string; border: string }
> = {
  HCM: {
    icon: <IconBrain size={20} color="#FFFFFF" />,
    bgGradient: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
    textPrimary: '#4338CA',
    border: '#C7D2FE',
  },
  TECH: {
    icon: <IconCpu size={20} color="#FFFFFF" />,
    bgGradient: 'linear-gradient(135deg, #0284C7 0%, #06B6D4 100%)',
    textPrimary: '#0369A1',
    border: '#BAE6FD',
  },
  CRIT: {
    icon: <IconHierarchy2 size={20} color="#FFFFFF" />,
    bgGradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
    textPrimary: '#B45309',
    border: '#FDE68A',
  },
  ETHIC: {
    icon: <IconShieldCheck size={20} color="#FFFFFF" />,
    bgGradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    textPrimary: '#047857',
    border: '#A7F3D0',
  },
};

export const getDomainLabelsMap = (t: any): Record<string, string> => ({
  HCM: t('home.radar.humanCenteredSingleLine', 'Tư duy lấy con người làm trung tâm'),
  TECH: t('home.radar.applicationSingleLine', 'Năng lực công nghệ'),
  CRIT: t('home.radar.criticalThinkingSingleLine', 'Tư duy phản biện'),
  ETHIC: t('home.radar.ethicsSingleLine', 'Đạo đức và quản trị'),
});

export const getLevelNameMap = (t: any): Record<string, string> => ({
  L1: t('home.level.L1', 'NHẬN BIẾT'),
  L2: t('home.level.L2', 'HIỂU & ÁP DỤNG'),
  L3: t('home.level.L3', 'PHÂN TÍCH & ĐÁNH GIÁ'),
});

export const getShortDomainTitleMap = (t: any): Record<string, string> => ({
  HCM: t('home.radar.domainShort.HCM', 'Tư duy AI'),
  TECH: t('home.radar.domainShort.TECH', 'Năng lực công nghệ'),
  CRIT: t('home.radar.domainShort.CRIT', 'Tư duy PB'),
  ETHIC: t('home.radar.domainShort.ETHIC', 'Đạo đức AI'),
});
