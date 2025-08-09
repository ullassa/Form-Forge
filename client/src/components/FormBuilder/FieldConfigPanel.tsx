import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateField } from '../../store/slices/formBuilderSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { FormField, ValidationRule, DerivedFieldConfig } from '@shared/schema';
import { Settings, Plus, Trash2 } from 'lucide-react';

const FieldConfigPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { currentForm, selectedFieldId } = useSelector((state: RootState) => state.formBuilder);
  
  const selectedField = currentForm.fields?.find(field => field.id === selectedFieldId);
  const [fieldConfig, setFieldConfig] = useState<FormField | null>(null);
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [derivedConfig, setDerivedConfig] = useState<DerivedFieldConfig | null>(null);

  useEffect(() => {
    console.log('FieldConfigPanel - selectedFieldId:', selectedFieldId);
    console.log('FieldConfigPanel - selectedField:', selectedField);
    if (selectedField) {
      setFieldConfig(selectedField);
      setValidationRules(selectedField.validationRules || []);
      setDerivedConfig(selectedField.derivedConfig || null);
    } else {
      setFieldConfig(null);
      setValidationRules([]);
      setDerivedConfig(null);
    }
  }, [selectedField, selectedFieldId]);

  const handleFieldUpdate = (updates: Partial<FormField>) => {
    if (fieldConfig) {
      const updatedField = { ...fieldConfig, ...updates };
      setFieldConfig(updatedField);
      dispatch(updateField(updatedField));
    }
  };

  const handleValidationRuleAdd = () => {
    const newRule: ValidationRule = {
      type: 'required',
      message: 'This field is required',
    };
    const updatedRules = [...validationRules, newRule];
    setValidationRules(updatedRules);
    handleFieldUpdate({ validationRules: updatedRules });
  };

  const handleValidationRuleUpdate = (index: number, updates: Partial<ValidationRule>) => {
    const updatedRules = validationRules.map((rule, i) => 
      i === index ? { ...rule, ...updates } : rule
    );
    setValidationRules(updatedRules);
    handleFieldUpdate({ validationRules: updatedRules });
  };

  const handleValidationRuleDelete = (index: number) => {
    const updatedRules = validationRules.filter((_, i) => i !== index);
    setValidationRules(updatedRules);
    handleFieldUpdate({ validationRules: updatedRules });
  };

  const handleDerivedConfigUpdate = (updates: Partial<DerivedFieldConfig>) => {
    const updatedConfig = derivedConfig ? { ...derivedConfig, ...updates } : updates as DerivedFieldConfig;
    setDerivedConfig(updatedConfig);
    handleFieldUpdate({ derivedConfig: updatedConfig });
  };

  const handleOptionsUpdate = (options: string[]) => {
    handleFieldUpdate({ options });
  };

  const addOption = () => {
    const currentOptions = fieldConfig?.options || [];
    const newOptions = [...currentOptions, `Option ${currentOptions.length + 1}`];
    handleOptionsUpdate(newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const currentOptions = fieldConfig?.options || [];
    const newOptions = currentOptions.map((opt, i) => i === index ? value : opt);
    handleOptionsUpdate(newOptions);
  };

  const removeOption = (index: number) => {
    const currentOptions = fieldConfig?.options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    handleOptionsUpdate(newOptions);
  };

  if (!fieldConfig) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Field Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Settings className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Select a field to configure its properties</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const parentFields = (currentForm.fields || []).filter(
    field => field.id !== fieldConfig.id && !field.isDerived
  );

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Field Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Field Properties */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="field-label">Field Label</Label>
            <Input
              id="field-label"
              value={fieldConfig.label}
              onChange={(e) => handleFieldUpdate({ label: e.target.value })}
              placeholder="Enter field label"
            />
          </div>
          
          <div>
            <Label htmlFor="field-type">Field Type</Label>
            <Select
              value={fieldConfig.type}
              onValueChange={(value) => handleFieldUpdate({ type: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="textarea">Textarea</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="radio">Radio</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="required-field">Required Field</Label>
            <Switch
              id="required-field"
              checked={fieldConfig.required}
              onCheckedChange={(checked) => handleFieldUpdate({ required: checked })}
            />
          </div>

          <div>
            <Label htmlFor="default-value">Default Value</Label>
            <Input
              id="default-value"
              value={fieldConfig.defaultValue || ''}
              onChange={(e) => handleFieldUpdate({ defaultValue: e.target.value })}
              placeholder="Optional default value"
            />
          </div>

          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={fieldConfig.placeholder || ''}
              onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
              placeholder="Field placeholder text"
            />
          </div>
        </div>

        {/* Options for Select, Radio, Checkbox */}
        {['select', 'radio', 'checkbox'].includes(fieldConfig.type) && (
          <>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Options</Label>
                <Button size="sm" onClick={addOption}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {(fieldConfig.options || []).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Validation Rules */}
        <Separator />
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Validation Rules</Label>
            <Button size="sm" onClick={handleValidationRuleAdd}>
              <Plus className="w-4 h-4 mr-1" />
              Add Rule
            </Button>
          </div>
          <div className="space-y-3">
            {validationRules.map((rule, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Select
                    value={rule.type}
                    onValueChange={(value) => handleValidationRuleUpdate(index, { type: value as any })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="required">Required</SelectItem>
                      <SelectItem value="minLength">Min Length</SelectItem>
                      <SelectItem value="maxLength">Max Length</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="password">Password</SelectItem>
                      <SelectItem value="min">Min Value</SelectItem>
                      <SelectItem value="max">Max Value</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleValidationRuleDelete(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {['minLength', 'maxLength', 'min', 'max'].includes(rule.type) && (
                  <Input
                    type="number"
                    value={rule.value || ''}
                    onChange={(e) => handleValidationRuleUpdate(index, { value: parseInt(e.target.value) })}
                    placeholder="Enter value"
                  />
                )}
                
                <Input
                  value={rule.message}
                  onChange={(e) => handleValidationRuleUpdate(index, { message: e.target.value })}
                  placeholder="Error message"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Derived Field Configuration */}
        <Separator />
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Derived Field</Label>
            <Switch
              checked={fieldConfig.isDerived}
              onCheckedChange={(checked) => {
                handleFieldUpdate({ isDerived: checked });
                if (!checked) {
                  setDerivedConfig(null);
                  handleFieldUpdate({ derivedConfig: undefined });
                } else {
                  const newConfig: DerivedFieldConfig = {
                    parentFieldId: '',
                    formula: '',
                    calculation: 'custom',
                  };
                  setDerivedConfig(newConfig);
                  handleFieldUpdate({ derivedConfig: newConfig });
                }
              }}
            />
          </div>
          
          {fieldConfig.isDerived && (
            <div className="space-y-3">
              <div>
                <Label>Parent Field</Label>
                <Select
                  value={derivedConfig?.parentFieldId || ''}
                  onValueChange={(value) => handleDerivedConfigUpdate({ parentFieldId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent field..." />
                  </SelectTrigger>
                  <SelectContent>
                    {parentFields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Calculation Type</Label>
                <Select
                  value={derivedConfig?.calculation || 'custom'}
                  onValueChange={(value) => handleDerivedConfigUpdate({ calculation: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="age">Age from Date</SelectItem>
                    <SelectItem value="sum">Sum</SelectItem>
                    <SelectItem value="difference">Difference</SelectItem>
                    <SelectItem value="custom">Custom Formula</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Formula</Label>
                <Textarea
                  value={derivedConfig?.formula || ''}
                  onChange={(e) => handleDerivedConfigUpdate({ formula: e.target.value })}
                  placeholder="e.g., currentYear - birthYear"
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>

        <Button className="w-full" onClick={() => handleFieldUpdate({})}>
          Apply Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default FieldConfigPanel;
