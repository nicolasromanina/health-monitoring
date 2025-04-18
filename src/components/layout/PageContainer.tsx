
import React from 'react';
import MobileHeader from './MobileHeader';
import MobileFooter from './MobileFooter';

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  showFooter?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  title, 
  children,
  showFooter = true 
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MobileHeader title={title} />
      
      <main className="flex-1 pt-16 pb-16 px-4 overflow-auto">
        {children}
      </main>
      
      {showFooter && <MobileFooter />}
    </div>
  );
};

export default PageContainer;
