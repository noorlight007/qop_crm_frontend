export interface OrgApplicantInfo {
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

export interface AddOrgApplicantModalProps {
  isOpen: boolean;
  toggle: () => void;
  onApplicantCreated?: (applicant: Partial<OrgApplicantInfo> | any) => void;
  onOpenCase?: (payload: {
    applicantId?: number;
    applicantName?: string | undefined;
    applicantData?: any;
  }) => void;
  role: string;
}

export interface AddOrgNewCaseModalProps {
  isOpen: boolean;
  toggle: () => void;
  applicantId?: number;
  applicantName?: string;
  applicantData?: any;
  onCaseCreated?: (caseAlias: string) => void;
  role: string;
}

export interface ViewOrgApplicantModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedApplicant?: Partial<OrgApplicantInfo>;
  role: string;
}

export interface UpdateOrgApplicantModalProps {
  isOpen: boolean;
  toggle: () => void;
  applicantToUpdate: OrgApplicantInfo | null;
  role: string;
}

export interface DeleteOrgApplicantModalProps {
  isOpen: boolean;
  toggle: () => void;
  applicantToDelete: OrgApplicantInfo | null;
  role: string;
}
