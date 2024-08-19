export interface FormField {
    question_text: string;
    type: string;
    question_id: string;
    options?: string[];
    condition?: { fieldName?: string; fieldValue?: string | number; operator?: string; range?: number[] };
    mandatory?: boolean;
    inputSize?: string;
  }
  
  export interface Column {
    col_id: number;
    question_id: string;
  }
  
  export interface Row {
    row_id: number;
    columns: Column[];
  }
  
  export interface Layout {
    layout: Row[];
  }
  
  export interface FormConfig {
    formTitle?: string;
    layout: Layout;
    redirect_url: string;
    update_URL?: string;
    submit_message: string;
  }
  
  export interface Values {
    height?: string[];
    weight?: string[];
  }
  
  export interface BusinessRule {
    type: string;
    criteria?: { question_id: string[]; type?: string; input_field_name?: string; options?: string[] | boolean[]; weights?: number[]; values?: Values; ranges?: { min: number; max: number; score: number }[]; fields?: string[] }[];
  }
  
  export interface FormData {
    [key: string]: string | boolean | number | string[] | boolean;
  }
  