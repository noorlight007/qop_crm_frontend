export interface IntroducerInfoProps {
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
  gender: string;
  joining_date: string;
  created_by: {
    title?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    user_type?: string;
  };
  created_at?: string;
}
export interface IntroducersProps {
  introducersPerPage?: number;
}
export interface AddIntroducerModalProps {
  isOpen: boolean;
  toggle: () => void;
}
export interface ViewIntroducerModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedIntroducer: Partial<IntroducerInfoProps>;
}
export interface UpdateIntroducerModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: (introducerData: Partial<IntroducerInfoProps>) => void;
  selectedIntroducer: Partial<IntroducerInfoProps>;
}
export interface DeleteIntroducerModalProps {
  isOpen: boolean;
  toggle: () => void;
  introducerName: string;
  introducerAlias?: string;
}
