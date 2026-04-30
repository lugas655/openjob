import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Search, Briefcase, MapPin, TrendingUp, Users, Building } from 'lucide-react';
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

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(59,102,245,0.05)_0%,rgba(255,255,255,0)_100%)]"></div>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-8 animate-bounce">
            <TrendingUp className="w-4 h-4 mr-2" />
            Over 10,000+ jobs are waiting for you
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
            Find Your <span className="text-primary-600">Dream Career</span> <br />
            with OpenJob
          </h1>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
            Discover thousands of job opportunities from top companies around the world. 
            Apply with ease and take the next step in your professional journey.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl border border-slate-100 flex flex-col md:flex-row gap-2">
            <div className="flex-grow flex items-center px-4">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <InputText
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title, keywords, or company..."
                className="w-full border-none focus:ring-0 p-3 text-lg"
              />
            </div>
            <Link to={`/jobs?q=${searchQuery}`}>
              <Button 
                label="Search Jobs" 
                className="w-full md:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 border-none text-lg font-bold text-white rounded-xl shadow-lg shadow-slate-200" 
              />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-slate-400">
            <div className="flex items-center"><Building className="w-5 h-5 mr-2" /> Top Companies</div>
            <div className="flex items-center"><Users className="w-5 h-5 mr-2" /> 5M+ Candidates</div>
            <div className="flex items-center"><Briefcase className="w-5 h-5 mr-2" /> 12K+ Jobs Posted</div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Job Openings</h2>
            <p className="text-slate-500">Hand-picked opportunities from our top-tier partners.</p>
          </div>
          <Link to="/jobs">
            <Button label="View All Jobs" className="p-button-text font-semibold text-primary-600" icon="pi pi-arrow-right" iconPos="right" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Categories / Stats */}
      <section className="bg-slate-900 py-20 rounded-[3rem] mx-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 opacity-10 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 opacity-10 blur-[100px]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose OpenJob?</h2>
            <p className="text-slate-400 max-w-xl mx-auto">We provide the tools and connections you need to land your next big role.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700">
              <div className="w-16 h-16 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Verified Jobs</h3>
              <p className="text-slate-400">Every job posting is verified by our team to ensure safety and quality.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Direct Contact</h3>
              <p className="text-slate-400">Communicate directly with hiring managers and recruiters.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Career Growth</h3>
              <p className="text-slate-400">Access exclusive resources and tools to boost your professional career.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
