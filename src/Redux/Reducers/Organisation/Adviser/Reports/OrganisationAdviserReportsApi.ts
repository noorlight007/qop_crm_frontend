import { baseApi } from "@/Redux/Api/BaseApi";

export const OrganisationAdviserReportsApi = baseApi.injectEndpoints({
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
    getOrganisationAdviserReportsView: builder.query({
      query: (params) => ({
        url: "reports/adviser-view/",
        method: "GET",
        params,
      }),
      providesTags: ["OrganisationAdviserReports"],
    }),
  }),
});

export const {
  useGetOrganisationAdviserReportsMutation,
  useGetOrganisationAdviserReportsViewQuery,
} = OrganisationAdviserReportsApi;
