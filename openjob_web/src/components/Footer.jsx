import { Link } from 'react-router-dom';
import { Briefcase, Github, Twitter, Linkedin, Facebook, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 overflow-hidden relative">
      {/* Soft Top Gradient for smoother transition */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="bg-white p-2.5 rounded-2xl shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                <Briefcase className="w-7 h-7 text-slate-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter leading-none">OpenJob</span>
                <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mt-1">Global Careers</span>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed font-medium">
              Connecting world-class talent with the industry's most innovative companies. Your next career move starts here.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-600 transition-colors group">
                <Twitter className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-600 transition-colors group">
                <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-600 transition-colors group">
                <Github className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-primary-400">For Candidates</h4>
            <ul className="space-y-4">
              <li><Link to="/jobs" className="text-slate-400 hover:text-white transition-colors font-bold">Browse Jobs</Link></li>
              <li><Link to="/profile" className="text-slate-400 hover:text-white transition-colors font-bold">Job Alerts</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors font-bold">Career Advice</Link></li>
              <li><Link to="/jobs" className="text-slate-400 hover:text-white transition-colors font-bold">Candidate Dashboard</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-primary-400">For Employers</h4>
            <ul className="space-y-4">
              <li><Link to="/manage/jobs" className="text-slate-400 hover:text-white transition-colors font-bold">Post a Job</Link></li>
              <li><Link to="/manage/companies" className="text-slate-400 hover:text-white transition-colors font-bold">Employer Portal</Link></li>
              <li><Link to="/manage/jobs" className="text-slate-400 hover:text-white transition-colors font-bold">Hiring Solutions</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors font-bold">Resource Center</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-primary-400">Get in Touch</h4>
            <ul className="space-y-6">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-primary-400 mr-4 shrink-0" />
                <span className="text-slate-400 font-medium">123 Career Avenue, Tech City, ST 12345</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-primary-400 mr-4 shrink-0" />
                <span className="text-slate-400 font-medium">hello@openjob.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-primary-400 mr-4 shrink-0" />
                <span className="text-slate-400 font-medium">+1 (234) 567-890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 font-bold text-sm">
            &copy; {new Date().getFullYear()} OpenJob. Crafted with precision for future leaders.
          </p>
          <div className="flex space-x-8 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
