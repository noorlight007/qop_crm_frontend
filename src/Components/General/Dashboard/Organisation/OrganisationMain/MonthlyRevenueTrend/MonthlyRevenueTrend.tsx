import dynamic from "next/dynamic";
import React from "react";
import { Card } from "reactstrap";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MonthlyRevenueTrend: React.FC = () => {
  const options = {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
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
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
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
        formatter: (value: number) => `£${value.toLocaleString()}`,
        style: {
          colors: "#666",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `£${value.toLocaleString()}`,
      },
    },
    colors: ["#7c3aed"],
  };

  const series = [
    {
      name: "Revenue",
      data: [5000, 48000, 45000, 30000, 55000, 65000],
    },
  ];

  return (
    <Card className="border-0 p-3 shadow-sm bg-white">
      <h4 className="text-xl font-semibold mb-4">Monthly Revenue Trend</h4>
      <Chart
        options={options as any}
        series={series}
        type="area"
        height="300px"
      />
    </Card>
  );
};

export default MonthlyRevenueTrend;
