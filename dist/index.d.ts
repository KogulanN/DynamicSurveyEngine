import React from 'react';
interface DynamicFormGeneratorProps {
    surveyID: string;
    participantID: string;
    Urls: string[];
}
declare const DynamicFormGenerator: React.FC<DynamicFormGeneratorProps>;
export default DynamicFormGenerator;
