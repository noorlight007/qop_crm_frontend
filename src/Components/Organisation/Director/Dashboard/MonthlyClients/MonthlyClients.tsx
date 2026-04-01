import { OrganisationDirectorDashboardProps } from "@/Types/Organisation/Director/DashboardTypes";
import dynamic from "next/dynamic";
import React from "react";
import { Card, CardBody } from "reactstrap";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Months: Array<
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december"
> = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const MonthlyClients: React.FC<OrganisationDirectorDashboardProps> = ({
  isLoading,
  organisationDirectorDashboardData,
}) => {
  const values = Months.map(
    (m) => organisationDirectorDashboardData?.monthly_clients?.[m]?.client ?? 0,
  );

  const series = [
    {
      name: "Clients",
      data: values,
    },
  ];

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      animations: { enabled: true, easing: "easeinout", speed: 800 },
    },
    stroke: { curve: "smooth", width: 3 },
    colors: ["#6fba1c"],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: { style: { colors: "#666", fontSize: "12px" } },
    },
    yaxis: {
      min: 0,
      labels: { style: { colors: "#666", fontSize: "12px" } },
    },
    tooltip: { theme: "light" },
    markers: {
      size: 4,
      colors: ["#6fba1c"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    grid: { borderColor: "#f1f1f1", strokeDashArray: 5 },
  };

  const hasData = values.some((v) => v > 0);

  return (
    <Card className="shadow-sm mb-4">
      <CardBody className="p-4">
        <h4 className="mb-4 text-lg font-semibold">Monthly Clients</h4>
        {isLoading ? (
          <div className="skeleton-loading" style={{ height: 300 }} />
        ) : hasData ? (
          <Chart
            options={options as any}
            series={series as any}
            type="line"
            height={300}
          />
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: 300 }}
          >
            <p className="text-muted">No data available</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default MonthlyClients;
