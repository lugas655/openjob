import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobsApi, categoriesApi } from '../api';
import JobCard from '../components/JobCard';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Search, SlidersHorizontal, MapPin, Briefcase } from 'lucide-react';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || ''
  });

  const jobTypes = [
    { label: 'All Types', value: '' },
    { label: 'Full Time', value: 'Full Time' },
    { label: 'Part Time', value: 'Part Time' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Internship', value: 'Internship' }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      const catData = response.data.data.categories.map(c => ({ label: c.name, value: c.id }));
      setCategories([{ label: 'All Categories', value: '' }, ...catData]);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const response = await jobsApi.getAll(params);
      setJobs(response.data.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Update URL search params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    setSearchParams(params);
  };

  return (
    <div className="bg-mesh min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Explore Roles</h1>
          <p className="text-slate-500 text-lg">Browse through our curated list of world-class opportunities.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 space-y-8">
            <div className="glass p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-white/40 sticky top-28">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-900 flex items-center text-lg">
                  <SlidersHorizontal className="w-5 h-5 mr-3 text-primary-500" />
                  Search & Filter
                </h3>
                <button 
                  onClick={() => {
                    setFilters({ q: '', category: '', type: '' });
                    setSearchParams({});
                  }}
                  className="text-[10px] text-primary-600 font-black hover:underline uppercase tracking-widest"
                >
                  Reset
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6 lg:gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Keywords</label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    <InputText 
                      value={filters.q} 
                      onChange={(e) => handleFilterChange('q', e.target.value)}
                      placeholder="Title, Company..." 
                      className="w-full pl-12 bg-white/50 border-slate-100 rounded-2xl p-4 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <Dropdown
                    value={filters.category}
                    options={categories}
                    onChange={(e) => handleFilterChange('category', e.value)}
                    placeholder="All Categories"
                    className="w-full bg-white/50 border-slate-100 rounded-2xl p-1 font-bold"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Type</label>
                  <Dropdown
                    value={filters.type}
                    options={jobTypes}
                    onChange={(e) => handleFilterChange('type', e.value)}
                    placeholder="All Types"
                    className="w-full bg-white/50 border-slate-100 rounded-2xl p-1 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Quick Info Box - Hidden on small mobile */}
            <div className="hidden lg:block bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-primary-600/20 rounded-full blur-3xl group-hover:bg-primary-600/30 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                   <Briefcase className="w-6 h-6 text-primary-400" />
                </div>
                <h4 className="text-xl font-black mb-2 tracking-tight">Weekly Alerts</h4>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">Join 50k+ pros getting fresh jobs every Monday.</p>
                <div className="space-y-3">
                  <InputText placeholder="Email" className="w-full bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl" />
                  <Button label="Join List" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black rounded-xl border-none p-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-9">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
              <p className="text-slate-400 font-bold">
                Found <span className="text-slate-900 font-black">{jobs.length}</span> matching roles
              </p>
              <div className="flex items-center space-x-3 text-sm font-bold text-slate-500 bg-white/50 p-2 rounded-2xl border border-slate-100">
                <span className="ml-2">Sort by:</span>
                <Dropdown
                  value="Newest"
                  options={['Newest', 'Salary: High to Low', 'Oldest']}
                  className="bg-transparent border-none focus:ring-0 font-black text-slate-900"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-80 bg-white/50 rounded-[2.5rem] animate-pulse border border-slate-100"></div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="glass rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">No jobs found</h3>
                <p className="text-slate-500 font-medium">Try adjusting your filters to find what you're looking for.</p>
                <Button 
                  label="Reset Filters" 
                  onClick={() => {
                    setFilters({ q: '', category: '', type: '' });
                    setSearchParams({});
                  }}
                  className="mt-8 p-button-text font-black text-primary-600"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
