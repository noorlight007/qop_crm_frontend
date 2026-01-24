import { baseApi } from "@/Redux/Api/BaseApi";

export const CreditCommitmentsSummaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCreditCommitmentsSummary: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/credit-commitments/summary`,
        method: "GET",
      }),
      providesTags: ["CreditCommitmentsDetails"],
    }),
  }),
});
export const { useGetCreditCommitmentsSummaryQuery } =
  CreditCommitmentsSummaryApi;
