import { useState, useEffect, useRef } from 'react';
import { companiesApi } from '../api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Building, Plus, Pencil, Trash2, MapPin } from 'lucide-react';

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '', description: '' });
  const toast = useRef(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await companiesApi.getAll();
      setCompanies(response.data.data.companies);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch companies' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingCompany) {
        await companiesApi.update(editingCompany.id, formData);
        toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Company updated successfully' });
      } else {
        await companiesApi.create(formData);
        toast.current.show({ severity: 'success', summary: 'Created', detail: 'Company created successfully' });
      }
      setShowDialog(false);
      fetchCompanies();
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'Operation failed' });
    }
  };

  const confirmDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companiesApi.delete(id);
        toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Company removed' });
        fetchCompanies();
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete company' });
      }
    }
  };

  const openNew = () => {
    setEditingCompany(null);
    setFormData({ name: '', location: '', description: '' });
    setShowDialog(true);
  };

  const openEdit = (company) => {
    setEditingCompany(company);
    setFormData({ name: company.name, location: company.location, description: company.description });
    setShowDialog(true);
  };

  const actionTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button icon={<Pencil className="w-4 h-4" />} className="p-button-text p-button-warning" onClick={() => openEdit(rowData)} />
      <Button icon={<Trash2 className="w-4 h-4" />} className="p-button-text p-button-danger" onClick={() => confirmDelete(rowData.id)} />
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Toast ref={toast} />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Companies</h1>
            <p className="text-slate-500">Register and manage company profiles for job listings.</p>
          </div>
          <Button label="Add New Company" icon={<Plus className="w-4 h-4 mr-2" />} className="bg-primary-600 border-none rounded-xl text-white" onClick={openNew} />
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden p-6">
          <DataTable value={companies} loading={loading} responsiveLayout="stack" paginator rows={10} className="p-datatable-sm">
            <Column field="name" header="Company Name" body={(row) => <span className="font-bold">{row.name}</span>}></Column>
            <Column field="location" header="Location" body={(row) => (
              <div className="flex items-center text-slate-500 text-sm">
                <MapPin className="w-3 h-3 mr-1" /> {row.location}
              </div>
            )}></Column>
            <Column field="description" header="Description" body={(row) => <span className="line-clamp-1 text-slate-400 text-sm">{row.description}</span>}></Column>
            <Column body={actionTemplate} header="Actions" style={{ width: '100px' }}></Column>
          </DataTable>
        </div>
      </div>

      <Dialog 
        header={editingCompany ? 'Edit Company' : 'New Company'} 
        visible={showDialog} 
        onHide={() => setShowDialog(false)}
        className="w-full max-w-lg mx-4"
      >
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Company Name</label>
            <InputText value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full" placeholder="e.g. Google" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Location</label>
            <InputText value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full" placeholder="e.g. Jakarta, Indonesia" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <InputTextarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full" rows={4} placeholder="Tell us about the company..." />
          </div>
          <div className="flex gap-3 pt-4">
            <Button label="Cancel" className="flex-1 p-button-text text-slate-500" onClick={() => setShowDialog(false)} />
            <Button label="Save Company" className="flex-2 bg-primary-600 border-none rounded-xl font-bold text-white" onClick={handleSave} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ManageCompanies;
