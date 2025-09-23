export interface LeadsInfo {
  alias: string;
  user: {
    id?: number;
    title: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    profile_image?: string;
    user_type: string;
  };
  role: string;
  official_email: string;
  official_phone: string;
  dob: string;
  gender: string;
  created_by?: {
    title: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    user_type: string;
  };
  created_at: string;
}
export interface LeadsProps {
  leadsPerPage?: number;
}

export interface AddLeadModalProps {
  isOpen: boolean;
  toggle: () => void;
}
export interface ViewLeadModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedLead: Partial<LeadsInfo>;
}
export interface UpdateLeadModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: (leadData: Partial<LeadsInfo>) => void;
  selectedLead: Partial<LeadsInfo>;
}
export interface DeleteLeadModalProps {
  isOpen: boolean;
  toggle: () => void;
  leadName: string;
  leadAlias?: string;
}
