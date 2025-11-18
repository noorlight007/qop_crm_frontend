export interface UserProfileDataProps {
  email: string;
  phone: string | null;
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  profile_image: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  post_code: string | null;
  updated_at: string;
}

export interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UserProfileDataProps;
}
