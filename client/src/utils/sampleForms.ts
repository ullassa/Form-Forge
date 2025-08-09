import { Form, FormField } from '@shared/schema';
import { generateId } from './helpers';

export const createSoftwareDeveloperForm = (): Form => {
  const now = new Date().toISOString();
  
  const fields: FormField[] = [
    {
      id: generateId(),
      type: 'text',
      label: 'Full Name',
      required: true,
      defaultValue: '',
      validationRules: [
        { type: 'required', message: 'Full name is required' },
        { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }
      ],
      isDerived: false,
      order: 0,
      placeholder: 'Enter your full name'
    },
    {
      id: generateId(),
      type: 'text',
      label: 'Email Address',
      required: true,
      defaultValue: '',
      validationRules: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email address' }
      ],
      isDerived: false,
      order: 1,
      placeholder: 'your.email@example.com'
    },
    {
      id: generateId(),
      type: 'text',
      label: 'Phone Number',
      required: true,
      defaultValue: '',
      validationRules: [
        { type: 'required', message: 'Phone number is required' },
        { type: 'minLength', value: 10, message: 'Phone number must be at least 10 digits' }
      ],
      isDerived: false,
      order: 2,
      placeholder: '+1 (555) 123-4567'
    },
    {
      id: generateId(),
      type: 'date',
      label: 'Date of Birth',
      required: true,
      defaultValue: '',
      validationRules: [
        { type: 'required', message: 'Date of birth is required' }
      ],
      isDerived: false,
      order: 3,
      placeholder: 'Select your birth date'
    },
    {
      id: generateId(),
      type: 'number',
      label: 'Age',
      required: false,
      defaultValue: '',
      validationRules: [],
      isDerived: true,
      derivedConfig: {
        parentFieldId: '', // Will be set to the date of birth field ID
        formula: 'currentYear - birthYear',
        calculation: 'age'
      },
      order: 4,
      placeholder: 'Automatically calculated'
    },
    {
      id: generateId(),
      type: 'select',
      label: 'Education Level',
      required: true,
      defaultValue: '',
      validationRules: [
        { type: 'required', message: 'Please select your education level' }
      ],
      isDerived: false,
      order: 5,
      options: [
        'High School',
        'Associate Degree',
        'Bachelor\'s Degree',
        'Master\'s Degree',
        'PhD',
        'Bootcamp Graduate',
        'Self-taught'
      ],
      placeholder: 'Select education level'
    },
    {
      id: generateId(),
      type: 'text',
      label: 'University/Institution',
      required: false,
      defaultValue: '',
      validationRules: [],
      isDerived: false,
      order: 6,
      placeholder: 'Name of your university or institution'
    },
    {
      id: generateId(),
      type: 'number',
      label: 'Years of Experience',
      required: true,
      defaultValue: '',
      validationRules: [
        { type: 'required', message: 'Years of experience is required' },
        { type: 'min', value: 0, message: 'Experience cannot be negative' },
        { type: 'max', value: 50, message: 'Please enter a realistic number of years' }
      ],
      isDerived: false,
      order: 7,
      placeholder: 'Number of years'
    },
    {
      id: generateId(),
      type: 'checkbox',
      label: 'Programming Languages',
      required: true,
      defaultValue: [],
      validationRules: [
        { type: 'required', message: 'Please select at least one programming language' }
      ],
      isDerived: false,
      order: 8,
      options: [
        'JavaScript',
        'TypeScript',
        'Python',
        'Java',
        'C++',
        'C#',
        'Go',
        'Rust',
        'PHP',
        'Swift',
        'Kotlin',
        'Ruby'
      ]
    },
    {
      id: generateId(),
      type: 'checkbox',
      label: 'Frameworks & Technologies',
      required: false,
      defaultValue: [],
      validationRules: [],
      isDerived: false,
      order: 9,
      options: [
        'React',
        'Vue.js',
        'Angular',
        'Node.js',
        'Express',
        'Django',
        'Flask',
        'Spring Boot',
        'ASP.NET',
        'Laravel',
        'Rails',
        'Docker',
        'Kubernetes',
        'AWS',
        'Azure',
        'GCP'
      ]
    },
    {
      id: generateId(),
      type: 'select',
      label: 'Preferred Work Arrangement',
      required: true,
      defaultValue: '',
      validationRules: [
        { type: 'required', message: 'Please select your preferred work arrangement' }
      ],
      isDerived: false,
      order: 10,
      options: [
        'Remote',
        'On-site',
        'Hybrid',
        'Flexible'
      ]
    },
    {
      id: generateId(),
      type: 'text',
      label: 'Current/Expected Salary (Annual)',
      required: false,
      defaultValue: '',
      validationRules: [],
      isDerived: false,
      order: 11,
      placeholder: 'e.g., $80,000 - $100,000'
    },
    {
      id: generateId(),
      type: 'text',
      label: 'GitHub Profile',
      required: false,
      defaultValue: '',
      validationRules: [],
      isDerived: false,
      order: 12,
      placeholder: 'https://github.com/yourusername'
    },
    {
      id: generateId(),
      type: 'text',
      label: 'LinkedIn Profile',
      required: false,
      defaultValue: '',
      validationRules: [],
      isDerived: false,
      order: 13,
      placeholder: 'https://linkedin.com/in/yourprofile'
    },
    {
      id: generateId(),
      type: 'text',
      label: 'Portfolio Website',
      required: false,
      defaultValue: '',
      validationRules: [],
      isDerived: false,
      order: 14,
      placeholder: 'https://yourportfolio.com'
    },
    {
      id: generateId(),
      type: 'textarea',
      label: 'Why do you want to work at upliance.ai?',
      required: true,
      defaultValue: '',
      validationRules: [
        { type: 'required', message: 'Please tell us why you want to work here' },
        { type: 'minLength', value: 50, message: 'Please provide at least 50 characters' },
        { type: 'maxLength', value: 500, message: 'Please keep it under 500 characters' }
      ],
      isDerived: false,
      order: 15,
      placeholder: 'Tell us what excites you about working at upliance.ai and how you can contribute to our mission...'
    },
    {
      id: generateId(),
      type: 'textarea',
      label: 'Describe your most challenging project',
      required: true,
      defaultValue: '',
      validationRules: [
        { type: 'required', message: 'Please describe a challenging project you worked on' },
        { type: 'minLength', value: 100, message: 'Please provide at least 100 characters' },
        { type: 'maxLength', value: 1000, message: 'Please keep it under 1000 characters' }
      ],
      isDerived: false,
      order: 16,
      placeholder: 'Describe the project, challenges faced, technologies used, and how you overcame obstacles...'
    },
    {
      id: generateId(),
      type: 'radio',
      label: 'How did you hear about this position?',
      required: true,
      defaultValue: '',
      validationRules: [
        { type: 'required', message: 'Please let us know how you heard about this position' }
      ],
      isDerived: false,
      order: 17,
      options: [
        'Company Website',
        'LinkedIn',
        'Job Board (Indeed, Glassdoor, etc.)',
        'Employee Referral',
        'Social Media',
        'Tech Conference/Event',
        'University Career Fair',
        'Other'
      ]
    },
    {
      id: generateId(),
      type: 'checkbox',
      label: 'Availability',
      required: true,
      defaultValue: [],
      validationRules: [
        { type: 'required', message: 'Please indicate your availability' }
      ],
      isDerived: false,
      order: 18,
      options: [
        'Available immediately',
        'Available in 2 weeks',
        'Available in 1 month',
        'Available in 2+ months',
        'Currently employed (need notice period)'
      ]
    }
  ];

  // Set up the derived field relationship for age calculation
  const dobField = fields.find(f => f.label === 'Date of Birth');
  const ageField = fields.find(f => f.label === 'Age');
  if (dobField && ageField && ageField.derivedConfig) {
    ageField.derivedConfig.parentFieldId = dobField.id;
  }

  return {
    id: generateId(),
    name: 'Software Developer Application - upliance.ai',
    description: 'Comprehensive application form for software developer positions at upliance.ai. This form collects essential information about candidates including technical skills, experience, and motivation.',
    createdAt: now,
    updatedAt: now,
    fields
  };
};

export const createContactForm = (): Form => {
  const now = new Date().toISOString();
  
  const fields: FormField[] = [
    {
      id: generateId(),
      type: 'text',
      label: 'Name',
      required: true,
      defaultValue: '',
      validationRules: [
        { type: 'required', message: 'Name is required' }
      ],
      isDerived: false,
      order: 0,
      placeholder: 'Your full name'
    },
    {
      id: generateId(),
      type: 'text',
      label: 'Email',
      required: true,
      defaultValue: '',
      validationRules: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email' }
      ],
      isDerived: false,
      order: 1,
      placeholder: 'your@email.com'
    },
    {
      id: generateId(),
      type: 'textarea',
      label: 'Message',
      required: true,
      defaultValue: '',
      validationRules: [
        { type: 'required', message: 'Message is required' },
        { type: 'minLength', value: 10, message: 'Message must be at least 10 characters' }
      ],
      isDerived: false,
      order: 2,
      placeholder: 'Your message...'
    }
  ];

  return {
    id: generateId(),
    name: 'Contact Form',
    description: 'Simple contact form for general inquiries',
    createdAt: now,
    updatedAt: now,
    fields
  };
};