export interface SingleOrganisationProps {
  slug?: string;
  organization: {
    slug: string;
    network: string;
    subdomain: string;
    logo: string | null;
    name: string;
    primary_mobile: string;
    email: string;
    other_contact: string;
    contact_person: string;
    contact_person_designation: string;
    website: string;
    license_no: string;
    license_image: string | null;
  };
  user: {
    alias: string;
    name: string;
    email: string;
    phone: string;
    title: string | null;
    first_name: string;
    middle_name: string;
    last_name: string;
    profile_image: string | null;
    roles?: string[];
    is_active: boolean;
  };
  name?: string;
  email?: string;
  logo?: string | null;
  profile_image?: string | null;
  hero_image?: string | null;
  primary_mobile?: string;
  other_contact?: string | null;
  contact_person?: string | null;
  contact_person_designation?: string | null;
  website?: string | null;
  license_no?: string | null;
  license_image?: string | null;
  is_removed?: boolean;
  is_approved?: boolean;
  is_active?: boolean;
  is_staff?: boolean;
}

export interface SingleOrganisationDashboardProps {
  organisationSlug?: string | undefined;
  organization: {
    slug?: string;
    name?: string;
    network?: string;
    email?: string;
    logo?: string | null;
    profile_image?: string | null;
    hero_image?: string | null;
    primary_mobile?: string;
    website?: string;
    other_contact?: string;
    contact_person?: string;
    description?: string;
  };
  counters: {
    total_cases?: number;
    total_leads?: number;
    total_clients?: number;
    total_advisers?: number;
    total_introducers?: number;
  };
  mortgage_type_counts: {
    PURCHASE?: number;
    REMORTGAGE?: number;
    SECURED_LOAN?: number;
    FURTHER_ADVANCE?: number;
    PRODUCT_TRANSFER?: number;
    UNSECURED?: number;
    INVOICE_DISCOUNTING?: number;
    ASSET_FINANCE?: number;
    OTHER?: number;
  };
  lender_counts: {
    ATOM_BANK?: number;
    ACCORD_MORTGAGES?: number;
    AHLI_UNITED_BANK?: number;
    AL_RAYAN_BANK?: number;
    ALDERMORE_MORTGAGES?: number;
    AMICUS_PLC?: number;
    ASSETZ_CAPITAL?: number;
    AVIVA_EQUITY_RELEASE?: number;
    AXIS_BANK?: number;
    BANK_AND_CLIENTS_PLC?: number;
    BANK_OF_CHINA?: number;
    BANK_OF_CYPRUS_UK?: number;
    BANK_OF_IRELAND?: number;
    BARCLAYS?: number;
    BARCLAYS_COMMERCIAL?: number;
    BATH_BUILDING_SOCIETY?: number;
    BEVERLEY_BUILDING_SOCIETY?: number;
    BLUESTONE_MORTGAGES?: number;
    BLUEZEST?: number;
    BM_SOLUTIONS?: number;
    BOOST_CAPITAL?: number;
    BRIDGEWATER_EQUITY_RELEASE?: number;
    BUCKINGHAMSHIRE_BUILDING_SOCIETY?: number;
    CAMBRIDGE_AND_COUNTIES_BANK?: number;
    CAMBRIDGE_BUILDING_SOCIETY?: number;
    CENTRAL_TRUST?: number;
    CHARTERBANK?: number;
    CHL_MORTGAGES?: number;
    CHORLEY_DISTRICT_BUILDING_SOCIETY?: number;
    CLEARLY_LOANS?: number;
    COUTTS?: number;
    COVENTRY_BUILDING_SOCIETY?: number;
    CROWN_EQUITY_RELEASE?: number;
    CUMBERLAND_BUILDING_SOCIETY?: number;
    DANSKE_BANK?: number;
    DARLINGTON_BUILDING_SOCIETY?: number;
    DIGITAL_MORTGAGES?: number;
    DUDLEY_BUILDING_SOCIETY?: number;
    EARL_SHILTON_BUILDING_SOCIETY?: number;
    ECOLOGY_BUILDING_SOCIETY?: number;
    EQUIFINANCE?: number;
    FAMILY_BUILDING_SOCIETY?: number;
    FINSEC?: number;
    FIRST_TRUST_BANK?: number;
    FLEET_MORTGAGES?: number;
    FOUNDATION_HOME_LOANS?: number;
    FURNESS_BUILDING_SOCIETY?: number;
    GATEHOUSE_BANK?: number;
    GENERATION_HOME?: number;
    GODIVA_MORTGAGES?: number;
    HALIFAX?: number;
    HAMPSHIRE_TRUST_BANK?: number;
    HANDELSBANKEN?: number;
    HANLEY_ECONOMIC_BUILDING_SOCIETY?: number;
    HARPDEN_BUILDING_SOCIETY?: number;
    HINCKLEY_AND_RUGBY_BUILDING_SOCIETY?: number;
    HODGE_BANK?: number;
    HODGE_LIFETIME?: number;
    HOLMESDALE_BUILDING_SOCIETY?: number;
    HSBC?: number;
    ICICI_BANK?: number;
    INTERBAY_COMMERCIAL?: number;
    INVESTEC?: number;
    IPSWICH_BUILDING_SOCIETY?: number;
    JUST_RETIREMENT_SOLUTIONS?: number;
    KENSINGTON_MORTGAGES?: number;
    KENT_RELIANCE?: number;
    KEYSTONE_PROPERTY_FINANCE?: number;
    LANDBAY?: number;
    LEEDS_BUILDING_SOCIETY?: number;
    LEEK_UNITED_BUILDING_SOCIETY?: number;
    LEGAL_AND_GENERAL_HOME_FINANCE?: number;
    LENDINVEST?: number;
    LLOYDS_COMMERCIAL?: number;
    LV?: number;
    MAGELLAN_HOMELOANS?: number;
    MANSFIELD_BUILDING_SOCIETY?: number;
    MARKET_HARBOROUGH_BUILDING_SOCIETY?: number;
    MARSDEN_BUILDING_SOCIETY?: number;
    MASTHAVEN_BANK?: number;
    MBS_LENDING_LTD?: number;
    METRO_BANK?: number;
    MOLO_FINANCE?: number;
    MONMOUTHSHIRE_BUILDING_SOCIETY?: number;
    MORE_2_LIFE_LIMITED?: number;
    N_AND_P_COMMERCIAL?: number;
    NATIONWIDE?: number;
    NATWEST?: number;
    NATWEST_INTERMEDIARY_SOLUTIONS?: number;
    NATWEST_INTERNATIONAL?: number;
    NEW_STREET_MORTGAGES?: number;
    NEWBURY_BUILDING_SOCIETY?: number;
    NEWCASTLE_BUILDING_SOCIETY?: number;
    NORTON_FINANCE?: number;
    NOTTINGHAM_BUILDING_SOCIETY?: number;
    NUCLEUS_COMMERCIAL?: number;
    OFFA?: number;
    OMNI_CAPITAL?: number;
    ONEFAMILY_LIFETIME_MORTGAGES?: number;
    OPLO?: number;
    OPTIMUM_CREDIT?: number;
    OTHER?: number;
    PARAGON_MORTGAGES?: number;
    PEPPER_MONEY?: number;
    PLATFORM?: number;
    POST_OFFICE_MORTGAGES?: number;
    PRECISE_MORTGAGES?: number;
    PRESTIGE_FINANCE?: number;
    PRINCIPALITY_BUILDING_SOCIETY?: number;
    PROGRESSIVE_BUILDING_SOCIETY?: number;
    PURE_RETIREMENT?: number;
    SAFFRON_BUILDING_SOCIETY?: number;
    SAINSBURYS_BANK?: number;
    SANTANDER?: number;
    SCOTTISH_BUILDING_SOCIETY?: number;
    SCOTTISH_WIDOWS?: number;
    SECURE_TRUST_BANK?: number;
    SHAWBROOK_BANK?: number;
    SKIPTON_BUILDING_SOCIETY?: number;
    SKIPTON_INTERNATIONAL?: number;
    SPRING_FINANCE?: number;
    STAFFORD_RAILWAY_BUILDING_SOCIETY?: number;
    STATE_BANK_OF_INDIA_UK?: number;
    STEP_ONE_FINANCE?: number;
    STRIDE_UP?: number;
    SUFFOLK_BUILDING_SOCIETY?: number;
    SWANSEA_BUILDING_SOCIETY?: number;
    TANDEM_HOME_LOANS?: number;
    TEACHERS_BUILDING_SOCIETY?: number;
    TESCO_BANK?: number;
    THE_MELTON_BUILDING_SOCIETY?: number;
    THE_MORTGAGE_LENDER?: number;
    THE_MORTGAGE_WORKS?: number;
    TIPTON_AND_COSELEY_BUILDING_SOCIETY?: number;
    TOGETHER_MONEY?: number;
    TSB?: number;
    ULSTER_BANK?: number;
    UNKNOWN?: number;
    UNKNOWN_DEFAULT?: number;
    VERNON_BUILDING_SOCIETY?: number;
    VIDA_HOMELOANS?: number;
    WEST_BROMWICH_BUILDING_SOCIETY?: number;
    WEST_ONE_LOANS?: number;
  };
  stage_counts: {
    ENQUIRY?: number;
    FACT_FIND?: number;
    RESEARCH_COMPLIANCE_CHECK?: number;
    DECISION_IN_PRINCIPLE?: number;
    FULL_MORTGAGE_APPLICATION?: number;
    SUBMISSION?: number;
    OFFER_FROM_BANK?: number;
    LEGAL?: number;
    COMPLETION?: number;
    FUTURE_OPPORTUNITY?: number;
    ACCEPT_WAITING_START_DATE?: number;
    ACCEPTED_ON_RISK?: number;
    FURTHER_MEDICAL_REQUIRED?: number;
    NOT_PROCEED?: number;
  };
  category_counts: {
    MORTGAGE?: number;
    PROTECTION?: number;
    GENERAL_INSURANCE?: number;
  };
  status_counts: {
    NEW_LEAD?: number;
    CALL_BACK?: number;
    MEETING?: number;
  };
}
export interface FetchSingleOrganisationProps {
  singleOrgInfo?: SingleOrganisationProps | undefined;
  singleOrgDashboardData?: SingleOrganisationDashboardProps | undefined;
  isLoading?: boolean;
  isDashboardLoading?: boolean;
}

export interface UserDataProps {
  email?: string;
  phone?: string;
  title?: string | null;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
}
export interface OrganisationListProps {
  name: string;
  subdomain: string;
  email: string;
  primary_mobile: string;
  other_contact: string;
  contact_person: string;
  contact_person_designation: string;
  website: string;
  license_no: string;
  license_image?: File;
}

export interface AddOrganisationProps {
  [key: string]: string | File | null | boolean | UserDataProps | undefined;
  organization: OrganisationListProps;
  user: UserDataProps;
}

// Add OrganisationModal Props
export interface AddOrganisationModalProps {
  isOpen?: any;
  toggleModal?: any;
  refreshOrganisations?: any;
}
// delete organisation modal props
export interface DeleteOrganisationModalProps {
  isOpen: boolean;
  toggle: () => void;
  organisationInfo?: any;
}
// update organisation modal props
export interface UpdateOrganisationModalProps {
  isOpen: boolean;
  toggle: () => void;
  slug?: string | undefined;
  organisationData?: any;
}

export interface AddEmployeeModalProps {
  isOpen: boolean;
  toggle: () => void;
}

// User data returned/used in various places
