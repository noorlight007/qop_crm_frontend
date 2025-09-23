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
      invalidatesTags: ["LoanDetails"],
    }),
  }),
});

export const {
  useGetLoanDetailsQuery,
  useUpdateLoanDetailsMutation,
  useGetCaseLoanDetailsQuery,
} = LoanDetailsApi;
