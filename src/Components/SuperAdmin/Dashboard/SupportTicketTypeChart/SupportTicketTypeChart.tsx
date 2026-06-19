import { useGetSuperAdminDashboardSupportTicketTypeChartQuery } from '@/Redux/Reducers/SuperAdmin/Dashboard/DashboardApi';
import type { TicketType } from '@/Types/Common/SupportTicket/SupportTicketTypes';
import dynamic from 'next/dynamic';
import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

// Dynamically import Google Charts with SSR disabled
const Chart = dynamic(() => import('react-google-charts'), { ssr: false });

const monthShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const ticketTypes = [
  { value: 'FEEDBACK', label: 'Feedback' },
  { value: 'BUG_REPORT', label: 'Bug Report' },
  { value: 'FEATURE_REQUEST', label: 'Feature Request' },
] satisfies Array<{ value: TicketType; label: string }>;

const buildLast12Months = () => {
  const now = new Date();
  return Array.from({ length: 12 }).map((_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return monthShort[date.getMonth()] ?? '';
  });
};

const formatMonthLabel = (value: unknown): string | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const idx = Math.max(1, Math.min(12, Math.trunc(value))) - 1;
    return monthShort[idx] ?? null;
  }

  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const isoLike = /^\d{4}-\d{2}(-\d{2})?$/;
  if (isoLike.test(trimmed)) {
    const d = new Date(trimmed.length === 7 ? `${trimmed}-01` : trimmed);
    if (!Number.isNaN(d.getTime())) return monthShort[d.getMonth()] ?? trimmed;
  }

  return trimmed;
};

const normalizeKey = (k: string) => k.replace(/[\s_-]/g, '').toLowerCase();

const pickNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const getTicketTypeCandidates = (type: TicketType) => {
  const lower = type.toLowerCase();
  const camel = lower.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
  return [
    type,
    lower,
    camel,
    lower.replace(/_/g, '-'),
    lower.replace(/_/g, ' '),
  ];
};

const readTypeValue = (row: Record<string, unknown>, type: TicketType) => {
  const candidates = getTicketTypeCandidates(type);
  for (const c of candidates) {
    if (c in row) return pickNumber(row[c]);
  }

  const normalizedTarget = normalizeKey(type);
  for (const k of Object.keys(row)) {
    if (normalizeKey(k) === normalizedTarget) return pickNumber(row[k]);
  }
  return 0;
};

const pickRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
};

const normalizeTicketTypeChartResponse = (
  raw: unknown,
): { months: string[]; series: Record<TicketType, number[]> } => {
  const base = (raw as any)?.data ?? raw;

  const monthsFromApiRaw: unknown =
    (base as any)?.months ?? (base as any)?.labels ?? (base as any)?.xAxis;
  const monthsFromApi = Array.isArray(monthsFromApiRaw)
    ? monthsFromApiRaw
        .map((m) => formatMonthLabel(m))
        .filter((m): m is string => Boolean(m))
    : [];

  const inferMonthsFromRows = (rows: unknown[]): string[] => {
    const inferred: string[] = [];
    for (const item of rows) {
      if (!item || typeof item !== 'object') continue;
      const row = item as Record<string, unknown>;
      const label =
        formatMonthLabel(
          row.month ?? row.label ?? row.x ?? row.date ?? row.period,
        ) ?? null;
      if (!label) continue;
      inferred.push(label);
    }
    return inferred.length > 0 ? inferred : buildLast12Months();
  };

  const months =
    monthsFromApi.length > 0
      ? monthsFromApi
      : Array.isArray(base)
        ? inferMonthsFromRows(base)
        : buildLast12Months();

  const series: Record<TicketType, number[]> = {
    FEEDBACK: Array.from({ length: months.length }).map(() => 0),
    BUG_REPORT: Array.from({ length: months.length }).map(() => 0),
    FEATURE_REQUEST: Array.from({ length: months.length }).map(() => 0),
  };

  if (Array.isArray(base)) {
    for (const item of base) {
      if (!item || typeof item !== 'object') continue;
      const row = item as Record<string, unknown>;

      const counts = pickRecord(row.counts);
      const rowForValues = counts ? { ...row, ...counts } : row;
      const label =
        formatMonthLabel(
          row.month ?? row.label ?? row.x ?? row.date ?? row.period,
        ) ?? null;

      const idx = label
        ? months.findIndex((m) => normalizeKey(m) === normalizeKey(label))
        : -1;
      if (idx < 0) continue;

      for (const t of ticketTypes) {
        series[t.value][idx] = readTypeValue(rowForValues, t.value);
      }
    }
    return { months, series };
  }

  if (base && typeof base === 'object') {
    const obj = base as Record<string, unknown>;

    for (const t of ticketTypes) {
      const candidates = getTicketTypeCandidates(t.value);
      let v: unknown = undefined;
      for (const c of candidates) {
        if (c in obj) {
          v = obj[c];
          break;
        }
      }
      if (v === undefined) {
        const normalizedTarget = normalizeKey(t.value);
        const matchKey = Object.keys(obj).find(
          (k) => normalizeKey(k) === normalizedTarget,
        );
        if (matchKey) v = obj[matchKey];
      }

      if (Array.isArray(v)) {
        series[t.value] = months.map((_, i) => pickNumber(v[i]));
      } else if (v && typeof v === 'object') {
        const byMonth = v as Record<string, unknown>;
        for (let i = 0; i < months.length; i += 1) {
          const monthLabel = months[i] ?? '';
          const direct = byMonth[monthLabel];
          if (direct !== undefined) {
            series[t.value][i] = pickNumber(direct);
            continue;
          }
          const normalizedMonth = normalizeKey(monthLabel);
          const k = Object.keys(byMonth).find(
            (key) => normalizeKey(String(key)) === normalizedMonth,
          );
          if (k) series[t.value][i] = pickNumber(byMonth[k]);
        }
      }
    }
  }

  return { months, series };
};

const SupportTicketTypeChart: React.FC = () => {
  const {
    data: chartResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetSuperAdminDashboardSupportTicketTypeChartQuery(undefined);

  const { months, series } = React.useMemo(
    () => normalizeTicketTypeChartResponse(chartResponse),
    [chartResponse],
  );

  const allValuesZero = months.every((_, i) =>
    ticketTypes.every((t) => (series[t.value]?.[i] ?? 0) === 0),
  );

  const data: any[] = [
    ['Month', ...ticketTypes.map((t) => t.label)],
    ...months.map((label, i) => [
      label,
      ...ticketTypes.map((t) => series[t.value]?.[i] ?? 0),
    ]),
  ];

  const options = {
    title: '',
    backgroundColor: 'transparent',
    legend: {
      position: 'bottom' as const,
      alignment: 'center' as const,
      textStyle: { fontSize: 12 },
    },
    chartArea: { left: 44, top: 18, width: '88%', height: '72%' },
    bar: { groupWidth: '62%' },
    isStacked: false,
    colors: ['#308e87', '#ea9200', '#51bb25'],
    hAxis: {
      textStyle: { fontSize: 11 },
    },
    vAxis: {
      minValue: 0,
      gridlines: { color: '#f1f1f1' },
      textStyle: { fontSize: 12 },
      format: '0',
    },
    tooltip: {
      textStyle: {
        fontSize: 12,
      },
    },
  };

  const loader = (
    <div className='p-4'>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <div
          className='skeleton-loading'
          style={{ width: '45%', height: 14 }}
        />
        <div className='skeleton-loading' style={{ width: 60, height: 14 }} />
      </div>
      <div
        className='skeleton-loading'
        style={{ width: '100%', height: 260 }}
      />
    </div>
  );

  return (
    <Card className='border-0 shadow-sm'>
      <CardHeader className='bg-transparent border-0 pb-0'>
        <h3 className='mb-1'>Ticket Types</h3>
        <small className='text-muted'>Monthly breakdown by type</small>
      </CardHeader>
      <CardBody className='google-chart'>
        {isLoading || isFetching ? (
          loader
        ) : isError ? (
          <div
            className='w-100 text-center'
            style={{ height: 320, display: 'grid', placeItems: 'center' }}
          >
            <div>
              <h6 className='mb-1 text-danger'>Unable to load chart</h6>
              <small className='text-muted'>
                Please try again in a moment.
              </small>
            </div>
          </div>
        ) : allValuesZero ? (
          <div
            className='w-100 text-center'
            style={{ height: 320, display: 'grid', placeItems: 'center' }}
          >
            <div>
              <h6 className='mb-1'>No ticket data yet</h6>
              <small className='text-muted'>
                Once activity is available, it will appear here.
              </small>
            </div>
          </div>
        ) : (
          <Chart
            chartType='ColumnChart'
            width='100%'
            height='320px'
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
