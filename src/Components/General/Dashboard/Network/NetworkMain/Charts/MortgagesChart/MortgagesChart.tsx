import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import { CommonDashboardProps } from "@/Types/CommonComponents/CommonDashboard/CommonDashboardType";
import { Chart } from "react-google-charts";
import { Card, CardBody } from "reactstrap";

const MortgagesChart: React.FC<CommonDashboardProps> = ({
  isLoading,
  commonDashboardData,
}) => {
  const chartData: (string | number)[][] = [["Category", "Value"]];
  let allValuesZero = true;

  if (!isLoading && commonDashboardData) {
    const {
      mortgage_type_counts: {
        PURCHASE,
        REMORTGAGE,
        SECURED_LOAN,
        FURTHER_ADVANCE,
        PRODUCT_TRANSFER,
        UNSECURED,
        INVOICE_DISCOUNTING,
        ASSET_FINANCE,
        OTHER,
      },
    } = commonDashboardData;
    const values = [
      PURCHASE ?? 0,
      REMORTGAGE ?? 0,
      SECURED_LOAN ?? 0,
      FURTHER_ADVANCE ?? 0,
      PRODUCT_TRANSFER ?? 0,
      UNSECURED ?? 0,
      INVOICE_DISCOUNTING ?? 0,
      ASSET_FINANCE ?? 0,
      OTHER ?? 0,
    ];

    allValuesZero = values.every((value) => value === 0);

    chartData.push(["Purchase", PURCHASE ?? 0]);
    chartData.push(["Remortgage", REMORTGAGE ?? 0]);
    chartData.push(["Secure Loan", SECURED_LOAN ?? 0]);
    chartData.push(["Further Advance", FURTHER_ADVANCE ?? 0]);
    chartData.push(["Product Transfer", PRODUCT_TRANSFER ?? 0]);
    chartData.push(["Unsecured", UNSECURED ?? 0]);
    chartData.push(["Invoice Discounting", INVOICE_DISCOUNTING ?? 0]);
    chartData.push(["Asset Finance", ASSET_FINANCE ?? 0]);
    chartData.push(["Other Mortgage", OTHER ?? 0]);
  }

  const chartOptions = {
    title: "",
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
    slices: { 0: { offset: 0.05 } },
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
      <CommonCardHeader title="Mortgages" />
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
        ) : allValuesZero ? (
          <div
            style={{ height: "340px", width: "100%" }}
            className="d-flex justify-content-center align-items-center py-5 text-muted"
          >
            No data available yet
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

export default MortgagesChart;
