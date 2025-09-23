import { baseApi } from "@/Redux/Api/BaseApi";

export const ApplicantPreviousAddressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPreviousAddress: builder.query({
      query: ({ case_alias, applicantDetails_alias }) => ({
        url: `/cases/${case_alias}/applicant/details/${applicantDetails_alias}/applicant/address/`,
        method: "GET",
      }),
      providesTags: ["ApplicantsDetails", "PreviousAddress"],
    }),
    addPreviousAddress: builder.mutation({
      query: ({ case_alias, applicantDetails_alias, previousAddressInfo }) => ({
        url: `/cases/${case_alias}/applicant/details/${applicantDetails_alias}/applicant/address/`,
        method: "POST",
        body: previousAddressInfo,
      }),
      invalidatesTags: ["ApplicantsDetails", "PreviousAddress"],
    }),
    deletePreviousAddress: builder.mutation({
      query: ({
        case_alias,
        applicantDetails_alias,
        previousAddress_alias,
      }) => ({
        url: `/cases/${case_alias}/applicant/details/${applicantDetails_alias}/applicant/address/${previousAddress_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ApplicantsDetails", "PreviousAddress"],
    }),
  }),
});

export const {
  useGetPreviousAddressQuery,
  useAddPreviousAddressMutation,
  useDeletePreviousAddressMutation,
} = ApplicantPreviousAddressApi;
