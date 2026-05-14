import { baseApi } from "@/Redux/Api/BaseApi";

export const SuperAdminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminDashboardOverviewData: builder.query({
      query: () => ({
        url: "/superadmin/dashboard/overview",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSuperAdminDashboardOverviewDataQuery } =
  SuperAdminDashboardApi;
