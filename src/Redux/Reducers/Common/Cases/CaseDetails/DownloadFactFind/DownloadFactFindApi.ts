import { baseApi } from "@/Redux/Api/BaseApi";

export const DownloadFactFindApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    downloadFactFind: builder.mutation({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/fact-find-pdf/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useDownloadFactFindMutation } = DownloadFactFindApi;