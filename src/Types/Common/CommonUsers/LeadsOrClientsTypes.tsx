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
  };
  profile_image: string | null;
  role?: string;
}

export interface LeadsOrClientsProps {
  title: string;
  leadsOrClientsPerPage?: number;
  userRole?: string;
}

export interface ViewLeadsOrClientsModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedLeadsOrClients: Partial<LeadOrClient>;
}

export interface AddLeadsModalProps {
  isOpen: boolean;
  toggle: () => void;
}

export interface UpdateLeadsOrClientsModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedLeadsOrClients: Partial<LeadOrClient>;
}
