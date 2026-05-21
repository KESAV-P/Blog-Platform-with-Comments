import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0d0d0d] border-t border-cream-border/20 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-display text-lg font-bold text-cream-light">
              Blog<span className="text-amber">Sphere</span>
            </span>
            <p className="text-xs text-cream-muted mt-1">
              Editorial reflections on technology, design, and culture.
            </p>
          </div>
          <div className="flex items-center space-x-6 text-sm text-cream-muted">
            <a href="#" className="hover:text-amber transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-amber transition-colors">Contact</a>
          </div>
        </div>
        <hr className="border-neutral-900 my-6" />
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-cream-muted">
          <span>&copy; {new Date().getFullYear()} BlogSphere. All rights reserved.</span>
          <span className="mt-1 md:mt-0">Designed by Kesav</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
