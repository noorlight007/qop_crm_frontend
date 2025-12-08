import { baseApi } from "@/Redux/Api/BaseApi";

export const OrganisationAdminReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgAdminReports: builder.mutation({
      query: (params) => ({
        url: "reports/organization-staff/",
        method: "GET",
        params,
        responseHandler: (response) => response.blob(),
      }),

      invalidatesTags: ["OrganisationStaffReports"],
    }),
  }),
});

export const { useGetOrgAdminReportsMutation } = OrganisationAdminReportsApi;
