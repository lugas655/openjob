import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsApi, applicationsApi, documentsApi, bookmarksApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { MapPin, Clock, DollarSign, Building, ChevronLeft, Bookmark, Share2, Briefcase, FileText } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [applyError, setApplyError] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (user) {
      fetchUserDocuments();
    }
  }, [id, user]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobsApi.getById(id);
      setJob(response.data.data.job);
    } catch (error) {
      console.error('Error fetching job details', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDocuments = async () => {
    try {
      const response = await documentsApi.getAll();
      const docs = response.data.data.documents.map(d => ({ label: d.filename, value: d.id }));
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents', error);
    }
  };

  const handleApply = async () => {
    if (!selectedDoc) {
      setApplyError('Please select a resume/document.');
      return;
    }
    setApplying(true);
    setApplyError('');
    try {
      await applicationsApi.apply(id, { documentId: selectedDoc });
      setShowApplyDialog(false);
      // Show success message or redirect
      navigate('/profile', { state: { message: 'Application submitted successfully!' } });
    } catch (error) {
      setApplyError(error.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (isBookmarked) {
        await bookmarksApi.remove(id);
      } else {
        await bookmarksApi.add(id);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Bookmark error', error);
    }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="animate-spin inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mb-4"></div>
      <p className="text-slate-500 font-medium">Loading job details...</p>
    </div>
  );

  if (!job) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-slate-900">Job not found</h2>
      <Link to="/jobs" className="text-primary-600 mt-4 inline-block font-bold">Back to jobs</Link>
    </div>
  );

  return (
    <div className="bg-mesh min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Link to="/jobs" className="inline-flex items-center text-slate-400 hover:text-primary-600 mb-12 transition-all font-black uppercase tracking-widest text-[10px]">
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-3 group">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Back to all opportunities
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="glass rounded-[3rem] p-10 md:p-16 border-white/60 shadow-2xl shadow-primary-500/5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 bg-white shadow-2xl shadow-slate-200/50 rounded-3xl flex items-center justify-center text-slate-400 shrink-0">
                    <Building className="w-12 h-12" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                       <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest border border-primary-100/50">{job.type || 'Full Time'}</span>
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{job.category_name}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">{job.title}</h1>
                    <p className="mt-4 text-lg font-bold text-slate-500">{job.company_name || 'Innovate Corp'}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    icon={<Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-primary-600 text-primary-600' : 'text-slate-400'}`} />} 
                    className="p-button-text p-button-rounded bg-white shadow-sm border border-slate-100 w-14 h-14" 
                    onClick={toggleBookmark}
                  />
                  <Button icon={<Share2 className="w-5 h-5 text-slate-400" />} className="p-button-text p-button-rounded bg-white shadow-sm border border-slate-100 w-14 h-14" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-slate-100/60 mb-12">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Salary</p>
                  <p className="text-xl font-black text-slate-900">{job.salary ? `$${(job.salary/1000).toFixed(0)}k` : 'Neg.'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Location</p>
                  <p className="text-xl font-black text-slate-900">{job.location || 'Remote'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Experience</p>
                  <p className="text-xl font-black text-slate-900">2-4 Yrs</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Posted</p>
                  <p className="text-xl font-black text-slate-900">{new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Job Overview</h3>
                <div className="text-slate-500 text-lg leading-relaxed space-y-6 whitespace-pre-line font-medium">
                  {job.description}
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="glass rounded-[3rem] p-10 md:p-16 border-white/60 shadow-xl shadow-slate-200/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 blur-[80px] -mr-32 -mt-32"></div>
              <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">The Company</h3>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0">
                  <Building className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">{job.company_name || 'Innovate Corp'}</h4>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">{job.location || 'San Francisco, CA'}</p>
                </div>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
                {job.company_description || "We are a mission-driven organization focused on building the next generation of digital experiences. Our team is composed of passionate individuals who value innovation, transparency, and impact."}
              </p>
              <Button label="Explore Company" className="p-button-text font-black text-primary-600 uppercase tracking-widest text-xs" icon="pi pi-external-link" iconPos="right" />
            </div>
          </div>

          {/* Sidebar / Apply Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-primary-900/40 space-y-10 border border-white/10 text-white">
              <div className="text-center pb-10 border-b border-white/10">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-6">Application Deadline</p>
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <span className="block text-4xl font-black mb-1">12</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Days</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-4xl font-black mb-1">08</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Hrs</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-4xl font-black mb-1">45</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Min</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  label="Apply Now" 
                  className="w-full py-6 bg-primary-600 hover:bg-primary-700 border-none rounded-2xl font-black text-xl shadow-xl shadow-primary-600/30"
                  onClick={() => user ? setShowApplyDialog(true) : navigate('/login')}
                />
                <Button 
                  label={isBookmarked ? 'Job Saved' : 'Save for Later'} 
                  icon={<Bookmark className={`w-5 h-5 mr-3 ${isBookmarked ? 'fill-white' : ''}`} />}
                  className={`w-full py-6 rounded-2xl font-black text-lg transition-all ${isBookmarked ? 'bg-white/10 text-white border-white/10' : 'p-button-text text-white hover:bg-white/5'}`}
                  onClick={toggleBookmark}
                />
              </div>

              <div className="pt-6 space-y-6">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary-400 flex items-center">
                   <Briefcase className="w-4 h-4 mr-3" /> 
                   Quick Stats
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold">Applicants</span>
                    <span className="font-black">124 People</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold">Industry</span>
                    <span className="font-black text-primary-400">{job.category_name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold">Work Mode</span>
                    <span className="font-black">Hybrid / Remote</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog 
        header={
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center"><FileText className="w-7 h-7 text-primary-600" /></div>
            <div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Apply for Role</h3>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{job.title}</p>
            </div>
          </div>
        }
        visible={showApplyDialog} 
        onHide={() => setShowApplyDialog(false)}
        className="w-full max-w-xl mx-4"
      >
        <div className="space-y-10 py-6">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
             <p className="text-slate-600 leading-relaxed font-medium">
               You are about to submit your profile to <span className="text-slate-900 font-black">{job.company_name}</span>. 
               Please ensure your resume is up to date for the best chance of success.
             </p>
          </div>
          
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Select Your Resume</label>
            <Dropdown
              value={selectedDoc}
              options={documents}
              onChange={(e) => setSelectedDoc(e.value)}
              placeholder="Select from your documents..."
              className="w-full bg-white border-slate-100 rounded-2xl p-2"
              emptyMessage={
                <div className="p-6 text-center">
                  <p className="mb-4 text-slate-400 font-bold">No resumes found in your profile.</p>
                  <Link to="/profile" className="text-primary-600 font-black hover:underline uppercase tracking-widest text-xs">Upload Document →</Link>
                </div>
              }
            />
          </div>

          {applyError && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm border border-red-100">
               {applyError}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Button label="Go Back" className="flex-1 p-button-text text-slate-400 font-black order-2 md:order-1" onClick={() => setShowApplyDialog(false)} />
            <Button 
              label={applying ? "Sending..." : "Submit Application"} 
              className="flex-1 py-5 bg-slate-900 hover:bg-primary-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 order-1 md:order-2" 
              onClick={handleApply}
              disabled={applying}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default JobDetail;
