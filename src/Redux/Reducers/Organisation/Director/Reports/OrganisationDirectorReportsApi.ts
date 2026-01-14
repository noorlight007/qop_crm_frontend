import { baseApi } from "@/Redux/Api/BaseApi";

export const OrganisationDirectorReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganisationDirectorReports: builder.mutation({
      query: (params) => ({
        url: "reports/organization/",
        method: "GET",
        params,
        responseHandler: (response) => response.blob(),
      }),

      invalidatesTags: ["OrganisationReports"],
    }),
    getOrganisationDirectorReportsView: builder.query({
      query: (params) => ({
        url: "reports/organization-view/",
        method: "GET",
        params,
      }),
      providesTags: ["OrganisationReports"],
    }),
  }),
});

export const {
  useGetOrganisationDirectorReportsMutation,
  useGetOrganisationDirectorReportsViewQuery,
} = OrganisationDirectorReportsApi;
