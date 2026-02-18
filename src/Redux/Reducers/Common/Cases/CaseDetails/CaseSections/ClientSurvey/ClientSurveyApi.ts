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
    sendClientSurvey: builder.mutation({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/client-survey/email/`,
        method: "GET",
      }),
      invalidatesTags: ["ClientSurvey"],
    }),
    downloadClientSurvey: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/client-survey/pdf/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useGetClientSurveyQuery, useSendClientSurveyMutation, useDownloadClientSurveyQuery } =
  ClientSurveyApi;
