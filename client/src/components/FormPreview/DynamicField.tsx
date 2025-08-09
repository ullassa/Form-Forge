import React from 'react';
import { FormField } from '@shared/schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface DynamicFieldProps {
  field: FormField;
  value: any;
  error?: string[];
  onChange: (value: any) => void;
  onBlur?: () => void;
}

const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  value,
  error,
  onChange,
  onBlur,
}) => {
  const hasError = error && error.length > 0;

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            className={hasError ? 'border-red-500' : ''}
            disabled={field.isDerived}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
            onBlur={onBlur}
            placeholder={field.placeholder}
            className={hasError ? 'border-red-500' : ''}
            disabled={field.isDerived}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            className={hasError ? 'border-red-500' : ''}
            disabled={field.isDerived}
            rows={4}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={hasError ? 'border-red-500' : ''}
            disabled={field.isDerived}
          />
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={onChange}
            disabled={field.isDerived}
          >
            <SelectTrigger className={hasError ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={onChange}
            disabled={field.isDerived}
            className="space-y-2"
          >
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        const checkboxValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => {
              const isChecked = checkboxValues.includes(option);
              return (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${index}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange([...checkboxValues, option]);
                      } else {
                        onChange(checkboxValues.filter((v: string) => v !== option));
                      }
                    }}
                    disabled={field.isDerived}
                  />
                  <Label htmlFor={`${field.id}-${index}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {field.isDerived && (
          <Badge variant="secondary" className="text-xs">
            Derived
          </Badge>
        )}
      </div>
      
      {renderField()}
      
      {field.isDerived && field.derivedConfig && (
        <p className="text-xs text-primary">
          Automatically calculated from parent field
        </p>
      )}
      
      {hasError && (
        <div className="space-y-1">
          {error.map((errorMsg, index) => (
            <p key={index} className="text-xs text-red-500">
              {errorMsg}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicField;
