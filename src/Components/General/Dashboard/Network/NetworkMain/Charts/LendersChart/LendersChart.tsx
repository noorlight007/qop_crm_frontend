import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import { CommonDashboardProps } from "@/Types/CommonComponents/CommonDashboard/CommonDashboardType";
import Chart from "react-google-charts";
import { Card, CardBody } from "reactstrap";

const LendersChart: React.FC<CommonDashboardProps> = ({
  isLoading,
  commonDashboardData,
}) => {
  const chartData: (string | number)[][] = [["Category", "Value"]];
  if (!isLoading && commonDashboardData?.lender_counts) {
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
        HSBC,
        ICICI_BANK,
        INTERBAY_COMMERCIAL,
        INVESTEC,
        IPSWICH_BUILDING_SOCIETY,
        JUST_RETIREMENT_SOLUTIONS,
        KENSINGTON_MORTGAGES,
        KENT_RELIANCE,
        KEYSTONE_PROPERTY_FINANCE,
        LEEDS_BUILDING_SOCIETY,
        LEEK_UNITED_BUILDING_SOCIETY,
        METRO_BANK,
        MONMOUTHSHIRE_BUILDING_SOCIETY,
        NATIONWIDE,
        NATWEST,
        NOTTINGHAM_BUILDING_SOCIETY,
        PARAGON_MORTGAGES,
        PEPPER_MONEY,
        POST_OFFICE_MORTGAGES,
        PRINCIPALITY_BUILDING_SOCIETY,
        SANTANDER,
        SKIPTON_BUILDING_SOCIETY,
        TSB,
        ULSTER_BANK,
        UNKNOWN,
        UNKNOWN_DEFAULT,
        VIDA_HOMELOANS,
        WEST_BROMWICH_BUILDING_SOCIETY,
        WEST_ONE_LOANS,
      },
    } = commonDashboardData;

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
    chartData.push(["Leeds Building Society", LEEDS_BUILDING_SOCIETY ?? 0]);
    chartData.push([
      "Leek United Building Society",
      LEEK_UNITED_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Metro Bank", METRO_BANK ?? 0]);
    chartData.push([
      "Monmouthshire Building Society",
      MONMOUTHSHIRE_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Nationwide", NATIONWIDE ?? 0]);
    chartData.push(["Natwest", NATWEST ?? 0]);
    chartData.push([
      "Nottingham Building Society",
      NOTTINGHAM_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Paragon Mortgages", PARAGON_MORTGAGES ?? 0]);
    chartData.push(["Pepper Money", PEPPER_MONEY ?? 0]);
    chartData.push(["Post Office Mortgages", POST_OFFICE_MORTGAGES ?? 0]);
    chartData.push([
      "Principality Building Society",
      PRINCIPALITY_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["Santander", SANTANDER ?? 0]);
    chartData.push(["Skipton Building Society", SKIPTON_BUILDING_SOCIETY ?? 0]);
    chartData.push(["Tsb", TSB ?? 0]);
    chartData.push(["Ulster Bank", ULSTER_BANK ?? 0]);
    chartData.push(["Unknown", UNKNOWN ?? 0]);
    chartData.push(["Unknown Default", UNKNOWN_DEFAULT ?? 0]);
    chartData.push(["Vida Homeloans", VIDA_HOMELOANS ?? 0]);
    chartData.push([
      "West Bromwich Building Society",
      WEST_BROMWICH_BUILDING_SOCIETY ?? 0,
    ]);
    chartData.push(["West One Loans", WEST_ONE_LOANS ?? 0]);
  }

  const chartOptions = {
    title: "",
    is3D: true,
    pieHole: 0,
    pieStartAngle: 0,
    opacity: 0.1,
    legend: {
      position: "right" as const,
      alignment: "center" as const,
      textStyle: {
        fontSize: 12,
      },
    },
    slices: {
      0: { offset: 0.05 },
    },
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
                height: "270px",
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
        ) : (
          <Chart
            chartType="PieChart"
            width="100%"
            height="280px"
            data={chartData}
            options={chartOptions}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default LendersChart;
