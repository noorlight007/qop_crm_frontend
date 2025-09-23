export interface Adviser {
  id?: number;
  rank?: number;
  full_name?: string;
  profile_image?: string;
  cases_completed?: number;
  total_loan_amount?: number; // e.g., 125000 or "125000"
}
export interface CommonDashboardDataProps {
  summary_cards: {
    new_mortgage_enquiry?: number;
    mortgage_cases_submitted?: number;
    mortgage_cases_completed?: number;
    insurance_cases_submitted?: number;
    mortgage_cases_offered?: number;
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
    HSBC?: number;
    ICICI_BANK?: number;
    INTERBAY_COMMERCIAL?: number;
    INVESTEC?: number;
    IPSWICH_BUILDING_SOCIETY?: number;
    JUST_RETIREMENT_SOLUTIONS?: number;
    KENSINGTON_MORTGAGES?: number;
    KENT_RELIANCE?: number;
    KEYSTONE_PROPERTY_FINANCE?: number;
    LEEDS_BUILDING_SOCIETY?: number;
    LEEK_UNITED_BUILDING_SOCIETY?: number;
    METRO_BANK?: number;
    MONMOUTHSHIRE_BUILDING_SOCIETY?: number;
    NATIONWIDE?: number;
    NATWEST?: number;
    NOTTINGHAM_BUILDING_SOCIETY?: number;
    PARAGON_MORTGAGES?: number;
    PEPPER_MONEY?: number;
    POST_OFFICE_MORTGAGES?: number;
    PRINCIPALITY_BUILDING_SOCIETY?: number;
    SANTANDER?: number;
    SKIPTON_BUILDING_SOCIETY?: number;
    TSB?: number;
    ULSTER_BANK?: number;
    UNKNOWN?: number;
    UNKNOWN_DEFAULT?: number;
    VIDA_HOMELOANS?: number;
    WEST_BROMWICH_BUILDING_SOCIETY?: number;
    WEST_ONE_LOANS?: number;
  };
  counters: {
    total_advisers?: number;
    total_clients?: number;
    total_leads?: number;
    total_introducers?: number;
    total_cases?: number;
  };
  top_performing_advisers?: Adviser[];
}

export interface CommonDashboardProps {
  isLoading: boolean;
  commonDashboardData: CommonDashboardDataProps | null;
}
