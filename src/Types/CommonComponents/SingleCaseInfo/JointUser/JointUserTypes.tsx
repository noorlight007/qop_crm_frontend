export interface JointUserProps {
  jointUserInfo?: any | undefined;
  fetchJointUserInfo?: any | undefined;
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
  notes?: string;
}
export interface AddJointUserModalProps {
  isOpen: boolean;
  toggle: () => void;
  handleFileUpload?: any;
}
export interface UpdateJointUserModalProps {
  isOpen: boolean;
  toggle: () => void;
  user: any;
}
export interface JointUserDeleteModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedUser?: any;
}
