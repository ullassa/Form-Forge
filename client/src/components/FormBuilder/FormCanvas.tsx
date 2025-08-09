import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addField, deleteField, selectField, reorderFields } from '../../store/slices/formBuilderSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DraggableField from './DraggableField';
import { FormField, FieldType } from '@shared/schema';
import { generateId } from '../../utils/helpers';
import { Save, Grip } from 'lucide-react';

interface FormCanvasProps {
  onSaveForm: () => void;
  onEditField: (fieldId: string) => void;
}

const FormCanvas: React.FC<FormCanvasProps> = ({ onSaveForm, onEditField }) => {
  const dispatch = useDispatch();
  const { currentForm, selectedFieldId } = useSelector((state: RootState) => state.formBuilder);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const fieldType = e.dataTransfer.getData('fieldType') as FieldType;
    const fieldId = e.dataTransfer.getData('fieldId');
    
    if (fieldType && !fieldId) {
      // Adding a new field
      const newField: Omit<FormField, 'id' | 'order'> = {
        type: fieldType,
        label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
        required: false,
        validationRules: [],
        isDerived: false,
        placeholder: `Enter ${fieldType}`,
        options: ['select', 'radio', 'checkbox'].includes(fieldType) ? ['Option 1', 'Option 2'] : undefined,
      };
      
      dispatch(addField(newField));
    }
    // Field reordering would be handled here if needed
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFieldDragStart = (e: React.DragEvent, fieldId: string) => {
    e.dataTransfer.setData('fieldId', fieldId);
  };

  const handleFieldSelect = (fieldId: string) => {
    dispatch(selectField(fieldId));
  };

  const handleFieldDelete = (fieldId: string) => {
    dispatch(deleteField(fieldId));
  };

  const fields = currentForm.fields || [];

  return (
    <Card className="h-fit min-h-96">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">🔧</span>
            Form Canvas
          </CardTitle>
          <Button onClick={onSaveForm} className="flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Save Form
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 min-h-80 transition-colors hover:border-primary/50 hover:bg-primary/5"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('border-primary', 'bg-primary/10');
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              e.currentTarget.classList.remove('border-primary', 'bg-primary/10');
            }
          }}
        >
          {fields.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Grip className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Drag field types here to build your form</p>
              <p className="text-sm">Click on fields to configure validation and properties</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <DraggableField
                    key={field.id}
                    field={field}
                    isSelected={selectedFieldId === field.id}
                    onSelect={handleFieldSelect}
                    onEdit={onEditField}
                    onDelete={handleFieldDelete}
                    onDragStart={handleFieldDragStart}
                    onDragEnd={() => {}}
                  />
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormCanvas;
