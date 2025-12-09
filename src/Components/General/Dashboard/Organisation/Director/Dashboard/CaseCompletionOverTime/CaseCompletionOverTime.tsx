import dynamic from "next/dynamic";
import React from "react";
import { Card } from "reactstrap";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const data = {
  completed: [12, 14, 18, 22, 19, 25],
  pending: [7, 5, 7, 5, 6, 4],
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const CaseCompletionOverTime: React.FC = () => {
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

  const series = [
    {
      name: "Completed",
      data: data.completed,
    },
    {
      name: "Pending",
      data: data.pending,
    },
  ];

  return (
    <Card>
      <h4 className="text-xl p-3 font-semibold mb-4">
        Case Completion Over Time
      </h4>
      <div className="apex-chart w-100">
        <Chart
          options={options as any}
          series={series}
          type="bar"
          height="300px"
        />
      </div>
    </Card>
  );
};

export default CaseCompletionOverTime;
