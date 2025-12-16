import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import { NetworkDirectorDashboardProps } from "@/Types/Network/Director/DashboardTypes";
import Chart from "react-google-charts";
import { Card, CardBody } from "reactstrap";

const LendersChart: React.FC<NetworkDirectorDashboardProps> = ({
  isLoading,
  networkDirectorDashboardData,
}) => {
  const chartData: (string | number)[][] = [["Category", "Value"]];
  let allValuesZero = true;

  if (!isLoading && networkDirectorDashboardData?.lender_counts) {
    const {
      lender_counts: {
        ATOM_BANK,
        ACCORD_MORTGAGES,
        AHLI_UNITED_BANK,
        AL_RAYAN_BANK,
        ALDERMORE_MORTGAGES,
        AMICUS_PLC,
        ASSETZ_CAPITAL,
        AVIVA_EQUITY_RELEASE,
        AXIS_BANK,
        BANK_AND_CLIENTS_PLC,
        BANK_OF_CHINA,
        BANK_OF_CYPRUS_UK,
        BANK_OF_IRELAND,
        BARCLAYS,
        BARCLAYS_COMMERCIAL,
        BATH_BUILDING_SOCIETY,
        BEVERLEY_BUILDING_SOCIETY,
        BLUESTONE_MORTGAGES,
        BLUEZEST,
        BM_SOLUTIONS,
        BOOST_CAPITAL,
        BRIDGEWATER_EQUITY_RELEASE,
        BUCKINGHAMSHIRE_BUILDING_SOCIETY,
        CAMBRIDGE_AND_COUNTIES_BANK,
        CAMBRIDGE_BUILDING_SOCIETY,
        CENTRAL_TRUST,
        CHARTERBANK,
        CHL_MORTGAGES,
        CHORLEY_DISTRICT_BUILDING_SOCIETY,
        CLEARLY_LOANS,
        COUTTS,
        COVENTRY_BUILDING_SOCIETY,
        CROWN_EQUITY_RELEASE,
        CUMBERLAND_BUILDING_SOCIETY,
        DANSKE_BANK,
        DARLINGTON_BUILDING_SOCIETY,
        DIGITAL_MORTGAGES,
        DUDLEY_BUILDING_SOCIETY,
        EARL_SHILTON_BUILDING_SOCIETY,
        ECOLOGY_BUILDING_SOCIETY,
        EQUIFINANCE,
        FAMILY_BUILDING_SOCIETY,
        FINSEC,
        FIRST_TRUST_BANK,
        FLEET_MORTGAGES,
        FOUNDATION_HOME_LOANS,
        FURNESS_BUILDING_SOCIETY,
        GATEHOUSE_BANK,
        GENERATION_HOME,
        GODIVA_MORTGAGES,
        HALIFAX,
        HAMPSHIRE_TRUST_BANK,
        HANDELSBANKEN,
        HANLEY_ECONOMIC_BUILDING_SOCIETY,
        HARPDEN_BUILDING_SOCIETY,
        HINCKLEY_AND_RUGBY_BUILDING_SOCIETY,
        HODGE_BANK,
        HODGE_LIFETIME,
        HOLMESDALE_BUILDING_SOCIETY,
        HSBC,
        ICICI_BANK,
        INTERBAY_COMMERCIAL,
        INVESTEC,
        IPSWICH_BUILDING_SOCIETY,
        JUST_RETIREMENT_SOLUTIONS,
        KENSINGTON_MORTGAGES,
        KENT_RELIANCE,
        KEYSTONE_PROPERTY_FINANCE,
        LANDBAY,
        LEEDS_BUILDING_SOCIETY,
        LEEK_UNITED_BUILDING_SOCIETY,
        LEGAL_AND_GENERAL_HOME_FINANCE,
        LENDINVEST,
        LLOYDS_COMMERCIAL,
        LV,
        MAGELLAN_HOMELOANS,
        MANSFIELD_BUILDING_SOCIETY,
        MARKET_HARBOROUGH_BUILDING_SOCIETY,
        MARSDEN_BUILDING_SOCIETY,
        MASTHAVEN_BANK,
        MBS_LENDING_LTD,
        METRO_BANK,
        MOLO_FINANCE,
        MONMOUTHSHIRE_BUILDING_SOCIETY,
        MORE_2_LIFE_LIMITED,
        N_AND_P_COMMERCIAL,
        NATIONWIDE,
        NATWEST,
        NATWEST_INTERMEDIARY_SOLUTIONS,
        NATWEST_INTERNATIONAL,
        NEW_STREET_MORTGAGES,
        NEWBURY_BUILDING_SOCIETY,
        NEWCASTLE_BUILDING_SOCIETY,
        NORTON_FINANCE,
        NOTTINGHAM_BUILDING_SOCIETY,
        NUCLEUS_COMMERCIAL,
        OFFA,
        OMNI_CAPITAL,
        ONEFAMILY_LIFETIME_MORTGAGES,
        OPLO,
        OPTIMUM_CREDIT,
        OTHER,
        PARAGON_MORTGAGES,
        PEPPER_MONEY,
        PLATFORM,
        POST_OFFICE_MORTGAGES,
        PRECISE_MORTGAGES,
        PRESTIGE_FINANCE,
        PRINCIPALITY_BUILDING_SOCIETY,
        PROGRESSIVE_BUILDING_SOCIETY,
        PURE_RETIREMENT,
        SAFFRON_BUILDING_SOCIETY,
        SAINSBURYS_BANK,
        SANTANDER,
        SCOTTISH_BUILDING_SOCIETY,
        SCOTTISH_WIDOWS,
        SECURE_TRUST_BANK,
        SHAWBROOK_BANK,
        SKIPTON_BUILDING_SOCIETY,
        SKIPTON_INTERNATIONAL,
        SPRING_FINANCE,
        STAFFORD_RAILWAY_BUILDING_SOCIETY,
        STATE_BANK_OF_INDIA_UK,
        STEP_ONE_FINANCE,
        STRIDE_UP,
        SUFFOLK_BUILDING_SOCIETY,
        SWANSEA_BUILDING_SOCIETY,
        TANDEM_HOME_LOANS,
        TEACHERS_BUILDING_SOCIETY,
        TESCO_BANK,
        THE_MELTON_BUILDING_SOCIETY,
        THE_MORTGAGE_LENDER,
        THE_MORTGAGE_WORKS,
        TIPTON_AND_COSELEY_BUILDING_SOCIETY,
        TOGETHER_MONEY,
        TSB,
        ULSTER_BANK,
        UNKNOWN,
        UNKNOWN_DEFAULT,
        VERNON_BUILDING_SOCIETY,
        VIDA_HOMELOANS,
        WEST_BROMWICH_BUILDING_SOCIETY,
        WEST_ONE_LOANS,
      },
    } = networkDirectorDashboardData;

    const values = [
      ATOM_BANK ?? 0,
      ACCORD_MORTGAGES ?? 0,
      AHLI_UNITED_BANK ?? 0,
      AL_RAYAN_BANK ?? 0,
      ALDERMORE_MORTGAGES ?? 0,
      AMICUS_PLC ?? 0,
      ASSETZ_CAPITAL ?? 0,
      AVIVA_EQUITY_RELEASE ?? 0,
      AXIS_BANK ?? 0,
      BANK_AND_CLIENTS_PLC ?? 0,
      BANK_OF_CHINA ?? 0,
      BANK_OF_CYPRUS_UK ?? 0,
      BANK_OF_IRELAND ?? 0,
      BARCLAYS ?? 0,
      BARCLAYS_COMMERCIAL ?? 0,
      BATH_BUILDING_SOCIETY ?? 0,
      BEVERLEY_BUILDING_SOCIETY ?? 0,
      BLUESTONE_MORTGAGES ?? 0,
      BLUEZEST ?? 0,
      BM_SOLUTIONS ?? 0,
      BOOST_CAPITAL ?? 0,
      BRIDGEWATER_EQUITY_RELEASE ?? 0,
      BUCKINGHAMSHIRE_BUILDING_SOCIETY ?? 0,
      CAMBRIDGE_AND_COUNTIES_BANK ?? 0,
      CAMBRIDGE_BUILDING_SOCIETY ?? 0,
      CENTRAL_TRUST ?? 0,
      CHARTERBANK ?? 0,
      CHL_MORTGAGES ?? 0,
      CHORLEY_DISTRICT_BUILDING_SOCIETY ?? 0,
      CLEARLY_LOANS ?? 0,
      COUTTS ?? 0,
      COVENTRY_BUILDING_SOCIETY ?? 0,
      CROWN_EQUITY_RELEASE ?? 0,
      CUMBERLAND_BUILDING_SOCIETY ?? 0,
      DANSKE_BANK ?? 0,
      DARLINGTON_BUILDING_SOCIETY ?? 0,
      DIGITAL_MORTGAGES ?? 0,
      DUDLEY_BUILDING_SOCIETY ?? 0,
      EARL_SHILTON_BUILDING_SOCIETY ?? 0,
      ECOLOGY_BUILDING_SOCIETY ?? 0,
      EQUIFINANCE ?? 0,
      FAMILY_BUILDING_SOCIETY ?? 0,
      FINSEC ?? 0,
      FIRST_TRUST_BANK ?? 0,
      FLEET_MORTGAGES ?? 0,
      FOUNDATION_HOME_LOANS ?? 0,
      FURNESS_BUILDING_SOCIETY ?? 0,
      GATEHOUSE_BANK ?? 0,
      GENERATION_HOME ?? 0,
      GODIVA_MORTGAGES ?? 0,
      HALIFAX ?? 0,
      HAMPSHIRE_TRUST_BANK ?? 0,
      HANDELSBANKEN ?? 0,
      HANLEY_ECONOMIC_BUILDING_SOCIETY ?? 0,
      HARPDEN_BUILDING_SOCIETY ?? 0,
      HINCKLEY_AND_RUGBY_BUILDING_SOCIETY ?? 0,
      HODGE_BANK ?? 0,
      HODGE_LIFETIME ?? 0,
      HOLMESDALE_BUILDING_SOCIETY ?? 0,
      HSBC ?? 0,
      ICICI_BANK ?? 0,
      INTERBAY_COMMERCIAL ?? 0,
      INVESTEC ?? 0,
      IPSWICH_BUILDING_SOCIETY ?? 0,
      JUST_RETIREMENT_SOLUTIONS ?? 0,
      KENSINGTON_MORTGAGES ?? 0,
      KENT_RELIANCE ?? 0,
      KEYSTONE_PROPERTY_FINANCE ?? 0,
      LANDBAY ?? 0,
      LEEDS_BUILDING_SOCIETY ?? 0,
      LEEK_UNITED_BUILDING_SOCIETY ?? 0,
      LEGAL_AND_GENERAL_HOME_FINANCE ?? 0,
      LENDINVEST ?? 0,
      LLOYDS_COMMERCIAL ?? 0,
      LV ?? 0,
      MAGELLAN_HOMELOANS ?? 0,
      MANSFIELD_BUILDING_SOCIETY ?? 0,
      MARKET_HARBOROUGH_BUILDING_SOCIETY ?? 0,
      MARSDEN_BUILDING_SOCIETY ?? 0,
      MASTHAVEN_BANK ?? 0,
      MBS_LENDING_LTD ?? 0,
      METRO_BANK ?? 0,
      MOLO_FINANCE ?? 0,
      MONMOUTHSHIRE_BUILDING_SOCIETY ?? 0,
      MORE_2_LIFE_LIMITED ?? 0,
      N_AND_P_COMMERCIAL ?? 0,
      NATIONWIDE ?? 0,
      NATWEST ?? 0,
      NATWEST_INTERMEDIARY_SOLUTIONS ?? 0,
      NATWEST_INTERNATIONAL ?? 0,
      NEW_STREET_MORTGAGES ?? 0,
      NEWBURY_BUILDING_SOCIETY ?? 0,
      NEWCASTLE_BUILDING_SOCIETY ?? 0,
      NORTON_FINANCE ?? 0,
      NOTTINGHAM_BUILDING_SOCIETY ?? 0,
      NUCLEUS_COMMERCIAL ?? 0,
      OFFA ?? 0,
      OMNI_CAPITAL ?? 0,
      ONEFAMILY_LIFETIME_MORTGAGES ?? 0,
      OPLO ?? 0,
      OPTIMUM_CREDIT ?? 0,
      OTHER ?? 0,
      PARAGON_MORTGAGES ?? 0,
      PEPPER_MONEY ?? 0,
      PLATFORM ?? 0,
      POST_OFFICE_MORTGAGES ?? 0,
      PRECISE_MORTGAGES ?? 0,
      PRESTIGE_FINANCE ?? 0,
      PRINCIPALITY_BUILDING_SOCIETY ?? 0,
      PROGRESSIVE_BUILDING_SOCIETY ?? 0,
      PURE_RETIREMENT ?? 0,
      SAFFRON_BUILDING_SOCIETY ?? 0,
      SAINSBURYS_BANK ?? 0,
      SANTANDER ?? 0,
      SCOTTISH_BUILDING_SOCIETY ?? 0,
      SCOTTISH_WIDOWS ?? 0,
      SECURE_TRUST_BANK ?? 0,
      SHAWBROOK_BANK ?? 0,
      SKIPTON_BUILDING_SOCIETY ?? 0,
      SKIPTON_INTERNATIONAL ?? 0,
      SPRING_FINANCE ?? 0,
      STAFFORD_RAILWAY_BUILDING_SOCIETY ?? 0,
      STATE_BANK_OF_INDIA_UK ?? 0,
      STEP_ONE_FINANCE ?? 0,
      STRIDE_UP ?? 0,
      SUFFOLK_BUILDING_SOCIETY ?? 0,
      SWANSEA_BUILDING_SOCIETY ?? 0,
      TANDEM_HOME_LOANS ?? 0,
      TEACHERS_BUILDING_SOCIETY ?? 0,
      TESCO_BANK ?? 0,
      THE_MELTON_BUILDING_SOCIETY ?? 0,
      THE_MORTGAGE_LENDER ?? 0,
      THE_MORTGAGE_WORKS ?? 0,
      TIPTON_AND_COSELEY_BUILDING_SOCIETY ?? 0,
      TOGETHER_MONEY ?? 0,
      TSB ?? 0,
      ULSTER_BANK ?? 0,
      UNKNOWN ?? 0,
      UNKNOWN_DEFAULT ?? 0,
      VERNON_BUILDING_SOCIETY ?? 0,
      VIDA_HOMELOANS ?? 0,
      WEST_BROMWICH_BUILDING_SOCIETY ?? 0,
      WEST_ONE_LOANS ?? 0,
    ];

    allValuesZero = values.every((value) => value === 0);

    // Push all lenders with formatted names
    chartData.push(["Atom Bank", ATOM_BANK ?? 0]);
    chartData.push(["Accord Mortgages", ACCORD_MORTGAGES ?? 0]);
    chartData.push(["Ahli United Bank", AHLI_UNITED_BANK ?? 0]);
    chartData.push(["Al Rayan Bank", AL_RAYAN_BANK ?? 0]);
    chartData.push(["Aldermore Mortgages", ALDERMORE_MORTGAGES ?? 0]);
    chartData.push(["Amicus Plc", AMICUS_PLC ?? 0]);
    chartData.push(["Assetz Capital", ASSETZ_CAPITAL ?? 0]);
    chartData.push(["Aviva Equity Release", AVIVA_EQUITY_RELEASE ?? 0]);
    chartData.push(["Axis Bank", AXIS_BANK ?? 0]);
    chartData.push(["Bank and Clients Plc", BANK_AND_CLIENTS_PLC ?? 0]);
    chartData.push(["Bank of China", BANK_OF_CHINA ?? 0]);
    chartData.push(["Bank of Cyprus Uk", BANK_OF_CYPRUS_UK ?? 0]);
    chartData.push(["Bank of Ireland", BANK_OF_IRELAND ?? 0]);
    chartData.push(["Barclays", BARCLAYS ?? 0]);
    chartData.push(["Barclays Commercial", BARCLAYS_COMMERCIAL ?? 0]);
    chartData.push(["Bath Building Society", BATH_BUILDING_SOCIETY ?? 0]);
    chartData.push([
      "Beverley Building Society",
      BEVERLEY_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Bluestone Mortgages", BLUESTONE_MORTGAGES ?? 0]);
    chartData.push(["Bluezest", BLUEZEST ?? 0]);
    chartData.push(["Bm Solutions", BM_SOLUTIONS ?? 0]);
    chartData.push(["Boost Capital", BOOST_CAPITAL ?? 0]);
    chartData.push([
      "Bridgewater Equity Release",
      BRIDGEWATER_EQUITY_RELEASE ?? 0,
    ]);
    chartData.push([
      "Buckinghamshire Building Society",
      BUCKINGHAMSHIRE_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push([
      "Cambridge and Counties Bank",
      CAMBRIDGE_AND_COUNTIES_BANK ?? 0,
    ]);
    chartData.push([
      "Cambridge Building Society",
      CAMBRIDGE_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Central Trust", CENTRAL_TRUST ?? 0]);
    chartData.push(["Charterbank", CHARTERBANK ?? 0]);
    chartData.push(["Chl Mortgages", CHL_MORTGAGES ?? 0]);
    chartData.push([
      "Chorley District Building Society",
      CHORLEY_DISTRICT_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Clearly Loans", CLEARLY_LOANS ?? 0]);
    chartData.push(["Coutts", COUTTS ?? 0]);
    chartData.push([
      "Coventry Building Society",
      COVENTRY_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Crown Equity Release", CROWN_EQUITY_RELEASE ?? 0]);
    chartData.push([
      "Cumberland Building Society",
      CUMBERLAND_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Danske Bank", DANSKE_BANK ?? 0]);
    chartData.push([
      "Darlington Building Society",
      DARLINGTON_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Digital Mortgages", DIGITAL_MORTGAGES ?? 0]);
    chartData.push(["Dudley Building Society", DUDLEY_BUILDING_SOCIETY ?? 0]);
    chartData.push([
      "Earl Shilton Building Society",
      EARL_SHILTON_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Ecology Building Society", ECOLOGY_BUILDING_SOCIETY ?? 0]);
    chartData.push(["Equifinance", EQUIFINANCE ?? 0]);
    chartData.push(["Family Building Society", FAMILY_BUILDING_SOCIETY ?? 0]);
    chartData.push(["Finsec", FINSEC ?? 0]);
    chartData.push(["First Trust Bank", FIRST_TRUST_BANK ?? 0]);
    chartData.push(["Fleet Mortgages", FLEET_MORTGAGES ?? 0]);
    chartData.push(["Foundation Home Loans", FOUNDATION_HOME_LOANS ?? 0]);
    chartData.push(["Furness Building Society", FURNESS_BUILDING_SOCIETY ?? 0]);
    chartData.push(["Gatehouse Bank", GATEHOUSE_BANK ?? 0]);
    chartData.push(["Generation Home", GENERATION_HOME ?? 0]);
    chartData.push(["Godiva Mortgages", GODIVA_MORTGAGES ?? 0]);
    chartData.push(["Halifax", HALIFAX ?? 0]);
    chartData.push(["Hampshire Trust Bank", HAMPSHIRE_TRUST_BANK ?? 0]);
    chartData.push(["Handelsbanken", HANDELSBANKEN ?? 0]);
    chartData.push([
      "Hanley Economic Building Society",
      HANLEY_ECONOMIC_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Harpden Building Society", HARPDEN_BUILDING_SOCIETY ?? 0]);
    chartData.push([
      "Hinckley and Rugby Building Society",
      HINCKLEY_AND_RUGBY_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Hodge Bank", HODGE_BANK ?? 0]);
    chartData.push(["Hodge Lifetime", HODGE_LIFETIME ?? 0]);
    chartData.push([
      "Holmesdale Building Society",
      HOLMESDALE_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Hsbc", HSBC ?? 0]);
    chartData.push(["Icici Bank", ICICI_BANK ?? 0]);
    chartData.push(["Interbay Commercial", INTERBAY_COMMERCIAL ?? 0]);
    chartData.push(["Investec", INVESTEC ?? 0]);
    chartData.push(["Ipswich Building Society", IPSWICH_BUILDING_SOCIETY ?? 0]);
    chartData.push([
      "Just Retirement Solutions",
      JUST_RETIREMENT_SOLUTIONS ?? 0,
    ]);
    chartData.push(["Kensington Mortgages", KENSINGTON_MORTGAGES ?? 0]);
    chartData.push(["Kent Reliance", KENT_RELIANCE ?? 0]);
    chartData.push([
      "Keystone Property Finance",
      KEYSTONE_PROPERTY_FINANCE ?? 0,
    ]);
    chartData.push(["Landbay", LANDBAY ?? 0]);
    chartData.push(["Leeds Building Society", LEEDS_BUILDING_SOCIETY ?? 0]);
    chartData.push([
      "Leek United Building Society",
      LEEK_UNITED_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push([
      "Legal and General Home Finance",
      LEGAL_AND_GENERAL_HOME_FINANCE ?? 0,
    ]);
    chartData.push(["Lendinvest", LENDINVEST ?? 0]);
    chartData.push(["Lloyds Commercial", LLOYDS_COMMERCIAL ?? 0]);
    chartData.push(["LV", LV ?? 0]);
    chartData.push(["Magellan Homeloans", MAGELLAN_HOMELOANS ?? 0]);
    chartData.push([
      "Mansfield Building Society",
      MANSFIELD_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push([
      "Market Harborough Building Society",
      MARKET_HARBOROUGH_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Marsden Building Society", MARSDEN_BUILDING_SOCIETY ?? 0]);
    chartData.push(["Masthaven Bank", MASTHAVEN_BANK ?? 0]);
    chartData.push(["MBS Lending Ltd", MBS_LENDING_LTD ?? 0]);
    chartData.push(["Metro Bank", METRO_BANK ?? 0]);
    chartData.push(["Molo Finance", MOLO_FINANCE ?? 0]);
    chartData.push([
      "Monmouthshire Building Society",
      MONMOUTHSHIRE_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["More 2 Life Limited", MORE_2_LIFE_LIMITED ?? 0]);
    chartData.push(["N and P Commercial", N_AND_P_COMMERCIAL ?? 0]);
    chartData.push(["Nationwide", NATIONWIDE ?? 0]);
    chartData.push(["Natwest", NATWEST ?? 0]);
    chartData.push([
      "Natwest Intermediary Solutions",
      NATWEST_INTERMEDIARY_SOLUTIONS ?? 0,
    ]);
    chartData.push(["Natwest International", NATWEST_INTERNATIONAL ?? 0]);
    chartData.push(["New Street Mortgages", NEW_STREET_MORTGAGES ?? 0]);
    chartData.push(["Newbury Building Society", NEWBURY_BUILDING_SOCIETY ?? 0]);
    chartData.push([
      "Newcastle Building Society",
      NEWCASTLE_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Norton Finance", NORTON_FINANCE ?? 0]);
    chartData.push([
      "Nottingham Building Society",
      NOTTINGHAM_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Nucleus Commercial", NUCLEUS_COMMERCIAL ?? 0]);
    chartData.push(["Offa", OFFA ?? 0]);
    chartData.push(["Omni Capital", OMNI_CAPITAL ?? 0]);
    chartData.push([
      "OneFamily Lifetime Mortgages",
      ONEFAMILY_LIFETIME_MORTGAGES ?? 0,
    ]);
    chartData.push(["Oplo", OPLO ?? 0]);
    chartData.push(["Optimum Credit", OPTIMUM_CREDIT ?? 0]);
    chartData.push(["Other", OTHER ?? 0]);
    chartData.push(["Paragon Mortgages", PARAGON_MORTGAGES ?? 0]);
    chartData.push(["Pepper Money", PEPPER_MONEY ?? 0]);
    chartData.push(["Platform", PLATFORM ?? 0]);
    chartData.push(["Post Office Mortgages", POST_OFFICE_MORTGAGES ?? 0]);
    chartData.push(["Precise Mortgages", PRECISE_MORTGAGES ?? 0]);
    chartData.push(["Prestige Finance", PRESTIGE_FINANCE ?? 0]);
    chartData.push([
      "Principality Building Society",
      PRINCIPALITY_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push([
      "Progressive Building Society",
      PROGRESSIVE_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Pure Retirement", PURE_RETIREMENT ?? 0]);
    chartData.push(["Saffron Building Society", SAFFRON_BUILDING_SOCIETY ?? 0]);
    chartData.push(["Sainsburys Bank", SAINSBURYS_BANK ?? 0]);
    chartData.push(["Santander", SANTANDER ?? 0]);
    chartData.push([
      "Scottish Building Society",
      SCOTTISH_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Scottish Widows", SCOTTISH_WIDOWS ?? 0]);
    chartData.push(["Secure Trust Bank", SECURE_TRUST_BANK ?? 0]);
    chartData.push(["Shawbrook Bank", SHAWBROOK_BANK ?? 0]);
    chartData.push(["Skipton Building Society", SKIPTON_BUILDING_SOCIETY ?? 0]);
    chartData.push(["Skipton International", SKIPTON_INTERNATIONAL ?? 0]);
    chartData.push(["Spring Finance", SPRING_FINANCE ?? 0]);
    chartData.push([
      "Stafford Railway Building Society",
      STAFFORD_RAILWAY_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["State Bank of India UK", STATE_BANK_OF_INDIA_UK ?? 0]);
    chartData.push(["Step One Finance", STEP_ONE_FINANCE ?? 0]);
    chartData.push(["Stride Up", STRIDE_UP ?? 0]);
    chartData.push(["Suffolk Building Society", SUFFOLK_BUILDING_SOCIETY ?? 0]);
    chartData.push(["Swansea Building Society", SWANSEA_BUILDING_SOCIETY ?? 0]);
    chartData.push(["Tandem Home Loans", TANDEM_HOME_LOANS ?? 0]);
    chartData.push([
      "Teachers Building Society",
      TEACHERS_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Tesco Bank", TESCO_BANK ?? 0]);
    chartData.push([
      "The Melton Building Society",
      THE_MELTON_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["The Mortgage Lender", THE_MORTGAGE_LENDER ?? 0]);
    chartData.push(["The Mortgage Works", THE_MORTGAGE_WORKS ?? 0]);
    chartData.push([
      "Tipton and Coseley Building Society",
      TIPTON_AND_COSELEY_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Together Money", TOGETHER_MONEY ?? 0]);
    chartData.push(["Tsb", TSB ?? 0]);
    chartData.push(["Ulster Bank", ULSTER_BANK ?? 0]);
    chartData.push(["Unknown", UNKNOWN ?? 0]);
    chartData.push(["Unknown Default", UNKNOWN_DEFAULT ?? 0]);
    chartData.push(["Vernon Building Society", VERNON_BUILDING_SOCIETY ?? 0]);
    chartData.push(["Vida Homeloans", VIDA_HOMELOANS ?? 0]);
    chartData.push([
      "West Bromwich Building Society",
      WEST_BROMWICH_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["West One Loans", WEST_ONE_LOANS ?? 0]);
  }

  const chartOptions = {
    title: "",
    // keep 3D as requested
    is3D: true,
    pieHole: 0,
    pieStartAngle: 0,
    legend: {
      position: "right" as const,
      alignment: "center" as const,
      textStyle: {
        fontSize: 12,
      },
    },
    // we'll compute `slices` dynamically below (so we can offset the top few slices)
    slices: {},
    colors: [
      "#8FA4D7", // Light Blue
      "#F28FB1", // Light Pink
      "#FFB84D", // Light Orange
      "#7BC87F", // Light Green
      "#B85CBF", // Light Purple
      "#FFD54F", // Light Yellow
      "#90A4AE", // Light Blue Grey
      "#A1887F", // Light Brown
      "#FF8A65", // Light Deep Orange
      "#AED581", // Light Green
      "#9575CD", // Light Deep Purple
      "#4DD0E1", // Light Cyan
      "#FFF176", // Light Yellow
      "#BDBDBD", // Light Grey
      "#EF5350", // Light Red
      "#64B5F6", // Light Blue
      "#DCE775", // Light Lime
      "#FF8A80", // Light Red
      "#A5D6A7", // Light Green
      "#C5E1A5", // Lighter Green
    ],
    chartArea: { left: 30, top: 30, width: "90%", height: "90%" },
    backgroundColor: "transparent",
    tooltip: {
      textStyle: {
        fontSize: 10,
      },
    },
    fontSize: 11,
  };

  // Post-process chartData: filter out zero values, sort desc and group remaining small lenders
  const processedChartData = (() => {
    const header = chartData[0];
    const rows = chartData.slice(1) as [string, number][];
    // keep only positive values
    const positive = rows.filter(([, v]) => (v ?? 0) > 0);
    if (positive.length === 0) return chartData;

    // sort descending by value so largest slices appear first
    positive.sort((a, b) => b[1] - a[1]);

    const MAX_SLICES = 10; // show top 10 lenders and group the rest as Others
    let finalRows: [string, number][] = [];
    if (positive.length > MAX_SLICES) {
      const top = positive.slice(0, MAX_SLICES);
      const rest = positive.slice(MAX_SLICES);
      const restSum = rest.reduce((s, [, v]) => s + v, 0);
      top.push(["Others", restSum]);
      finalRows = top;
    } else {
      finalRows = positive;
    }

    return [header, ...finalRows];
  })();

  // Build slices offsets: only offset the first slice (index 0)
  const slicesObj: Record<number, { offset: number }> = {};
  if (processedChartData.length > 1) {
    slicesObj[0] = { offset: 0.05 };
  }
  const optionsWithSlices = { ...chartOptions, slices: slicesObj };

  return (
    <Card>
      <CommonCardHeader title="Lenders" />
      <CardBody className="google-chart">
        {isLoading ? (
          <div className="d-flex justify-content-between align-items-center gap-3 ms-5">
            <div
              className="skeleton-loading"
              style={{
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                backgroundColor: "#e0e0e0",
              }}
            />
            <div
              className="skeleton-loading"
              style={{
                width: "50%",
                height: "100px",
                backgroundColor: "#e0e0e0",
              }}
            />
          </div>
        ) : allValuesZero ? (
          <div
            style={{ height: "280px", width: "100%" }}
            className="d-flex justify-content-center align-items-center py-5 text-muted"
          >
            No data available yet
          </div>
        ) : (
          <Chart
            chartType="PieChart"
            width="100%"
            height="280px"
            data={processedChartData}
            options={optionsWithSlices}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default LendersChart;
