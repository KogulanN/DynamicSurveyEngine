import React from 'react';
interface DynamicFormGeneratorProps {
    surveyData: any;
    formData: any;
    redirectUrl: string;
    onSectionChange: (sectionTitle: string) => void;
    onSave: (formData: any) => void;
}
declare const DynamicFormGenerator: React.FC<DynamicFormGeneratorProps>;
export default DynamicFormGenerator;
