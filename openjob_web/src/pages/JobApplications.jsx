import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationsApi, jobsApi } from '../api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Users, Mail, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const JobApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, jobRes] = await Promise.all([
        applicationsApi.getByJob(jobId),
        jobsApi.getById(jobId)
      ]);
      setApplications(appRes.data.data.applications);
      setJob(jobRes.data.data);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch applicants' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await applicationsApi.updateStatus(id, status);
      toast.current.show({ severity: 'success', summary: 'Updated', detail: `Status changed to ${status}` });
      fetchData();
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update status' });
    }
  };

  const statusTemplate = (rowData) => {
    const statuses = [
      { label: 'Pending', value: 'pending' },
      { label: 'Accepted', value: 'Accepted' },
      { label: 'Rejected', value: 'Rejected' }
    ];

    return (
      <Dropdown 
        value={rowData.status} 
        options={statuses} 
        onChange={(e) => updateStatus(rowData.id, e.value)}
        className={`w-32 text-xs font-bold ${
          rowData.status === 'Accepted' ? 'p-inputwrapper-filled bg-emerald-50 text-emerald-600' :
          rowData.status === 'Rejected' ? 'p-inputwrapper-filled bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'
        }`}
      />
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Toast ref={toast} />
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/manage/jobs" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Applicants for: {job?.title}</h1>
            <p className="text-slate-500">Review and manage candidates who applied for this position.</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden p-6">
          <DataTable value={applications} loading={loading} paginator rows={10} className="p-datatable-sm" emptyMessage="No applicants yet.">
            <Column field="user_name" header="Candidate Name" body={(row) => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-xs font-bold">
                  {row.user_name?.charAt(0)}
                </div>
                <span className="font-bold text-slate-900">{row.user_name}</span>
              </div>
            )}></Column>
            <Column field="email" header="Email" body={(row) => (
              <div className="flex items-center text-slate-500 text-sm">
                <Mail className="w-3 h-3 mr-2" /> {row.email}
              </div>
            )}></Column>
            <Column field="created_at" header="Applied On" body={(row) => (
              <div className="flex items-center text-slate-400 text-xs font-medium">
                <Clock className="w-3 h-3 mr-1" /> {new Date(row.created_at).toLocaleDateString()}
              </div>
            )}></Column>
            <Column header="Status Management" body={statusTemplate}></Column>
            <Column header="Actions" body={(row) => (
              <Button label="View Profile" className="p-button-text p-button-sm font-bold text-primary-600" />
            )}></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default JobApplications;
