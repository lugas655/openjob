import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Search, Briefcase, MapPin, TrendingUp, Users, Building, ShieldCheck, Zap } from 'lucide-react';
import { jobsApi } from '../api';
import JobCard from '../components/JobCard';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const response = await jobsApi.getAll({ limit: 6 });
      setFeaturedJobs(response.data.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Ecosystem",
      desc: "Every company and job post is manually vetted by our quality team to ensure zero spam."
    },
    {
      icon: Users,
      title: "Direct Networking",
      desc: "Skip the line and connect directly with hiring managers through our professional network."
    },
    {
      icon: Zap,
      title: "Instant Alerts",
      desc: "Be the first to apply. Get real-time notifications for roles that match your skill set perfectly."
    }
  ];

  return (
    <div className="bg-mesh min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-sm font-bold mb-8 shadow-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Empowering over 100,000+ careers monthly
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
              Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">Work</span> <br />
              Starts Here.
            </h1>
            <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              Explore opportunities that match your passion. OpenJob connects visionaries with world-class companies.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto glass p-3 rounded-[2.5rem] flex flex-col md:flex-row gap-2 shadow-2xl shadow-primary-500/10">
              <div className="flex-grow flex items-center px-6">
                <Search className="w-6 h-6 text-primary-500 mr-4" />
                <InputText
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Design, Engineering, Marketing..."
                  className="w-full border-none focus:ring-0 p-4 text-xl bg-transparent"
                />
              </div>
              <Link to={`/jobs?q=${searchQuery}`} className="md:w-auto w-full">
                <Button 
                  label="Explore Now" 
                  className="w-full md:w-auto px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-primary-600/30" 
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Hottest Openings</h2>
            <p className="text-slate-500 text-lg">Don't miss out on these hand-picked opportunities.</p>
          </div>
          <Link to="/jobs">
            <Button label="View All Opportunities" className="p-button-text font-black" icon="pi pi-arrow-right" iconPos="right" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-32">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Why Choose OpenJob?</h2>
          <p className="text-slate-500 text-lg">We provide the tools and network you need to succeed in the modern job market.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="glass p-12 rounded-[3rem] hover:bg-white transition-all duration-500 group border-white/60">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500 shadow-2xl shadow-slate-900/20">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - Centered & Effective */}
      <section className="container mx-auto px-4 relative z-20 -mb-24">
        <div className="relative rounded-[4rem] overflow-hidden group shadow-2xl shadow-slate-900/40 bg-slate-900 py-20 md:py-28 px-8">
          {/* Animated Decorative Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full scale-150 group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full scale-150 group-hover:scale-110 transition-transform duration-1000 animation-delay-2000"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
              Ready to accelerate your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">professional journey?</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-xl mx-auto">
              Join thousands of professionals who have already found their dream roles through OpenJob.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/register" className="w-full sm:w-auto">
                <Button label="Get Started Now" className="w-full px-12 py-6 bg-primary-600 hover:bg-primary-700 text-white rounded-[2rem] font-black text-xl border-none shadow-2xl shadow-primary-600/40 transition-all hover:-translate-y-1" />
              </Link>
              <Link to="/jobs" className="w-full sm:w-auto">
                <Button label="View Openings" className="w-full px-12 py-6 p-button-text text-white hover:bg-white/5 rounded-[2rem] font-black text-xl" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <div className="h-24"></div>
    </div>
  );
};

export default Home;
