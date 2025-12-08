import { baseApi } from "@/Redux/Api/BaseApi";

export const OrganisationListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganisationList: builder.query({
      query: (params) => ({
        url: `/organization/list/`,
        method: "GET",
        params,
      }),
      providesTags: ["OrganisationList"],
    }),
    addOrganisation: builder.mutation({
      query: ({ payload }) => ({
        url: `/organization/list/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["OrganisationList"],
    }),
  }),
});

export const { useGetOrganisationListQuery, useAddOrganisationMutation } =
  OrganisationListApi;
