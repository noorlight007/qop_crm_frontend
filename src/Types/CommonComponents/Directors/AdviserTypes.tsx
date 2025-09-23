export interface AdviserInfoProps {
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
  permanent_address: string;
  present_address: string;
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
export interface AdvisersProps {
  advisersPerPage?: number;
}
export interface AddAdviserModalProps {
  isOpen: boolean;
  toggle: () => void;
}

export interface ViewAdviserModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedAdviser: Partial<AdviserInfoProps>;
}
export interface UpdateAdviserModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: (AdviserData: Partial<AdviserInfoProps>) => void;
  selectedAdviser: Partial<AdviserInfoProps>;
}
export interface DeleteAdviserModalProps {
  isOpen: boolean;
  toggle: () => void;
  adviserName: string;
  adviserAlias: string;
}
