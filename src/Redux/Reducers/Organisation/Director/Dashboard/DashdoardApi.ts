import { baseApi } from "@/Redux/Api/BaseApi";

export const NetworkDirectorDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkDashboard: builder.query({
      query: () => ({
        url: `/dashboard/network-director-summary/`,
        method: "GET",
      }),
      providesTags: ["NetworkDirectorDashboard"],
    }),
  }),
});
export const { useGetNetworkDashboardQuery } = NetworkDirectorDashboardApi;
