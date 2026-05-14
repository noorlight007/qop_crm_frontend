import type { TicketType } from "@/Types/Common/SupportTicket/SupportTicketTypes";
import dynamic from "next/dynamic";
import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";

// Dynamically import Google Charts with SSR disabled
const Chart = dynamic(() => import("react-google-charts"), { ssr: false });

const SupportTicketTypeChart: React.FC = () => {
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

  const ticketTypes = [
    { value: "FEEDBACK", label: "Feedback" },
    { value: "BUG_REPORT", label: "Bug Report" },
    { value: "FEATURE_REQUEST", label: "Feature Request" },
  ] satisfies Array<{ value: TicketType; label: string }>;

  // Oldest -> newest (last 12 months)
  const sample: Record<TicketType, number[]> = {
    FEEDBACK: [12, 10, 14, 13, 18, 15, 21, 20, 19, 22, 18, 24],
    BUG_REPORT: [6, 7, 5, 8, 9, 8, 11, 10, 12, 14, 13, 15],
    FEATURE_REQUEST: [9, 8, 10, 11, 12, 14, 13, 15, 16, 18, 17, 19],
  };

  const now = new Date();
  const months = Array.from({ length: 12 }).map((_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return monthShort[date.getMonth()] ?? "";
  });

  const allValuesZero = months.every((_, i) =>
    ticketTypes.every((t) => (sample[t.value]?.[i] ?? 0) === 0),
  );

  const data: any[] = [
    ["Month", ...ticketTypes.map((t) => t.label)],
    ...months.map((label, i) => [
      label,
      ...ticketTypes.map((t) => sample[t.value]?.[i] ?? 0),
    ]),
  ];

  const options = {
    title: "",
    backgroundColor: "transparent",
    legend: {
      position: "bottom" as const,
      alignment: "center" as const,
      textStyle: { fontSize: 12 },
    },
    chartArea: { left: 44, top: 18, width: "88%", height: "72%" },
    bar: { groupWidth: "62%" },
    isStacked: false,
    colors: ["#308e87", "#ea9200", "#51bb25"],
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
        <h3 className="mb-1">Ticket Types</h3>
        <small className="text-muted">Monthly breakdown by type</small>
      </CardHeader>
      <CardBody className="google-chart">
        {allValuesZero ? (
          <div
            className="d-flex flex-column justify-content-center align-items-center text-center"
            style={{ height: 320 }}
          >
            <h6 className="mb-1">No ticket data yet</h6>
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

export default SupportTicketTypeChart;
