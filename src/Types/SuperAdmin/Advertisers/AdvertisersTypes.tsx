export type Advertiser = {
  alias: string;
  company_name: string;
  contact_email?: string | null;
  website?: string | null;
};

export type AdvertiserListResponse = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: Advertiser[];
};

export type AddAdvertiserModalProps = {
  isOpen: boolean;
  toggleModal: () => void;
};

export type EditAdvertiserModalProps = {
  isOpen: boolean;
  toggleModal: () => void;
  advertiserData: Advertiser | null;
};

export type AddAdvertiserForm = {
  company_name: string;
  contact_email: string;
  website: string;
};

export interface AdvertisersInfoProps {
  advertiserData: Advertiser | null;
  isLoading: boolean;
}
