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
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Link to="/jobs" className="inline-flex items-center text-slate-500 hover:text-primary-600 mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to all jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                    <Building className="w-10 h-10" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-slate-500">
                      <span className="flex items-center"><Building className="w-4 h-4 mr-1" /> {job.company_name || 'Top Company'}</span>
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.location || 'Remote'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    icon={<Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-primary-600 text-primary-600' : 'text-slate-400'}`} />} 
                    className="p-button-outlined border-slate-200" 
                    onClick={toggleBookmark}
                  />
                  <Button icon={<Share2 className="w-5 h-5 text-slate-400" />} className="p-button-outlined border-slate-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-slate-100 mb-10">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Salary</p>
                  <p className="font-bold text-slate-900">{job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Type</p>
                  <p className="font-bold text-slate-900">{job.type || 'Full Time'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</p>
                  <p className="font-bold text-slate-900">{job.category_name || 'General'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posted Date</p>
                  <p className="font-bold text-slate-900">{new Date(job.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Job Description</h3>
                <div className="text-slate-600 leading-relaxed space-y-4 whitespace-pre-line">
                  {job.description}
                </div>
              </div>
            </div>

            {/* Related Jobs / Company Info */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">About the Company</h3>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                  <Building className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{job.company_name || 'Top Company'}</h4>
                  <p className="text-slate-500 text-sm">Technology & Software Services</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                {job.company_description || "This is a leading company in their industry, committed to innovation and excellence. Join their dynamic team to work on cutting-edge projects and grow your professional career."}
              </p>
              <Button label="View Company Profile" className="p-button-text font-bold text-primary-600 p-0" />
            </div>
          </div>

          {/* Sidebar / Apply Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-8 rounded-3xl shadow-lg shadow-primary-100 border border-slate-100 space-y-6">
              <div className="text-center pb-6 border-b border-slate-100">
                <p className="text-slate-500 mb-1">Application ends in</p>
                <div className="flex justify-center gap-4 text-slate-900">
                  <div className="text-center">
                    <span className="block text-2xl font-bold">12</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">Days</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-300">:</div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold">08</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">Hrs</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-300">:</div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold">45</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">Min</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  label="Apply for Job" 
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 border-none rounded-2xl font-bold text-lg"
                  onClick={() => user ? setShowApplyDialog(true) : navigate('/login')}
                />
                <Button 
                  label={isBookmarked ? 'Saved to Bookmarks' : 'Save this Job'} 
                  icon={<Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-white' : ''}`} />}
                  className={`w-full py-4 rounded-2xl font-bold ${isBookmarked ? 'bg-slate-900 text-white' : 'p-button-outlined border-slate-200 text-slate-700'}`}
                  onClick={toggleBookmark}
                />
              </div>

              <div className="pt-6 space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center"><Briefcase className="w-4 h-4 mr-2 text-primary-500" /> Requirements</h4>
                <ul className="space-y-3">
                  <li className="flex items-start text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 mr-3 shrink-0"></div>
                    At least 2-3 years of relevant experience
                  </li>
                  <li className="flex items-start text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 mr-3 shrink-0"></div>
                    Bachelor's degree in related field
                  </li>
                  <li className="flex items-start text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 mr-3 shrink-0"></div>
                    Strong communication skills
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog 
        header={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-lg"><FileText className="w-6 h-6 text-primary-600" /></div>
            <h3 className="text-xl font-bold">Complete Your Application</h3>
          </div>
        }
        visible={showApplyDialog} 
        onHide={() => setShowApplyDialog(false)}
        className="w-full max-w-lg mx-4"
        rounded
      >
        <div className="space-y-6 pt-2">
          <p className="text-slate-500">You are applying for <span className="text-slate-900 font-bold">{job.title}</span> at <span className="text-slate-900 font-bold">{job.company_name}</span>.</p>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Select Resume / Document</label>
            <Dropdown
              value={selectedDoc}
              options={documents}
              onChange={(e) => setSelectedDoc(e.value)}
              placeholder="Choose a document..."
              className="w-full"
              emptyMessage={
                <div className="p-2 text-center">
                  <p className="mb-2">No documents found.</p>
                  <Link to="/profile" className="text-primary-600 font-bold">Upload one in your profile</Link>
                </div>
              }
            />
          </div>

          {applyError && (
            <Message severity="error" text={applyError} className="w-full" />
          )}

          <div className="flex gap-3 pt-4">
            <Button label="Cancel" className="flex-1 p-button-text text-slate-500" onClick={() => setShowApplyDialog(false)} />
            <Button 
              label={applying ? "Submitting..." : "Submit Application"} 
              className="flex-2 px-8 bg-primary-600 border-none rounded-xl font-bold" 
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
