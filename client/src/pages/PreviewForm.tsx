import React from 'react';
import FormRenderer from '../components/FormPreview/FormRenderer';

const PreviewForm: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Form Preview</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Test your form as an end user would experience it
        </p>
      </div>
      
      <FormRenderer />
    </div>
  );
};

export default PreviewForm;
