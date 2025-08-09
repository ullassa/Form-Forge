import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  updateFieldValue,
  setFieldError,
  setFormValid,
  setSubmitting,
  setSubmitSuccess,
  resetForm as resetPreviewForm,
} from '../../store/slices/previewSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DynamicField from './DynamicField';
import { validateField } from '../../utils/validation';
import { updateDerivedFields } from '../../utils/derivedFields';
import { CheckCircle, RefreshCw, Send } from 'lucide-react';

const FormRenderer: React.FC = () => {
  const dispatch = useDispatch();
  const { previewForm, formValues, fieldErrors, isValid, isSubmitting, submitSuccess } = useSelector(
    (state: RootState) => state.preview
  );

  useEffect(() => {
    if (previewForm) {
      validateAllFields();
    }
  }, [previewForm, formValues]);

  const validateAllFields = () => {
    if (!previewForm) return;

    let hasErrors = false;
    previewForm.fields.forEach(field => {
      const errors = validateField(field, formValues[field.id]);
      if (errors.length > 0) {
        hasErrors = true;
        dispatch(setFieldError({ fieldId: field.id, errors }));
      } else {
        dispatch(setFieldError({ fieldId: field.id, errors: [] }));
      }
    });

    dispatch(setFormValid(!hasErrors));
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    if (!previewForm) return;

    // Update derived fields if this field has dependencies
    const updatedValues = updateDerivedFields(fieldId, value, previewForm.fields, formValues);
    
    // Update all changed values
    Object.entries(updatedValues).forEach(([id, val]) => {
      dispatch(updateFieldValue({ fieldId: id, value: val }));
    });

    // Validate the changed field
    const field = previewForm.fields.find(f => f.id === fieldId);
    if (field) {
      const errors = validateField(field, value);
      dispatch(setFieldError({ fieldId, errors }));
    }
  };

  const handleFieldBlur = (fieldId: string) => {
    if (!previewForm) return;

    const field = previewForm.fields.find(f => f.id === fieldId);
    if (field) {
      const errors = validateField(field, formValues[fieldId]);
      dispatch(setFieldError({ fieldId, errors }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid || !previewForm) return;

    dispatch(setSubmitting(true));
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch(setSubmitSuccess(true));
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        dispatch(setSubmitSuccess(false));
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleReset = () => {
    dispatch(resetPreviewForm());
  };

  if (!previewForm) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No form selected for preview</p>
            <p className="text-sm mt-2">Go to Create page to build a form first</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {previewForm.name || 'Form Preview'}
          </CardTitle>
          {previewForm.description && (
            <p className="text-gray-600 dark:text-gray-400">
              {previewForm.description}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {previewForm.fields
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <div
                    key={field.id}
                    className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                  >
                    <DynamicField
                      field={field}
                      value={formValues[field.id]}
                      error={fieldErrors[field.id]}
                      onChange={(value) => handleFieldChange(field.id, value)}
                      onBlur={() => handleFieldBlur(field.id)}
                    />
                  </div>
                ))}
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="min-w-32"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Form
                  </>
                )}
              </Button>
            </div>
          </form>

          {submitSuccess && (
            <Alert className="mt-6 border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                Form submitted successfully! All validation checks passed.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FormRenderer;
