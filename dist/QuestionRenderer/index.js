"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
require("react-datepicker/dist/react-datepicker.css");
var ai_1 = require("react-icons/ai");
require("../FormLayout.css");
var moment_1 = __importDefault(require("moment"));
var fa_1 = require("react-icons/fa");
require("react-pdf/dist/esm/Page/AnnotationLayer.css"); // PDF Viewer styles
var QuestionRenderer = function (_a) {
    var question = _a.question, question_length = _a.question_length, handleChange = _a.handleChange, value = _a.value, inline = _a.inline, columnsCount = _a.columnsCount, dependencies = _a.dependencies, error = _a.error, formData = _a.formData, businessRules = _a.businessRules, setFormData = _a.setFormData;
    var sizeMap = {
        'XS': 'var(--size-xs)',
        'S': 'var(--size-s)',
        'M': 'var(--size-m)',
        'L': 'var(--size-l)',
        'XL': 'var(--size-xl)',
        'XXL': 'var(--size-xxl)',
        'XXXL': 'var(--size-xxxl)',
    };
    var _b = (0, react_1.useState)(''), otherValue = _b[0], setOtherValue = _b[1];
    var _c = (0, react_1.useState)(false), visible = _c[0], setVisible = _c[1];
    var _d = (0, react_1.useState)(value ? (0, moment_1.default)(value, 'MM/DD/YYYY').toDate() : null), selectedDate = _d[0], setSelectedDate = _d[1];
    var labelRef = (0, react_1.useRef)(null);
    var _e = (0, react_1.useState)(0), numLineBreaks = _e[0], setNumLineBreaks = _e[1];
    var isTextEmpty = question.question_text === "";
    var _f = (0, react_1.useState)(false), modalIsOpen = _f[0], setModalIsOpen = _f[1];
    var _g = (0, react_1.useState)(''), pdfUrl = _g[0], setPdfUrl = _g[1]; // Store the document URL
    var openPopup = function (url) {
        var width = 800;
        var height = 600;
        var left = (window.innerWidth - width) / 2;
        var top = (window.innerHeight - height) / 2;
        window.open(url, 'popup', "width=".concat(width, ",height=").concat(height, ",top=").concat(top, ",left=").concat(left));
    };
    (0, react_1.useEffect)(function () {
        function evaluateEligibility(formData) {
            var conditions = [
                { fieldName: 'DPPSCRSEC01Q007', operator: '>=', value: 25 },
                { fieldName: 'DPPSCRSEC02Q015', operator: '>=', value: 5 },
                { fieldName: 'DPPSCRSEC01Q008', operator: 'range', range: [5.7, 6.4] },
                { fieldName: 'DPPSCRSEC02Q005', operator: '===', value: 'Yes' },
            ];
            var count = conditions.reduce(function (acc, condition) {
                var questionValue = formData[condition.fieldName];
                var isConditionMet = false;
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
                            var _a = condition.range, min = _a[0], max = _a[1];
                            isConditionMet = questionValue >= min && questionValue <= max;
                        }
                        break;
                    default:
                        break;
                }
                return acc + (isConditionMet ? 1 : 0);
            }, 0);
            console.log("Count", count);
            return count >= 3 ? 'DPPSCRSEC03Q006' : 'DPPSCRSEC03Q007'; // Returns the question ID to show
        }
        var result = evaluateEligibility(formData);
        console.log("result", result);
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
    (0, react_1.useEffect)(function () {
        if (question.dependency && Array.isArray(question.dependency)) {
            var conditionsMet = question.dependency.every(function (dep) {
                var dependentQuestion = dependencies.find(function (d) { return d.question_id === dep.question_id; });
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
                                var _a = dep.range, min = _a[0], max = _a[1];
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
        }
        else if (question.dependency) {
            var dependentQuestion = dependencies.find(function (dep) { return dep.question_id === question.dependency; });
            if (dependentQuestion) {
                setVisible(dependentQuestion.value === question.show_if_value);
            }
        }
        else {
            setVisible(true); // If no dependency, make the question visible
        }
    }, [dependencies, question]);
    (0, react_1.useEffect)(function () {
        if (labelRef.current) {
            var lineHeight = parseFloat(getComputedStyle(labelRef.current).lineHeight);
            var labelHeight = labelRef.current.clientHeight;
            var lines = Math.ceil(labelHeight / lineHeight);
            setNumLineBreaks(lines);
        }
    }, [question.question_text]);
    var getWidth = function (sizeCode, columns) {
        var percentage = sizeMap[sizeCode] || 'var(--size-xxxl)';
        return "calc(".concat(percentage, " * ").concat(columns, ")");
    };
    var parseWidths = function (widthString, columns) {
        if (columns === void 0) { columns = 1; }
        if (!widthString) {
            return {
                labelWidth: '300px',
                inputWidth: '200px',
                inputMinWidth: '100px'
            };
        }
        var _a = widthString.split('/'), labelWidthCode = _a[0], inputWidthCode = _a[1];
        return {
            labelWidth: getWidth(labelWidthCode, columns),
            inputWidth: getWidth(inputWidthCode, columns),
            inputMinWidth: getWidth(inputWidthCode, 1)
        };
    };
    var _h = parseWidths(question_length, columnsCount), labelWidth = _h.labelWidth, inputWidth = _h.inputWidth, inputMinWidth = _h.inputMinWidth;
    if (!visible) {
        return null;
    }
    var handleDateChange = function (date, questionId) {
        handleChange({
            target: {
                name: questionId,
                value: date ? date.toISOString().split('T')[0] : ''
            }
        });
    };
    var handleNumberChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value, min = _a.min, max = _a.max;
        if (value === '' || (Number(value) >= Number(min) && Number(value) <= Number(max))) {
            handleChange(e);
        }
    };
    var handleNumberOnlyChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        if (value === '' || !isNaN(Number(value))) {
            handleChange(e);
        }
    };
    var handleClockIconClick = function (questionId) {
        var timePickerInput = document.querySelector("#".concat(questionId, " .react-time-picker__inputGroup__input"));
        if (timePickerInput) {
            timePickerInput.focus();
        }
    };
    // Evaluate condition for tickicon
    var evaluateCondition = function () {
        var condition = question.show_if_value;
        var questionValue = formData[condition.fieldName];
        var isConditionMet = false;
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
                }
                break;
            default:
                break;
        }
        return isConditionMet;
    };
    var renderQuestion = function () {
        switch (question.question_type) {
            case 'tickicon':
                var isConditionMet = evaluateCondition();
                console.log("Condition Met: ".concat(isConditionMet, ", QuestionID: ").concat(question.question_id)); // Debugging to see if the condition is met
                return (react_1.default.createElement("div", { className: "question-inline flex items-center justify-end md:w-full md:pr-20 lg:w-1/2" },
                    react_1.default.createElement("div", { className: "tick-icon-container tick ".concat(isConditionMet ? 'satisfied' : 'not-satisfied') },
                        react_1.default.createElement("div", { className: "status-icon" }, isConditionMet ? react_1.default.createElement(fa_1.FaCheck, { className: 'iconGreen' }) : react_1.default.createElement(fa_1.FaTimes, { className: 'iconRed' })))));
            case 'upload-link':
                return (react_1.default.createElement("div", { className: 'upload-link-container' },
                    react_1.default.createElement("label", { htmlFor: question.question_id, style: {
                            textDecoration: 'underline',
                            cursor: 'pointer',
                        } }, question.question_text),
                    react_1.default.createElement("input", { id: question.question_id, className: 'form-input', type: 'file', style: { display: 'none' } })));
            case 'view-document':
                return (react_1.default.createElement("div", { className: "flex space-x-5" },
                    react_1.default.createElement("a", { href: question.documentUrl, onClick: function (e) {
                            e.preventDefault(); // Prevent the default link behavior
                            openPopup(question.documentUrl);
                        }, className: "" }, "View Document")));
            case 'text-area':
                return react_1.default.createElement("textarea", { className: "form-input text-area", name: question.question_id, value: value, onChange: handleChange, style: { width: inputWidth, minWidth: inputMinWidth } });
            case 'text':
                return react_1.default.createElement("input", { className: "form-input", type: "text", name: question.question_id, value: value, onChange: handleChange, style: { width: inputWidth, minWidth: inputMinWidth } });
            case 'number':
                var min = question.min !== undefined ? question.min : 0;
                var max = question.max !== undefined ? question.max : 100;
                return react_1.default.createElement("input", { className: "form-input", type: "number", name: question.question_id, value: value, onChange: handleChange, min: min, max: max, style: { width: inputWidth, minWidth: inputMinWidth } });
            case 'number-only':
                return (react_1.default.createElement("input", { className: "form-input", type: "text", name: question.question_id, value: value, onChange: handleNumberOnlyChange, style: { width: inputWidth, minWidth: inputMinWidth } }));
            case 'qrcode':
                return (react_1.default.createElement("div", { className: "justify-center" },
                    react_1.default.createElement(ai_1.AiOutlineQrcode, { size: 50, style: { marginLeft: '10px', cursor: 'pointer' } }),
                    react_1.default.createElement("h3", null, " Scan here")));
            case 'date':
                var getMaxWidth = function () {
                    if (window.innerWidth <= 1023) {
                        // Small screens (md and below)
                        return '75%';
                    }
                    else {
                        // Larger screens (ld and above)
                        return '45%';
                    }
                };
                return (react_1.default.createElement("input", { className: "form-input", type: "date", name: question.question_id, value: value, style: { maxWidth: getMaxWidth() }, onChange: handleNumberOnlyChange }));
            case 'time':
                return (react_1.default.createElement("input", { className: "form-input", type: "time", name: question.question_id, value: value, onChange: handleNumberOnlyChange, style: { width: inputWidth, minWidth: inputMinWidth } }));
            case 'select':
                return (react_1.default.createElement("div", null,
                    react_1.default.createElement("select", { className: "form-input", name: question.question_id, value: value, onChange: handleChange, style: { width: inputWidth, minWidth: inputMinWidth } },
                        react_1.default.createElement("option", { value: "" }, "--SELECT--"),
                        question.options.map(function (option) { return (react_1.default.createElement("option", { key: option, value: option }, option)); }),
                        question.other_option && question.other_option.enabled && (react_1.default.createElement("option", { value: "Other" }, question.other_option.label))),
                    value === "Other" && (react_1.default.createElement("input", { type: "text", name: "".concat(question.question_id, "_other"), value: otherValue, onChange: function (e) { return setOtherValue(e.target.value); }, placeholder: question.other_option.placeholder, style: { marginLeft: '10px', width: inputWidth, minWidth: inputMinWidth, padding: '5px', border: 'solid 1px #ccc', borderRadius: '4px' } }))));
            case 'radio_multiline':
                return (react_1.default.createElement("div", { className: "radio-multiline" },
                    question.options.map(function (option) { return (react_1.default.createElement("div", { key: option, className: "radio-multiline-option" },
                        react_1.default.createElement("label", null,
                            react_1.default.createElement("input", { type: "radio", name: question.question_id, value: option, checked: value === option, onChange: handleChange }),
                            react_1.default.createElement("span", { className: "radio-label" }, option)))); }),
                    question.other_option && question.other_option.enabled && (react_1.default.createElement("div", { className: "radio-multiline-option ".concat(question.other_option.display === "block" ? "block" : "inline") },
                        react_1.default.createElement("label", { className: '' },
                            react_1.default.createElement("input", { type: "radio", name: question.question_id, value: "Other", checked: value === "Other", onChange: handleChange }),
                            react_1.default.createElement("span", { className: "radio-label" }, question.other_option.label),
                            value === "Other" && (react_1.default.createElement("input", { type: "text", name: "".concat(question.question_id, "_other"), value: otherValue, onChange: function (e) { return setOtherValue(e.target.value); }, className: "form-input other-input", placeholder: question.other_option.placeholder || "Specify", style: { marginLeft: '10px', width: inputWidth, minWidth: inputMinWidth } })))))));
            case 'radio_multiline-multiselect':
                return (react_1.default.createElement("div", { className: "radio-multiline" },
                    question.options.map(function (option) { return (react_1.default.createElement("div", { key: option, className: "radio-multiline-option" },
                        react_1.default.createElement("label", null,
                            react_1.default.createElement("input", { type: "checkbox", name: "".concat(question.question_id, "_").concat(option), value: option, checked: value.includes(option), onChange: function (e) {
                                    var newValue = value ? value.split(',') : [];
                                    if (e.target.checked) {
                                        newValue.push(option);
                                    }
                                    else {
                                        newValue = newValue.filter(function (val) { return val !== option; });
                                    }
                                    handleChange({ target: { name: question.question_id, value: newValue.join(',') } });
                                } }),
                            react_1.default.createElement("span", { className: "radio-label" }, option)))); }),
                    question.other_option && question.other_option.enabled && (react_1.default.createElement("div", { className: "radio-multiline-option ".concat(question.other_option.display === "block" ? "block" : "inline") },
                        react_1.default.createElement("label", { className: '' },
                            react_1.default.createElement("input", { type: "checkbox", name: "".concat(question.question_id, "_Other"), value: "Other", checked: value.includes("Other"), onChange: function (e) {
                                    var newValue = value ? value.split(',') : [];
                                    if (e.target.checked) {
                                        newValue.push("Other");
                                    }
                                    else {
                                        newValue = newValue.filter(function (val) { return val !== "Other"; });
                                    }
                                    handleChange({ target: { name: question.question_id, value: newValue.join(',') } });
                                } }),
                            react_1.default.createElement("span", { className: "radio-label" }, question.other_option.label),
                            value.includes("Other") && (react_1.default.createElement("input", { type: "text", name: "".concat(question.question_id, "_other"), value: otherValue, onChange: function (e) { return setOtherValue(e.target.value); }, className: "form-input other-input", placeholder: question.other_option.placeholder || "Specify", style: { marginLeft: '10px', width: inputWidth, minWidth: inputMinWidth } })))))));
            case 'textdisable':
                return react_1.default.createElement("input", { className: "form-input textdisable-input", type: "text", name: question.question_id, value: value, readOnly: true, style: { width: inputWidth, minWidth: inputMinWidth } });
            case 'label':
                var labelStyles = {
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
                return (react_1.default.createElement("label", { style: labelStyles }, question.question_text));
            case 'send-link-button':
                return (react_1.default.createElement("div", { className: "" },
                    react_1.default.createElement("button", { style: {
                            backgroundColor: '#8ba8da',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }, type: "button" }, question.label)));
            case 'radio':
                return (react_1.default.createElement("div", null, question.options.map(function (option) { return (react_1.default.createElement("div", { key: option, className: "radio-option" },
                    react_1.default.createElement("label", null,
                        react_1.default.createElement("input", { type: "radio", name: question.question_id, value: option, checked: value === option, onChange: handleChange }),
                        option))); })));
            case 'checkbox-inline':
                return (react_1.default.createElement("div", { className: "flex items-center" },
                    react_1.default.createElement("input", { type: "checkbox", id: question.question_id, name: question.question_id, checked: value === 'true', onChange: function (e) { return handleChange({ target: { name: question.question_id, value: e.target.checked ? 'true' : 'false' } }); }, className: " mb-2" }),
                    react_1.default.createElement("label", { className: "ml-5 text-nowrap", htmlFor: question.question_id }, question.label)));
            case 'checkbox':
                return (react_1.default.createElement("div", { className: "" },
                    react_1.default.createElement("input", { type: "checkbox", id: question.question_id, name: question.question_id, checked: value === 'true', onChange: function (e) { return handleChange({ target: { name: question.question_id, value: e.target.checked ? 'true' : 'false' } }); }, className: "" })));
            case 'card':
                return (react_1.default.createElement("div", { className: "border-2 border-slate-500 p-4 rounded-sm" },
                    react_1.default.createElement("div", { className: " ml-4 mb-4" },
                        react_1.default.createElement("div", { className: "" },
                            react_1.default.createElement("input", { type: "radio", id: question.question_id, name: question.question_id, checked: value === 'true', onChange: function (e) { return handleChange({ target: { name: question.question_id, value: e.target.checked ? 'true' : 'false' } }); }, className: "" }),
                            react_1.default.createElement("span", null, " send via SMS Text")),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("input", { className: "form-input", type: "text", name: "SMS", placeholder: "Enter Phone number", value: "", onChange: handleChange, style: { width: 180, minWidth: 130, paddingTop: 2, marginTop: 3 } }))),
                    react_1.default.createElement("div", { className: " ml-4 mb-4" },
                        react_1.default.createElement("div", { className: "" },
                            react_1.default.createElement("input", { type: "radio", id: "SMS", name: "SMS", checked: value === 'true', onChange: function (e) { return handleChange({ target: { name: "SMS", value: e.target.checked ? 'true' : 'false' } }); }, className: "" }),
                            react_1.default.createElement("span", null, " send via Email")),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("input", { className: "form-input", type: "text", name: "Email", placeholder: "Enter email", value: "", onChange: handleChange, style: { width: 180, minWidth: 130, paddingTop: 2, marginTop: 3 } }))),
                    react_1.default.createElement("div", { className: " ml-4 mb-4" },
                        react_1.default.createElement("div", { className: "" },
                            react_1.default.createElement("button", { className: ' bg-black text-zinc-50 p-2 rounded-sm px-10' }, " confirm ")))));
            case 'slider':
                return (react_1.default.createElement("div", { className: "slider-container" },
                    react_1.default.createElement("div", { className: " flex flex-col w-2/3" },
                        react_1.default.createElement("div", { className: ' flex flex-row justify-between m-2' },
                            react_1.default.createElement("span", null, "0"),
                            " ",
                            react_1.default.createElement("span", null, "10")),
                        react_1.default.createElement("input", { type: "range", id: question.question_id, name: question.question_id, min: "0", max: "10", value: value || 5, onChange: handleChange, className: " slider-input" }),
                        react_1.default.createElement("div", { className: "flex flex-row justify-between m-3" },
                            react_1.default.createElement("span", null, "Definitely Not Ready"),
                            react_1.default.createElement("span", null, "Definitely Ready")))));
            default:
                return null;
        }
    };
    var renderLineBreaks = function () {
        // Add specific question_ids that need line breaks
        var lineBreakQuestions = ["NPAQ01Q11", "NPAQ01Q08", "NPAQ01Q14", "SURV01S02Q12", "SURV01S02Q14"];
        if (lineBreakQuestions.includes(question.question_id)) {
            return react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("br", null),
                react_1.default.createElement("br", null));
        }
        return null;
    };
    return (react_1.default.createElement("div", { className: "question-container column ".concat(isTextEmpty ? 'empty-question' : '') },
        question.question_type !== 'label' && question.question_type !== 'checkbox-inline' && question.question_type !== 'upload-link' && question.question_type !== 'view-document' && question.question_type !== 'tickicon' && (react_1.default.createElement("label", { ref: labelRef, className: inline ? 'question-inline' : 'question-block', htmlFor: question.question_id, style: { width: labelWidth } },
            question.question_text || (react_1.default.createElement("span", { className: 'mt-2' },
                Array(numLineBreaks).fill(react_1.default.createElement("br", null)),
                "  ")),
            question.required && react_1.default.createElement("span", { className: "required" }, "*"))),
        error && react_1.default.createElement("div", { className: "error-message" }, error),
        " ",
        renderQuestion(),
        " "));
};
exports.default = QuestionRenderer;
