export interface CreditCommitmentProps {
  alias?: string;
  applicant?: {
    first_name: string;
    last_name: string;
  };
}

export interface AddCreditCommitmentModalProps {
  isOpen: boolean;
  toggle: () => void;
}

export interface UpdateCreditCommitmentModalProps {
  isOpen: boolean;
  toggle: () => void;
  casealias: string;
  creditData: any;
}

export interface DeleteCreditCommitmentModalProps {
  isOpen: boolean;
  toggle: () => void;
  onDelete: () => void;
  casealias: string;
  creditCommitmentAlias: string;
  creditCommitmentName: string;
}
