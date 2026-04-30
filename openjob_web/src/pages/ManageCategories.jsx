import { useState, useEffect, useRef } from 'react';
import { categoriesApi } from '../api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Tag, Plus, Pencil, Trash2 } from 'lucide-react';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const toast = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data.data.categories);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch categories' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, formData);
        toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Category updated' });
      } else {
        await categoriesApi.create(formData);
        toast.current.show({ severity: 'success', summary: 'Created', detail: 'Category created' });
      }
      setShowDialog(false);
      fetchCategories();
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save category' });
    }
  };

  const confirmDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await categoriesApi.delete(id);
        toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Category removed' });
        fetchCategories();
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete' });
      }
    }
  };

  const openNew = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setShowDialog(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description });
    setShowDialog(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <Toast ref={toast} />
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Categories</h1>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Job Taxonomy</p>
            </div>
          </div>
          <Button 
            label="Create New Category" 
            icon={<Plus className="w-5 h-5 mr-2" />} 
            className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-primary-600 text-white border-none rounded-2xl font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95" 
            onClick={openNew} 
          />
        </div>

        {/* List Content */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <DataTable 
            value={categories} 
            loading={loading} 
            responsiveLayout="stack" 
            breakpoint="768px"
            paginator 
            rows={10} 
            className="custom-datatable"
            emptyMessage={
              <div className="py-20 text-center opacity-40">
                <Tag className="w-16 h-16 mx-auto mb-4" />
                <p className="font-bold uppercase tracking-widest text-xs">No categories added yet</p>
              </div>
            }
          >
            <Column field="name" header="CATEGORY NAME" body={(row) => (
              <div className="flex items-center gap-4 py-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <span className="text-lg font-black text-slate-900">{row.name}</span>
              </div>
            )}></Column>
            
            <Column field="description" header="DESCRIPTION" body={(row) => (
              <p className="text-slate-400 text-sm font-medium line-clamp-1 max-w-md">{row.description}</p>
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
                <Tag className="w-6 h-6 text-primary-600" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{editingCategory ? 'Update Category' : 'New Category'}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry Classification</p>
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
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Category Name</label>
            <InputText value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold" placeholder="e.g. Technology" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Detailed Description</label>
            <InputTextarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold" rows={4} placeholder="What kind of jobs belong here?" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button label="Cancel" className="flex-1 p-button-text text-slate-400 font-black order-2 sm:order-1" onClick={() => setShowDialog(false)} />
            <Button label={editingCategory ? "Update Category" : "Save Category"} className="flex-1 py-4 bg-slate-900 hover:bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 order-1 sm:order-2 transition-all" onClick={handleSave} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ManageCategories;
