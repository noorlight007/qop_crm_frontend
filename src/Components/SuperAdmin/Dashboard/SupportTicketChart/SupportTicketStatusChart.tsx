import dynamic from "next/dynamic";
import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";

// Dynamically import Google Charts with SSR disabled
const Chart = dynamic(() => import("react-google-charts"), { ssr: false });

type TicketStatusPoint = {
  label: string;
  open: number;
  inProgress: number;
  completed: number;
  resolved: number;
  closed: number;
};

const SupportTicketStatusChart: React.FC = () => {
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
  const sample = {
    open: [18, 22, 20, 26, 28, 24, 30, 32, 29, 27, 25, 21],
    inProgress: [10, 12, 11, 14, 15, 13, 16, 18, 17, 15, 20, 12],
    completed: [8, 10, 9, 12, 14, 20, 16, 40, 17, 15, 14, 12],
    resolved: [26, 24, 28, 30, 33, 31, 40, 38, 36, 34, 32, 29],
    closed: [14, 16, 15, 18, 20, 19, 22, 24, 23, 21, 19, 10],
  };

  const now = new Date();
  const points: TicketStatusPoint[] = Array.from({ length: 12 }).map((_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return {
      label: monthShort[date.getMonth()] ?? "",
      open: sample.open[i] ?? 0,
      inProgress: sample.inProgress[i] ?? 0,
      completed: sample.completed[i] ?? 0,
      resolved: sample.resolved[i] ?? 0,
      closed: sample.closed[i] ?? 0,
    };
  });

  const allValuesZero = points.every(
    (p) =>
      (p.open ?? 0) === 0 &&
      (p.inProgress ?? 0) === 0 &&
      (p.completed ?? 0) === 0 &&
      (p.resolved ?? 0) === 0 &&
      (p.closed ?? 0) === 0,
  );

  const data: any[] = [
    ["Month", "Open", "In Progress", "Completed", "Resolved", "Closed"],
    ...points.map((p) => [
      p.label,
      p.open,
      p.inProgress,
      p.completed,
      p.resolved,
      p.closed,
    ]),
  ];

  const options = {
    backgroundColor: "transparent",
    chartArea: { left: 44, top: 18, width: "88%", height: "72%" },
    legend: {
      position: "bottom" as const,
      alignment: "center" as const,
      textStyle: { fontSize: 12 },
    },
    colors: ["#e74b2b", "#ea9200", "#308e87", "#51bb25", "#57375d"],
    lineWidth: 3,
    pointSize: 4,
    curveType: "function" as const,
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
      isHtml: false,
      textStyle: { fontSize: 12 },
    },
  };

  const loader = (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div
          className="skeleton-loading"
          style={{ width: "50%", height: 14 }}
        />
        <div className="skeleton-loading" style={{ width: 90, height: 14 }} />
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
        <h3 className="mb-1">Ticket Status</h3>
        <small className="text-muted">Monthly trend by status</small>
      </CardHeader>
      <CardBody className="google-chart">
        {allValuesZero ? (
          <div
            className="d-flex flex-column justify-content-center align-items-center text-center"
            style={{ height: 320 }}
          >
            <h6 className="mb-1">No ticket data yet</h6>
            <small className="text-muted">
              Once tickets are created, trends will appear here.
            </small>
          </div>
        ) : (
          <Chart
            chartType="LineChart"
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

export default SupportTicketStatusChart;
