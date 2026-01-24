import { baseApi } from "@/Redux/Api/BaseApi";

export const CreditCommitmentsDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCreditCommitmentsDetails: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/credit/commitments/`,
        method: "GET",
      }),
      providesTags: ["CreditCommitmentsDetails"],
    }),
    addCreditCommitmentsDetails: builder.mutation({
      query: ({ case_alias, payload }) => ({
        url: `/cases/${case_alias}/credit/commitments/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CreditCommitmentsDetails"],
    }),
    updateCreditCommitmentsDetails: builder.mutation({
      query: ({ case_alias, creditCommitment_alias, payload }) => ({
        url: `/cases/${case_alias}/credit/commitments/${creditCommitment_alias}/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CreditCommitmentsDetails"],
    }),
    deleteCreditCommitmentsDetails: builder.mutation({
      query: ({ case_alias, creditCommitment_alias }) => ({
        url: `/cases/${case_alias}/credit/commitments/${creditCommitment_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CreditCommitmentsDetails"],
    }),
  }),
});

export const {
  useGetCreditCommitmentsDetailsQuery,
  useAddCreditCommitmentsDetailsMutation,
  useUpdateCreditCommitmentsDetailsMutation,
  useDeleteCreditCommitmentsDetailsMutation,
} = CreditCommitmentsDetailsApi;
