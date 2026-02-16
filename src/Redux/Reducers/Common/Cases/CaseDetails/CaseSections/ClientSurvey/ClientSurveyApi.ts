import { baseApi } from "@/Redux/Api/BaseApi";

export const ClientSurveyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientSurvey: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/client-survey/`,
        method: "GET",
      }),
      providesTags: ["ClientSurvey"],
    }),
    updateClientSurvey: builder.mutation({
      query: ({ case_alias, payload }) => ({
        url: `/cases/${case_alias}/client-survey/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["ClientSurvey"],
    }),
  }),
});

export const { useGetClientSurveyQuery, useUpdateClientSurveyMutation } =
  ClientSurveyApi;
