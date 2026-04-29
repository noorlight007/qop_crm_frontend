export interface SupportTicketFormData {
  alias: string;
  ticket_type: string;
  priority?: string;
  status?: string;
  subject: string;
  message?: string;
  files: File[];
  created_by?: {
    profile_image?: string;
    title: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    name?: string;
    email?: string;
  };
  created_at?: string;
}

export interface AddSupportTicketFormData {
  ticket_type: string;
  priority: string;
  subject: string;
  message: string;
  files: File[];
}

export interface AddSupportTicketModalProps {
  isOpen: boolean;
  toggle: () => void;
}

export interface UpdateSupportTicketModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: (ticket: Partial<SupportTicketFormData>) => void;
  selected: Partial<SupportTicketFormData>;
}

export interface DeleteSupportTicketModalProps {
  isOpen: boolean;
  toggle: () => void;
  ticketAlias?: string;
}
