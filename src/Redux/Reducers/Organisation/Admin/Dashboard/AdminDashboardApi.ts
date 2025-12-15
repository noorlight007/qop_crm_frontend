import { baseApi } from "@/Redux/Api/BaseApi";

export const AdminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardData: builder.query({
      query: () => ({
        url: `/dashboard/admin-summary/`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});
export const { useGetAdminDashboardDataQuery } = AdminDashboardApi;
