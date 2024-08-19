//@ts-ignore

import React from 'react';
import QuestionRenderer from '../QuestionRenderer';

interface GroupRendererProps {
  group: any;
  questions: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  formData: { [key: string]: string };
  dependencies: any[];
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: { [key: string]: string };
  businessRules: any;
}

const GroupRenderer: React.FC<GroupRendererProps> = ({ group, questions, handleChange, formData, dependencies, errors, businessRules, setFormData }) => {
  const sizeMap = {
    'XS': 0.3,
    'S': 0.4,
    'M': 0.5,
    'L': 0.6,
    'XL': 0.7,
    'XXL': 0.8,
    'XXXL': 0.9,
  };

  const getRowClass = (groupLayout: string) => {
    switch (groupLayout) {
      case 'table-1':
        return 'two-columns';
      case 'table-2a':
        return 'two-column';
      case 'table-2':
        return 'two-columns';
      case 'table-3':
        return 'three-columns';
        case 'table-4':
        return 'four-columns';
      case 'table-5':
        return 'five-columns';
      default:
        return '';
    }
  };

  const maxColumnWidths = group.rows.reduce((acc: any, row: any) => {
    // row.columns.forEach((column: any, index: number) => {
    //   const sizes = column.width.split('/') as (keyof typeof sizeMap)[];
    //   const labelWidth = sizeMap[sizes[0]] || 0.7;
    //   const inputWidth = sizeMap[sizes[1]] || 0.7;
    //   const totalWidth = labelWidth + inputWidth;
    //   if (!acc[index] || totalWidth > acc[index]) {
    //     acc[index] = totalWidth;
    //   }
    // });
    // return acc;
    return acc;
  }, {});
  
  // Helper function to calculate the maximum number of lines in a row
  const calculateMaxLinesInRow = (row: any) => {
    return row.columns.reduce((maxLines: any, column: any) => {
      const question = questions.find((q) => q.question_id === column.question_id);
      if (question) {
        const labelHeight = question.question_text.split('\n').length;
        return Math.max(maxLines, labelHeight);
      }
      return maxLines;
    }, 0);
  };

  const shouldDisplay = (conditions: { question_id: string, value: any }[] | undefined) => {
    if (!conditions || conditions.length === 0) {
      return true;
    }
    return conditions.every(condition => formData[condition.question_id] === condition.value);
  };

  if (!shouldDisplay(group.display_conditions)) {
    return null;
  }

  return (
    <div key={group.group_id} className="form-group">
      {group.group_header && (
        <div className="group-header" style={{ fontWeight: group.group_header_font_weight, fontStyle: group.group_header_font_style }}>
          {group.group_header}
        </div>
      )}
      {group.rows.map((row: any) => (
        <div key={row.row_id} className={`row ${getRowClass(group.group_layout)}`}>
          {row.columns.map((column: any, index: number) => {
            const question = questions.find((q: any) => q.question_id === column.question_id);
            const columnsCount = row.columns.length;
            return shouldDisplay(column.display_conditions) && (
              <div key={column.question_id} className="column" >
                {question && (
                  <QuestionRenderer
                    question={question}
                    question_length={column.width}
                    handleChange={handleChange}
                    value={formData[question.question_id] || ''}
                    inline={column.inline}
                    setFormData={setFormData}
                    formData={formData}
                    businessRules={businessRules}
                    columnsCount={columnsCount}
                    dependencies={dependencies} // Pass dependencies
                    error={errors[question.question_id]} // Pass the error for this question
                    
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GroupRenderer;

