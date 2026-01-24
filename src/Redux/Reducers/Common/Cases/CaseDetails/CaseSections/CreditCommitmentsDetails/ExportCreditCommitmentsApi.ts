import { baseApi } from "@/Redux/Api/BaseApi";

export const ExportCreditCommitmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    exportCreditCommitments: builder.mutation({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/export-credit-commitments/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: ["CreditCommitmentsDetails"],
    }),
  }),
});

export const { useExportCreditCommitmentsMutation } =
  ExportCreditCommitmentsApi;
