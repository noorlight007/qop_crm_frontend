import { OrganisationDirectorDashboardProps } from "@/Types/Organisation/Director/DashboardTypes";
import getCurrencySign from "@/utils/currency";
import dynamic from "next/dynamic";
import React from "react";
import { Card } from "reactstrap";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Months = [
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
] as const;

const MonthlyRevenueTrend: React.FC<OrganisationDirectorDashboardProps> = ({
  isLoading,
  organisationDirectorDashboardData,
}) => {
  const values = Months.map(
    (m) =>
      organisationDirectorDashboardData?.monthly_revenue_trend?.[m]?.[
        "monthly-revenue"
      ] ?? 0
  );

  const hasData = values.some((v) => v > 0);

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      animations: { enabled: true, easing: "easeinout", speed: 800 },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
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
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#666", fontSize: "12px" } },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${getCurrencySign()}${value.toLocaleString()}`,
        style: { colors: "#666", fontSize: "12px" },
      },
    },
    grid: { borderColor: "#f1f1f1", strokeDashArray: 4 },
    tooltip: {
      y: { formatter: (value: number) => `${getCurrencySign()}${value.toLocaleString()}` },
    },
    colors: ["#7c3aed"],
  };

  const series = [
    {
      name: "Revenue",
      data: values,
    },
  ];

  return (
    <Card className="border-0 p-3 shadow-sm bg-white">
      <h4 className="text-xl font-semibold mb-4">Monthly Revenue Trend</h4>
      {isLoading ? (
        <div className="skeleton-loading" style={{ height: 300 }} />
      ) : hasData ? (
        <Chart
          options={options as any}
          series={series as any}
          type="area"
          height={300}
        />
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: 315 }}
        >
          <p className="text-muted">No data available yet</p>
        </div>
      )}
    </Card>
  );
};

export default MonthlyRevenueTrend;
