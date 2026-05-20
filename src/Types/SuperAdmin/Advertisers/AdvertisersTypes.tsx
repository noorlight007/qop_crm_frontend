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

export interface DeleteAdvertiserProps {
  advertiserData: Advertiser | null;
  isLoading: boolean;
}

export interface DeleteAdvertiserModalProps {
  isOpen: boolean;
  toggle: () => void;
  advertiserData: Advertiser | null;
}

export interface AdvertiserAdsData {
  alias: string;
  title: string;
  image: string;
  redirect_url: string;
  placement: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  impressions: number;
  clicks: number;
  priority: number;
}

export type AdvertiserAdsListResponse = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: AdvertiserAdsData[];
};

export type AddNewAdModalProps = {
  isOpen: boolean;
  toggleModal: () => void;
  advertiserAlias: string;
};

export interface AdvertiserAdsProps {
  advertiserAdsData: AdvertiserAdsData[] | AdvertiserAdsListResponse | null;
  advertiserAdsLoading: boolean;
  advertiserAlias: string;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}
