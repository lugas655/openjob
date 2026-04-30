import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { authApi } from '../api';
import { Briefcase, User, Mail, Lock, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullname: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.register(formData);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -right-4 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 -left-4 w-96 h-96 bg-accent-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full glass rounded-[3rem] shadow-2xl shadow-primary-500/10 border-white/60 overflow-hidden relative z-10">
        <div className="p-10 md:p-14">
          <div className="flex justify-center mb-10">
            <div className="bg-slate-900 p-4 rounded-2xl shadow-2xl shadow-slate-900/20">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Create Account</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Start your journey with us</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm border border-red-100 mb-8 animate-shake">
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                <InputText
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full !pl-14 py-4 bg-white border-slate-100 rounded-2xl font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                <InputText
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full !pl-14 py-4 bg-white border-slate-100 rounded-2xl font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Choose Password</label>
              <div className="relative group login-password">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10 group-focus-within:text-primary-500 transition-colors" />
                <Password
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  toggleMask
                  className="w-full"
                  inputClassName="w-full !pl-14 py-4 bg-white border-slate-100 rounded-2xl font-medium"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              label={loading ? 'Creating Portal...' : 'Get Started Now'}
              icon={!loading && <UserPlus className="w-5 h-5 ml-2" />}
              iconPos="right"
              className="w-full py-5 bg-slate-900 hover:bg-primary-600 text-white border-none rounded-[2rem] font-black text-lg shadow-xl shadow-slate-900/20 transition-all active:scale-95"
              disabled={loading}
            />
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-400 font-bold text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-black hover:underline uppercase tracking-widest text-[11px] ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
