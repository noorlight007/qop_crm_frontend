export interface PolicyTabProps {
  insuranceOverviewAlias: string | undefined;
}
export interface AddNewInsurancePolicyModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseAlias: string | string[];
  insuranceOverviewAlias: string | undefined;
}
export interface DeleteInsurancePolicyModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseAlias: string | string[];
  insuranceOverviewAlias: string | undefined;
  policyAlias: string | undefined;
  policyType?: string;
}
