'use client';

import Header from './_components/header';
import CanvasContextProvider from './editor/[id]/hooks/CanvasContext';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <CanvasContextProvider>{children}</CanvasContextProvider>
    </div>
  );
};

export default DashboardLayout;
