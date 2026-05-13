import dynamic from "next/dynamic";
import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";

// Dynamically import Google Charts with SSR disabled
const Chart = dynamic(() => import("react-google-charts"), { ssr: false });

type ProfileVisitPoint = {
  label: string;
  visits: number;
};

const ProfileVisitChart: React.FC = () => {
  // TODO: Replace with real API data when the endpoint is available.
  const monthShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Oldest -> newest (last 12 months)
  const sampleValues = [
    420, 380, 460, 510, 640, 590, 720, 680, 740, 810, 770, 860,
  ];

  const now = new Date();
  const points: ProfileVisitPoint[] = Array.from({ length: 12 }).map((_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return {
      label: monthShort[date.getMonth()] ?? "",
      visits: sampleValues[i] ?? 0,
    };
  });

  const barColors = [
    "#308e87",
    "#f39159",
    "#51bb25",
    "#ea9200",
    "#e74b2b",
    "#a927f9",
  ];

  const allValuesZero = points.every((p) => (p.visits ?? 0) === 0);

  const data: any[] = [
    ["Month", "Visits", { role: "style" }, { role: "annotation" }],
    ...points.map((p, index) => [
      p.label,
      p.visits,
      barColors[index % barColors.length],
      String(p.visits),
    ]),
  ];

  const options = {
    title: "",
    backgroundColor: "transparent",
    legend: { position: "none" as const },
    chartArea: { left: 44, top: 18, width: "88%", height: "72%" },
    bar: { groupWidth: "62%" },
    annotations: {
      textStyle: {
        fontSize: 10,
      },
    },
    hAxis: {
      textStyle: { fontSize: 11 },
    },
    vAxis: {
      minValue: 0,
      gridlines: { color: "#f1f1f1" },
      textStyle: { fontSize: 12 },
      format: "0",
    },
    tooltip: {
      textStyle: {
        fontSize: 12,
      },
      showColorCode: true,
    },
  };

  const loader = (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div
          className="skeleton-loading"
          style={{ width: "45%", height: 14 }}
        />
        <div className="skeleton-loading" style={{ width: 60, height: 14 }} />
      </div>
      <div
        className="skeleton-loading"
        style={{ width: "100%", height: 260 }}
      />
    </div>
  );

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="bg-transparent border-0 pb-0">
        <h3 className="mb-1">Profile Visits</h3>
        <small className="text-muted">Monthly visits (last 12 months)</small>
      </CardHeader>
      <CardBody className="google-chart">
        {allValuesZero ? (
          <div
            className="d-flex flex-column justify-content-center align-items-center text-center"
            style={{ height: 320 }}
          >
            <h6 className="mb-1">No visit data yet</h6>
            <small className="text-muted">
              Once activity is available, it will appear here.
            </small>
          </div>
        ) : (
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="320px"
            data={data}
            options={options}
            loader={loader}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default ProfileVisitChart;
