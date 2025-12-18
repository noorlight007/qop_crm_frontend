import { OrganisationDirectorDashboardProps } from "@/Types/Organisation/Director/DashboardTypes";
import dynamic from "next/dynamic";
import React from "react";
import { Card } from "reactstrap";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MonthKeys = [
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

const months = [
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
];

const CaseCompletionOverTime: React.FC<OrganisationDirectorDashboardProps> = ({
  isLoading,
  organisationDirectorDashboardData,
}) => {
  const options = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "40%",
      },
    },
    colors: ["#10B981", "#F59E0B"],
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: months,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#666",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#666",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => `${value} cases`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 0,
      offsetY: 0,
      markers: {
        width: 8,
        height: 8,
        radius: 12,
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8,
      },
    },
  };

  const completed = MonthKeys.map(
    (k) =>
      organisationDirectorDashboardData?.monthly_cases?.[k]?.completed_cases ??
      0
  );
  const pending = MonthKeys.map(
    (k) =>
      organisationDirectorDashboardData?.monthly_cases?.[k]?.pending_cases ?? 0
  );

  const hasData = [...completed, ...pending].some((v) => v > 0);

  const series = [
    {
      name: "Completed",
      data: completed,
    },
    {
      name: "Pending",
      data: pending,
    },
  ];

  return (
    <Card className="border-0 p-3 shadow-sm bg-white">
      <h4 className="text-xl font-semibold mb-4">Case Completion Over Time</h4>
      <div className="apex-chart w-100">
        {isLoading ? (
          <div className="skeleton-loading" style={{ height: 300 }} />
        ) : hasData ? (
          <Chart
            options={options as any}
            series={series as any}
            type="bar"
            height="300px"
          />
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: 315 }}
          >
            <p className="text-muted">No data available yet</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CaseCompletionOverTime;
