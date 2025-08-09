import { type Form } from "@shared/schema";
import { randomUUID } from "crypto";

// Form storage interface for the form builder application
export interface IStorage {
  getForms(): Promise<Form[]>;
  getForm(id: string): Promise<Form | undefined>;
  createForm(form: Omit<Form, 'id'>): Promise<Form>;
  updateForm(id: string, form: Partial<Form>): Promise<Form | undefined>;
  deleteForm(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private forms: Map<string, Form>;

  constructor() {
    this.forms = new Map();
  }

  async getForms(): Promise<Form[]> {
    return Array.from(this.forms.values());
  }

  async getForm(id: string): Promise<Form | undefined> {
    return this.forms.get(id);
  }

  async createForm(formData: Omit<Form, 'id'>): Promise<Form> {
    const id = randomUUID();
    const form: Form = { ...formData, id };
    this.forms.set(id, form);
    return form;
  }

  async updateForm(id: string, updates: Partial<Form>): Promise<Form | undefined> {
    const existingForm = this.forms.get(id);
    if (!existingForm) return undefined;
    
    const updatedForm = { ...existingForm, ...updates };
    this.forms.set(id, updatedForm);
    return updatedForm;
  }

  async deleteForm(id: string): Promise<boolean> {
    return this.forms.delete(id);
  }
}

export const storage = new MemStorage();
