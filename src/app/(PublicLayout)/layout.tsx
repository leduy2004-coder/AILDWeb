import { PublicHeader } from './layout/header/PublicHeader';
import { PublicFooter } from './layout/footer/PublicFooter';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <PublicHeader />
      <main style={{ flexGrow: 1 }}>{children}</main>
      <PublicFooter />
    </div>
  );
}
