import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import ChangePasswordModule from '@/modules/public/change-password';

export default function ChangePasswordPage() {
  return (
    <>
      <PageMeta titleKey="changePassword.pageTitle" descriptionKey="changePassword.pageDescription" />
      <ChangePasswordModule />
    </>
  );
}
