import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgUserListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgLeadAndApplicantList: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/organization/${organisationslug}/applicants/`,
        method: "GET",
        params: params,
      }),
      providesTags: ["OrgLeadAndApplicantList"],
    }),
    addOrgLeadOrApplicant: builder.mutation({
      query: ({ organisationslug, payload }) => ({
        url: `/organization/${organisationslug}/applicants/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["OrgLeadAndApplicantList"],
    }),
    getOrgUserList: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/organization/${organisationslug}/user-list/`,
        method: "GET",
        params: params,
      }),
      providesTags: ["OrgUserList"],
    }),
  }),
});

export const {
  useGetOrgLeadAndApplicantListQuery,
  useAddOrgLeadOrApplicantMutation,
  useGetOrgUserListQuery,
} = OrgUserListApi;
