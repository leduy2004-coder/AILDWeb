import React from 'react';

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Test Header will be rendered per page if it needs dynamic progress, or here if generic.
          Since progress is dynamic, we'll let the page component render the header.
      */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  );
}
