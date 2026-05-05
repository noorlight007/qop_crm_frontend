import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgUserListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgLeadAndApplicantList: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/api/organisations/${organisationslug}/applicants/`,
        method: "GET",
        params: params,
      }),
      providesTags: ["OrgLeadAndApplicantList"],
    }),
    addOrgLeadOrApplicant: builder.mutation({
      query: ({ organisationslug, payload }) => ({
        url: `/api/organisations/${organisationslug}/applicants/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["OrgLeadAndApplicantList"],
    }),
    updateOrgLeadOrApplicant: builder.mutation({
      query: ({ organisationslug, user_alias, payload }) => ({
        url: `/api/organisations/${organisationslug}/applicants/${user_alias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["OrgLeadAndApplicantList"],
    }),
    deleteOrgLeadOrApplicant: builder.mutation({
      query: ({ organisationslug, user_alias }) => ({
        url: `/api/organisations/${organisationslug}/applicants/${user_alias}/`, //
        method: "DELETE",
      }),
      invalidatesTags: ["OrgLeadAndApplicantList"],
    }),
    getOrgUserList: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/api/organisations/${organisationslug}/members/`,
        method: "GET",
        params: params,
      }),
      providesTags: ["OrgUserList"],
    }),

    updateOrgMember: builder.mutation({
      query: ({ organisationslug, user_alias, payload }) => ({
        url: `/api/organisations/${organisationslug}/members/${user_alias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["OrgUserList"],
    }),

    deleteOrgMember: builder.mutation({
      query: ({ organisationslug, user_alias }) => ({
        url: `/api/organisations/${organisationslug}/members/${user_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["OrgUserList"],
    }),
  }),
});

export const {
  useGetOrgLeadAndApplicantListQuery,
  useAddOrgLeadOrApplicantMutation,
  useUpdateOrgLeadOrApplicantMutation,
  useDeleteOrgLeadOrApplicantMutation,
  useGetOrgUserListQuery,
  useUpdateOrgMemberMutation,
  useDeleteOrgMemberMutation,
} = OrgUserListApi;
