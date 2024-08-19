//ts-ignore

import React, { useEffect, useState } from 'react';
import LayoutRenderer from './LayoutRenderer';
import BusinessRuleHandler from './BusinessRuleHandler';
import axios from 'axios';
import data from './backenddata/surveys/surveys.json';

interface DynamicFormGeneratorProps {
  surveyID: string;
  participantID: string;
  Urls: string[];
  
}

const DynamicFormGenerator: React.FC<DynamicFormGeneratorProps> = ({ surveyID, participantID, Urls }) => {
  const [surveyData, setSurveyData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    console.log("Dynamic form")
    const fetchSurveyData = async () => {
      try {
        // look at this we need to read the data in the local folder. here with the url:
        const response = await axios.get(Urls[0], {
          headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
          
          
        });
        if (response.data) {
          console.log("Response:",response.data)
          setSurveyData(response.data);
        }
      } catch (error) {
        console.error('Error fetching survey data:', error);
        const localSurvey = data.surveys.find((survey: any) => survey.surveyID === surveyID);
        if (localSurvey) {
          setSurveyData(localSurvey);
        }
      }
    };

    const fetchFormData = async () => {
      try {
        const response = await axios.get(Urls[1], {
          params: { participantID, surveyID }
        });
        if (response.data) {
          setFormData(response.data.formData);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchSurveyData();
    fetchFormData();
  }, [surveyID, participantID]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (!surveyData) {
    //setSurveyData(data.surveys.find(surveyID));
    console.log("Error:",surveyID,participantID,Urls,data)
    return <div>Survey Loading...</div>;
  }

  const { sections, questions, businessRules, redirectUrl, saveUrl } = surveyData;

  return (
    <div className="dynamic-form-generator">
      <LayoutRenderer
        layout={sections}
        questions={questions}
        handleChange={handleChange}
        formData={formData}
        setFormData={setFormData}
        businessRules={businessRules}
        redirectUrl={redirectUrl}
        saveUrl={saveUrl}
        participantID={participantID}
        surveyID={surveyID}
        
      />
      <BusinessRuleHandler formData={formData} businessRules={businessRules} setFormData={setFormData} />
    </div>
  );
};

export default DynamicFormGenerator;