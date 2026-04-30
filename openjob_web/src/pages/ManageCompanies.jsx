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
    <div className="bg-slate-50 min-h-screen py-16">
      <Toast ref={toast} />
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Companies</h1>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Partner Directory</p>
            </div>
          </div>
          <Button 
            label="Add New Company" 
            icon={<Plus className="w-5 h-5 mr-2" />} 
            className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-primary-600 text-white border-none rounded-2xl font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95" 
            onClick={openNew} 
          />
        </div>

        {/* List Content */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <DataTable 
            value={companies} 
            loading={loading} 
            responsiveLayout="stack" 
            breakpoint="960px"
            paginator 
            rows={10} 
            className="custom-datatable"
            emptyMessage={
              <div className="py-20 text-center opacity-40">
                <Building className="w-16 h-16 mx-auto mb-4" />
                <p className="font-bold uppercase tracking-widest text-xs">No companies registered yet</p>
              </div>
            }
          >
            <Column field="name" header="COMPANY NAME" body={(row) => (
              <div className="flex items-center gap-4 py-3">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-slate-900/10 font-black text-xl">
                  {row.name.charAt(0)}
                </div>
                <span className="text-lg font-black text-slate-900">{row.name}</span>
              </div>
            )}></Column>
            
            <Column field="location" header="LOCATION" body={(row) => (
              <div className="flex items-center text-slate-500 font-bold">
                <MapPin className="w-4 h-4 mr-2 text-primary-500" /> {row.location}
              </div>
            )}></Column>

            <Column field="description" header="ABOUT" body={(row) => (
              <p className="text-slate-400 text-sm font-medium line-clamp-1 max-w-xs">{row.description}</p>
            )}></Column>

            <Column header="ACTIONS" body={(row) => (
              <div className="flex gap-3 md:justify-end py-2">
                <button 
                  onClick={() => openEdit(row)}
                  className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => confirmDelete(row.id)}
                  className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}></Column>
          </DataTable>
        </div>
      </div>

      <Dialog 
        header={
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
                <Building className="w-6 h-6 text-primary-600" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{editingCompany ? 'Update Profile' : 'Register Company'}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Configuration</p>
             </div>
          </div>
        } 
        visible={showDialog} 
        onHide={() => setShowDialog(false)}
        className="w-full max-w-lg mx-4"
        contentClassName="!pt-6"
      >
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Official Name</label>
            <InputText value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold" placeholder="e.g. Acme Corporation" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Headquarters</label>
            <InputText value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold" placeholder="e.g. Tokyo, Japan" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Description</label>
            <InputTextarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold" rows={4} placeholder="Brief company overview..." />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button label="Cancel" className="flex-1 p-button-text text-slate-400 font-black order-2 sm:order-1" onClick={() => setShowDialog(false)} />
            <Button label={editingCompany ? "Update Company" : "Create Company"} className="flex-1 py-4 bg-slate-900 hover:bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 order-1 sm:order-2 transition-all" onClick={handleSave} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ManageCompanies;
