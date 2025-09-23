import dynamic from "next/dynamic";
import React from "react";
import { Card } from "reactstrap";

// Dynamically import ApexCharts with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CaseStatusOverview: React.FC = () => {
  // Sample data - replace with actual data from your API
  const series = [70, 20, 10]; // Compliant, In Progress, Issues

  const options = {
    chart: {
      type: "donut",
      background: "transparent",
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
    colors: ["#10b981", "#f59e0b", "#94a3b8"],
    labels: ["Compliant", "In Progress", "Issues"],
    legend: {
      position: "bottom",
      fontSize: "14px",
      offsetY: 20,
      labels: {
        colors: undefined, // Let CSS handle the colors
        useSeriesColors: false,
      },
      markers: {
        width: 8,
        height: 8,
        radius: 4,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontFamily: "inherit",
              offsetY: -10,
              color: undefined, // Let CSS handle the color
            },
            value: {
              show: true,
              fontSize: "24px",
              fontFamily: "inherit",
              offsetY: 10,
              color: undefined, // Let CSS handle the color
              formatter: function (val: number) {
                return val + "%";
              },
            },
            total: {
              show: true,
              label: "Total Cases",
              fontSize: "14px",
              color: undefined, // Let CSS handle the color
              formatter: function (w: any) {
                return (
                  w.globals.seriesTotals.reduce(
                    (a: number, b: number) => a + b,
                    0
                  ) + " Cases"
                );
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            position: "bottom",
            offsetY: 0,
            itemMargin: {
              horizontal: 8,
              vertical: 2,
            },
          },
        },
      },
    ],
    stroke: {
      width: 0,
    },
  };

  return (
    <Card className="bg-white p-4 shadow-sm">
      <h4 className="mb-3 text-lg font-semibold">Case Status Overview</h4>
      <div className="apex-chart w-100">
        <Chart
          options={options as any}
          series={series}
          type="donut"
          height={340}
        />
      </div>
    </Card>
  );
};

export default CaseStatusOverview;
