import { baseApi } from "@/Redux/Api/BaseApi";

export const LoanDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCaseLoanDetails: builder.query({
      query: (case_alias) => ({
        url: `/cases/${case_alias}/loan/details/`,
        method: "GET",
      }),
      providesTags: ["LoanDetails"],
    }),
    getLoanDetails: builder.query({
      query: ({ case_alias, loanDetails_alias }) => ({
        url: `/cases/${case_alias}/loan/details/${loanDetails_alias}/`,
        method: "GET",
      }),
      providesTags: ["LoanDetails"],
    }),
    updateLoanDetails: builder.mutation({
      query: ({ case_alias, loanDetails_alias, mergedData }) => ({
        url: `/cases/${case_alias}/loan/details/${loanDetails_alias}/`,
        method: "PATCH",
        body: mergedData,
      }),
      invalidatesTags: ["LoanDetails", "CaseDetails"],
    }),
    // Validation-only mutation: backend should return validation errors without persisting when possible.
    // Uses same PATCH endpoint but can be distinguished server-side by a query param `?validate=true`.
    validateLoanDetails: builder.mutation({
      query: ({ case_alias, loanDetails_alias, mergedData }) => ({
        url: `/cases/${case_alias}/loan/details/${loanDetails_alias}/?validate=true`,
        method: "PATCH",
        body: mergedData,
      }),
    }),
  }),
});

export const {
  useGetLoanDetailsQuery,
  useUpdateLoanDetailsMutation,
  useGetCaseLoanDetailsQuery,
  useValidateLoanDetailsMutation,
} = LoanDetailsApi;
