import { publicBaseApi } from "@/Redux/Api/PublicBaseApi";

export const ClientSurveyApi = publicBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    postClientSurvey: builder.mutation({
      query: ({ case_id, payload }) => ({
        url: `/cases/${case_id}/client-survey/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["PublicClientSurvey"],
    }),
  }),
});

export const { usePostClientSurveyMutation } = ClientSurveyApi;
