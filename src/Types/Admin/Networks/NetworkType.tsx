
export interface Network {
  slug: string;
  logo: string | null;
  name: string;
  email: string;
  subdomain: string;
  primary_mobile: string;
  created_at: string;
  updated_at: string;
}

export interface NetworkFormData {
  network: {
    name: string;
    address: string;
    primary_mobile: string;
    email: string;
    license_no: string;
  };
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

export interface AddNetworkModalProps{
  isOpen: boolean;
  toggle: () => void;
}

export interface UpdateNetworkInfoModalProps {
  isOpen: boolean;
  toggle: () => void;
  slug?: string | undefined;
  networkData?: any;
}

export interface DeleteNetworkModalProps {
  isOpen: boolean;
  toggle: () => void;
  networkInfo?: any;
}


