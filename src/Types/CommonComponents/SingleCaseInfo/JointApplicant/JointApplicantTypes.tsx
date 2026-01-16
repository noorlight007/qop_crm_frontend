export interface JointApplicantProps {
  jointApplicantInfo?: any | undefined;
  fetchJointApplicantInfo?: any | undefined;
  isLoading?: boolean;
  alias?: string;
  joint_user_details?: {
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
}
export interface JointApplicantDeleteModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedApplicant?: any;
}
export interface JointApplicantViewModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedApplicant?: any;
}
