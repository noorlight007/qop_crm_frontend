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
  }),
});

export const { useGetOrganisationDirectorReportsMutation } =
  OrganisationDirectorReportsApi;
