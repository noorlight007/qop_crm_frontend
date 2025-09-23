"use client";

import dynamic from "next/dynamic";
import { Card } from "reactstrap";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const CaseProgress = () => {
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
      categories: ["Sarah J.", "Michael C.", "Emma W.", "James W."],
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
      data: [0.85, 0.65, 0.45, 0.25],
    },
  ];

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
