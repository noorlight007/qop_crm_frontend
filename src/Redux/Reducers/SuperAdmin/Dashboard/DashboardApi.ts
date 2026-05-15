import { baseApi } from "@/Redux/Api/BaseApi";

export const SuperAdminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminDashboardOverviewData: builder.query({
      query: () => ({
        url: "/dashboard/super-admin-summary/",
        method: "GET",
      }),
    }),
    getSuperAdminDashboardSupportTicketTypeChart: builder.query({
      query: () => ({
        url: "/dashboard/ticket-types-chart/",
        method: "GET",
      }),
    }),
    getSuperAdminDashboardSupportTicketStatusChart: builder.query({
      query: () => ({
        url: "/dashboard/ticket-status-chart/",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetSuperAdminDashboardOverviewDataQuery,
  useGetSuperAdminDashboardSupportTicketTypeChartQuery,
  useGetSuperAdminDashboardSupportTicketStatusChartQuery,
} = SuperAdminDashboardApi;
