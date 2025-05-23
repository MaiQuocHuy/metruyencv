import LayoutNonDashboard from '@/components/layout/LayoutNonDashboard';

import type React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LayoutNonDashboard>{children}</LayoutNonDashboard>;
}
