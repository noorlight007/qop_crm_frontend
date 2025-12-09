import { baseApi } from "@/Redux/Api/BaseApi";

export const NetworkAdviserDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkAdviserDashboardSummaryData: builder.query({
      query: () => ({
        url: "/dashboard/network-adviser-summary/",
        method: "GET",
      }),
      providesTags: ["NetworkAdviserDashboardData"],
    }),
    getNetworkAdviserDashboardClientData: builder.query({
      query: () => ({
        url: "/dashboard/network-adviser-clients/",
        method: "GET",
      }),
      providesTags: ["NetworkAdviserDashboardData"],
    }),
    getNetworkAdviserDashboardDocumentData: builder.query({
      query: () => ({
        url: "/dashboard/network-adviser-files/",
        method: "GET",
      }),
      providesTags: ["NetworkAdviserDashboardData"],
    }),
  }),
});

export const {
  useGetNetworkAdviserDashboardSummaryDataQuery,
  useGetNetworkAdviserDashboardClientDataQuery,
  useGetNetworkAdviserDashboardDocumentDataQuery,
} = NetworkAdviserDashboardApi;
