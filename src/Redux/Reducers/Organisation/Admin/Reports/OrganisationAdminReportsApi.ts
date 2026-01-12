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
    getOrgAdminReportsView: builder.query({
      query: (params) => ({
        url: "reports/organization-staff-view/",
        method: "GET",
        params,
      }),

      providesTags: ["NetworkAdviserReports"],
    }),
  }),
});

export const { useGetOrgAdminReportsMutation, useGetOrgAdminReportsViewQuery } = OrganisationAdminReportsApi;
