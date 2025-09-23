export interface CaseInfoPrpos {
  alias: string;
  lead: number;
  name: string;
  lead_user: {
    title: string;
    email: string;
    phone: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    profile_image: string;
    user_type: string;
  };
  case_category: string;
  applicant_type: string;
  case_status: string;
  case_stage: string;
  notes: string;
  is_removed: boolean;
  created_at: string;
  created_by: {
    title: string;
    email: string;
    phone: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    profile_image: null;
    user_type: string;
  };
  assigned_user: {
    id: number;
    title: string;
    email: string;
    phone: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    profile_image: null;
    user_type: string;
  };
  assigned_to?: string;
  updated_by: {
    title: string;
    email: string;
    phone: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    profile_image: null;
    user_type: string;
  };
  caseData?: any;
}
export interface SingleCaseProps {
  caseInfo: CaseInfoPrpos | undefined;
  isLoading: boolean;
}
export interface CaseSearchProps {
  fetchCaseInfo?: any;
  searchQuery?: any;
  setSearchQuery?: any;
}

export interface AddNewCaseModalProps {
  isOpen: boolean;
  toggle: () => void;
  leadId?: number;
  onCaseCreated?: (caseAlias: string) => void;
}

export interface UpdateCaseModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseData: CaseInfoPrpos;
}
export interface DeleteCaseModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseData: CaseInfoPrpos | null; // The case to delete
  onDelete: () => void; // Callback to handle deletion
  isDeleting?: any;
}
