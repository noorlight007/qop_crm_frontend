import { baseApi } from "@/Redux/Api/BaseApi";

export const OrganisationDirectorDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganisationDirectorDashboard: builder.query({
      query: () => ({
        url: `/dashboard/organisation-director-summary/`,
        method: "GET",
      }),
      providesTags: ["OrganisationDirectorDashboard"],
    }),
  }),
});
export const { useGetOrganisationDirectorDashboardQuery } =
  OrganisationDirectorDashboardApi;
