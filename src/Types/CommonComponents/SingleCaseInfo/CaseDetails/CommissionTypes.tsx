export interface CommissionProps {
  caseAlias?: string | string[];
  commissionAlias?: string | null;
}
export interface LumpSumProps {
  id: string;
  policy: string;
  commissionAmount: string;
  dateReceived: string;
  clawbackAmount: string;
  clawbackDate: string;
  reconciledAmount: string;
}
export interface AddLumpSumAndTrailModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseAlias?: string | null | undefined;
  commissionAlias?: string | null | undefined;
  policies?: Policy[];
  onAdded?: () => void;
}
interface Policy {
  alias: string;
  policy_type?: string;
}

export interface DeleteLumpSumAndTrailModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseAlias: string | undefined | null;
  commissionAlias: string | undefined | null;
  lumpSumAlias?: string | null;
  trailCommissionAlias?: string | null;
  onDeleted?: () => void;
  policyType?: string | null;
}
