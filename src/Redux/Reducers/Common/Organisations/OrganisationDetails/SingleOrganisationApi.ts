import { baseApi } from "@/Redux/Api/BaseApi";

export const SingleOrganisationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSingleOrganisation: builder.query({
      query: ({ organisationslug }) => ({
        url: `/api/organisations/${organisationslug}/`,
        method: "GET",
      }),
      providesTags: ["SingleOrganisation"],
    }),
    getSingleOrganisationDashboardData: builder.query({
      query: ({ organisationslug }) => ({
        url: `/dashboard/organization/${organisationslug}/`,
        method: "GET",
      }),
      providesTags: ["SingleOrganisation"],
    }),
    updateOrganisation: builder.mutation({
      query: ({ slug, payload }) => ({
        url: `/api/organisations/${slug}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["SingleOrganisation", "OrganisationList"],
    }),
    deleteOrganisation: builder.mutation({
      query: ({ slug }) => ({
        url: `/api/organisations/${slug}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["SingleOrganisation", "OrganisationList"],
    }),
  }),
});

export const {
  useGetSingleOrganisationQuery,
  useGetSingleOrganisationDashboardDataQuery,
  useUpdateOrganisationMutation,
  useDeleteOrganisationMutation,
} = SingleOrganisationApi;
