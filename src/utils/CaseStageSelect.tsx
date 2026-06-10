// components/Common/CaseStageSelect.tsx
import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

const MORTGAGE_STAGES = [
  { value: 'ENQUIRY', label: 'Enquiry' },
  { value: 'FACT_FIND', label: 'Fact Find' },
  {
    value: 'RESEARCH_COMPLIANCE_CHECK',
    label: 'Research and Compliance Check',
  },
  { value: 'DECISION_IN_PRINCIPLE', label: 'Decision in Principle' },
  { value: 'FULL_MORTGAGE_APPLICATION', label: 'Full Mortgage Application' },
  { value: 'SUBMISSION', label: 'Submission' },
  { value: 'OFFER_FROM_BANK', label: 'Offer From Bank' },
  { value: 'LEGAL', label: 'Legal' },
  { value: 'COMPLETION', label: 'Completion' },
  { value: 'REFERRED', label: 'Referred (Packager/External)' },
  { value: 'FUTURE_OPPORTUNITY', label: 'Future Opportunity' },
  { value: 'NOT_PROCEED', label: 'Not Proceed' },
];

const INSURANCE_STAGES = [
  { value: 'ENQUIRY', label: 'Enquiry' },
  { value: 'FACT_FIND', label: 'Fact Find' },
  { value: 'SUBMISSION', label: 'Submission' },
  { value: 'ACCEPT_WAITING_START_DATE', label: 'Accept Awaiting Start Date' },
  { value: 'ACCEPTED_ON_RISK', label: 'Accepted on Risk' },
  { value: 'FURTHER_MEDICAL_REQUIRED', label: 'Further Medical Required' },
  { value: 'REFERRED', label: 'Referred (Packager/External)' },
  { value: 'FUTURE_OPPORTUNITY', label: 'Future Opportunity' },
  { value: 'NOT_PROCEED', label: 'Not Proceed' },
];

interface CaseStageSelectProps {
  value: string;
  caseCategory: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CaseStageSelect: React.FC<CaseStageSelectProps> = ({
  value,
  caseCategory,
  onChange,
}) => {
  const stages =
    caseCategory === 'MORTGAGE' ? MORTGAGE_STAGES : INSURANCE_STAGES;

  return (
    <FormGroup>
      <Label for='case_stage'>Case Stage</Label>
      <Input
        type='select'
        name='case_stage'
        id='case_stage'
        value={value}
        onChange={onChange}
      >
        <option value=''>Select...</option>
        {stages.map((stage) => (
          <option key={stage.value} value={stage.value}>
            {stage.label}
          </option>
        ))}
      </Input>
    </FormGroup>
  );
};

export default CaseStageSelect;
