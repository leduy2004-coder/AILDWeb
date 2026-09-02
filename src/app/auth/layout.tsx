import { PublicHeader } from '@/app/(PublicLayout)/layout/header/PublicHeader';
import { PublicFooter } from '@/app/(PublicLayout)/layout/footer/PublicFooter';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <PublicHeader />
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
      <PublicFooter />
    </div>
  );
}
