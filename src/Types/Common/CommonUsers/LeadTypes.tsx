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
  source: string;
  other_source: string;
  enquiry_type: string;
  other_enquiry_type: string;
  note: string;
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
  onLeadCreated?: (lead: Partial<LeadsInfo> | any) => void;
  /**
   * Optional callback to open the AddNewCaseModal from the parent.
   * Called when user clicks "Save & Create Case" and a lead was created.
   */
  onOpenCase?: (payload: {
    leadId?: number;
    leadName?: string | undefined;
    leadData?: any;
  }) => void;
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
