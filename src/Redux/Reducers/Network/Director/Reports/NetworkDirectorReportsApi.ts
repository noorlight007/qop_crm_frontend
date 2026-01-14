import { baseApi } from "@/Redux/Api/BaseApi";

export const NetworkDirectorReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkDirectorReports: builder.mutation({
      query: (params) => ({
        url: "/reports/network/",
        method: "GET",
        params,
        responseHandler: (response) => response.blob(),
      }),    
      invalidatesTags: ["NetworkReports"],
    }),
    getNetworkDirectorReportsView: builder.query({
      query: (params) => ({
        url: "/reports/network-view/",
        method: "GET",
        params,
      }),
      providesTags: ["NetworkReports"],
    })
  }),
});

export const { useGetNetworkDirectorReportsMutation, useGetNetworkDirectorReportsViewQuery } =
  NetworkDirectorReportsApi;
