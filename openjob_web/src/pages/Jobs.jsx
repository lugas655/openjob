import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobsApi, categoriesApi } from '../api';
import JobCard from '../components/JobCard';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
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
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Explore Opportunities</h1>
          <p className="text-slate-500 text-lg">Browse thousands of jobs and find your perfect match.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 flex items-center">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </h3>
                <button 
                  onClick={() => handleFilterChange('q', '') || handleFilterChange('category', '') || handleFilterChange('type', '')}
                  className="text-xs text-primary-600 font-semibold hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Keyword</label>
                  <span className="p-input-icon-left w-full">
                    <Search className="w-4 h-4 text-slate-400" />
                    <InputText 
                      value={filters.q} 
                      onChange={(e) => handleFilterChange('q', e.target.value)}
                      placeholder="Search title..." 
                      className="w-full"
                    />
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <Dropdown
                    value={filters.category}
                    options={categories}
                    onChange={(e) => handleFilterChange('category', e.value)}
                    placeholder="Select Category"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Job Type</label>
                  <Dropdown
                    value={filters.type}
                    options={jobTypes}
                    onChange={(e) => handleFilterChange('type', e.value)}
                    placeholder="Select Type"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats / Info */}
            <div className="bg-primary-600 p-6 rounded-2xl text-white overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <h4 className="font-bold mb-2">Get Notified</h4>
              <p className="text-sm text-primary-100 mb-4">Subscribe to get daily job alerts in your inbox.</p>
              <InputText placeholder="your@email.com" className="w-full mb-3 bg-white/10 border-white/20 text-white placeholder:text-primary-200" />
              <button className="w-full py-2 bg-white text-primary-600 rounded-lg text-sm font-bold">Subscribe</button>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-500 font-medium">
                Showing <span className="text-slate-900 font-bold">{jobs.length}</span> jobs
              </p>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <span>Sort by:</span>
                <Dropdown
                  value="Newest"
                  options={['Newest', 'Salary: High to Low', 'Oldest']}
                  className="bg-transparent border-none focus:ring-0 font-bold text-slate-900"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-64 bg-white rounded-2xl animate-pulse shadow-sm border border-slate-100"></div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
                <p className="text-slate-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
