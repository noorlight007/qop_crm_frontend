import { baseApi } from "@/Redux/Api/BaseApi";

export const SuitabilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuitability: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/suitability-letter/`,
        method: "GET",
      }),
      providesTags: ["Suitability"],
    }),
    updateSuitability: builder.mutation({
      query: ({ case_alias, payload }) => ({
        url: `/cases/${case_alias}/suitability-letter/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Suitability"],
    }),
    // Modals endpoints start here
    getExtraAnswer: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/answers/`,
        method: "GET",
      }),
      providesTags: ["Suitability"],
    }),
    AddExtraAnswer: builder.mutation({
      query: ({ case_alias, payload }) => ({
        url: `/cases/${case_alias}/answers/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Suitability"],
    }),
  }),
});

export const {
  useGetSuitabilityQuery,
  useUpdateSuitabilityMutation,
  useGetExtraAnswerQuery,
  useAddExtraAnswerMutation,
} = SuitabilityApi;
