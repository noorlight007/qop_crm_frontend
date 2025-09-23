import { baseApi } from "@/Redux/Api/BaseApi";

export const NetworkAdviserReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkAdviserReports: builder.mutation({
      query: (params) => ({
        url: "reports/adviser",
        method: "GET",
        params,
        responseHandler: (response) => response.blob(),
      }),

      invalidatesTags: ["NetworkAdviserReports"],
    }),
  }),
});

export const { useGetNetworkAdviserReportsMutation } = NetworkAdviserReportsApi;
