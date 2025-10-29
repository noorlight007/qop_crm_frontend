import { baseApi } from "@/Redux/Api/BaseApi";

export const NetworkReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganisationAdviserReports: builder.mutation({
      query: (params) => ({
        url: "reports/adviser/",
        method: "GET",
        params,
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: ["OrganisationAdviserReports"],
    }),
  }),
});

export const { useGetOrganisationAdviserReportsMutation } = NetworkReportsApi;
