import { baseApi } from "@/Redux/Api/BaseApi";

export const OrganisationStaffReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgStaffReports: builder.mutation({
      query: (params) => ({
        url: "reports/admin",
        method: "GET",
        params,
        responseHandler: (response) => response.blob(),
      }),

      invalidatesTags: ["OrganisationStaffReports"],
    }),
  }),
});

export const { useGetOrgStaffReportsMutation } = OrganisationStaffReportsApi;