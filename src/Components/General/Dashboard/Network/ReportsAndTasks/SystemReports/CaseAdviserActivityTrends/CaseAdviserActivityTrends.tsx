import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, Col } from "reactstrap";

const CaseAdviserActivityTrends: React.FC = () => {
  const chartOptions: ApexOptions = {
    chart: {
      height: 350,
      type: "line" as const,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#2E93fA", "#66DA26"],
    dataLabels: {
      enabled: true,
      style: {
        colors: undefined, // Let CSS handle the color
      },
      background: {
        enabled: true,
        padding: 4,
        borderRadius: 2,
        borderWidth: 0,
        opacity: 0.9,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    title: {
      text: "Case & Adviser Activity Trends",
      align: "left",
      style: {
        fontSize: "18px",
        fontWeight: "700",
        color: undefined, // Let CSS handle the color
      },
    },
    grid: {
      borderColor: "#e2e8f0", // Keep visible grid for both themes
      row: {
        colors: ["#f9fafb", "transparent"], // Light alternating rows for better readability
        opacity: 0.5,
      },
    },
    markers: {
      size: 6,
      hover: {
        size: 8,
      },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      title: {
        text: "Month",
        style: {
          color: undefined, // Let CSS handle the color
        },
      },
      labels: {
        style: {
          colors: undefined, // Let CSS handle the color
        },
      },
    },
    yaxis: {
      title: {
        text: "Number of Activities",
        style: {
          color: undefined, // Let CSS handle the color
        },
      },
      labels: {
        style: {
          colors: undefined, // Let CSS handle the color
        },
      },
      min: 0,
      max: 400,
      tickAmount: 4,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
      labels: {
        colors: undefined, // Let CSS handle the color
        useSeriesColors: false,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y: number) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " activities";
          }
          return y;
        },
      },
    },
  };

  const chartSeries = [
    {
      name: "Case Activities",
      data: [240, 300, 285, 380, 290, 300],
    },
    {
      name: "Adviser Activities",
      data: [35, 40, 45, 42, 38, 41],
    },
  ];

  return (
    <Col md={6}>
      <Card className="shadow-sm">
        <CardBody className="apex-chart w-100">
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={350}
          />
        </CardBody>
      </Card>
    </Col>
  );
};

export default CaseAdviserActivityTrends;
