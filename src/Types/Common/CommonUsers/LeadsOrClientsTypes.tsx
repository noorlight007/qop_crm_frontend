export interface LeadOrClient {
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
    user_type?: string;
  };
  profile_image: string | null;
  role?: string;
  is_lead: boolean;
  note?: string | null;
}

export interface LeadsOrClientsProps {
  title: string;
  leadsOrClientsPerPage?: number;
  userRole?: string;
}

export interface ViewLeadOrClientModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedLeadOrClient: Partial<LeadOrClient>;
}

export interface AddLeadsModalProps {
  isOpen: boolean;
  toggle: () => void;
  onLeadCreated?: (lead: Partial<LeadOrClient> | any) => void;
  onOpenCase?: (payload: {
    leadId?: number;
    leadName?: string | undefined;
    leadData?: any;
  }) => void;
  header: string;
}

export interface UpdateLeadOrClientModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedLeadOrClient: Partial<LeadOrClient>;
}
export interface DeleteLeadOrClientModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedLeadOrClient: Partial<LeadOrClient>;
}

export interface ClientInvitationProps {
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
