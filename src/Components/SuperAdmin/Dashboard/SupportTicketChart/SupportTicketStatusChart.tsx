import { useGetSuperAdminDashboardSupportTicketStatusChartQuery } from "@/Redux/Reducers/SuperAdmin/Dashboard/DashboardApi";
import {
  TicketStatusKey,
  TicketStatusPoint,
} from "@/Types/SuperAdmin/Dashboard/DashboardTypes";
import dynamic from "next/dynamic";
import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";

// Dynamically import Google Charts with SSR disabled
const Chart = dynamic(() => import("react-google-charts"), { ssr: false });

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

const statusSeries = [
  { key: "open", label: "Open" },
  { key: "inProgress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "resolved", label: "Resolved" },
  { key: "closed", label: "Closed" },
] satisfies Array<{ key: TicketStatusKey; label: string }>;

const buildLast12Months = () => {
  const now = new Date();
  return Array.from({ length: 12 }).map((_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return monthShort[date.getMonth()] ?? "";
  });
};

const formatMonthLabel = (value: unknown): string | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    const idx = Math.max(1, Math.min(12, Math.trunc(value))) - 1;
    return monthShort[idx] ?? null;
  }

  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const isoLike = /^\d{4}-\d{2}(-\d{2})?$/;
  if (isoLike.test(trimmed)) {
    const d = new Date(trimmed.length === 7 ? `${trimmed}-01` : trimmed);
    if (!Number.isNaN(d.getTime())) return monthShort[d.getMonth()] ?? trimmed;
  }

  return trimmed;
};

const normalizeKey = (k: string) => k.replace(/[\s_-]/g, "").toLowerCase();

const pickNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const pickRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
};

const getStatusCandidates = (key: TicketStatusKey) => {
  const lower = key.toLowerCase();
  const snake = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
  return [
    key,
    lower,
    snake,
    snake.replace(/_/g, "-"),
    snake.replace(/_/g, " "),
    lower.replace(/_/g, ""),
  ];
};

const readStatusValue = (
  row: Record<string, unknown>,
  key: TicketStatusKey,
) => {
  const candidates = getStatusCandidates(key);
  for (const c of candidates) {
    if (c in row) return pickNumber(row[c]);
  }

  const normalizedTarget = normalizeKey(key);
  for (const k of Object.keys(row)) {
    if (normalizeKey(k) === normalizedTarget) return pickNumber(row[k]);
  }
  return 0;
};

const uniqueInOrder = (items: string[]) => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = normalizeKey(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
};

const normalizeTicketStatusChartResponse = (
  raw: unknown,
): TicketStatusPoint[] => {
  const base = (raw as any)?.data ?? raw;

  const monthsFromApiRaw: unknown =
    (base as any)?.months ?? (base as any)?.labels ?? (base as any)?.xAxis;
  const monthsFromApi = Array.isArray(monthsFromApiRaw)
    ? monthsFromApiRaw
        .map((m) => formatMonthLabel(m))
        .filter((m): m is string => Boolean(m))
    : [];

  const initPoints = (months: string[]) =>
    months.map(
      (label): TicketStatusPoint => ({
        label,
        open: 0,
        inProgress: 0,
        completed: 0,
        resolved: 0,
        closed: 0,
      }),
    );

  if (Array.isArray(base)) {
    const derivedMonths =
      monthsFromApi.length > 0
        ? monthsFromApi
        : uniqueInOrder(
            base
              .map((item) => {
                if (!item || typeof item !== "object") return null;
                const row = item as Record<string, unknown>;
                return (
                  formatMonthLabel(
                    row.month ?? row.label ?? row.x ?? row.date ?? row.period,
                  ) ?? null
                );
              })
              .filter((m): m is string => Boolean(m)),
          );

    const months =
      derivedMonths.length > 0 ? derivedMonths : buildLast12Months();
    const points = initPoints(months);

    for (const item of base) {
      if (!item || typeof item !== "object") continue;
      const row = item as Record<string, unknown>;
      const counts = pickRecord(row.counts);
      const rowForValues = counts ? { ...row, ...counts } : row;
      const label =
        formatMonthLabel(
          row.month ?? row.label ?? row.x ?? row.date ?? row.period,
        ) ?? null;
      if (!label) continue;

      const idx = months.findIndex(
        (m) => normalizeKey(m) === normalizeKey(label),
      );
      if (idx < 0) continue;

      for (const s of statusSeries) {
        points[idx][s.key] = readStatusValue(rowForValues, s.key);
      }
    }

    return points;
  }

  if (base && typeof base === "object") {
    const months =
      monthsFromApi.length > 0 ? monthsFromApi : buildLast12Months();
    const points = initPoints(months);

    const container = ((base as any)?.series ?? base) as Record<
      string,
      unknown
    >;

    for (const s of statusSeries) {
      const candidates = getStatusCandidates(s.key);
      let v: unknown = undefined;
      for (const c of candidates) {
        if (c in container) {
          v = container[c];
          break;
        }
      }
      if (v === undefined) {
        const normalizedTarget = normalizeKey(s.key);
        const matchKey = Object.keys(container).find(
          (k) => normalizeKey(k) === normalizedTarget,
        );
        if (matchKey) v = container[matchKey];
      }

      if (Array.isArray(v)) {
        for (let i = 0; i < points.length; i += 1) {
          points[i][s.key] = pickNumber(v[i]);
        }
      } else if (v && typeof v === "object") {
        const byMonth = v as Record<string, unknown>;
        for (let i = 0; i < points.length; i += 1) {
          const monthLabel = points[i].label ?? "";
          const direct = byMonth[monthLabel];
          if (direct !== undefined) {
            points[i][s.key] = pickNumber(direct);
            continue;
          }
          const normalizedMonth = normalizeKey(monthLabel);
          const k = Object.keys(byMonth).find(
            (key) => normalizeKey(String(key)) === normalizedMonth,
          );
          if (k) points[i][s.key] = pickNumber(byMonth[k]);
        }
      }
    }

    return points;
  }

  return initPoints(buildLast12Months());
};

const SupportTicketStatusChart: React.FC = () => {
  const {
    data: chartResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetSuperAdminDashboardSupportTicketStatusChartQuery(undefined);

  const points = React.useMemo(
    () => normalizeTicketStatusChartResponse(chartResponse),
    [chartResponse],
  );

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
      viewWindowMode: "explicit" as const,
      viewWindow: { min: 0 },
      baseline: 0,
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
        {isLoading || isFetching ? (
          loader
        ) : isError ? (
          <div
            className="w-100 text-center"
            style={{ height: 320, display: "grid", placeItems: "center" }}
          >
            <div>
              <h6 className="mb-1 text-danger">Unable to load chart</h6>
              <small className="text-muted">
                Please try again in a moment.
              </small>
            </div>
          </div>
        ) : allValuesZero ? (
          <div
            className="w-100 text-center"
            style={{ height: 320, display: "grid", placeItems: "center" }}
          >
            <div>
              <h6 className="mb-1">No ticket data yet</h6>
              <small className="text-muted">
                Once tickets are created, trends will appear here.
              </small>
            </div>
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
