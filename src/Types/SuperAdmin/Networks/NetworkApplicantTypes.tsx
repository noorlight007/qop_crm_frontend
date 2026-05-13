export interface AddNetworkNewCaseModalProps {
  isOpen: boolean;
  toggle: () => void;
  applicantId?: number;
  applicantName?: string;
  applicantData?: any;
  onCaseCreated?: (caseAlias: string) => void;
  role: string;
}

export interface NetworkApplicantInfo {
  alias: string;
  profile_image: string;
  name: string;
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  enquiry_type: string;
  other_enquiry_type: string;
  source: string;
  other_source: string;
  note: string;
  created_by: {
    name?: string;
    title?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    email?: string;
  };
  created_at: string;
}

export interface AddNetworkApplicantModalProps {
  isOpen: boolean;
  toggle: () => void;
  onApplicantCreated?: (applicant: Partial<NetworkApplicantInfo> | any) => void;
  onOpenCase?: (payload: {
    applicantId?: number;
    applicantName?: string | undefined;
    applicantData?: any;
  }) => void;
  role: string;
}

export interface ViewNetworkApplicantModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedApplicant?: Partial<NetworkApplicantInfo>;
  role: string;
}

export interface UpdateNetworkApplicantModalProps {
  isOpen: boolean;
  toggle: () => void;
  applicantToUpdate: NetworkApplicantInfo | null;
  role: string;
}

export interface DeleteNetworkApplicantModalProps {
  isOpen: boolean;
  toggle: () => void;
  applicantToDelete: NetworkApplicantInfo | null;
  role: string;
}
