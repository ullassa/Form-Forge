import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { RootState } from '../store';
import { setFormName, setFormDescription, resetForm, setDraggedFieldType } from '../store/slices/formBuilderSlice';
import { addForm } from '../store/slices/savedFormsSlice';
import { setPreviewForm } from '../store/slices/previewSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import FieldTypesPanel from '../components/FormBuilder/FieldTypesPanel';
import FormCanvas from '../components/FormBuilder/FormCanvas';
import FieldConfigPanel from '../components/FormBuilder/FieldConfigPanel';
import { saveFormToStorage } from '../utils/storage';
import { generateId } from '../utils/helpers';
import { Form } from '@shared/schema';

const CreateForm: React.FC = () => {
  const [, setLocation] = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);
  
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [formName, setFormNameLocal] = useState(currentForm.name || '');
  const [formDescription, setFormDescriptionLocal] = useState(currentForm.description || '');

  const handleDragStart = (fieldType: string) => {
    dispatch(setDraggedFieldType(fieldType));
  };

  const handleDragEnd = () => {
    dispatch(setDraggedFieldType(null));
  };

  const handleSaveForm = () => {
    if (!currentForm.fields || currentForm.fields.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one field to save the form",
        variant: "destructive",
      });
      return;
    }
    setShowSaveDialog(true);
  };

  const handleConfirmSave = async () => {
    try {
      const now = new Date().toISOString();
      const form: Form = {
        id: currentForm.id || generateId(),
        name: formName,
        description: formDescription,
        fields: currentForm.fields || [],
        createdAt: currentForm.createdAt || now,
        updatedAt: now,
      };

      saveFormToStorage(form);
      dispatch(addForm(form));
      dispatch(setFormName(formName));
      dispatch(setFormDescription(formDescription));
      
      setShowSaveDialog(false);
      
      toast({
        title: "Success",
        description: "Form saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save form",
        variant: "destructive",
      });
    }
  };

  const handlePreviewForm = () => {
    if (!currentForm.fields || currentForm.fields.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one field to preview the form",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();
    const previewForm: Form = {
      id: currentForm.id || generateId(),
      name: currentForm.name || 'Untitled Form',
      description: currentForm.description || '',
      fields: currentForm.fields,
      createdAt: currentForm.createdAt || now,
      updatedAt: now,
    };

    dispatch(setPreviewForm(previewForm));
    setLocation('/preview');
  };

  const handleNewForm = () => {
    dispatch(resetForm());
    setFormNameLocal('');
    setFormDescriptionLocal('');
  };

  const handleEditField = (fieldId: string) => {
    // Field selection and editing is handled by the FieldConfigPanel
    // This could be used for additional logic if needed
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Form</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Build dynamic forms with customizable fields and validation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleNewForm}>
            New Form
          </Button>
          <Button variant="outline" onClick={handlePreviewForm}>
            Preview
          </Button>
        </div>
      </div>

      {/* Form Name and Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="form-name">Form Name</Label>
          <Input
            id="form-name"
            value={currentForm.name || ''}
            onChange={(e) => dispatch(setFormName(e.target.value))}
            placeholder="Enter form name"
          />
        </div>
        <div>
          <Label htmlFor="form-description">Description (Optional)</Label>
          <Input
            id="form-description"
            value={currentForm.description || ''}
            onChange={(e) => dispatch(setFormDescription(e.target.value))}
            placeholder="Brief description of the form"
          />
        </div>
      </div>

      {/* Main Form Builder Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Field Types Panel */}
        <div className="lg:col-span-1">
          <FieldTypesPanel
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        </div>

        {/* Form Canvas */}
        <div className="lg:col-span-2">
          <FormCanvas
            onSaveForm={handleSaveForm}
            onEditField={handleEditField}
          />
        </div>

        {/* Field Configuration Panel */}
        <div className="lg:col-span-1">
          <FieldConfigPanel />
        </div>
      </div>

      {/* Save Form Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="save-form-name">Form Name *</Label>
              <Input
                id="save-form-name"
                value={formName}
                onChange={(e) => setFormNameLocal(e.target.value)}
                placeholder="Enter form name"
                required
              />
            </div>
            <div>
              <Label htmlFor="save-form-description">Description</Label>
              <Textarea
                id="save-form-description"
                value={formDescription}
                onChange={(e) => setFormDescriptionLocal(e.target.value)}
                placeholder="Optional description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSave}
              disabled={!formName.trim()}
            >
              Save Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateForm;
