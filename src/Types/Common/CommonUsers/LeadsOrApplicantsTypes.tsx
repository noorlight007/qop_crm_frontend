export interface LeadOrApplicant {
  alias: string;
  name: string;
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  source: string;
  other_source: string | null;
  enquiry_type: string;
  other_enquiry_type: string | null;
  created_at: string;
  created_by: {
    name: string;
    email?: string;
  };
  profile_image: string | null;
  role?: string;
  is_lead: boolean;
  note?: string | null;
}

export interface LeadsOrApplicantsProps {
  title: string;
  leadsOrApplicantsPerPage?: number;
  userRole?: string;
}

export interface ViewLeadOrApplicantModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedLeadOrApplicant: Partial<LeadOrApplicant>;
  title: string;
}

export interface AddLeadsModalProps {
  isOpen: boolean;
  toggle: () => void;
  onLeadCreated?: (lead: Partial<LeadOrApplicant> | any) => void;
  onOpenCase?: (payload: {
    leadId?: number;
    leadName?: string | undefined;
    leadData?: any;
  }) => void;
  header: string;
}

export interface UpdateLeadOrApplicantModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedLeadOrApplicant: Partial<LeadOrApplicant>;
  title: string;
}
export interface DeleteLeadOrApplicantModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedLeadOrApplicant: Partial<LeadOrApplicant>;
  title: string;
}

export interface ApplicantInvitationProps {
  alias: string;
  user: {
    id?: number;
    title: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email?: string;
  };
}

export interface ApplicantInvitationModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseAlias?: string;
}
