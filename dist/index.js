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
var LayoutRenderer_1 = __importDefault(require("./LayoutRenderer"));
var BusinessRuleHandler_1 = __importDefault(require("./BusinessRuleHandler"));
var DynamicFormGenerator = function (_a) {
    var surveyData = _a.surveyData, formData = _a.formData, onSectionChange = _a.onSectionChange, onSave = _a.onSave, redirectUrl = _a.redirectUrl;
    var _b = (0, react_1.useState)(surveyData), localSurveyData = _b[0], setLocalSurveyData = _b[1];
    var _c = (0, react_1.useState)(formData), localFormData = _c[0], setLocalFormData = _c[1];
    (0, react_1.useEffect)(function () {
        setLocalSurveyData(surveyData);
        setLocalFormData(formData);
    }, [surveyData, formData]);
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setLocalFormData(function (prevState) {
            var _a;
            return (__assign(__assign({}, prevState), (_a = {}, _a[name] = value, _a)));
        });
    };
    if (!localSurveyData) {
        return react_1.default.createElement("div", null, "Survey Loading...");
    }
    var sections = localSurveyData.sections, questions = localSurveyData.questions, businessRules = localSurveyData.businessRules;
    return (react_1.default.createElement("div", { className: "dynamic-form-generator" },
        react_1.default.createElement(LayoutRenderer_1.default, { layout: sections, questions: questions, handleChange: handleChange, formData: localFormData, setFormData: setLocalFormData, redirectUrl: redirectUrl, businessRules: businessRules, onSectionChange: onSectionChange, onSave: onSave }),
        react_1.default.createElement(BusinessRuleHandler_1.default, { formData: localFormData, businessRules: businessRules, setFormData: setLocalFormData })));
};
exports.default = DynamicFormGenerator;
