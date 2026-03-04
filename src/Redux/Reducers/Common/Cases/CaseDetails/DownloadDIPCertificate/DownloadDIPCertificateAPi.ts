import { baseApi } from "@/Redux/Api/BaseApi";

export const DownloadDIPCertificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    downloadDIPCertificate: builder.mutation({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/dip-pdf/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useDownloadDIPCertificateMutation } = DownloadDIPCertificateApi;