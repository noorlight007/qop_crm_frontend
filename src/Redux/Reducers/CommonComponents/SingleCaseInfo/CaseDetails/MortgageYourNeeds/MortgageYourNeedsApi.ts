import { baseApi } from "@/Redux/Api/BaseApi";

export const MortgageYourNeedsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMortgageYourNeeds: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/mortgage/`,
        method: "GET",
      }),
      providesTags: ["MortgageYourNeeds"],
    }),
    updateMortgageYourNeeds: builder.mutation({
      query: ({ case_alias, payload }) => ({
        url: `/cases/${case_alias}/mortgage/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["MortgageYourNeeds"],
    }),
  }),
});

export const {
  useGetMortgageYourNeedsQuery,
  useUpdateMortgageYourNeedsMutation,
} = MortgageYourNeedsApi;
