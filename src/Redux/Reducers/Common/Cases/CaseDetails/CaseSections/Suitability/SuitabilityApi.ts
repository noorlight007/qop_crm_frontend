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
    createDebtSummaryRecommendation: builder.mutation({
      query: ({ case_alias, payload }) => ({
        url: `/cases/${case_alias}/suitability-letter/debt-summary-recommendations/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Suitability"],
    }),
    updateDebtSummaryRecommendation: builder.mutation({
      query: ({ case_alias, payload, alias }) => ({
        url: `/cases/${case_alias}/suitability-letter/debt-summary-recommendations/${alias}/`,
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
    // suitability pdf download api
    downloadSuitabilityPdf: builder.mutation({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/suitability-letter/pdf/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetSuitabilityQuery,
  useUpdateSuitabilityMutation,
  useCreateDebtSummaryRecommendationMutation,
  useUpdateDebtSummaryRecommendationMutation,
  useGetExtraAnswerQuery,
  useAddExtraAnswerMutation,
  useDownloadSuitabilityPdfMutation,
} = SuitabilityApi;
