"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var BusinessRuleHandler = function (_a) {
    var formData = _a.formData, businessRules = _a.businessRules, setFormData = _a.setFormData;
    (0, react_1.useEffect)(function () {
        businessRules.forEach(function (rule) {
            switch (rule.rule_type) {
                case 'calculate_bmi':
                    var weight = parseFloat(formData[rule.weight_question_id]);
                    var heightFeet = parseFloat(formData[rule.height_feet_question_id]);
                    var heightInches = parseFloat(formData[rule.height_inches_question_id]);
                    if (!isNaN(weight) && !isNaN(heightFeet) && !isNaN(heightInches)) {
                        var height = heightFeet * 12 + heightInches; // Convert height to inches
                        var bmi_1 = ((weight / (height * height)) * 703).toFixed(2); // BMI formula for inches and lbs
                        setFormData(function (prevData) {
                            var _a;
                            return (__assign(__assign({}, prevData), (_a = {}, _a[rule.target_question_id] = bmi_1, _a)));
                        });
                    }
                    break;
                case 'calculate_bmi_inch':
                    var bmi_weight = parseFloat(formData[rule.weight_question_id]);
                    var bmi_height = parseFloat(formData[rule.height_inches_question_id]);
                    if (!isNaN(bmi_weight) && !isNaN(bmi_height)) {
                        var bmi_2 = ((bmi_weight / (bmi_height * bmi_height)) * 703).toFixed(2); // BMI formula for inches and lbs
                        setFormData(function (prevData) {
                            var _a;
                            return (__assign(__assign({}, prevData), (_a = {}, _a[rule.target_question_id] = bmi_2, _a)));
                        });
                    }
                    break;
                case 'apply_weights':
                    rule.criteria.forEach(function (criteria) {
                        var _a, _b;
                        var questionId = criteria.question_id;
                        var value = formData[questionId];
                        switch (criteria.type) {
                            case 'range':
                                var range = (_a = criteria.ranges) === null || _a === void 0 ? void 0 : _a.find(function (range) { return Number(value) >= range.min && Number(value) <= range.max; });
                                if (range) {
                                    var inputFieldName = criteria.input_field_name;
                                    if (inputFieldName) {
                                        var weightedScore_1 = range.score;
                                        setFormData(function (prevData) {
                                            var _a;
                                            return (__assign(__assign({}, prevData), (_a = {}, _a[criteria.input_field_name] = weightedScore_1 !== undefined ? weightedScore_1.toFixed(0) : 0, _a)));
                                        });
                                    }
                                }
                                break;
                            case 'options':
                                var index = (_b = criteria.options) === null || _b === void 0 ? void 0 : _b.findIndex(function (option) { return option === value; });
                                if (index !== undefined && index !== -1) {
                                    var weight_1 = criteria.weights[index];
                                    if (weight_1 !== undefined) {
                                        var inputFieldName = criteria.input_field_name;
                                        if (inputFieldName) {
                                            setFormData(function (prevData) {
                                                var _a;
                                                return (__assign(__assign({}, prevData), (_a = {}, _a[criteria.input_field_name] = weight_1 !== undefined ? weight_1.toFixed(0) : 0, _a)));
                                            });
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
                    rule.criteria.forEach(function (criteria) {
                        var sum = criteria.question_id.reduce(function (acc, questionId) {
                            return acc + (parseFloat(formData[questionId]) || 0);
                        }, 0);
                        setFormData(function (prevData) {
                            var _a;
                            return (__assign(__assign({}, prevData), (_a = {}, _a[criteria.input_field_name] = sum, _a)));
                        });
                    });
                    break;
                case 'calculate_average':
                    rule.criteria.forEach(function (criteria) {
                        var values = criteria.fields.map(function (questionId) { return parseFloat(formData[questionId]); });
                        if (values.every(function (val) { return !isNaN(val); })) {
                            var sum = values.reduce(function (acc, val) { return acc + val; }, 0);
                            var average_1 = sum / values.length;
                            setFormData(function (prevData) {
                                var _a;
                                return (__assign(__assign({}, prevData), (_a = {}, _a[criteria.input_field_name] = average_1.toFixed(2), _a)));
                            });
                        }
                        else {
                            setFormData(function (prevData) {
                                var _a;
                                return (__assign(__assign({}, prevData), (_a = {}, _a[criteria.input_field_name] = "" // Empty field if not calculated
                                , _a)));
                            });
                        }
                    });
                    break;
                case 'calculate_score':
                    rule.criteria.forEach(function (criteria) {
                        var score = parseFloat(formData[criteria.question_id]);
                        var result = '';
                        if (score > criteria.thresholds.high) {
                            result = criteria.labels.high;
                        }
                        else if (score >= criteria.thresholds.medium.min && score <= criteria.thresholds.medium.max) {
                            result = criteria.labels.medium;
                        }
                        else if (score < criteria.thresholds.low) {
                            result = criteria.labels.low;
                        }
                        setFormData(function (prevData) {
                            var _a;
                            return (__assign(__assign({}, prevData), (_a = {}, _a[criteria.target_question_id] = result, _a)));
                        });
                    });
                    break;
                case 'calculate_score_exact':
                    rule.criteria.forEach(function (criteria) {
                        var questionValue = formData[criteria.question_id];
                        var score = criteria.scores[questionValue] || 0;
                        setFormData(function (prevData) {
                            var _a;
                            return (__assign(__assign({}, prevData), (_a = {}, _a[criteria.target_question_id] = score.toFixed(2), _a)));
                        });
                    });
                    break;
                case 'calculate_score_range':
                    rule.criteria.forEach(function (criteria) {
                        var questionValue = parseFloat(formData[criteria.question_id]);
                        var score = 0;
                        criteria.ranges.forEach(function (range) {
                            if (questionValue >= range.min && questionValue <= range.max) {
                                score = range.score;
                            }
                        });
                        setFormData(function (prevData) {
                            var _a;
                            return (__assign(__assign({}, prevData), (_a = {}, _a[criteria.target_question_id] = score.toFixed(2), _a)));
                        });
                    });
                    break;
                case 'convert_value':
                    rule.criteria.forEach(function (criteria) {
                        var inputValue = parseFloat(formData[criteria.question_id]);
                        if (!isNaN(inputValue)) {
                            var convertedValue_1 = 0;
                            switch (criteria.type) {
                                case 'inch_cm':
                                    convertedValue_1 = inputValue * 2.54; // Inches to cm
                                    break;
                                case 'lbs_kg':
                                    convertedValue_1 = inputValue * 0.453592; // Pounds to kg
                                    break;
                                default:
                                    break;
                            }
                            setFormData(function (prevData) {
                                var _a;
                                return (__assign(__assign({}, prevData), (_a = {}, _a[criteria.input_field_name] = convertedValue_1.toFixed(2), _a)));
                            });
                        }
                        else {
                            setFormData(function (prevData) {
                                var _a;
                                return (__assign(__assign({}, prevData), (_a = {}, _a[criteria.input_field_name] = "" // Empty field if not converted
                                , _a)));
                            });
                        }
                    });
                    break;
                case 'copy_values':
                    rule.criteria.forEach(function (criteria) {
                        var sources = criteria.source_question_ids.map(function (id, index) {
                            var value = formData[id];
                            var unit = criteria.connection_string[index] || '';
                            return value ? "".concat(value, " ").concat(unit) : '';
                        }).filter(Boolean).join(' '); // Filters out empty values and joins non-empty ones with a space
                        setFormData(function (prevData) {
                            var _a;
                            return (__assign(__assign({}, prevData), (_a = {}, _a[criteria.target_question_id] = sources, _a)));
                        });
                    });
                    break;
                case 'calculate_weight_category_points':
                    rule.criteria.forEach(function (criteria) {
                        var heightFt = parseFloat(formData[criteria.height_question_ids[0]]);
                        var heightInch = parseFloat(formData[criteria.height_question_ids[1]]);
                        var weight = parseFloat(formData[criteria.weight_question_id]);
                        if (!isNaN(heightFt) && !isNaN(heightInch) && !isNaN(weight)) {
                            var totalHeightInches = heightFt * 12 + heightInch;
                            //console.log("Weight:", weight, "Height:", totalHeightInches)
                            var points_1 = 0;
                            // Weight Category Chart Logic
                            if (totalHeightInches === 58) { // 4'10"
                                if (weight >= 119 && weight <= 142)
                                    points_1 = 1;
                                else if (weight >= 143 && weight <= 190)
                                    points_1 = 2;
                                else if (weight >= 191)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 59) { // 4'11"
                                if (weight >= 124 && weight <= 147)
                                    points_1 = 1;
                                else if (weight >= 148 && weight <= 197)
                                    points_1 = 2;
                                else if (weight >= 198)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 60) { // 5'0"
                                if (weight >= 128 && weight <= 152)
                                    points_1 = 1;
                                else if (weight >= 153 && weight <= 203)
                                    points_1 = 2;
                                else if (weight >= 204)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 61) { // 5'1"
                                if (weight >= 132 && weight <= 157)
                                    points_1 = 1;
                                else if (weight >= 158 && weight <= 210)
                                    points_1 = 2;
                                else if (weight >= 211)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 62) { // 5'2"
                                if (weight >= 136 && weight <= 163)
                                    points_1 = 1;
                                else if (weight >= 164 && weight <= 217)
                                    points_1 = 2;
                                else if (weight >= 218)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 63) { // 5'3"
                                if (weight >= 141 && weight <= 168)
                                    points_1 = 1;
                                else if (weight >= 169 && weight <= 224)
                                    points_1 = 2;
                                else if (weight >= 225)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 64) { // 5'4"
                                if (weight >= 145 && weight <= 173)
                                    points_1 = 1;
                                else if (weight >= 174 && weight <= 231)
                                    points_1 = 2;
                                else if (weight >= 232)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 65) { // 5'5"
                                if (weight >= 150 && weight <= 179)
                                    points_1 = 1;
                                else if (weight >= 180 && weight <= 239)
                                    points_1 = 2;
                                else if (weight >= 240)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 66) { // 5'6"
                                if (weight >= 155 && weight <= 185)
                                    points_1 = 1;
                                else if (weight >= 186 && weight <= 246)
                                    points_1 = 2;
                                else if (weight >= 247)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 67) { // 5'7"
                                if (weight >= 159 && weight <= 190)
                                    points_1 = 1;
                                else if (weight >= 191 && weight <= 254)
                                    points_1 = 2;
                                else if (weight >= 255)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 68) { // 5'8"
                                if (weight >= 164 && weight <= 196)
                                    points_1 = 1;
                                else if (weight >= 197 && weight <= 261)
                                    points_1 = 2;
                                else if (weight >= 262)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 69) { // 5'9"
                                if (weight >= 169 && weight <= 202)
                                    points_1 = 1;
                                else if (weight >= 203 && weight <= 269)
                                    points_1 = 2;
                                else if (weight >= 270)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 70) { // 5'10"
                                if (weight >= 174 && weight <= 208)
                                    points_1 = 1;
                                else if (weight >= 209 && weight <= 277)
                                    points_1 = 2;
                                else if (weight >= 278)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 71) { // 5'11"
                                if (weight >= 179 && weight <= 214)
                                    points_1 = 1;
                                else if (weight >= 215 && weight <= 285)
                                    points_1 = 2;
                                else if (weight >= 286)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 72) { // 6'0"
                                if (weight >= 184 && weight <= 220)
                                    points_1 = 1;
                                else if (weight >= 221 && weight <= 293)
                                    points_1 = 2;
                                else if (weight >= 294)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 73) { // 6'1"
                                if (weight >= 189 && weight <= 226)
                                    points_1 = 1;
                                else if (weight >= 227 && weight <= 301)
                                    points_1 = 2;
                                else if (weight >= 302)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 74) { // 6'2"
                                if (weight >= 194 && weight <= 232)
                                    points_1 = 1;
                                else if (weight >= 233 && weight <= 310)
                                    points_1 = 2;
                                else if (weight >= 311)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 75) { // 6'3"
                                if (weight >= 200 && weight <= 239)
                                    points_1 = 1;
                                else if (weight >= 240 && weight <= 318)
                                    points_1 = 2;
                                else if (weight >= 319)
                                    points_1 = 3;
                            }
                            else if (totalHeightInches === 76) { // 6'4"
                                if (weight >= 205 && weight <= 245)
                                    points_1 = 1;
                                else if (weight >= 246 && weight <= 327)
                                    points_1 = 2;
                                else if (weight >= 328)
                                    points_1 = 3;
                            }
                            //console.log("points", points)
                            // Set the calculated points in the output field
                            setFormData(function (prevData) {
                                var _a;
                                return (__assign(__assign({}, prevData), (_a = {}, _a[criteria.output_question_id] = points_1.toFixed(0), _a)));
                            });
                        }
                    });
                    break;
                case 'tickicon':
                    rule.criteria.forEach(function (criteria) {
                        var condition = criteria.condition;
                        //console.log("Evaluating Condition:", condition);
                        var questionValue = formData[condition.fieldName];
                        //console.log("Question Value:", questionValue);
                        var isConditionMet = false;
                        console.log("Condition Met Evaluation:", {
                            questionValue: questionValue,
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
                                    var _a = condition.range, min = _a[0], max = _a[1];
                                    isConditionMet = questionValue >= min && questionValue <= max;
                                }
                                else {
                                    console.error("Range operator requires an array with two elements: [min, max]");
                                    isConditionMet = false;
                                }
                            default:
                                break;
                        }
                        //console.log("Is Condition Met:", isConditionMet);
                        setFormData(function (prevData) {
                            var _a;
                            return (__assign(__assign({}, prevData), (_a = {}, _a[rule.output_question_id] = isConditionMet, _a)));
                        });
                    });
                    break;
                default:
                    break;
            }
        });
    }, [formData, businessRules, setFormData]);
    return null;
};
exports.default = BusinessRuleHandler;
