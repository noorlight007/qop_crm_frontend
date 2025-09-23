import dynamic from "next/dynamic";
import React from "react";
import { Card } from "reactstrap";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MonthlyPerformance: React.FC = () => {
  const options = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: {
        show: false,
      },
      background: "transparent",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 6,
        borderRadiusApplication: "end",
        distributed: false,
        dataLabels: {
          position: "top",
        },
      },
    },
    colors: ["#3b82f6", "#94a3b8"],
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: undefined, // Let CSS handle the color
      },
    },
    stroke: {
      show: true,
      width: 3,
      colors: ["transparent"],
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
          fontSize: "12px",
          colors: undefined, // Let CSS handle the color
        },
      },
    },
    yaxis: {
      title: {
        text: "Performance",
        style: {
          // color: "#64748b",
          fontSize: "13px",
          fontWeight: "500",
          color: undefined, // Let CSS handle the color
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: undefined, // Let CSS handle the color
        },
      },
    },
    fill: {
      opacity: 1,
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.2,
        gradientToColors: ["#60a5fa", "#cbd5e1"],
        inverseColors: true,
        opacityFrom: 0.9,
        opacityTo: 0.7,
        stops: [0, 100],
      },
    },
    tooltip: {
      theme: "light", // Keep as light, CSS will handle dark mode
      y: {
        formatter: function (val: number) {
          return val + " cases";
        },
      },
      style: {
        fontSize: "12px",
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontSize: "13px",
      labels: {
        colors: undefined, // Let CSS handle the color
        useSeriesColors: false,
      },
      markers: {
        width: 10,
        height: 10,
        radius: 10,
      },
      itemMargin: {
        horizontal: 10,
      },
    },
    grid: {
      show: true,
      borderColor: "transparent", // Let CSS handle grid colors
      strokeDashArray: 4,
      padding: {
        top: 20,
        right: 20,
        bottom: 10,
        left: 20,
      },
    },
  };

  const series = [
    {
      name: "Performance",
      data: [8, 12, 9, 15, 11, 14],
    },
    {
      name: "Target",
      data: [10, 10, 10, 12, 12, 12],
    },
  ];

  return (
    <Card className="border-0 p-4 shadow-sm bg-white">
      <h4 className="text-lg font-semibold mb-4 text-slate-800">
        Monthly Performance vs Target
      </h4>
      <div className="apex-chart w-100">
        <Chart
          options={options as any}
          series={series}
          type="bar"
          height="320px"
        />
      </div>
    </Card>
  );
};

export default MonthlyPerformance;
