import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineCalendar, AiOutlineQrcode } from 'react-icons/ai';
import "../FormLayout.css";
import moment from 'moment';
import { FaCheck, FaTimes } from 'react-icons/fa';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // PDF Viewer styles
import BusinessRuleHandler from '../BusinessRuleHandler';



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
  formData: { [key: string]: any }; 
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, question_length, handleChange, value, inline, columnsCount, dependencies, error, formData, businessRules, setFormData }) => {
  const sizeMap: Record<string, string> = {
    'XS': 'var(--size-xs)',
    'S': 'var(--size-s)',
    'M': 'var(--size-m)',
    'L': 'var(--size-l)',
    'XL': 'var(--size-xl)',
    'XXL': 'var(--size-xxl)',
    'XXXL': 'var(--size-xxxl)',
  };

  const [otherValue, setOtherValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? moment(value, 'MM/DD/YYYY').toDate() : null);
  const labelRef = useRef<HTMLLabelElement>(null);
  const [numLineBreaks, setNumLineBreaks] = useState(0);
  const isTextEmpty = question.question_text === "";

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(''); // Store the document URL



  const openPopup = (url: any) => {
    const width = 800;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
  
    window.open(url, 'popup', `width=${width},height=${height},top=${top},left=${left}`);
  };

  
  useEffect(() => {
    function evaluateEligibility(formData: any) {
      const conditions = [
        { fieldName: 'DPPSCRSEC01Q007', operator: '>=', value: 25 },
        { fieldName: 'DPPSCRSEC02Q015', operator: '>=', value: 5 },
        { fieldName: 'DPPSCRSEC01Q008', operator: 'range', range: [5.7, 6.4] },
        { fieldName: 'DPPSCRSEC02Q005', operator: '===', value: 'Yes' },
      ];

      const count = conditions.reduce((acc, condition: any) => {
        const questionValue = formData[condition.fieldName];
        let isConditionMet = false;

        switch (condition.operator) {
          case '>':
            isConditionMet = questionValue > condition.value;
            break;
          case '<':
            isConditionMet = questionValue < condition.value;
            break;
          case '>=':
            isConditionMet = questionValue >= condition.value;
            break;
          case '<=':
            isConditionMet = questionValue <= condition.value;
            break;
          case '===':
            isConditionMet = questionValue === condition.value;
            break;
          case 'range':
            if (Array.isArray(condition.range) && condition.range.length === 2) {
              const [min, max] = condition.range;
              isConditionMet = questionValue >= min && questionValue <= max;
            }
            break;
          default:
            break;
        }

        return acc + (isConditionMet ? 1 : 0);
      }, 0);
      console.log("Count",count)
      return count >= 3 ? 'DPPSCRSEC03Q006' : 'DPPSCRSEC03Q007'; // Returns the question ID to show
    }

    const result = evaluateEligibility(formData);
    console.log("result",result)
    setVisible(result === question.question_id);

  }, [dependencies, formData, question]);
  

  // useEffect(() => {
  //   if (question.dependency) {
  //     const dependentQuestion = dependencies.find((dep: any) => dep.question_id === question.dependency);
  //     if (dependentQuestion) {
  //       setVisible(dependentQuestion.value === question.show_if_value);
  //     }
  //   } else {
  //     setVisible(true); // If no dependency, make the question visible
  //   }
  // }, [dependencies, question]);
  useEffect(() => {
    if (question.dependency && Array.isArray(question.dependency)) {
      const conditionsMet = question.dependency.every((dep: any) => {
        const dependentQuestion = dependencies.find((d: any) => d.question_id === dep.question_id);
        if (dependentQuestion) {
          switch (dep.operator) {
            case '>':
              return dependentQuestion.value > dep.value;
            case '<':
              return dependentQuestion.value < dep.value;
            case '>=':
              return dependentQuestion.value >= dep.value;
            case '<=':
              return dependentQuestion.value <= dep.value;
            case '===':
              return dependentQuestion.value === dep.value;
            case '!=':
              return dependentQuestion.value !== dep.value;
            case 'range':
              if (Array.isArray(dep.range) && dep.range.length === 2) {
                const [min, max] = dep.range;
                return dependentQuestion.value >= min && dependentQuestion.value <= max;
              }
              return false;
            default:
              return false;
          }
        }
        return false;
      });

      setVisible(conditionsMet);
    } else if (question.dependency) {
      const dependentQuestion = dependencies.find((dep: any) => dep.question_id === question.dependency);
      if (dependentQuestion) {
        setVisible(dependentQuestion.value === question.show_if_value)
      }
    } 
    
    else {
      
      setVisible(true); // If no dependency, make the question visible
    }
  }, [dependencies, question]);


  useEffect(() => {
    if (labelRef.current) {
      const lineHeight = parseFloat(getComputedStyle(labelRef.current).lineHeight);
      const labelHeight = labelRef.current.clientHeight;
      const lines = Math.ceil(labelHeight / lineHeight);
      setNumLineBreaks(lines);
    }
  }, [question.question_text]);

  const getWidth = (sizeCode: string, columns: number) => {
    const percentage = sizeMap[sizeCode] || 'var(--size-xxxl)';
    return `calc(${percentage} * ${columns})`;
  };

  const parseWidths = (widthString?: string, columns: number = 1) => {
    if (!widthString) {
      return {
        labelWidth: '300px',
        inputWidth: '200px',
        inputMinWidth: '100px'
      };
    }
    const [labelWidthCode, inputWidthCode] = widthString.split('/');
    return {
      labelWidth: getWidth(labelWidthCode, columns),
      inputWidth: getWidth(inputWidthCode, columns),
      inputMinWidth: getWidth(inputWidthCode, 1)
    };
  };

  const { labelWidth, inputWidth, inputMinWidth } = parseWidths(question_length, columnsCount);

  if (!visible) {
    return null;
  }

  const handleDateChange = (date: Date | null, questionId: string) => {
    handleChange({
      target: {
        name: questionId,
        value: date ? date.toISOString().split('T')[0] : ''
      }
    });
  };

 

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, min, max } = e.target;
    if (value === '' || (Number(value) >= Number(min) && Number(value) <= Number(max))) {
      handleChange(e);
    }
  };

  const handleNumberOnlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '' || !isNaN(Number(value))) {
      handleChange(e);
    }
  };

  const handleClockIconClick = (questionId: string) => {
    const timePickerInput = document.querySelector(`#${questionId} .react-time-picker__inputGroup__input`) as HTMLInputElement;
    if (timePickerInput) {
      timePickerInput.focus();
    }
  };


  // Evaluate condition for tickicon
  const evaluateCondition = () => {
    const condition = question.show_if_value;
    const questionValue = formData[condition.fieldName];
    let isConditionMet = false;

    switch (condition.operator) {
        case '>':
            isConditionMet = questionValue > condition.value;
            break;
        case '<':
            isConditionMet = questionValue < condition.value;
            break;
        case '>=':
            isConditionMet = questionValue >= condition.value;
            break;
        case '<=':
            isConditionMet = questionValue <= condition.value;
            break;
        case '===':
            isConditionMet = questionValue === condition.value;
            break;
        case '!=':
            isConditionMet = questionValue !== condition.value;
            break;
        case 'range':
            if (Array.isArray(condition.range) && condition.range.length === 2) {
                const [min, max] = condition.range;
                isConditionMet = questionValue >= min && questionValue <= max;
            } else {
                console.error("Range operator requires an array with two elements: [min, max]");
            }
            break;
        default:
            break;
    }

    return isConditionMet;
  };

  const renderQuestion = () => {
    switch (question.question_type) {
     
      case 'tickicon':
   const isConditionMet = evaluateCondition();
    
    console.log(`Condition Met: ${isConditionMet}, QuestionID: ${question.question_id}`); // Debugging to see if the condition is met
    return (
      <div className="question-inline flex items-center justify-end md:w-full md:pr-20 lg:w-1/2">
        <div className={`tick-icon-container tick ${isConditionMet ? 'satisfied' : 'not-satisfied'}`}>
          <div className="status-icon">
            {isConditionMet ? <FaCheck className='iconGreen' /> : <FaTimes className='iconRed' />}
          </div>
        </div>
      </div>
    );
      case 'upload-link':
      return (
        <div className='upload-link-container'>
          <label
            htmlFor={question.question_id}
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            {question.question_text}
          </label>
          <input
            id={question.question_id}
            className='form-input'
            type='file'
            style={{ display: 'none' }} // Hide the file input
          />
        </div>
      );   
      case 'view-document':
        return (
          <div className="flex space-x-5">
            <a
              href={question.documentUrl}
              onClick={(e) => {
                e.preventDefault(); // Prevent the default link behavior
                openPopup(question.documentUrl);
              }}
              className=""
            >
              View Document
            </a>
          </div>
        );
      

      case 'text-area':
        return <textarea className="form-input text-area" name={question.question_id} value={value} onChange={handleChange} style={{ width: inputWidth, minWidth: inputMinWidth }} />;
      case 'text':
        return <input className="form-input" type="text" name={question.question_id} value={value} onChange={handleChange} style={{ width: inputWidth, minWidth: inputMinWidth }} />;
      case 'number':
        const min = question.min !== undefined ? question.min : 0;
        const max = question.max !== undefined ? question.max : 100;
        return <input className="form-input" type="number" name={question.question_id} value={value} onChange={handleChange} min={min} max={max} style={{ width: inputWidth, minWidth: inputMinWidth }} />;
      case 'number-only':
        return (
          <input
            className="form-input"
            type="text"
            name={question.question_id}
            value={value}
            onChange={handleNumberOnlyChange}
            style={{ width: inputWidth, minWidth: inputMinWidth }}
          />
        );
      case 'qrcode':
        return (
          <div className={"justify-center"}>
            <AiOutlineQrcode size={50} style={{ marginLeft: '10px', cursor: 'pointer' }} />
            <h3> Scan here</h3>
          </div>  
        );
        case 'date':
          const getMaxWidth = () => {
            if (window.innerWidth <= 1023) {
              // Small screens (md and below)
              return '75%';
            } else {
              // Larger screens (ld and above)
              return '45%';
            }
          };
        
          return (
            <input
              className="form-input"
              type="date"
              name={question.question_id}
              value={value}
              style={{ maxWidth: getMaxWidth() }}
              onChange={handleNumberOnlyChange}
            />
          );
        
      case 'time':
        return (
          <input
            className="form-input"
            type="time"
            name={question.question_id}
            value={value}
            onChange={handleNumberOnlyChange}
            style={{ width: inputWidth, minWidth: inputMinWidth }}
          />
        );
      case 'select':
        return (
          <div>
            <select className="form-input" name={question.question_id} value={value} onChange={handleChange} style={{ width: inputWidth, minWidth: inputMinWidth }}>
              <option value="">--SELECT--</option>
              {question.options.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              {question.other_option && question.other_option.enabled && (
                <option value="Other">{question.other_option.label}</option>
              )}
            </select>
            {value === "Other" && (
              <input
                type="text"
                name={`${question.question_id}_other`}
                value={otherValue}
                onChange={(e) => setOtherValue(e.target.value)}
                placeholder={question.other_option.placeholder}
                style={{ marginLeft: '10px', width: inputWidth, minWidth: inputMinWidth, padding: '5px', border: 'solid 1px #ccc', borderRadius: '4px' }}
              />
            )}
          </div>
        );
      case 'radio_multiline':
        return (
          <div className="radio-multiline">
            {question.options.map((option: string) => (
              <div key={option} className="radio-multiline-option">
                <label>
                  <input
                    type="radio"
                    name={question.question_id}
                    value={option}
                    checked={value === option}
                    onChange={handleChange}
                  />
                  <span className="radio-label">{option}</span>
                </label>
              </div>
            ))}
            {question.other_option && question.other_option.enabled && (
              <div className={`radio-multiline-option ${question.other_option.display === "block" ? "block" : "inline"}`}>
                <label className=''>
                  <input
                    type="radio"
                    name={question.question_id}
                    value="Other"
                    checked={value === "Other"}
                    onChange={handleChange}
                  />
                  <span className="radio-label">{question.other_option.label}</span>
                  {value === "Other" && (
                    <input
                      type="text"
                      name={`${question.question_id}_other`}
                      value={otherValue}
                      onChange={(e) => setOtherValue(e.target.value)}
                      className="form-input other-input"
                      placeholder={question.other_option.placeholder || "Specify"}
                      style={{ marginLeft: '10px', width: inputWidth, minWidth: inputMinWidth }}
                    />
                  )}
                </label>
              </div>
            )}
          </div>
        );
      case 'radio_multiline-multiselect':
        return (
          <div className="radio-multiline">
            {question.options.map((option: string) => (
              <div key={option} className="radio-multiline-option">
                <label>
                  <input
                    type="checkbox"
                    name={`${question.question_id}_${option}`}
                    value={option}
                    checked={value.includes(option)}
                    onChange={(e) => {
                      let newValue = value ? value.split(',') : [];
                      if (e.target.checked) {
                        newValue.push(option);
                      } else {
                        newValue = newValue.filter((val) => val !== option);
                      }
                      handleChange({ target: { name: question.question_id, value: newValue.join(',') } });
                    }}
                  />
                  <span className="radio-label">{option}</span>
                </label>
              </div>
            ))}
            {question.other_option && question.other_option.enabled && (
              <div className={`radio-multiline-option ${question.other_option.display === "block" ? "block" : "inline"}`}>
                <label className=''>
                  <input
                    type="checkbox"
                    name={`${question.question_id}_Other`}
                    value="Other"
                    checked={value.includes("Other")}
                    onChange={(e) => {
                      let newValue = value ? value.split(',') : [];
                      if (e.target.checked) {
                        newValue.push("Other");
                      } else {
                        newValue = newValue.filter((val) => val !== "Other");
                      }
                      handleChange({ target: { name: question.question_id, value: newValue.join(',') } });
                    }}
                  />
                  <span className="radio-label">{question.other_option.label}</span>
                  {value.includes("Other") && (
                    <input
                      type="text"
                      name={`${question.question_id}_other`}
                      value={otherValue}
                      onChange={(e) => setOtherValue(e.target.value)}
                      className="form-input other-input"
                      placeholder={question.other_option.placeholder || "Specify"}
                      style={{ marginLeft: '10px', width: inputWidth, minWidth: inputMinWidth }}
                    />
                  )}
                </label>
              </div>
            )}
          </div>
        );
      case 'textdisable':
        return <input className="form-input textdisable-input" type="text" name={question.question_id} value={value} readOnly style={{ width: inputWidth, minWidth: inputMinWidth }} />;
      case 'label':
        const labelStyles: React.CSSProperties = {
          fontWeight: question.fontWeight || 'medium',
          backgroundColor: question.backgroundColor || 'transparent',
          fontSize: question.fontSize || 'inherit',
          borderRadius: question.borderRadius || '0px',
          padding: question.padding || '0px',
          color: question.color || 'inherit',
          display: 'inline-block',
          textAlign: question.textAlign || 'left',
          textWrap: question.wrap || 'wrap'
        };
        return (
          <label style={labelStyles}>
            {question.question_text}
          </label>
        );
      case 'send-link-button':
        return (
          <div className="">
            <button
              style={{
                backgroundColor: '#8ba8da',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
              type="button"
            >
              {question.label}
            </button>
          </div>
        );
      case 'radio':
        return (
          <div>
            {question.options.map((option: string) => (
              <div key={option} className="radio-option">
                <label>
                  <input
                    type="radio"
                    name={question.question_id}
                    value={option}
                    checked={value === option}
                    onChange={handleChange}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case 'checkbox-inline':
        return (
          <div className="flex items-center">
            
            <input
              type="checkbox"
              id={question.question_id}
              name={question.question_id}
              checked={value === 'true'}
              onChange={(e) => handleChange({ target: { name: question.question_id, value: e.target.checked ? 'true' : 'false' } })}
              className=" mb-2"
            />
            <label className="ml-5 text-nowrap" htmlFor={question.question_id}>{question.label}</label>
          </div>
        );
      case 'checkbox':
        return (
          <div className="">
            <input
              type="checkbox"
              id={question.question_id}
              name={question.question_id}
              checked={value === 'true'}
              onChange={(e) => handleChange({ target: { name: question.question_id, value: e.target.checked ? 'true' : 'false' } })}
              className=""
            />
          </div>
        );
        case 'card':
        return (
          <div className="border-2 border-slate-500 p-4 rounded-sm">
            
            <div className=" ml-4 mb-4" >
              <div className="">
              <input
              type="radio"
              id={question.question_id}
              name={question.question_id}
              checked={value === 'true'}
              onChange={(e) => handleChange({ target: { name: question.question_id, value: e.target.checked ? 'true' : 'false' } })}
              className=""
            />
            <span> send via SMS Text</span>
              </div>
              <div>
              <input className="form-input" type="text" name={"SMS"} placeholder="Enter Phone number"  value={""} onChange={handleChange} style={{ width: 180, minWidth: 130, paddingTop: 2, marginTop: 3 }} />
              </div>

            </div>
            <div className=" ml-4 mb-4" >
              <div className="">
              <input
              type="radio"
              id={"SMS"}
              name={"SMS"}
              checked={value === 'true'}
              onChange={(e) => handleChange({ target: { name: "SMS", value: e.target.checked ? 'true' : 'false' } })}
              className=""
            />
            <span> send via Email</span>
              </div>
              <div>
              <input className="form-input" type="text" name={"Email"}  placeholder="Enter email" value={""} onChange={handleChange} style={{ width: 180, minWidth: 130, paddingTop: 2, marginTop: 3 }} />
              </div>

            </div>

            <div className=" ml-4 mb-4" >
              <div className="">

            <button className=' bg-black text-zinc-50 p-2 rounded-sm px-10'> confirm </button>
              </div>
            

            </div>
          </div>
        );
        case 'slider':
          return (
            <div className="slider-container">
              
              <div className=" flex flex-col w-2/3">
                <div className=' flex flex-row justify-between m-2'>
                <span>0</span> <span>10</span>
                </div>
                
                <input
                  type="range"
                  id={question.question_id}
                  name={question.question_id}
                  min="0"
                  max="10"
                  value={value || 5}
                  onChange={handleChange}
                  className=" slider-input"
                />
                <div className="flex flex-row justify-between m-3">
                <span>Definitely Not Ready</span>
                <span>Definitely Ready</span>
              </div>
              </div>
              
            </div>
          );
      default:
        return null;
    }
  };

  const renderLineBreaks = () => {
    // Add specific question_ids that need line breaks
    const lineBreakQuestions = ["NPAQ01Q11", "NPAQ01Q08", "NPAQ01Q14", "SURV01S02Q12", "SURV01S02Q14"];
    if (lineBreakQuestions.includes(question.question_id)) {
      return <><br /><br /></>;
    }
    return null;
  };

  return (
    <div className={`question-container column ${isTextEmpty ? 'empty-question' : ''}`}>
    {question.question_type !== 'label' && question.question_type !== 'checkbox-inline' && question.question_type !== 'upload-link'  && question.question_type !== 'view-document'  && question.question_type !== 'tickicon' && (
      <label
        ref={labelRef}  // Reference to calculate line breaks if needed
        className={inline ? 'question-inline' : 'question-block'}
        htmlFor={question.question_id}
        style={{ width: labelWidth }}
      >
        {question.question_text || (
          <span className='mt-2'>
            {Array(numLineBreaks).fill(<br />)}  {/* Render calculated line breaks */}
          </span>
        )} 
        {question.required && <span className="required">*</span>}
      </label>
    )}
    {error && <div className="error-message">{error}</div>} {/* Render error message if it exists */}
    {renderQuestion()} {/* Render the input field */}
    
  </div>
  );
};

export default QuestionRenderer;
