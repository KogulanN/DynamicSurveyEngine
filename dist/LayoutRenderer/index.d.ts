import React from 'react';
import '../FormLayout.css';
interface LayoutRendererProps {
    layout: any[];
    questions: any[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    businessRules: any[];
    redirectUrl: string;
    saveUrl: string;
    participantID: string;
    surveyID: string;
}
declare const LayoutRenderer: React.FC<LayoutRendererProps>;
export default LayoutRenderer;
