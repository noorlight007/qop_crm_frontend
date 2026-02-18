export interface LeadOrClient {
  alias: string;
  name: string;
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  gender: string;
  created_at: string;
  created_by: {
    name: string;
  };
  designation?: string;
  joining_date: string;
  is_active: boolean;
  profile_image: string | null;
  company_name?: string;
  company_address?: string;
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
