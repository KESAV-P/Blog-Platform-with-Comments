import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PageWrapper = ({ children, className = '' }) => {
  return (
    <div className="flex min-h-screen flex-col bg-bg-dark">
      <Navbar />
      <main className={`flex-grow mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageWrapper;
