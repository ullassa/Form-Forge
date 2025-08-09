export interface FieldTypeOption {
  type: string;
  label: string;
  icon: string;
  color: string;
}

export interface DragAndDropResult {
  draggableId: string;
  type: string;
  source: {
    index: number;
    droppableId: string;
  };
  destination: {
    index: number;
    droppableId: string;
  } | null;
}

export interface ValidationError {
  fieldId: string;
  message: string;
}

export interface FormSubmissionResult {
  success: boolean;
  errors?: ValidationError[];
  data?: Record<string, any>;
}
