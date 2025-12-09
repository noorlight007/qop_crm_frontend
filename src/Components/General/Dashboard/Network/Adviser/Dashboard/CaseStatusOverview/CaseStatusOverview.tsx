import {
  CaseStage,
  CommonNetworkAdviserSummaryProps,
} from "@/Types/Network/Adviser/DashboardTypes";
import dynamic from "next/dynamic";
import React from "react";
import { Card } from "reactstrap";

// Dynamically import Google Charts with SSR disabled
const Chart = dynamic(() => import("react-google-charts"), { ssr: false });

const CaseStatusOverview: React.FC<CommonNetworkAdviserSummaryProps> = ({
  isLoading,
  netAdviserSummaryData,
}) => {
  // Map raw case stage keys to human readable labels
  const labelMapping: Record<keyof CaseStage, string> = {
    enquiry: "Enquiry",
    fact_find: "Fact Find",
    research_compliance_check: "Research / Compliance Check",
    decision_in_principle: "Decision in Principle",
    full_mortgage_application: "Full Mortgage Application",
    submission: "Submission",
    offer_from_bank: "Offer from Bank",
    legal: "Legal",
    completion: "Completion",
    future_opportunity: "Future Opportunity",
    accept_waiting_start_date: "Accept - Waiting Start Date",
    accept_on_risk: "Accept on Risk",
    further_medical_required: "Further Medical Required",
    not_proceed: "Not Proceed",
  };

  const rawCaseStage: CaseStage | undefined = netAdviserSummaryData?.case_stage;

  // Build the data array for Google Charts; include keys with numeric values
  const data: Array<Array<string | number>> = [
    ["Category", "Cases"],
    ...(rawCaseStage
      ? (Object.keys(rawCaseStage) as Array<keyof CaseStage>).map((k) => [
          labelMapping[k] || String(k),
          Number(rawCaseStage[k] ?? 0),
        ])
      : []),
  ];

  const options = {
    title: "",
    pieHole: 0,
    is3D: true,
    slices: {
      0: { offset: 0.05 },
      1: { offset: 0.03 },
      2: { offset: 0.03 },
    },
    pieStartAngle: 0, // No rotation
    sliceVisibilityThreshold: 0.01, // Show all slices
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
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

  // If loading - show skeleton
  if (isLoading || !netAdviserSummaryData) {
    return (
      <Card className="bg-white p-3 shadow-sm">
        <div className="mb-2">
          <div
            className="skeleton-loading mb-2"
            style={{ width: "50%", height: "20px" }}
          />
          <div
            className="skeleton-loading"
            style={{ width: "100%", height: "320px" }}
          />
        </div>
      </Card>
    );
  }

  // If all case stage values are 0
  const totalCases = data.reduce(
    (acc, val, i) => (i === 0 ? 0 : acc + Number(val[1] ?? 0)),
    0
  );

  if (totalCases === 0) {
    return (
      <Card className="bg-white p-3 shadow-sm text-center">
        <h4 className="mb-2 text-md font-semibold">Case Status Overview</h4>
        <div className="text-muted">No case stage data available</div>
      </Card>
    );
  }

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
