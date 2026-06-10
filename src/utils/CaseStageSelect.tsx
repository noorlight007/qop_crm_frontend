// components/Common/CaseStageSelect.tsx
import React, { useEffect, useRef, useState } from 'react';
import { FormGroup, Label } from 'reactstrap';

export const STAGE_COLORS: Record<string, string> = {
  // Initial
  ENQUIRY: '#888780', // gray
  FACT_FIND: '#8B5CF6', // purple

  // Mortgage progression
  RESEARCH_COMPLIANCE_CHECK: '#0EA5E9', // sky blue
  DECISION_IN_PRINCIPLE: '#378ADD', // blue
  FULL_MORTGAGE_APPLICATION: '#6366F1', // indigo
  SUBMISSION: '#10B981', // emerald
  OFFER_FROM_BANK: '#059669', // green
  LEGAL: '#F59E0B', // amber
  COMPLETION: '#16A34A', // dark green

  // Insurance progression
  ACCEPT_WAITING_START_DATE: '#06B6D4', // cyan
  ACCEPTED_ON_RISK: '#22C55E', // lime green
  FURTHER_MEDICAL_REQUIRED: '#F97316', // orange

  // Common endings
  REFERRED: '#A855F7', // violet
  FUTURE_OPPORTUNITY: '#EAB308', // yellow
  NOT_PROCEED: '#E24B4A', // red
};

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

const Dot = ({ color }: { color: string }) => (
  <span
    style={{
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: color,
      display: 'inline-block',
      flexShrink: 0,
    }}
  />
);

const CaseStageSelect: React.FC<CaseStageSelectProps> = ({
  value,
  caseCategory,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const stages =
    caseCategory === 'MORTGAGE' ? MORTGAGE_STAGES : INSURANCE_STAGES;

  const selectedStage = stages.find((s) => s.value === value);

  const handleSelect = (stageValue: string) => {
    const syntheticEvent = {
      target: { name: 'case_stage', value: stageValue },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <FormGroup>
      <Label for='case_stage'>Case Stage</Label>

      <div ref={containerRef} style={{ position: 'relative' }}>
        {/* Trigger */}
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#f8f9fa')
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 12px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: '#fff',
            minHeight: '38px',
            userSelect: 'none',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {selectedStage ? (
              <>
                <Dot color={STAGE_COLORS[selectedStage.value] ?? '#ccc'} />
                <span style={{ fontSize: '14px', color: '#212529' }}>
                  {selectedStage.label}
                </span>
              </>
            ) : (
              <span style={{ fontSize: '14px', color: '#6c757d' }}>
                Select...
              </span>
            )}
          </span>
          <span style={{ fontSize: '11px', color: '#6c757d' }}>
            {isOpen ? '▲' : '▼'}
          </span>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 2px)',
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              zIndex: 1050,
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              maxHeight: '280px',
              overflowY: 'auto',
            }}
          >
            {/* Clear option */}
            <div
              onClick={() => handleSelect('')}
              style={{
                padding: '9px 14px',
                fontSize: '14px',
                color: '#6c757d',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#f8f9fa')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              Select...
            </div>

            {stages.map((stage) => {
              const isSelected = stage.value === value;
              return (
                <div
                  key={stage.value}
                  onClick={() => handleSelect(stage.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 14px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#fff8f0' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isSelected
                      ? '#fff8f0'
                      : 'transparent';
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <Dot color={STAGE_COLORS[stage.value] ?? '#ccc'} />
                    <span style={{ fontSize: '14px', color: '#212529' }}>
                      {stage.label}
                    </span>
                  </span>
                  {isSelected && (
                    <span style={{ color: '#6c757d', fontSize: '13px' }}>
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </FormGroup>
  );
};

export default CaseStageSelect;
