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
  }),
});

export const { useGetClientSurveyQuery } = ClientSurveyApi;
