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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var GroupRenderer_1 = __importDefault(require("../GroupRenderer"));
require("../FormLayout.css");
var axios_1 = __importDefault(require("axios"));
var LayoutRenderer = function (_a) {
    var _b = _a.layout, layout = _b === void 0 ? [] : _b, questions = _a.questions, handleChange = _a.handleChange, formData = _a.formData, setFormData = _a.setFormData, businessRules = _a.businessRules, redirectUrl = _a.redirectUrl, saveUrl = _a.saveUrl, participantID = _a.participantID, surveyID = _a.surveyID;
    var _c = (0, react_1.useState)(0), currentSectionIndex = _c[0], setCurrentSectionIndex = _c[1];
    var _d = (0, react_1.useState)({}), errors = _d[0], setErrors = _d[1];
    (0, react_1.useEffect)(function () {
        var fetchExistingResponses = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("http://localhost:3001/api/getFormData?participantID=".concat(participantID, "&surveyID=").concat(surveyID))];
                    case 1:
                        response = _a.sent();
                        if (response.data && response.data.formData) {
                            setFormData(response.data.formData);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        // const localResponse = preprocessdata.responses.find((response: any)  => response.participantID === participantID && response.surveyID === surveyID);
                        // if (localResponse) {
                        //   setFormData(localResponse);
                        // }
                        console.error('Error fetching form data:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchExistingResponses();
    }, [participantID, surveyID, setFormData]);
    var shouldDisplay = function (conditions) {
        if (!conditions || conditions.length === 0) {
            return true;
        }
        return conditions.every(function (condition) { return formData[condition.question_id] === condition.value; });
    };
    var handleFieldChange = function (e) {
        handleChange(e);
        if (errors[e.target.name]) {
            var newErrors = __assign({}, errors);
            delete newErrors[e.target.name];
            setErrors(newErrors);
        }
    };
    var handleNext = function () {
        var newErrors = {};
        var currentSection = layout[currentSectionIndex];
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
        }
        else {
            setErrors({});
            var nextIndex = currentSectionIndex + 1;
            while (nextIndex < layout.length && !shouldDisplay(layout[nextIndex].display_conditions)) {
                nextIndex += 1;
            }
            if (nextIndex < layout.length) {
                setCurrentSectionIndex(nextIndex);
            }
        }
    };
    var handlePrev = function () {
        var prevIndex = currentSectionIndex - 1;
        while (prevIndex >= 0 && !shouldDisplay(layout[prevIndex].display_conditions)) {
            prevIndex -= 1;
        }
        if (prevIndex >= 0) {
            setCurrentSectionIndex(prevIndex);
        }
    };
    var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.post(saveUrl, {
                            formData: formData,
                            participantID: participantID,
                            surveyID: surveyID
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error saving file:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleCancel = function () { return __awaiter(void 0, void 0, void 0, function () {
        var builtUrl;
        return __generator(this, function (_a) {
            try {
                // await axios.post(saveUrl, {
                //   formData,
                //   participantID,
                //   surveyID
                // });
                alert('You have canceled this survey');
                builtUrl = redirectUrl.replace('[participantID]', participantID);
                window.location.href = builtUrl;
            }
            catch (error) {
                console.error('Error saving file:', error);
                alert('Failed to save file. Please try again.');
            }
            return [2 /*return*/];
        });
    }); };
    var buildRedirectUrl = function () {
        if (!participantID) {
            return redirectUrl;
        }
        return redirectUrl.replace('[participantID]', participantID);
    };
    var handleSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var newErrors, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newErrors = {};
                    layout.forEach(function (section) {
                        section.groups.forEach(function (group) {
                            group.rows.forEach(function (row) {
                                row.columns.forEach(function (column) {
                                    var question = questions.find(function (q) { return q.question_id === column.question_id; });
                                    if (question && question.required && !formData[question.question_id]) {
                                        newErrors[question.question_id] = 'This field is required';
                                    }
                                });
                            });
                        });
                    });
                    if (!(Object.keys(newErrors).length > 0)) return [3 /*break*/, 1];
                    setErrors(newErrors);
                    return [3 /*break*/, 5];
                case 1:
                    setErrors({});
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.post(saveUrl, {
                            formData: formData,
                            participantID: participantID,
                            surveyID: surveyID
                        })];
                case 3:
                    _a.sent();
                    window.location.href = buildRedirectUrl();
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error('Error saving file:', error_3);
                    alert('Failed to save file. Please try again.');
                    window.location.href = buildRedirectUrl();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var currentSection = layout[currentSectionIndex];
    var isLastSection = function (index) {
        for (var i = index + 1; i < layout.length; i++) {
            if (shouldDisplay(layout[i].display_conditions)) {
                return false;
            }
        }
        return true;
    };
    return (react_1.default.createElement("div", { className: "dynamic-form-section" },
        shouldDisplay(currentSection.display_conditions) && (react_1.default.createElement("div", { key: currentSection.section_id, className: "form-section" },
            react_1.default.createElement("h2", { className: "section-title" }, currentSection.section_title),
            currentSection.groups.map(function (group) { return (shouldDisplay(group.display_conditions) && (react_1.default.createElement(GroupRenderer_1.default, { key: group.group_id, group: group, questions: questions, handleChange: handleFieldChange, setFormData: setFormData, businessRules: businessRules, formData: formData, dependencies: Object.keys(formData).map(function (key) { return ({ question_id: key, value: formData[key] }); }), errors: errors }))); }))),
        react_1.default.createElement("div", { className: "form-buttons" },
            currentSectionIndex > 0 && react_1.default.createElement("button", { className: "button prev", onClick: handlePrev }, "Prev"),
            react_1.default.createElement("button", { className: "button save", onClick: handleSave }, "Save"),
            isLastSection(currentSectionIndex) ? (react_1.default.createElement("button", { className: "button submit", onClick: handleSubmit }, "Submit")) : (react_1.default.createElement("button", { className: "button next", onClick: handleNext }, "Next")),
            react_1.default.createElement("button", { className: "button cancel", onClick: handleCancel }, "Cancel"))));
};
exports.default = LayoutRenderer;
