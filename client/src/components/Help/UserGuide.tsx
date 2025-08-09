import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play,
  PlusCircle,
  Settings,
  Eye,
  Save,
  FileText,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const UserGuide: React.FC = () => {
  const steps = [
    {
      title: "1. Start Building",
      description: "Begin creating your form by dragging field types from the left panel",
      icon: <PlusCircle className="w-5 h-5" />,
      details: [
        "Choose from 7 field types: Text, Number, Textarea, Select, Radio, Checkbox, Date",
        "Simply drag and drop field types onto the form canvas",
        "Fields are automatically added to your form structure"
      ]
    },
    {
      title: "2. Configure Fields",
      description: "Click on any field to customize its properties and validation",
      icon: <Settings className="w-5 h-5" />,
      details: [
        "Set field labels, placeholders, and default values",
        "Add validation rules (required, length limits, email format, etc.)",
        "Configure derived fields that calculate from other fields",
        "Reorder fields by dragging them around"
      ]
    },
    {
      title: "3. Preview & Test",
      description: "Test your form exactly as users will experience it",
      icon: <Eye className="w-5 h-5" />,
      details: [
        "Real-time form preview with live validation",
        "Test all field interactions and derived calculations",
        "See validation errors as they would appear to users",
        "Submit the form to verify everything works correctly"
      ]
    },
    {
      title: "4. Save & Manage",
      description: "Save your forms and manage them from the My Forms section",
      icon: <Save className="w-5 h-5" />,
      details: [
        "Give your form a name and optional description",
        "Forms are automatically saved to your browser",
        "Search, sort, and organize your saved forms",
        "Edit, duplicate, or delete forms as needed"
      ]
    }
  ];

  const features = [
    {
      title: "Advanced Validation",
      description: "Set up complex validation rules for each field",
      icon: <CheckCircle className="w-4 h-4 text-green-500" />
    },
    {
      title: "Derived Fields",
      description: "Create fields that automatically calculate values from other fields",
      icon: <Zap className="w-4 h-4 text-yellow-500" />
    },
    {
      title: "Drag & Drop",
      description: "Intuitive drag-and-drop interface for building forms",
      icon: <Play className="w-4 h-4 text-blue-500" />
    },
    {
      title: "Real-time Preview",
      description: "See exactly how your form will look and behave",
      icon: <Eye className="w-4 h-4 text-purple-500" />
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <FileText className="w-6 h-6 mr-3 text-primary" />
            How to Use the Form Builder
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            Follow these simple steps to create professional forms with advanced features
          </p>
        </CardHeader>
      </Card>

      {/* Step-by-step guide */}
      <div className="grid gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {step.description}
                  </p>
                  <ul className="space-y-1">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start text-sm text-gray-500 dark:text-gray-400">
                        <ArrowRight className="w-3 h-3 mr-2 mt-0.5 text-primary flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                {feature.icon}
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-300">
            💡 Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start space-x-2">
            <Badge variant="secondary" className="text-xs">Tip</Badge>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Use derived fields to create dynamic forms that calculate age from birthdate, totals from multiple fields, or other computed values
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <Badge variant="secondary" className="text-xs">Tip</Badge>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Always test your forms in Preview mode before saving to ensure validation rules work as expected
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <Badge variant="secondary" className="text-xs">Tip</Badge>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Click the dark mode toggle in the top right to switch between light and dark themes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserGuide;