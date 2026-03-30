export interface JointApplicantProps {
  jointApplicantInfo?: any | undefined;
  fetchJointApplicantInfo?: any | undefined;
  isLoading?: boolean;
  alias?: string;
  customer?: {
    id?: number;
    title?: string;
    email?: string;
    phone?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    profile_image?: string | null;
    user_type?: string;
  };
  relationship?: string;
  other_relationship?: string;
  notes?: string;
}
export interface AddJointApplicantModalProps {
  isOpen: boolean;
  toggle: () => void;
  handleFileUpload?: any;
}
export interface UpdateJointApplicantModalProps {
  isOpen: boolean;
  toggle: () => void;
  user: any;
  onUpdateSuccess?: (updatedApplicant: any) => void;
}
export interface DeleteJointApplicantModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedApplicant?: any;
  onDelete?: () => void;
}
export interface JointApplicantViewModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedApplicant?: any;
}
