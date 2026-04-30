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
    <div className="bg-slate-50 min-h-screen py-12">
      <Toast ref={toast} />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Categories</h1>
            <p className="text-slate-500">Organize jobs into searchable categories.</p>
          </div>
          <Button label="New Category" icon={<Plus className="w-4 h-4 mr-2" />} className="bg-primary-600 border-none rounded-xl text-white" onClick={openNew} />
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden p-6">
          <DataTable value={categories} loading={loading} responsiveLayout="stack" paginator rows={10} className="p-datatable-sm">
            <Column field="name" header="Category Name" body={(row) => <span className="font-bold">{row.name}</span>}></Column>
            <Column field="description" header="Description" body={(row) => <span className="text-slate-500 text-sm">{row.description}</span>}></Column>
            <Column body={(row) => (
              <div className="flex gap-2">
                <Button icon={<Pencil className="w-4 h-4" />} className="p-button-text p-button-warning" onClick={() => openEdit(row)} />
                <Button icon={<Trash2 className="w-4 h-4" />} className="p-button-text p-button-danger" onClick={() => confirmDelete(row.id)} />
              </div>
            )} header="Actions" style={{ width: '100px' }}></Column>
          </DataTable>
        </div>
      </div>

      <Dialog 
        header={editingCategory ? 'Edit Category' : 'New Category'} 
        visible={showDialog} 
        onHide={() => setShowDialog(false)}
        className="w-full max-w-lg mx-4"
      >
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Name</label>
            <InputText value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full" placeholder="e.g. Engineering" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <InputTextarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full" rows={4} placeholder="Description..." />
          </div>
          <div className="flex gap-3 pt-4">
            <Button label="Cancel" className="flex-1 p-button-text text-slate-500" onClick={() => setShowDialog(false)} />
            <Button label="Save Category" className="flex-2 bg-primary-600 border-none rounded-xl font-bold text-white" onClick={handleSave} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ManageCategories;
