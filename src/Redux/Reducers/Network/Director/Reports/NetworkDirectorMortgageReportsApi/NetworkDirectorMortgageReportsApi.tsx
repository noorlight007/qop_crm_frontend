import { baseApi } from "@/Redux/Api/BaseApi";

export const NetworkDirectorMortgageReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkDirectorMortgageReports: builder.mutation({
      query: (params) => ({
        url: "/api/reports/mortgage-register-report-csv/",
        method: "GET",
        params,
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: ["NetworkReports"],
    }),
    getNetworkDirectorMortgageReportsView: builder.query({
      query: (params) => ({
        url: "/api/reports/mortgage-register-report/",
        method: "GET",
        params,
      }),
      providesTags: ["NetworkReports"],
    }),
  }),
});

export const {
  useGetNetworkDirectorMortgageReportsMutation,
  useGetNetworkDirectorMortgageReportsViewQuery,
} = NetworkDirectorMortgageReportsApi;
