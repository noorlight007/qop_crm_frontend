import { baseApi } from "@/Redux/Api/BaseApi";

// export const SuitabilityApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getSuitability: builder.query({
//       query: ({ case_alias }) => ({
//         url: `/cases/${case_alias}/suitability/`,
//         method: "GET",
//       }),
//       providesTags: ["Suitability"],
//     }),
//     updateSuitability: builder.mutation({
//       query: ({ case_alias, payload }) => ({
//         url: `/cases/${case_alias}/suitability/`,
//         method: "PUT",
//         body: payload,
//       }),
//       invalidatesTags: ["Suitability"],
//     }),
//     // Modals endpoints start here
//     getExtraAnswer: builder.query({
//       query: ({ case_alias }) => ({
//         url: `/cases/${case_alias}/answers/`,
//         method: "GET",
//       }),
//       providesTags: ["Suitability"],
//     }),
//     AddExtraAnswer: builder.mutation({
//       query: ({ case_alias, payload }) => ({
//         url: `/cases/${case_alias}/answers/`,
//         method: "POST",
//         body: payload,
//       }),
//       invalidatesTags: ["Suitability"],
//     }),
//   }),
// });

// export const {
//   useGetSuitabilityQuery,
//   useUpdateSuitabilityMutation,
//   useGetExtraAnswerQuery,
//   useAddExtraAnswerMutation,
// } = SuitabilityApi;=

export const recommendationLetterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendationLetter: builder.query<any, { case_alias: any }>({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/recommendation-letter/`,
        method: "GET",
      }),
      providesTags: ["Suitability"],
    }),

    updateRecommendationLetter: builder.mutation<
      any,
      { payload: any; case_alias: any }
    >({
      query: ({ payload, case_alias }) => ({
        url: `/cases/${case_alias}/recommendation-letter/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Suitability"],
    }),
  }),
});

export const {
  useGetRecommendationLetterQuery,
  useUpdateRecommendationLetterMutation,
} = recommendationLetterApi;
