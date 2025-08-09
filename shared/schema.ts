import { z } from "zod";

// Form field types
export const FieldType = z.enum([
  'text',
  'number', 
  'textarea',
  'select',
  'radio',
  'checkbox',
  'date'
]);

// Validation rule types
export const ValidationRuleType = z.enum([
  'required',
  'minLength',
  'maxLength',
  'email',
  'password',
  'min',
  'max',
  'custom'
]);

// Validation rule schema
export const ValidationRuleSchema = z.object({
  type: ValidationRuleType,
  value: z.any().optional(),
  message: z.string(),
});

// Derived field configuration
export const DerivedFieldConfigSchema = z.object({
  parentFieldId: z.string(),
  formula: z.string(),
  calculation: z.enum(['age', 'sum', 'difference', 'custom']),
});

// Form field schema
export const FormFieldSchema = z.object({
  id: z.string(),
  type: FieldType,
  label: z.string(),
  required: z.boolean().default(false),
  defaultValue: z.any().optional(),
  validationRules: z.array(ValidationRuleSchema).default([]),
  isDerived: z.boolean().default(false),
  derivedConfig: DerivedFieldConfigSchema.optional(),
  order: z.number(),
  options: z.array(z.string()).optional(), // for select, radio, checkbox
  placeholder: z.string().optional(),
});

// Form schema
export const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  fields: z.array(FormFieldSchema).default([]),
});

// Export types
export type FieldType = z.infer<typeof FieldType>;
export type ValidationRule = z.infer<typeof ValidationRuleSchema>;
export type DerivedFieldConfig = z.infer<typeof DerivedFieldConfigSchema>;
export type FormField = z.infer<typeof FormFieldSchema>;
export type Form = z.infer<typeof FormSchema>;

// Insert schemas
export const insertFormFieldSchema = FormFieldSchema.omit({ id: true });
export const insertFormSchema = FormSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type InsertFormField = z.infer<typeof insertFormFieldSchema>;
export type InsertForm = z.infer<typeof insertFormSchema>;
