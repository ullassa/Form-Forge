import React, { useRef, useEffect } from 'react';
import { FormField } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Edit, Trash2 } from 'lucide-react';

interface DraggableFieldProps {
  field: FormField;
  isSelected: boolean;
  onSelect: (fieldId: string) => void;
  onEdit: (fieldId: string) => void;
  onDelete: (fieldId: string) => void;
  onDragStart: (e: React.DragEvent, fieldId: string) => void;
  onDragEnd: () => void;
}

const DraggableField: React.FC<DraggableFieldProps> = ({
  field,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      console.log('Direct event listener clicked - field:', field.id, field.label);
      e.preventDefault();
      e.stopPropagation();
      onSelect(field.id);
    };
    
    const cardElement = cardRef.current;
    if (cardElement) {
      cardElement.addEventListener('click', handleClick);
      console.log('Added direct event listener to field:', field.id);
      
      return () => {
        cardElement.removeEventListener('click', handleClick);
        console.log('Removed direct event listener from field:', field.id);
      };
    }
  }, [field.id, onSelect]);
  
  const renderFieldPreview = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            defaultValue={field.defaultValue}
            disabled
          />
        );
      case 'number':
        return (
          <input
            type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            defaultValue={field.defaultValue}
            disabled
          />
        );
      case 'textarea':
        return (
          <textarea
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            defaultValue={field.defaultValue}
            rows={3}
            disabled
          />
        );
      case 'select':
        return (
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            defaultValue={field.defaultValue}
            disabled
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  className="mr-2"
                  defaultChecked={field.defaultValue === option}
                  disabled
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  className="mr-2"
                  defaultChecked={Array.isArray(field.defaultValue) && field.defaultValue.includes(option)}
                  disabled
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'date':
        return (
          <input
            type="date"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            defaultValue={field.defaultValue}
            disabled
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`group relative p-4 transition-all duration-200 cursor-pointer border rounded-lg shadow-sm ${
        isSelected
          ? 'ring-2 ring-primary border-primary bg-primary/10'
          : 'hover:border-gray-300 dark:hover:border-gray-500 border-gray-200 dark:border-gray-700'
      } ${
        field.isDerived
          ? 'border-primary/50 bg-primary/5 dark:bg-primary/10'
          : 'bg-gray-50 dark:bg-gray-700'
      }`}
      onClick={(e) => {
        console.log('🎯 DIRECT DIV onClick - field:', field.id, field.label);
        console.log('🎯 Event details:', { target: e.target, currentTarget: e.currentTarget });
        console.log('🎯 isSelected before click:', isSelected);
        e.preventDefault();
        e.stopPropagation();
        onSelect(field.id);
        console.log('🎯 onSelect called for field:', field.id);
      }}
      draggable={false}
      onDragStart={(e) => onDragStart(e, field.id)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {field.label}
              </label>
              {field.required && (
                <span className="text-red-500 text-sm">*</span>
              )}
              {field.isDerived && (
                <Badge variant="secondary" className="text-xs">
                  Derived
                </Badge>
              )}
            </div>
            {renderFieldPreview()}
            {field.isDerived && field.derivedConfig && (
              <span className="text-xs text-primary mt-1 block">
                Calculated from parent field
              </span>
            )}
            {field.required && (
              <span className="text-xs text-red-500 mt-1 block">
                * Required field
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(field.id);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(field.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DraggableField;
