import dynamic from "next/dynamic";
import React from "react";
import { Card } from "reactstrap";

// Dynamically import Google Charts with SSR disabled
const Chart = dynamic(() => import("react-google-charts"), { ssr: false });

const CaseStatusOverview: React.FC = () => {
  // Data matching your image
  const data = [
    ["Category", "Percentage"],
    ["Category 1", 33.3],
    ["Category 2", 26.7],
    ["Category 3", 20],
  ];

  const options = {
    title: "",
    pieHole: 0,
    is3D: true,
    slices: {
      0: { offset: 0.08 },
      1: { offset: 0.03 },
      2: { offset: 0.03 },
    },
    pieStartAngle: 0, // No rotation
    sliceVisibilityThreshold: 0.01, // Show all slices
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "#233238",
        fontSize: 12,
      },
    },
    colors: ["#2c7d7b", "#e97451", "#a5d6a7"],
    backgroundColor: "transparent",
    chartArea: {
      left: 30,
      top: 30,
      width: "85%",
      height: "85%",
    },
    tooltip: {
      textStyle: {
        fontSize: 10,
      },
    },
    fontSize: 11, // Overall font size
  };

  return (
    <Card className="bg-white p-3 shadow-sm">
      <h4 className="mb-2 text-md font-semibold">Case Status Overview</h4>
      <div className="google-chart">
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width="100%"
        height="370px"
      />
      </div>
    </Card>
  );
};

export default CaseStatusOverview;
