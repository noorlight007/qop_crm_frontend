import dynamic from "next/dynamic";
import React from "react";
import { Card } from "reactstrap";

// Dynamically import ApexCharts with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ClientGrowth: React.FC = () => {
  // Sample data - replace with actual data from your API
  const series = [
    {
      name: "Clients",
      data: [125, 132, 128, 145, 160, 172],
    },
  ];

  const options = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#00B8D9"],
    fill: {
      type: "",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10,
      },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      labels: {
        style: {
          colors: "#666",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 180,
      tickAmount: 4,
      labels: {
        style: {
          colors: "#666",
          fontSize: "12px",
        },
        formatter: (value: number) => Math.round(value),
      },
    },
    tooltip: {
      theme: "light",
      x: {
        show: true,
      },
      y: {
        title: {
          formatter: () => "Clients",
        },
      },
    },
    markers: {
      size: 5,
      colors: ["#00B8D9"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
  };

  return (
    <Card className="bg-white p-4 shadow-sm">
      <h4 className="mb-4 text-lg font-semibold">Client Growth</h4>
      <Chart
        options={options as any}
        series={series}
        type="line"
        height={300}
      />
    </Card>
  );
};

export default ClientGrowth;
