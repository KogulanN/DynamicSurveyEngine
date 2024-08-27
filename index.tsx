import React, { useEffect, useState } from 'react';
import LayoutRenderer from './LayoutRenderer';
import BusinessRuleHandler from './BusinessRuleHandler';

interface DynamicFormGeneratorProps {
  surveyData: any;
  formData: any;
  redirectUrl: string
  onSectionChange: (sectionTitle: string) => void;  // Callback for section title change
  onSave: (formData: any) => void;  // Callback for saving form data
}

const DynamicFormGenerator: React.FC<DynamicFormGeneratorProps> = ({ surveyData, formData, onSectionChange, onSave, redirectUrl }) => {
  const [localSurveyData, setLocalSurveyData] = useState<any>(surveyData);
  const [localFormData, setLocalFormData] = useState<any>(formData);

  useEffect(() => {
    setLocalSurveyData(surveyData);
    setLocalFormData(formData);
  }, [surveyData, formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (!localSurveyData) {
    return <div>Survey Loading...</div>;
  }

  const { sections, questions, businessRules } = localSurveyData;

  return (
    <div className="dynamic-form-generator">
      <LayoutRenderer
        layout={sections}
        questions={questions}
        handleChange={handleChange}
        formData={localFormData}
        setFormData={setLocalFormData}
        redirectUrl={redirectUrl}
        businessRules={businessRules}
        onSectionChange={onSectionChange}  // Pass the callback for section title change
        onSave={onSave}  // Pass the callback for saving form data
      />
      <BusinessRuleHandler
        formData={localFormData}
        businessRules={businessRules}
        setFormData={setLocalFormData}
      />
    </div>
  );
};

export default DynamicFormGenerator;
