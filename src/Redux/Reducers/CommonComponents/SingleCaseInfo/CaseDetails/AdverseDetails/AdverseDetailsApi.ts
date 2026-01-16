import { baseApi } from "@/Redux/Api/BaseApi";

export const AdverseDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdverseDetails: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/adverse/`,
        method: "GET",
      }),
      providesTags: ["AdverseDetails", "JointApplicantDetails"],
    }),
    getSingleAdverseDetails: builder.query({
      query: ({ case_alias, adverse_alias }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/`,
        method: "GET",
      }),
      providesTags: ["AdverseDetails", "JointApplicantDetails"],
    }),

    updateAdverseDetails: builder.mutation({
      query: ({ case_alias, adverse_alias, adverse_details }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/`,
        method: "PUT",
        body: adverse_details,
      }),
      invalidatesTags: ["AdverseDetails", "JointApplicantDetails"],
    }),
    addPropertyRepossessed: builder.mutation({
      query: ({ case_alias, adverse_alias, value }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/property/repossessed/`,
        method: "POST",
        body: value,
      }),
      invalidatesTags: ["AdverseDetails"],
    }),
    getPropertyRepossessed: builder.query({
      query: ({ case_alias, adverse_alias }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/property/repossessed/`,
        method: "GET",
      }),
      providesTags: ["AdverseDetails"],
    }),
    addCommitmentPayments: builder.mutation({
      query: ({ case_alias, adverse_alias, value }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/payment/commitments/`,
        method: "POST",
        body: value,
      }),
      invalidatesTags: ["AdverseDetails"],
    }),
    getCommitmentPayments: builder.query({
      query: ({ case_alias, adverse_alias }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/payment/commitments/`,
        method: "GET",
      }),
      providesTags: ["AdverseDetails"],
    }),
    addDefaults: builder.mutation({
      query: ({ case_alias, adverse_alias, value }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/register/loans/`,
        method: "POST",
        body: value,
      }),
      invalidatesTags: ["AdverseDetails"],
    }),
    getDefaults: builder.query({
      query: ({ case_alias, adverse_alias }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/register/loans/`,
        method: "GET",
      }),
      providesTags: ["AdverseDetails"],
    }),
    addBankrupts: builder.mutation({
      query: ({ case_alias, adverse_alias, value }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/bankrupts/`,
        method: "POST",
        body: value,
      }),
      invalidatesTags: ["AdverseDetails"],
    }),
    getBankrupts: builder.query({
      query: ({ case_alias, adverse_alias }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/bankrupts/`,
        method: "GET",
      }),
      providesTags: ["AdverseDetails"],
    }),
    addIVAs: builder.mutation({
      query: ({ case_alias, adverse_alias, value }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/individual/voluntary/`,
        method: "POST",
        body: value,
      }),
      invalidatesTags: ["AdverseDetails"],
    }),
    getIVAs: builder.query({
      query: ({ case_alias, adverse_alias }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/individual/voluntary/`,
        method: "GET",
      }),
      providesTags: ["AdverseDetails"],
    }),
    addDMPs: builder.mutation({
      query: ({ case_alias, adverse_alias, value }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/debt/management/`,
        method: "POST",
        body: value,
      }),
      invalidatesTags: ["AdverseDetails"],
    }),
    getDMPs: builder.query({
      query: ({ case_alias, adverse_alias }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/debt/management/`,
        method: "GET",
      }),
      providesTags: ["AdverseDetails"],
    }),
    addPayDayLoans: builder.mutation({
      query: ({ case_alias, adverse_alias, value }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/pay/day/loan/`,
        method: "POST",
        body: value,
      }),
      invalidatesTags: ["AdverseDetails"],
    }),
    getPayDayLoans: builder.query({
      query: ({ case_alias, adverse_alias }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/pay/day/loan/`,
        method: "GET",
      }),
      providesTags: ["AdverseDetails"],
    }),
    addCCJs: builder.mutation({
      query: ({ case_alias, adverse_alias, value }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/ccj`,
        method: "POST",
        body: value,
      }),
      invalidatesTags: ["AdverseDetails"],
    }),
    getCCJs: builder.query({
      query: ({ case_alias, adverse_alias }) => ({
        url: `/cases/${case_alias}/adverse/${adverse_alias}/ccj`,
        method: "GET",
      }),
      providesTags: ["AdverseDetails"],
    }),
  }),
});

// Update exports to include the new query
export const {
  useGetAdverseDetailsQuery,
  useGetSingleAdverseDetailsQuery,
  useUpdateAdverseDetailsMutation,
  useAddPropertyRepossessedMutation,
  useGetPropertyRepossessedQuery,
  useAddCommitmentPaymentsMutation,
  useGetCommitmentPaymentsQuery,
  useAddDefaultsMutation,
  useGetDefaultsQuery,
  useAddBankruptsMutation,
  useGetBankruptsQuery,
  useAddIVAsMutation,
  useGetIVAsQuery,
  useAddDMPsMutation,
  useGetDMPsQuery,
  useAddPayDayLoansMutation,
  useGetPayDayLoansQuery,
  useAddCCJsMutation,
  useGetCCJsQuery,
} = AdverseDetailsApi;
