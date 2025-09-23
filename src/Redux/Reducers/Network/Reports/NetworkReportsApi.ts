import { baseApi } from "@/Redux/Api/BaseApi";

export const NetworkReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkReports: builder.mutation({
      query: (params) => ({
        url: "reports/network",
        method: "GET",
        params,
        responseHandler: (response) => response.blob(),
      }),

      invalidatesTags: ["NetworkReports"],
    }),
  }),
});

export const { useGetNetworkReportsMutation } = NetworkReportsApi;
