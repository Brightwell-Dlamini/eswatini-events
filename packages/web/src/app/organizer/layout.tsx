'use client';

import { Providers } from '../providers';
import { ThemeProvider } from 'next-themes';
import OrganizerNavbar from '@/components/organizer/Navbar';

const OrganizerLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen">
      <OrganizerNavbar />
      <ThemeProvider>
        <Providers>{children}</Providers>
      </ThemeProvider>
    </div>
  );
};

export default OrganizerLayout;
