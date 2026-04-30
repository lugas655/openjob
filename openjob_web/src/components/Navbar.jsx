import { Link, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Find Jobs', path: '/jobs' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-100/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-slate-200 group-hover:rotate-6 transition-transform">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              OpenJob
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold tracking-wide transition-all hover:text-primary-600 ${
                  isActive(link.path) ? 'text-primary-600' : 'text-slate-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to="/manage/jobs"
                  className={`text-sm font-bold tracking-wide transition-all hover:text-primary-600 ${
                    isActive('/manage/jobs') ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  Post Jobs
                </Link>
                <Link
                  to="/manage/companies"
                  className={`text-sm font-bold tracking-wide transition-all hover:text-primary-600 ${
                    isActive('/manage/companies') ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  Companies
                </Link>
                <Link
                  to="/manage/categories"
                  className={`text-sm font-bold tracking-wide transition-all hover:text-primary-600 ${
                    isActive('/manage/categories') ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  Categories
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button
                    icon={<User className="w-4 h-4 mr-2" />}
                    label={user.fullname || 'Profile'}
                    className="p-button-text text-slate-700"
                  />
                </Link>
                <Button
                  icon={<LogOut className="w-4 h-4 mr-2" />}
                  label="Logout"
                  onClick={logout}
                  className="p-button-outlined p-button-danger p-button-sm"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button label="Login" className="p-button-text text-slate-700" />
                </Link>
                <Link to="/register">
                  <Button label="Register" className="p-button-raised bg-primary-600 border-none" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path) ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-slate-100" />
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button label="Login" className="w-full p-button-outlined" />
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button label="Register" className="w-full bg-primary-600 border-none" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
