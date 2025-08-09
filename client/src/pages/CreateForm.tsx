import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { RootState } from '../store';
import { setFormName, setFormDescription, setFormFields, resetForm, setDraggedFieldType, addField, selectField } from '../store/slices/formBuilderSlice';
import { FieldType } from '@shared/schema';
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
import UserGuide from '../components/Help/UserGuide';
import { saveFormToStorage } from '../utils/storage';
import { generateId } from '../utils/helpers';
import { Form } from '@shared/schema';
import { createSoftwareDeveloperForm, createContactForm } from '../utils/sampleForms';

const CreateForm: React.FC = () => {
  const [, setLocation] = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);
  
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
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

  const loadTemplate = (templateType: 'developer' | 'contact') => {
    const template = templateType === 'developer' 
      ? createSoftwareDeveloperForm() 
      : createContactForm();
    
    console.log('Loading template:', template);
    
    dispatch(setFormName(template.name));
    dispatch(setFormDescription(template.description || ''));
    dispatch(setFormFields(template.fields));
    
    toast({
      title: "Template Loaded",
      description: `${template.name} has been loaded successfully!`,
    });
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
          <Button variant="outline" onClick={() => setShowGuide(!showGuide)}>
            {showGuide ? 'Hide Guide' : 'How to Use'}
          </Button>
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

      {/* Quick Start Templates */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">Quick Start Templates</h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">Load pre-built forms to get started quickly:</p>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => loadTemplate('developer')}
            className="text-blue-700 border-blue-300 hover:bg-blue-100"
          >
            Software Developer Form
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => loadTemplate('contact')}
            className="text-blue-700 border-blue-300 hover:bg-blue-100"
          >
            Contact Form
          </Button>
        </div>

        {/* Debug Buttons */}
        <div className="flex space-x-2 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              console.log('Creating comprehensive test form...');
              // Create multiple test fields
              const testFields = [
                {
                  type: 'text' as FieldType,
                  label: 'Full Name',
                  required: true,
                  placeholder: 'Enter your full name',
                  validationRules: [],
                  isDerived: false,
                },
                {
                  type: 'email' as FieldType,
                  label: 'Email Address',
                  required: true,
                  placeholder: 'Enter your email',
                  validationRules: [],
                  isDerived: false,
                },
                {
                  type: 'select' as FieldType,
                  label: 'Country',
                  required: false,
                  options: ['USA', 'Canada', 'UK', 'Australia'],
                  placeholder: 'Select your country',
                  validationRules: [],
                  isDerived: false,
                }
              ];
              
              // Add each field
              testFields.forEach(fieldData => {
                dispatch(addField(fieldData));
              });
              
              console.log('Test form created with', testFields.length, 'fields');
              
              // Auto-select the first field after a short delay
              setTimeout(() => {
                if (currentForm.fields && currentForm.fields.length > 0) {
                  const firstField = currentForm.fields[0];
                  console.log('Auto-selecting first field:', firstField.id);
                  dispatch(selectField(firstField.id));
                }
              }, 500);
            }}
            className="text-blue-700 border-blue-300 hover:bg-blue-100"
          >
            🚀 Create Test Form
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              dispatch(addField({
                type: 'text' as FieldType,
                label: 'Test Field',
                required: false,
                placeholder: 'Test placeholder',
                validationRules: [],
                isDerived: false,
              }));
            }}
            className="text-green-700 border-green-300 hover:bg-green-100"
          >
            Add Test Field
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              console.log('Debug button clicked - current form fields:', currentForm.fields);
              if (currentForm.fields && currentForm.fields.length > 0) {
                const firstField = currentForm.fields[0];
                console.log('Manually selecting first field:', firstField.id, firstField.label);
                dispatch(selectField(firstField.id));
              } else {
                console.log('No fields available to select');
              }
            }}
            className="text-purple-700 border-purple-300 hover:bg-purple-100"
          >
            Debug: Select First Field
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              alert('Simple click test works!');
            }}
            className="text-orange-700 border-orange-300 hover:bg-orange-100"
          >
            Click Test
          </Button>
        </div>
      </div>

      {/* User Guide */}
      {showGuide && (
        <div className="mb-6">
          <UserGuide />
        </div>
      )}

      {/* Main Form Builder Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Field Types Panel */}
        <div className="xl:col-span-1 order-1 xl:order-1">
          <div className="sticky top-20">
            <FieldTypesPanel
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>
        </div>

        {/* Form Canvas */}
        <div className="xl:col-span-2 order-2 xl:order-2">
          <FormCanvas
            onSaveForm={handleSaveForm}
            onEditField={handleEditField}
          />
        </div>

        {/* Field Configuration Panel */}
        <div className="xl:col-span-1 order-3 xl:order-3">
          <div className="sticky top-20">
            <FieldConfigPanel />
          </div>
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
