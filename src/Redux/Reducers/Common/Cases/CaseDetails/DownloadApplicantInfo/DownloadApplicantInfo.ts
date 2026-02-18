import { baseApi } from "@/Redux/Api/BaseApi";

export const DownloadApplicantInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    downloadApplicantInfo: builder.mutation({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/client-joint-user-pdf/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useDownloadApplicantInfoMutation } = DownloadApplicantInfoApi;