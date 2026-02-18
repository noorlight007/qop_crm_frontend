import { baseApi } from "@/Redux/Api/BaseApi";

export const FeesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeesInDetails: builder.query({
      query: ({ case_alias, page }) => ({
        url: `/cases/${case_alias}/fees/in/?page=${page ?? 1}`,
        method: "GET",
      }),
      providesTags: ["Fees"],
    }),
    getFeesOutDetails: builder.query({
      query: ({ case_alias, page }) => ({
        url: `/cases/${case_alias}/fees/out/?page=${page ?? 1}`,
        method: "GET",
      }),
      providesTags: ["Fees"],
    }),
    addFeesInDetails: builder.mutation({
      query: ({ case_alias, feesInDetails }) => ({
        url: `/cases/${case_alias}/fees/in/`,
        method: "POST",
        body: feesInDetails,
      }),
      invalidatesTags: ["Fees"],
    }),
    addFeesOutDetails: builder.mutation({
      query: ({ case_alias, feesOutDetails }) => ({
        url: `/cases/${case_alias}/fees/out/`,
        method: "POST",
        body: feesOutDetails,
      }),
      invalidatesTags: ["Fees"],
    }),
    deleteFeesInOut: builder.mutation({
      query: ({ case_alias, fee_alias }) => ({
        url: `/cases/${case_alias}/fees/${fee_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Fees"],
    }),
    calculateFees: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/fees/`,
        method: "GET",
      }),
      providesTags: ["Fees"],
    }),
    downloadFeesSummary: builder.mutation({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/fees/pdf/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetFeesInDetailsQuery,
  useGetFeesOutDetailsQuery,
  useAddFeesInDetailsMutation,
  useAddFeesOutDetailsMutation,
  useDeleteFeesInOutMutation,
  useCalculateFeesQuery,
  useDownloadFeesSummaryMutation,
} = FeesApi;
