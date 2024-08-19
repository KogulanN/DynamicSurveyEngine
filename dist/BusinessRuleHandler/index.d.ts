import React from 'react';
interface BusinessRuleHandlerProps {
    formData: any;
    businessRules: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}
declare const BusinessRuleHandler: React.FC<BusinessRuleHandlerProps>;
export default BusinessRuleHandler;
