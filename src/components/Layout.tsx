
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-lavender/20 to-white">
      <Navbar />
      <main className="flex-grow px-4 pt-20 pb-10 w-full max-w-5xl mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
