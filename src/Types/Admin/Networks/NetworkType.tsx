
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

export interface UpdateNetworkModalProps{
  isOpen: boolean;
  toggle: () => void;
  network: Network | null;
  // onSave should accept the network slug and the form payload and return a Promise
  onSave: (network_slug: string, payload: NetworkFormData) => Promise<any>;
} 

export interface DeleteNetworkModalProps{
  isOpen: boolean;
  toggle: () => void;
  network_slug: string | null;
}

