import React, { useState, useEffect } from 'react';
import GroupRenderer from '../GroupRenderer';
import '../FormLayout.css';
import axios from 'axios';
import preprocessdata from '@/data/backenddata/surveys/responses.json'

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

const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  layout = [],
  questions,
  handleChange,
  formData,
  setFormData,
  businessRules,
  redirectUrl,
  saveUrl,
  participantID,
  surveyID
}) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchExistingResponses = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/getFormData?participantID=${participantID}&surveyID=${surveyID}`);
        if (response.data && response.data.formData) {
          setFormData(response.data.formData);
        }
      } catch (error) {
        // const localResponse = preprocessdata.responses.find((response: any)  => response.participantID === participantID && response.surveyID === surveyID);
        // if (localResponse) {
        //   setFormData(localResponse);
        // }
        console.error('Error fetching form data:', error);
      }
    };

    fetchExistingResponses();
  }, [participantID, surveyID, setFormData]);

  const shouldDisplay = (conditions: { question_id: string, value: any }[] | undefined) => {
    if (!conditions || conditions.length === 0) {
      return true;
    }
    return conditions.every(condition => formData[condition.question_id] === condition.value);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handleChange(e);
    if (errors[e.target.name]) {
      const newErrors = { ...errors };
      delete newErrors[e.target.name];
      setErrors(newErrors);
    }
  };

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};

    const currentSection = layout[currentSectionIndex];
    // currentSection.groups.forEach((group: any) => {
    //   group.rows.forEach((row: any) => {
    //     row.columns.forEach((column: any) => {
    //       const question = questions.find((q: any) => q.question_id === column.question_id);
    //       if (question && question.required && !formData[question.question_id]) {
    //         newErrors[question.question_id] = 'This field is required';
    //       }
    //     });
    //   });
    // });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      let nextIndex = currentSectionIndex + 1;
      while (nextIndex < layout.length && !shouldDisplay(layout[nextIndex].display_conditions)) {
        nextIndex += 1;
      }
      if (nextIndex < layout.length) {
        setCurrentSectionIndex(nextIndex);
      }
    }
  };

  const handlePrev = () => {
    let prevIndex = currentSectionIndex - 1;
    while (prevIndex >= 0 && !shouldDisplay(layout[prevIndex].display_conditions)) {
      prevIndex -= 1;
    }
    if (prevIndex >= 0) {
      setCurrentSectionIndex(prevIndex);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(saveUrl, {
        formData,
        participantID,
        surveyID
      });
      //alert('Data saved successfully.');
    } catch (error) {
      console.error('Error saving file:', error);
      //alert('Failed to save file. Please try again.');
    }
  };

  const handleCancel = async () => {
    try {
      // await axios.post(saveUrl, {
      //   formData,
      //   participantID,
      //   surveyID
      // });
      alert('You have canceled this survey');
      const builtUrl = redirectUrl.replace('[participantID]', participantID);
      window.location.href = builtUrl;
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file. Please try again.');
    }
  };

  const buildRedirectUrl = () => {
    if (!participantID) {
      return redirectUrl;
    }
    return redirectUrl.replace('[participantID]', participantID);
  };

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};

    layout.forEach((section: any) => {
      section.groups.forEach((group: any) => {
        group.rows.forEach((row: any) => {
          row.columns.forEach((column: any) => {
            const question = questions.find((q: any) => q.question_id === column.question_id);
            if (question && question.required && !formData[question.question_id]) {
              newErrors[question.question_id] = 'This field is required';
            }
          });
        });
      });
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      try {
        await axios.post(saveUrl, {
          formData,
          participantID,
          surveyID
        });
        window.location.href = buildRedirectUrl();
      } catch (error) {
        console.error('Error saving file:', error);
        alert('Failed to save file. Please try again.');
        window.location.href = buildRedirectUrl();
      }
    }
  };

  const currentSection = layout[currentSectionIndex];

  const isLastSection = (index: number) => {
    for (let i = index + 1; i < layout.length; i++) {
      if (shouldDisplay(layout[i].display_conditions)) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="dynamic-form-section">
      {shouldDisplay(currentSection.display_conditions) && (
        <div key={currentSection.section_id} className="form-section">
          <h2 className="section-title">{currentSection.section_title}</h2>
          {currentSection.groups.map((group: any) => (
            shouldDisplay(group.display_conditions) && (
              <GroupRenderer
                key={group.group_id}
                group={group}
                questions={questions}
                handleChange={handleFieldChange}
                setFormData={setFormData}
                businessRules={businessRules}
                formData={formData}
                dependencies={Object.keys(formData).map(key => ({ question_id: key, value: formData[key] }))}
                errors={errors}
              />
            )
          ))}
        </div>
      )}
      <div className="form-buttons">
        {currentSectionIndex > 0 && <button className="button prev" onClick={handlePrev}>Prev</button>}
        <button className="button save" onClick={handleSave}>Save</button>
        {isLastSection(currentSectionIndex) ? (
          <button className="button submit" onClick={handleSubmit}>Submit</button>
        ) : (
          <button className="button next" onClick={handleNext}>Next</button>
        )}
        
        <button className="button cancel" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default LayoutRenderer;