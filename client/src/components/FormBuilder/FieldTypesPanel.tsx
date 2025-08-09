import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldTypeOption } from '../../types/form';
import { 
  Type, 
  Hash, 
  AlignLeft, 
  ChevronDown, 
  Circle, 
  Square, 
  Calendar 
} from 'lucide-react';

const fieldTypes: FieldTypeOption[] = [
  { type: 'text', label: 'Text Input', icon: 'Type', color: 'text-blue-500' },
  { type: 'number', label: 'Number', icon: 'Hash', color: 'text-green-500' },
  { type: 'textarea', label: 'Textarea', icon: 'AlignLeft', color: 'text-purple-500' },
  { type: 'select', label: 'Select', icon: 'ChevronDown', color: 'text-yellow-500' },
  { type: 'radio', label: 'Radio', icon: 'Circle', color: 'text-red-500' },
  { type: 'checkbox', label: 'Checkbox', icon: 'Square', color: 'text-indigo-500' },
  { type: 'date', label: 'Date', icon: 'Calendar', color: 'text-pink-500' },
];

const iconMap = {
  Type,
  Hash,
  AlignLeft,
  ChevronDown,
  Circle,
  Square,
  Calendar,
};

interface FieldTypesPanelProps {
  onDragStart: (fieldType: string) => void;
  onDragEnd: () => void;
}

const FieldTypesPanel: React.FC<FieldTypesPanelProps> = ({ onDragStart, onDragEnd }) => {
  const handleDragStart = (e: React.DragEvent, fieldType: string) => {
    e.dataTransfer.setData('fieldType', fieldType);
    onDragStart(fieldType);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <span className="mr-2">🧩</span>
          Field Types
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {fieldTypes.map((fieldType) => {
            const IconComponent = iconMap[fieldType.icon as keyof typeof iconMap];
            return (
              <div
                key={fieldType.type}
                draggable
                onDragStart={(e) => handleDragStart(e, fieldType.type)}
                onDragEnd={onDragEnd}
                className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-move transition-all duration-200 hover:transform hover:translate-x-1 hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-5 h-5 ${fieldType.color}`} />
                  <span className="text-sm font-medium">{fieldType.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldTypesPanel;
