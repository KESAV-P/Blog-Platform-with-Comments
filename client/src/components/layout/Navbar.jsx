import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, Settings, PenTool, Menu, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) =>
    `text-sm font-medium tracking-wide uppercase transition-colors hover:text-amber ${
      isActive ? 'text-amber' : 'text-cream-muted'
    }`;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-cream-border/30 bg-[#0f0f0f]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-display text-2xl font-bold tracking-tight text-cream-light">
              Blog<span className="text-amber">Sphere</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkStyle}>Home</NavLink>
            <NavLink to="/blog" className={navLinkStyle}>Blog</NavLink>
            {user && (
              <>
                <NavLink to="/dashboard" className={navLinkStyle}>Dashboard</NavLink>
                <Link
                  to="/create-post"
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-bg-dark bg-amber hover:bg-amber-dark px-3 py-1.5 rounded transition-colors"
                >
                  <PenTool size={13} />
                  Write
                </Link>
              </>
            )}
          </div>

          {/* Right Area (Auth Profile/Buttons) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 outline-none cursor-pointer"
                >
                  <Avatar src={user.avatar} name={user.username} size="sm" />
                  <span className="text-sm font-medium text-cream hover:text-amber transition-colors max-w-[120px] truncate">
                    {user.username}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded bg-[#161616] border border-neutral-800 p-1 shadow-glass z-50 animate-fade-in">
                    <Link
                      to={`/profile/${user.username}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center px-4 py-2 text-sm text-cream-muted hover:text-cream-light hover:bg-bg-accent rounded transition-colors"
                    >
                      <User size={15} className="mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center px-4 py-2 text-sm text-cream-muted hover:text-cream-light hover:bg-bg-accent rounded transition-colors"
                    >
                      <Settings size={15} className="mr-2" />
                      Settings
                    </Link>
                    <hr className="border-neutral-850 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-bg-accent rounded transition-colors"
                    >
                      <LogOut size={15} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium uppercase tracking-wider text-cream-muted hover:text-cream transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium uppercase tracking-wider text-bg-dark bg-cream hover:bg-cream-dark px-4 py-2 rounded transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded text-cream-muted hover:bg-bg-accent hover:text-cream-light"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f0f0f] border-b border-neutral-900 px-4 pt-2 pb-4 space-y-2">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-base font-medium text-cream-muted hover:bg-bg-accent hover:text-cream"
          >
            Home
          </NavLink>
          <NavLink
            to="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-base font-medium text-cream-muted hover:bg-bg-accent hover:text-cream"
          >
            Blog
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded text-base font-medium text-cream-muted hover:bg-bg-accent hover:text-cream"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/create-post"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded text-base font-medium text-bg-dark bg-amber hover:bg-amber-dark"
              >
                Write Post
              </NavLink>
              <hr className="border-neutral-900 my-2" />
              <Link
                to={`/profile/${user.username}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2 rounded text-base font-medium text-cream-muted hover:bg-bg-accent"
              >
                <User size={16} className="mr-2" /> My Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2 rounded text-base font-medium text-cream-muted hover:bg-bg-accent"
              >
                <Settings size={16} className="mr-2" /> Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-3 py-2 rounded text-base font-medium text-red-400 hover:bg-bg-accent"
              >
                <LogOut size={16} className="mr-2" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <hr className="border-neutral-900 my-2" />
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center px-4 py-2 rounded text-sm font-medium border border-cream-border text-cream"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center px-4 py-2 rounded text-sm font-medium bg-cream text-bg-dark"
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
