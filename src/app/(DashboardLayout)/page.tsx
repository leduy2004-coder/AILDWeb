'use client';

import { ROLE_CODE } from '@/modules/shared/constants';
import { getUserInfoByAccessToken } from '@/modules/shared/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const userInfoString = getUserInfoByAccessToken();

    if (!userInfoString) {
      router.replace('/home');
      return;
    }

    const userLogin = JSON.parse(userInfoString);

    const userRoles = Array.isArray(userLogin.roles) 
      ? userLogin.roles 
      : (userLogin.roles ? [userLogin.roles] : []);

    // ADMIN -> projects
    if (userRoles.includes(ROLE_CODE.ADMIN)) {
      router.replace('/admin/overview');
      return;
    }

    // STUDENT -> student overview
    if (userRoles.includes(ROLE_CODE.STUDENT)) {
      router.replace('/student/overview');
      return;
    }

    // TEACHER -> teacher overview
    if (userRoles.includes(ROLE_CODE.TEACHER)) {
      router.replace('/teacher/overview');
      return;
    }
  }, [router]);

  return null;
}
