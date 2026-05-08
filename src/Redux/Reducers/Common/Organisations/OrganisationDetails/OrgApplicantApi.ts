import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgApplicantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgApplicantList: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/api/organisations/${organisationslug}/applicants/`,
        method: "GET",
        params: params,
      }),
      providesTags: ["OrgApplicantList"],
    }),
    addOrgApplicant: builder.mutation({
      query: ({ organisationslug, payload }) => ({
        url: `/api/organisations/${organisationslug}/applicants/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["OrgApplicantList"],
    }),
    updateOrgApplicant: builder.mutation({
      query: ({ organisationslug, user_alias, payload }) => ({
        url: `/api/organisations/${organisationslug}/applicants/${user_alias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["OrgApplicantList"],
    }),
    deleteOrgApplicant: builder.mutation({
      query: ({ organisationslug, user_alias }) => ({
        url: `/api/organisations/${organisationslug}/applicants/${user_alias}/`, //
        method: "DELETE",
      }),
      invalidatesTags: ["OrgApplicantList"],
    }),
  }),
});

export const {
  useGetOrgApplicantListQuery,
  useAddOrgApplicantMutation,
  useUpdateOrgApplicantMutation,
  useDeleteOrgApplicantMutation,
} = OrgApplicantApi;
