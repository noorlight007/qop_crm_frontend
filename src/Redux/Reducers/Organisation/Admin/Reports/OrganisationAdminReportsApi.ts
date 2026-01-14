import { baseApi } from "@/Redux/Api/BaseApi";

export const OrganisationAdminReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgAdminReports: builder.mutation({
      query: (params) => ({
        url: "/reports/organisation-admin/",
        method: "GET",
        params,
        responseHandler: (response) => response.blob(),
      }),

      invalidatesTags: ["OrganisationAdminReports"],
    }),
    getOrgAdminReportsView: builder.query({
      query: (params) => ({
        url: "/reports/organisation-admin-view/",
        method: "GET",
        params,
      }),

      providesTags: ["OrganisationAdminReports"],
    }),
  }),
});

export const { useGetOrgAdminReportsMutation, useGetOrgAdminReportsViewQuery } = OrganisationAdminReportsApi;
