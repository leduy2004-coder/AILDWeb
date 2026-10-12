import type { TFunction } from 'i18next';

export const getLocalizedDomain = (
  item: {
    domainCode?: string | null;
    domainId?: number | null;
    domainName?: string | null;
  },
  t: TFunction
): string => {
  const code = (item.domainCode || '').toUpperCase();
  const idStr = item.domainId ? String(item.domainId) : '';

  if (code === 'HCM' || idStr === '1') {
    return t('home.domain.HCM', { defaultValue: 'Tư duy lấy con người làm trung tâm' });
  }
  if (code === 'ETHICS' || idStr === '2') {
    return t('home.domain.ETHICS', { defaultValue: 'Đạo đức AI' });
  }
  if (code === 'TECH' || idStr === '3') {
    return t('home.domain.TECH', { defaultValue: 'Kỹ thuật và Ứng dụng AI' });
  }
  if (code === 'DESIGN' || idStr === '4') {
    return t('home.domain.DESIGN', { defaultValue: 'Thiết kế Hệ thống AI' });
  }

  // Fallback by domainName matching if code is not provided
  if (item.domainName) {
    const nameUpper = item.domainName.toUpperCase();
    if (nameUpper.includes('CON NGƯỜI') || nameUpper.includes('HUMAN')) {
      return t('home.domain.HCM', { defaultValue: 'Tư duy lấy con người làm trung tâm' });
    }
    if (nameUpper.includes('ĐẠO ĐỨC') || nameUpper.includes('ETHIC')) {
      return t('home.domain.ETHICS', { defaultValue: 'Đạo đức AI' });
    }
    if (nameUpper.includes('KỸ THUẬT') || nameUpper.includes('TECH') || nameUpper.includes('ỨNG DỤNG')) {
      return t('home.domain.TECH', { defaultValue: 'Kỹ thuật và Ứng dụng AI' });
    }
    if (nameUpper.includes('THIẾT KẾ') || nameUpper.includes('DESIGN') || nameUpper.includes('HỆ THỐNG')) {
      return t('home.domain.DESIGN', { defaultValue: 'Thiết kế Hệ thống AI' });
    }
  }

  return item.domainName || item.domainCode || 'AI';
};

export const getLocalizedLevel = (
  item: {
    targetLevelCode?: string | null;
    targetLevelId?: number | null;
    targetLevelName?: string | null;
  },
  t: TFunction
): string => {
  const code = (item.targetLevelCode || '').toUpperCase();
  const idStr = item.targetLevelId ? String(item.targetLevelId) : '';

  if (code === 'UNDERSTAND' || code === 'L1' || idStr === '1') {
    return t('home.level.UNDERSTAND', { defaultValue: 'THÔNG HIỂU' });
  }
  if (code === 'APPLY' || code === 'L2' || idStr === '2') {
    return t('home.level.APPLY', { defaultValue: 'VẬN DỤNG' });
  }
  if (code === 'CREATE' || code === 'L3' || idStr === '3') {
    return t('home.level.CREATE', { defaultValue: 'SÁNG TẠO' });
  }

  // Fallback by targetLevelName matching if code is not provided
  if (item.targetLevelName) {
    const nameUpper = item.targetLevelName.toUpperCase();
    if (nameUpper.includes('THÔNG HIỂU') || nameUpper.includes('UNDERSTAND')) {
      return t('home.level.UNDERSTAND', { defaultValue: 'THÔNG HIỂU' });
    }
    if (nameUpper.includes('VẬN DỤNG') || nameUpper.includes('APPLY')) {
      return t('home.level.APPLY', { defaultValue: 'VẬN DỤNG' });
    }
    if (nameUpper.includes('SÁNG TẠO') || nameUpper.includes('CREATE')) {
      return t('home.level.CREATE', { defaultValue: 'SÁNG TẠO' });
    }
  }

  return item.targetLevelName || item.targetLevelCode || '';
};
