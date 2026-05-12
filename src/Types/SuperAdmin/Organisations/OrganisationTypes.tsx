export interface Organisation {
  slug: string;
  logo: string | null;
  name: string;
  email: string;
  subdomain: string;
  primary_mobile: string;
  created_at: string;
}

export interface UpdateOrgInfoModalProps {
  isOpen: boolean;
  toggle: () => void;
  slug?: string | undefined;
  organisationData?: any;
}

export interface DeleteOrgModalProps {
  isOpen: boolean;
  toggle: () => void;
  organisationInfo?: any;
}