export interface ClientInfoProps {
  alias: string;
  user: {
    id?: number;
    title: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email?: string;
    phone?: string;
    profile_image?: string;
    user_type: string;
  };
  role: string;
  gender: string;
  reason_for_enquiry: string;
  created_by: {
    title?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    user_type?: string;
  };
  created_at: string;
}
export interface ClientsProps {
  clientsPerPage?: number;
}
export interface AddClientModalProps {
  isOpen: boolean;
  toggle: () => void;
}

export interface ViewClientModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedClient: Partial<ClientInfoProps>;
}
export interface UpdateClientModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: (clientData: Partial<ClientInfoProps>) => void;
  selectedClient: Partial<ClientInfoProps>;
}
export interface DeleteClientModalProps {
  isOpen: boolean;
  toggle: () => void;
  clientName: string;
  clientAlias: string;
}
