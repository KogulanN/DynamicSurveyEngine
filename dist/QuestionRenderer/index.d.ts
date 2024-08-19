import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import "../FormLayout.css";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
interface QuestionRendererProps {
    question: any;
    question_length: string;
    handleChange: (e: any) => void;
    value: string;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    inline?: boolean;
    columnsCount: number;
    dependencies: any[];
    businessRules: any;
    error?: string;
    formData: {
        [key: string]: any;
    };
}
declare const QuestionRenderer: React.FC<QuestionRendererProps>;
export default QuestionRenderer;
