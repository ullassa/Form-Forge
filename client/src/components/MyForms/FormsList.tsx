import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { RootState } from '../../store';
import { setForms, deleteForm, setSearchQuery, setSortBy } from '../../store/slices/savedFormsSlice';
import { setPreviewForm } from '../../store/slices/previewSlice';
import { loadForm } from '../../store/slices/formBuilderSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import FormCard from './FormCard';
import { getFormsFromStorage, deleteFormFromStorage, saveFormToStorage } from '../../utils/storage';
import { generateId } from '../../utils/helpers';
import { Form } from '@shared/schema';
import { Search, Plus, FolderOpen } from 'lucide-react';

const FormsList: React.FC = () => {
  const [, setLocation] = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { forms, searchQuery, sortBy, sortOrder } = useSelector((state: RootState) => state.savedForms);

  useEffect(() => {
    loadFormsFromStorage();
  }, []);

  const loadFormsFromStorage = () => {
    try {
      const savedForms = getFormsFromStorage();
      dispatch(setForms(savedForms));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load saved forms",
        variant: "destructive",
      });
    }
  };

  const filteredAndSortedForms = forms
    .filter(form => 
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (form.description && form.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const handlePreview = (form: Form) => {
    dispatch(setPreviewForm(form));
    setLocation('/preview');
  };

  const handleEdit = (form: Form) => {
    dispatch(loadForm(form));
    setLocation('/create');
  };

  const handleDelete = async (formId: string) => {
    try {
      deleteFormFromStorage(formId);
      dispatch(deleteForm(formId));
      toast({
        title: "Success",
        description: "Form deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete form",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (form: Form) => {
    try {
      const duplicatedForm: Form = {
        ...form,
        id: generateId(),
        name: `${form.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      saveFormToStorage(duplicatedForm);
      loadFormsFromStorage();
      
      toast({
        title: "Success",
        description: "Form duplicated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate form",
        variant: "destructive",
      });
    }
  };

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleSortChange = (value: string) => {
    dispatch(setSortBy(value as 'name' | 'createdAt' | 'updatedAt'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Forms</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your saved form configurations
          </p>
        </div>
        <Button onClick={() => setLocation('/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt">Sort by: Recent</SelectItem>
                <SelectItem value="name">Sort by: Name</SelectItem>
                <SelectItem value="createdAt">Sort by: Created Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Forms Grid */}
      {filteredAndSortedForms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedForms.map((form) => (
            <FormCard
              key={form.id}
              form={form}
              onPreview={handlePreview}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'No forms found' : 'No forms created yet'}
              </h3>
              <p className="text-sm mb-4">
                {searchQuery 
                  ? 'Try adjusting your search criteria'
                  : 'Create your first form to get started'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setLocation('/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Form
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FormsList;
