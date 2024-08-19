import React from 'react';
interface GroupRendererProps {
    group: any;
    questions: any[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    formData: {
        [key: string]: string;
    };
    dependencies: any[];
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    errors: {
        [key: string]: string;
    };
    businessRules: any;
}
declare const GroupRenderer: React.FC<GroupRendererProps>;
export default GroupRenderer;
