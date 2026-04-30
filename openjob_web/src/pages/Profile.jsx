import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileApi, documentsApi, usersApi, api } from '../api';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { User, FileText, Briefcase, Bookmark, Upload, Trash2, ExternalLink, Calendar, MapPin, Pencil } from 'lucide-react';

const Profile = () => {
  const { user, fetchUserProfile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [updating, setUpdating] = useState(false);
  const toast = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchData();
      setEditName(user.fullname);
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, bookRes, docRes] = await Promise.all([
        profileApi.getApplications(),
        profileApi.getBookmarks(),
        documentsApi.getAll()
      ]);
      setApplications(appRes.data.data.applications);
      setBookmarks(bookRes.data.data.bookmarks);
      setDocuments(docRes.data.data.documents);
    } catch (error) {
      console.error('Error fetching profile data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editName) return;
    setUpdating(true);
    try {
      await usersApi.update(user.id, { fullname: editName });
      toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Profile updated successfully' });
      await fetchUserProfile();
      setShowEditProfile(false);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update profile' });
    } finally {
      setUpdating(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    try {
      await documentsApi.upload(formData);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Document uploaded successfully' });
      fetchData();
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'Upload failed' });
    }
  };

  const deleteDocument = async (id) => {
    try {
      await documentsApi.delete(id);
      toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Document removed' });
      fetchData();
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete document' });
    }
  };

  const handleDownload = async (docId, filename) => {
    try {
      const response = await api.get(`/documents/${docId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to download document' });
    }
  };

  const statusBodyTemplate = (rowData) => {
    const status = rowData.status || 'Pending';
    const severity = status === 'Accepted' ? 'success' : status === 'Rejected' ? 'danger' : 'info';
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
        severity === 'success' ? 'bg-emerald-50 text-emerald-600' :
        severity === 'danger' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'
      }`}>
        {status}
      </span>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.created_at).toLocaleDateString();
  };

  if (!user) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Please login to view your profile</h2>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Toast ref={toast} />
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-24 h-24 bg-primary-100 rounded-3xl flex items-center justify-center text-primary-600">
              <User className="w-12 h-12" />
            </div>
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{user.fullname}</h1>
              <p className="text-slate-500 mb-4">@{user.username || user.email} • Job Seeker</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center text-sm font-medium text-slate-600">
                  <Briefcase className="w-4 h-4 mr-2 text-primary-500" />
                  {applications.length} Applications
                </div>
                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center text-sm font-medium text-slate-600">
                  <Bookmark className="w-4 h-4 mr-2 text-amber-500" />
                  {bookmarks.length} Bookmarks
                </div>
              </div>
            </div>
            <Button 
              label="Edit Profile" 
              icon={<Pencil className="w-4 h-4 mr-2" />} 
              className="p-button-outlined border-slate-200 text-slate-700 rounded-xl" 
              onClick={() => setShowEditProfile(true)}
            />
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
          <TabView className="custom-tabview">
            <TabPanel header={
              <div className="flex items-center gap-2 py-2">
                <Briefcase className="w-4 h-4" />
                <span>My Applications</span>
              </div>
            }>
              <div className="py-6">
                <DataTable value={applications} loading={loading} responsiveLayout="stack" className="p-datatable-sm" emptyMessage="No applications found.">
                  <Column field="job_title" header="Job Title" body={(row) => <span className="font-bold text-slate-900">{row.job_title}</span>}></Column>
                  <Column field="company_name" header="Company"></Column>
                  <Column header="Date" body={dateBodyTemplate}></Column>
                  <Column header="Status" body={statusBodyTemplate}></Column>
                </DataTable>
              </div>
            </TabPanel>

            <TabPanel header={
              <div className="flex items-center gap-2 py-2">
                <Bookmark className="w-4 h-4" />
                <span>Bookmarks</span>
              </div>
            }>
              <div className="py-6">
                {bookmarks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarks.map((item) => (
                      <div key={item.job_id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{item.title}</h4>
                          <p className="text-slate-500 text-sm">{item.company_name} • {item.company_location || 'Remote'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No bookmarked jobs yet.</p>
                  </div>
                )}
              </div>
            </TabPanel>

            <TabPanel header={
              <div className="flex items-center gap-2 py-2">
                <FileText className="w-4 h-4" />
                <span>Documents & CV</span>
              </div>
            }>
              <div className="py-6">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="font-bold text-slate-900">Your Resumes</h3>
                    <p className="text-slate-500 text-sm">Upload your latest CV or portfolio to apply for jobs.</p>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf" />
                  <Button 
                    label="Upload New PDF" 
                    icon={<Upload className="w-4 h-4 mr-2" />} 
                    className="bg-primary-600 border-none rounded-xl text-white"
                    onClick={() => fileInputRef.current.click()}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-slate-900 line-clamp-1 mb-1">{doc.originalName || doc.filename}</h4>
                        <p className="text-slate-400 text-xs mb-4 uppercase font-bold tracking-wider">{new Date(doc.created_at || Date.now()).toLocaleDateString()} • {(doc.size / 1024 / 1024).toFixed(2)} MB</p>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => handleDownload(doc.id, doc.originalName || doc.filename)}
                            className="text-xs font-bold text-primary-600 hover:underline flex items-center bg-transparent border-none p-0 cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" /> Download
                          </button>
                          <Button label="Delete" className="p-button-text p-button-xs font-bold text-red-500 p-0" onClick={() => deleteDocument(doc.id)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabPanel>
          </TabView>
        </Card>
      </div>

      <Dialog 
        header="Edit Profile" 
        visible={showEditProfile} 
        onHide={() => setShowEditProfile(false)}
        className="w-full max-w-md mx-4"
      >
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <InputText value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full" placeholder="Your name" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button label="Cancel" className="flex-1 p-button-text text-slate-500" onClick={() => setShowEditProfile(false)} />
            <Button label={updating ? "Updating..." : "Save Changes"} className="flex-2 bg-primary-600 border-none rounded-xl font-bold text-white" onClick={handleUpdateProfile} disabled={updating} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Profile;
