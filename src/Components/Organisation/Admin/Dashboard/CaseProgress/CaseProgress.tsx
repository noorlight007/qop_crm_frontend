"use client";

import { AdminDashboardProps } from "@/Types/Organisation/Admin/AdminDashboardTypes";
import dynamic from "next/dynamic";
import { Card, CardBody } from "reactstrap";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const CaseProgress: React.FC<AdminDashboardProps> = ({
  isLoading,
  dashboardData,
}) => {
  const advisers = dashboardData?.adviser_case ?? [];

  // derive categories (names) and series values (normalized to 0-1)
  const categories = advisers.map((a) => a.adviser_name || "Unknown");
  // create shorter labels for display on the chart (keep full names for tooltips)
  const shortCategories = categories.map((name) => {
    if (!name) return "Unknown";
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].length > 12 ? words[0].slice(0, 12) + "..." : words[0];
    }
    const title = words[0].toLowerCase();
    if (["mr", "mrs", "ms", "dr"].includes(title)) {
      const last = words[words.length - 1];
      return last.length > 10
        ? words[0] + " " + last.slice(0, 10) + "..."
        : words[0] + " " + last;
    }
    // default: FirstName + LastInitial. -> "John D."
    return words[0] + " " + words[1].charAt(0) + ".";
  });
  const seriesValues = advisers.map((a) => {
    const raw = Number(a.completion_percentage ?? 0);
    if (isNaN(raw)) return 0;
    return raw > 1 ? raw / 100 : raw;
  });

  const options = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "40%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: shortCategories,
      labels: {
        formatter: function (val: number) {
          return Math.round(val * 100) + "%";
        },
      },
      min: 0,
      max: 1,
      tickAmount: 4,
    },
    yaxis: {
      labels: {
        style: {
          colors: ["#6E6E6E"],
        },
      },
    },
    colors: ["#7366FF"],
    grid: {
      borderColor: "#f0f0f0",
      strokeDashArray: 3,
    },
    tooltip: {
      x: {
        // show full adviser name in tooltip
        formatter: function (_val: any, opts: any) {
          const idx = opts?.dataPointIndex ?? 0;
          return categories[idx] || "";
        },
      },
      y: {
        formatter: function (val: number) {
          return Math.round(val * 100) + "%";
        },
      },
    },
  };

  const series = [
    {
      name: "Progress",
      data: seriesValues,
    },
  ];

  if (isLoading) {
    return (
      <Card className="border-0 p-2 shadow-sm bg-white">
        <CardBody className="mb-1">
          <div
            className="skeleton-loading mb-4"
            style={{ width: "30%", height: "20px" }}
          />
          <div
            className="skeleton-loading rounded-2"
            style={{ width: "100%", height: "280px" }}
          />
        </CardBody>
      </Card>
    );
  }

  if (!advisers || advisers.length === 0) {
    return (
      <Card className="bg-white p-3 shadow-sm" style={{ height: "390px" }}>
        <h4 className="text-xl font-semibold mb-4">Case Progress by Adviser</h4>
        <div className="text-muted d-flex justify-content-center align-items-center h-75">
          No adviser progress data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 p-3 shadow-sm bg-white">
      <h4 className="text-xl font-semibold mb-4">Case Progress by Adviser</h4>
      <ReactApexChart
        options={options as any}
        series={series}
        type="bar"
        height="340px"
      />
    </Card>
  );
};

export default CaseProgress;
