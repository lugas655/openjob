import { Link, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, LogOut, Menu, X, Building, Tag } from 'lucide-react';
import { useState, useRef } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Find Jobs', path: '/jobs' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="bg-slate-900 p-2.5 rounded-2xl shadow-2xl shadow-slate-900/20 group-hover:bg-primary-600 transition-all duration-500 group-hover:rotate-12">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">
                OpenJob
              </span>
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mt-1">
                Careers
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-100/50 p-1.5 rounded-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-6 py-2.5 rounded-xl text-sm font-black tracking-tight transition-all ${
                  isActive(link.path) 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/manage/jobs"
                className={`px-6 py-2.5 rounded-xl text-sm font-black tracking-tight transition-all ${
                  isActive('/manage/jobs') 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Manage
              </Link>
            )}
          </div>

          {/* Auth / User Menu */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-1.5 pr-4 rounded-2xl hover:bg-slate-100 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-600/20 group-hover:scale-105 transition-transform">
                     <User className="w-5 h-5" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-black text-slate-900 leading-none mb-1">{user.fullname?.split(' ')[0]}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Plan</p>
                  </div>
                  <div className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}>
                    <X className={`w-4 h-4 text-slate-400 ${isUserMenuOpen ? 'block' : 'hidden'}`} />
                    <Menu className={`w-4 h-4 text-slate-400 ${isUserMenuOpen ? 'hidden' : 'block'}`} />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-4 w-64 glass rounded-3xl shadow-2xl shadow-slate-900/20 border-white/60 p-3 animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-slate-100/60 mb-2">
                      <p className="text-sm font-black text-slate-900">{user.fullname}</p>
                      <p className="text-xs font-medium text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <Link 
                        to="/profile" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-primary-50 text-slate-600 hover:text-primary-600 transition-all font-bold text-sm"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link 
                        to="/manage/jobs" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-primary-50 text-slate-600 hover:text-primary-600 transition-all font-bold text-sm"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span>Manage Jobs</span>
                      </Link>
                      <Link 
                        to="/manage/companies" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-primary-50 text-slate-600 hover:text-primary-600 transition-all font-bold text-sm"
                      >
                        <Building className="w-4 h-4" />
                        <span>Manage Companies</span>
                      </Link>
                      <Link 
                        to="/manage/categories" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-primary-50 text-slate-600 hover:text-primary-600 transition-all font-bold text-sm"
                      >
                        <Tag className="w-4 h-4" />
                        <span>Manage Categories</span>
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-600 transition-all font-bold text-sm mt-2 border-t border-slate-100/60 pt-4"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button label="Sign In" className="p-button-text text-slate-900 font-black" />
                </Link>
                <Link to="/register">
                  <Button label="Join Now" className="bg-slate-900 text-white rounded-2xl px-8 font-black border-none hover:bg-primary-600 transition-colors shadow-lg shadow-slate-900/20" />
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
