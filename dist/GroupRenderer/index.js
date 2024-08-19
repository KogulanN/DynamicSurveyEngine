"use strict";
//@ts-ignore
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var QuestionRenderer_1 = __importDefault(require("../QuestionRenderer"));
var GroupRenderer = function (_a) {
    var group = _a.group, questions = _a.questions, handleChange = _a.handleChange, formData = _a.formData, dependencies = _a.dependencies, errors = _a.errors, businessRules = _a.businessRules, setFormData = _a.setFormData;
    var sizeMap = {
        'XS': 0.3,
        'S': 0.4,
        'M': 0.5,
        'L': 0.6,
        'XL': 0.7,
        'XXL': 0.8,
        'XXXL': 0.9,
    };
    var getRowClass = function (groupLayout) {
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
    var maxColumnWidths = group.rows.reduce(function (acc, row) {
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
    var calculateMaxLinesInRow = function (row) {
        return row.columns.reduce(function (maxLines, column) {
            var question = questions.find(function (q) { return q.question_id === column.question_id; });
            if (question) {
                var labelHeight = question.question_text.split('\n').length;
                return Math.max(maxLines, labelHeight);
            }
            return maxLines;
        }, 0);
    };
    var shouldDisplay = function (conditions) {
        if (!conditions || conditions.length === 0) {
            return true;
        }
        return conditions.every(function (condition) { return formData[condition.question_id] === condition.value; });
    };
    if (!shouldDisplay(group.display_conditions)) {
        return null;
    }
    return (react_1.default.createElement("div", { key: group.group_id, className: "form-group" },
        group.group_header && (react_1.default.createElement("div", { className: "group-header", style: { fontWeight: group.group_header_font_weight, fontStyle: group.group_header_font_style } }, group.group_header)),
        group.rows.map(function (row) { return (react_1.default.createElement("div", { key: row.row_id, className: "row ".concat(getRowClass(group.group_layout)) }, row.columns.map(function (column, index) {
            var question = questions.find(function (q) { return q.question_id === column.question_id; });
            var columnsCount = row.columns.length;
            return shouldDisplay(column.display_conditions) && (react_1.default.createElement("div", { key: column.question_id, className: "column" }, question && (react_1.default.createElement(QuestionRenderer_1.default, { question: question, question_length: column.width, handleChange: handleChange, value: formData[question.question_id] || '', inline: column.inline, setFormData: setFormData, formData: formData, businessRules: businessRules, columnsCount: columnsCount, dependencies: dependencies, error: errors[question.question_id] }))));
        }))); })));
};
exports.default = GroupRenderer;
