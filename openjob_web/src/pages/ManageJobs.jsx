import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { jobsApi, companiesApi, categoriesApi } from '../api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { Briefcase, Plus, Pencil, Trash2, Tag, Building, DollarSign, Users, TrendingUp } from 'lucide-react';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyId: '',
    categoryId: '',
    salary: 0,
    type: 'Full-time',
    status: 'Open'
  });
  const toast = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, compRes, catRes] = await Promise.all([
        jobsApi.getAll(),
        companiesApi.getAll(),
        categoriesApi.getAll()
      ]);
      setJobs(jobsRes.data.data.jobs);
      setCompanies(compRes.data.data.companies.map(c => ({ label: c.name, value: c.id })));
      setCategories(catRes.data.data.categories.map(c => ({ label: c.name, value: c.id })));
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingJob) {
        await jobsApi.update(editingJob.id, formData);
        toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Job updated successfully' });
      } else {
        await jobsApi.create(formData);
        toast.current.show({ severity: 'success', summary: 'Created', detail: 'Job created successfully' });
      }
      setShowDialog(false);
      fetchData();
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'Operation failed' });
    }
  };

  const confirmDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      try {
        await jobsApi.delete(id);
        toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Job listing removed' });
        fetchData();
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete job' });
      }
    }
  };

  const openNew = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      description: '',
      companyId: companies[0]?.value || '',
      categoryId: categories[0]?.value || '',
      salary: 0,
      type: 'Full-time',
      status: 'Open'
    });
    setShowDialog(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      companyId: job.company_id,
      categoryId: job.category_id,
      salary: job.salary,
      type: job.type || 'Full-time',
      status: job.status || 'Open'
    });
    setShowDialog(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Toast ref={toast} />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Job Postings</h1>
            <p className="text-slate-500">Create and manage job opportunities for candidates.</p>
          </div>
          <Button label="Post New Job" icon={<Plus className="w-4 h-4 mr-2" />} className="bg-primary-600 border-none rounded-xl text-white" onClick={openNew} />
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden p-6">
          <DataTable value={jobs} loading={loading} responsiveLayout="stack" paginator rows={10} className="p-datatable-sm">
            <Column field="title" header="Job Title" body={(row) => <span className="font-bold">{row.title}</span>}></Column>
            <Column field="company_name" header="Company" body={(row) => (
              <div className="flex items-center text-slate-500 text-sm">
                <Building className="w-3 h-3 mr-1" /> {row.company_name}
              </div>
            )}></Column>
            <Column field="category_name" header="Category" body={(row) => (
              <div className="flex items-center text-slate-500 text-sm">
                <Tag className="w-3 h-3 mr-1" /> {row.category_name}
              </div>
            )}></Column>
            <Column field="salary" header="Salary" body={(row) => <span className="text-sm font-bold text-emerald-600">${row.salary?.toLocaleString()}</span>}></Column>
            <Column field="status" header="Status" body={(row) => (
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${row.status === 'Open' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {row.status}
              </span>
            )}></Column>
            <Column body={(row) => (
              <div className="flex gap-2">
                <Link to={`/manage/jobs/${row.id}/applications`}>
                  <Button icon={<Users className="w-4 h-4" />} className="p-button-text p-button-info" tooltip="View Applicants" />
                </Link>
                <Button icon={<Pencil className="w-4 h-4" />} className="p-button-text p-button-warning" onClick={() => openEdit(row)} tooltip="Edit Job" />
                <Button icon={<Trash2 className="w-4 h-4" />} className="p-button-text p-button-danger" onClick={() => confirmDelete(row.id)} tooltip="Delete Job" />
              </div>
            )} header="Actions" style={{ width: '150px' }}></Column>
          </DataTable>
        </div>
      </div>

      <Dialog 
        header={editingJob ? 'Edit Job Posting' : 'New Job Posting'} 
        visible={showDialog} 
        onHide={() => setShowDialog(false)}
        className="w-full max-w-2xl mx-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Job Title</label>
            <InputText value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full" placeholder="e.g. Senior Frontend Developer" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Company</label>
            <Dropdown value={formData.companyId} options={companies} onChange={(e) => setFormData({...formData, companyId: e.value})} className="w-full" placeholder="Select Company" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Category</label>
            <Dropdown value={formData.categoryId} options={categories} onChange={(e) => setFormData({...formData, categoryId: e.value})} className="w-full" placeholder="Select Category" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Salary (Monthly)</label>
            <InputNumber value={formData.salary} onValueChange={(e) => setFormData({...formData, salary: e.value})} className="w-full" mode="currency" currency="USD" locale="en-US" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Job Type</label>
            <Dropdown 
              value={formData.type} 
              options={['Full-time', 'Part-time', 'Contract', 'Internship']} 
              onChange={(e) => setFormData({...formData, type: e.value})} 
              className="w-full" 
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <InputTextarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full" rows={6} placeholder="Detailed job description..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Status</label>
            <Dropdown 
              value={formData.status} 
              options={['Open', 'Closed']} 
              onChange={(e) => setFormData({...formData, status: e.value})} 
              className="w-full" 
            />
          </div>

          <div className="flex gap-3 pt-6 md:col-span-2">
            <Button label="Cancel" className="flex-1 p-button-text text-slate-500" onClick={() => setShowDialog(false)} />
            <Button label="Save Job Posting" className="flex-2 bg-primary-600 border-none rounded-xl font-bold text-white" onClick={handleSave} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ManageJobs;
