import { JointApplicantProps } from "./CaseDetails/JointApplicant/JointApplicantTypes";

export interface CaseInfoPrpos {
  alias: string;
  customer_id?: number;
  lead: number;
  name: string;
  customer: {
    alias: string;
    title: string;
    email: string;
    phone: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    profile_image: string;
    user_type: string;
  };
  joint_users?: CaseUser[];
  case_category: string;
  applicant_type: string;
  case_status: string;
  case_stage: string;
  notes: string;
  is_removed: boolean;
  created_at: string;
  created_by: {
    name: string;
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
    name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    profile_image: null;
    user_type: string;
  };
  assigned_admin: {
    id: number;
    title: string;
    email: string;
    phone: string;
    name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    profile_image: null;
    user_type: string;
  };
  assigned_to?: string;
  assigned_to_admin?: string;
  updated_by: {
    title: string;
    email: string;
    phone: string;
    name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    profile_image: null;
    user_type: string;
  };
  caseData?: any;
  organization: {
    id: number;
    name: string;
  };
  network: {
    id: number;
    name: string;
  };
  application_type?: string;
  mortgage_type?: string;
  property_valuation?: number;
  purchase_price?: number;
  completion_date?: string;
  review_date?: string;
  lender?: string;
  loan_amount?: number;
  policy_type?: string;
  provider?: string;
  property_details: {
    house_name_or_number?: string;
    address_one?: string;
    address_two?: string;
    city?: string;
    county?: string;
    region?: string;
    postcode?: string;
    country?: string;
  };
}

export interface CaseUser {
  id: number;
  alias?: string;
  email?: string;
  phone?: string | null;
  name?: string;
  title?: string | null;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  profile_image?: string | null;
  user_type?: string;
}
export interface SingleCaseProps {
  caseInfo: CaseInfoPrpos | undefined;
  isLoading: boolean;
  jointApplicantInfo?: JointApplicantProps[] | undefined;
  isJointApplicantLoading?: boolean;
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
  /** Optional display name for the preselected lead */
  leadName?: string;
  /** Optional full lead data to prefill the select (user object or lead object) */
  leadData?: any;
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

export interface LeadOptionType {
  value: number;
  label: string;
  name: string;
  email?: string;
  phone?: string | null;
  role?: string;
  user_type?: string;
  profile_image?: string | null;
}

export interface ApplicantEditAccessModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseInfo: any;
  updateCaseDetails: (args: {
    caseAlias: string;
    payload: any;
  }) => Promise<any>;
  isUpdating: boolean;
}
