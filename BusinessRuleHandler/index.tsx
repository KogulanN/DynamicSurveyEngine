import React, { useEffect } from 'react';

interface BusinessRuleHandlerProps {
  formData: any;
  businessRules: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const BusinessRuleHandler: React.FC<BusinessRuleHandlerProps> = ({ formData, businessRules, setFormData }) => {
  useEffect(() => {
    businessRules.forEach((rule: any) => {
      switch (rule.rule_type) {
        case 'calculate_bmi':
          const weight = parseFloat(formData[rule.weight_question_id]);
          const heightFeet = parseFloat(formData[rule.height_feet_question_id]);
          const heightInches = parseFloat(formData[rule.height_inches_question_id]);
          if (!isNaN(weight) && !isNaN(heightFeet) && !isNaN(heightInches)) {
            const height = heightFeet * 12 + heightInches; // Convert height to inches
            const bmi = ((weight / (height * height)) * 703).toFixed(2); // BMI formula for inches and lbs
            setFormData((prevData: any) => ({
              ...prevData,
              [rule.target_question_id]: bmi
            }));
          }
          break;

        case 'calculate_bmi_inch':
          const bmi_weight = parseFloat(formData[rule.weight_question_id]);
          const bmi_height = parseFloat(formData[rule.height_inches_question_id]);
          if (!isNaN(bmi_weight) && !isNaN(bmi_height)) {
            const bmi = ((bmi_weight / (bmi_height * bmi_height)) * 703).toFixed(2); // BMI formula for inches and lbs
            setFormData((prevData: any) => ({
              ...prevData,
              [rule.target_question_id]: bmi
            }));
          }
          break;

          case 'apply_weights':
            rule.criteria.forEach((criteria: any) => {
              const questionId = criteria.question_id;
              const value = formData[questionId];
            
              switch (criteria.type) {
                case 'range':
                  const range = criteria.ranges?.find((range: { min: number, max: number, score: number })  => Number(value) >= range.min && Number(value) <= range.max);
                  if (range) {
                    const inputFieldName = criteria.input_field_name;
                    if (inputFieldName) {
                      const weightedScore = range.score 
                      setFormData((prevData: any) => ({
                        ...prevData,
                        [criteria.input_field_name]: weightedScore !== undefined ? weightedScore.toFixed(0) : 0
                      }));
                    }
                  }
                  break;
            
                case 'options':
                  const index = criteria.options?.findIndex((option: string) => option === value);
                  if (index !== undefined && index !== -1) {
                    const weight = criteria.weights[index];
                    if (weight !== undefined) {
                      const inputFieldName = criteria.input_field_name;
                      if (inputFieldName) {
                        setFormData((prevData: any) => ({
                          ...prevData,
                          [criteria.input_field_name]: weight !== undefined ? weight.toFixed(0) : 0
                        }));
                      }
                    }
                  }
                  break;
            
                default:
                  break;
              }
            });
            break;
          

        case 'calculate_sum':
          rule.criteria.forEach((criteria: any) => {
            const sum = criteria.question_id.reduce((acc: number, questionId: string) => {
              return acc + (parseFloat(formData[questionId]) || 0);
            }, 0);
            setFormData((prevData: any) => ({
              ...prevData,
              [criteria.input_field_name]: sum
            }));
          });
          break;

        case 'calculate_average':
          rule.criteria.forEach((criteria: any) => {
            const values = criteria.fields.map((questionId: string) => parseFloat(formData[questionId]));
            if (values.every((val: any) => !isNaN(val))) {
              const sum = values.reduce((acc: number, val: number) => acc + val, 0);
              const average = sum / values.length;
              setFormData((prevData: any) => ({
                ...prevData,
                [criteria.input_field_name]: average.toFixed(2)
              }));
            } else {
              setFormData((prevData: any) => ({
                ...prevData,
                [criteria.input_field_name]: "" // Empty field if not calculated
              }));
            }
          });
          break;

        case 'calculate_score':
          rule.criteria.forEach((criteria: any) => {
            const score = parseFloat(formData[criteria.question_id]);
            let result = '';
            if (score > criteria.thresholds.high) {
              result = criteria.labels.high;
            } else if (score >= criteria.thresholds.medium.min && score <= criteria.thresholds.medium.max) {
              result = criteria.labels.medium;
            } else if (score < criteria.thresholds.low) {
              result = criteria.labels.low;
            }
            setFormData((prevData: any) => ({
              ...prevData,
              [criteria.target_question_id]: result
            }));
          });
          break;

        case 'calculate_score_exact':
          rule.criteria.forEach((criteria: any) => {
            const questionValue = formData[criteria.question_id];
            const score = criteria.scores[questionValue] || 0;
            setFormData((prevData: any) => ({
              ...prevData,
              [criteria.target_question_id]: score.toFixed(2)
            }));
          });
          break;

        case 'calculate_score_range':
          rule.criteria.forEach((criteria: any) => {
            const questionValue = parseFloat(formData[criteria.question_id]);
            let score = 0;
            criteria.ranges.forEach((range: any) => {
              if (questionValue >= range.min && questionValue <= range.max) {
                score = range.score;
              }
            });
            setFormData((prevData: any) => ({
              ...prevData,
              [criteria.target_question_id]: score.toFixed(2)
            }));
          });
          break;

        case 'convert_value':
          rule.criteria.forEach((criteria: any) => {
            const inputValue = parseFloat(formData[criteria.question_id]);
            if (!isNaN(inputValue)) {
              let convertedValue = 0;

              switch (criteria.type) {
                case 'inch_cm':
                  convertedValue = inputValue * 2.54; // Inches to cm
                  break;
                case 'lbs_kg':
                  convertedValue = inputValue * 0.453592; // Pounds to kg
                  break;
                default:
                  break;
              }

              setFormData((prevData: any) => ({
                ...prevData,
                [criteria.input_field_name]: convertedValue.toFixed(2)
              }));
            } else {
              setFormData((prevData: any) => ({
                ...prevData,
                [criteria.input_field_name]: "" // Empty field if not converted
              }));
            }
          });
          break;

        case 'copy_values':
          rule.criteria.forEach((criteria: any) => {
            const sources = criteria.source_question_ids.map((id: string, index: number) => {
              const value = formData[id];
              const unit = criteria.connection_string[index] || '';
              return value ? `${value} ${unit}` : '';
            }).filter(Boolean).join(' '); // Filters out empty values and joins non-empty ones with a space

            setFormData((prevData: any) => ({
              ...prevData,
              [criteria.target_question_id]: sources
            }));
          });
          break;

        case 'calculate_weight_category_points':
          rule.criteria.forEach((criteria: any) => {
            const heightFt = parseFloat(formData[criteria.height_question_ids[0]]);
            const heightInch = parseFloat(formData[criteria.height_question_ids[1]]);
            const weight = parseFloat(formData[criteria.weight_question_id]);

            if (!isNaN(heightFt) && !isNaN(heightInch) && !isNaN(weight)) {
              const totalHeightInches = heightFt * 12 + heightInch;

              //console.log("Weight:", weight, "Height:", totalHeightInches)

              let points = 0;

              // Weight Category Chart Logic
              if (totalHeightInches === 58) { // 4'10"
                if (weight >= 119 && weight <= 142) points = 1;
                else if (weight >= 143 && weight <= 190) points = 2;
                else if (weight >= 191) points = 3;
              } else if (totalHeightInches === 59) { // 4'11"
                if (weight >= 124 && weight <= 147) points = 1;
                else if (weight >= 148 && weight <= 197) points = 2;
                else if (weight >= 198) points = 3;
              } else if (totalHeightInches === 60) { // 5'0"
                if (weight >= 128 && weight <= 152) points = 1;
                else if (weight >= 153 && weight <= 203) points = 2;
                else if (weight >= 204) points = 3;
              } else if (totalHeightInches === 61) { // 5'1"
                if (weight >= 132 && weight <= 157) points = 1;
                else if (weight >= 158 && weight <= 210) points = 2;
                else if (weight >= 211) points = 3;
              } else if (totalHeightInches === 62) { // 5'2"
                if (weight >= 136 && weight <= 163) points = 1;
                else if (weight >= 164 && weight <= 217) points = 2;
                else if (weight >= 218) points = 3;
              } else if (totalHeightInches === 63) { // 5'3"
                if (weight >= 141 && weight <= 168) points = 1;
                else if (weight >= 169 && weight <= 224) points = 2;
                else if (weight >= 225) points = 3;
              } else if (totalHeightInches === 64) { // 5'4"
                if (weight >= 145 && weight <= 173) points = 1;
                else if (weight >= 174 && weight <= 231) points = 2;
                else if (weight >= 232) points = 3;
              } else if (totalHeightInches === 65) { // 5'5"
                if (weight >= 150 && weight <= 179) points = 1;
                else if (weight >= 180 && weight <= 239) points = 2;
                else if (weight >= 240) points = 3;
              } else if (totalHeightInches === 66) { // 5'6"
                if (weight >= 155 && weight <= 185) points = 1;
                else if (weight >= 186 && weight <= 246) points = 2;
                else if (weight >= 247) points = 3;
              } else if (totalHeightInches === 67) { // 5'7"
                if (weight >= 159 && weight <= 190) points = 1;
                else if (weight >= 191 && weight <= 254) points = 2;
                else if (weight >= 255) points = 3;
              } else if (totalHeightInches === 68) { // 5'8"
                if (weight >= 164 && weight <= 196) points = 1;
                else if (weight >= 197 && weight <= 261) points = 2;
                else if (weight >= 262) points = 3;
              } else if (totalHeightInches === 69) { // 5'9"
                if (weight >= 169 && weight <= 202) points = 1;
                else if (weight >= 203 && weight <= 269) points = 2;
                else if (weight >= 270) points = 3;
              } else if (totalHeightInches === 70) { // 5'10"
                if (weight >= 174 && weight <= 208) points = 1;
                else if (weight >= 209 && weight <= 277) points = 2;
                else if (weight >= 278) points = 3;
              } else if (totalHeightInches === 71) { // 5'11"
                if (weight >= 179 && weight <= 214) points = 1;
                else if (weight >= 215 && weight <= 285) points = 2;
                else if (weight >= 286) points = 3;
              } else if (totalHeightInches === 72) { // 6'0"
                if (weight >= 184 && weight <= 220) points = 1;
                else if (weight >= 221 && weight <= 293) points = 2;
                else if (weight >= 294) points = 3;
              } else if (totalHeightInches === 73) { // 6'1"
                if (weight >= 189 && weight <= 226) points = 1;
                else if (weight >= 227 && weight <= 301) points = 2;
                else if (weight >= 302) points = 3;
              } else if (totalHeightInches === 74) { // 6'2"
                if (weight >= 194 && weight <= 232) points = 1;
                else if (weight >= 233 && weight <= 310) points = 2;
                else if (weight >= 311) points = 3;
              } else if (totalHeightInches === 75) { // 6'3"
                if (weight >= 200 && weight <= 239) points = 1;
                else if (weight >= 240 && weight <= 318) points = 2;
                else if (weight >= 319) points = 3;
              } else if (totalHeightInches === 76) { // 6'4"
                if (weight >= 205 && weight <= 245) points = 1;
                else if (weight >= 246 && weight <= 327) points = 2;
                else if (weight >= 328) points = 3;
              }
              //console.log("points", points)
              // Set the calculated points in the output field
              setFormData((prevData: any) => ({
                ...prevData,
                [criteria.output_question_id]: points.toFixed(0)
              }));
            }
          });
          break;

          case 'tickicon':

      rule.criteria.forEach((criteria: any) => {
      const condition = criteria.condition;
      //console.log("Evaluating Condition:", condition);
      const questionValue = formData[condition.fieldName];
      //console.log("Question Value:", questionValue);
      let isConditionMet = false;

      console.log("Condition Met Evaluation:", {
        questionValue,
        conditionValue: condition.value,
        operator: condition.operator
      });

      // Assuming condition.operator and condition.value are available
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
                isConditionMet = false;
            }
        default:
          break;
      }

      //console.log("Is Condition Met:", isConditionMet);

      setFormData((prevData: any) => ({
        ...prevData,
        [rule.output_question_id]: isConditionMet,
      }));
    });

  break;

        default:
          break;
      }
    });
  }, [formData, businessRules, setFormData]);

  return null;
};

export default BusinessRuleHandler;
