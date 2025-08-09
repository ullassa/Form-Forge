import React from 'react';
import { Form } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Eye, 
  Edit, 
  Trash2, 
  Copy 
} from 'lucide-react';

interface FormCardProps {
  form: Form;
  onPreview: (form: Form) => void;
  onEdit: (form: Form) => void;
  onDelete: (formId: string) => void;
  onDuplicate: (form: Form) => void;
}

const FormCard: React.FC<FormCardProps> = ({
  form,
  onPreview,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const fieldCount = form.fields.length;
  const derivedFieldCount = form.fields.filter(f => f.isDerived).length;

  const getFormIcon = () => {
    if (fieldCount <= 5) return '📝';
    if (fieldCount <= 10) return '📋';
    return '📄';
  };

  const getFormColor = () => {
    if (fieldCount <= 5) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    if (fieldCount <= 10) return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
    return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFormColor()}`}>
              <span className="text-lg">{getFormIcon()}</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {form.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {fieldCount} fields
                </span>
                {derivedFieldCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {derivedFieldCount} derived
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(form)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDuplicate(form)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700"
              onClick={() => onDelete(form.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {form.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {form.description}
          </p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Created: {formatDate(form.createdAt)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-2" />
            <span>Modified: {formatRelativeTime(form.updatedAt)}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            className="flex-1"
            onClick={() => onPreview(form)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormCard;
