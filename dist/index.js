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
var LayoutRenderer_1 = __importDefault(require("./LayoutRenderer"));
var BusinessRuleHandler_1 = __importDefault(require("./BusinessRuleHandler"));
var axios_1 = __importDefault(require("axios"));
var surveys_json_1 = __importDefault(require("./backenddata/surveys/surveys.json"));
var DynamicFormGenerator = function (_a) {
    var surveyID = _a.surveyID, participantID = _a.participantID, Urls = _a.Urls;
    var _b = (0, react_1.useState)(null), surveyData = _b[0], setSurveyData = _b[1];
    var _c = (0, react_1.useState)({}), formData = _c[0], setFormData = _c[1];
    (0, react_1.useEffect)(function () {
        console.log("Dynamic form");
        var fetchSurveyData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_1, localSurvey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(Urls[0], {
                                headers: { Authorization: "Bearer ".concat(process.env.BLOB_READ_WRITE_TOKEN) }
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            console.log("Response:", response.data);
                            setSurveyData(response.data);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error fetching survey data:', error_1);
                        localSurvey = surveys_json_1.default.surveys.find(function (survey) { return survey.surveyID === surveyID; });
                        if (localSurvey) {
                            setSurveyData(localSurvey);
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        var fetchFormData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(Urls[1], {
                                params: { participantID: participantID, surveyID: surveyID }
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            setFormData(response.data.formData);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error fetching form data:', error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchSurveyData();
        fetchFormData();
    }, [surveyID, participantID]);
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prevState) {
            var _a;
            return (__assign(__assign({}, prevState), (_a = {}, _a[name] = value, _a)));
        });
    };
    if (!surveyData) {
        //setSurveyData(data.surveys.find(surveyID));
        console.log("Error:", surveyID, participantID, Urls, surveys_json_1.default);
        return react_1.default.createElement("div", null, "Survey Loading...");
    }
    var sections = surveyData.sections, questions = surveyData.questions, businessRules = surveyData.businessRules, redirectUrl = surveyData.redirectUrl, saveUrl = surveyData.saveUrl;
    return (react_1.default.createElement("div", { className: "dynamic-form-generator" },
        react_1.default.createElement(LayoutRenderer_1.default, { layout: sections, questions: questions, handleChange: handleChange, formData: formData, setFormData: setFormData, businessRules: businessRules, redirectUrl: redirectUrl, saveUrl: saveUrl, participantID: participantID, surveyID: surveyID }),
        react_1.default.createElement(BusinessRuleHandler_1.default, { formData: formData, businessRules: businessRules, setFormData: setFormData })));
};
exports.default = DynamicFormGenerator;
