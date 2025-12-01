import { baseApi } from "@/Redux/Api/BaseApi";

export const CommissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommission: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/commission/`,
        method: "GET",
      }),
      providesTags: ["Commission"],
    }),
    addCommission: builder.mutation({
      query: ({ case_alias, commission_alias, commissionData }) => ({
        url: `/cases/${case_alias}/commission/${commission_alias}/`,
        method: "PATCH",
        body: commissionData,
      }),
      invalidatesTags: ["Commission"],
    }),
    getLumpSumCommission: builder.query({
      query: ({ case_alias, commission_alias }) => ({
        url: `/cases/${case_alias}/commission/${commission_alias}/lump-sum-commissions/`,
        method: "GET",
      }),
      providesTags: ["Commission"],
    }),
    addLumpSumCommission: builder.mutation({
      query: ({ case_alias, commission_alias, lumpSumData }) => ({
        url: `/cases/${case_alias}/commission/${commission_alias}/lump-sum-commissions/`,
        method: "POST",
        body: lumpSumData,
      }),
      invalidatesTags: ["Commission"],
    }),
    updateLumpSumCommission: builder.mutation({
      query: ({
        case_alias,
        commission_alias,
        lump_sum_alias,
        lumpSumData,
      }) => ({
        url: `/cases/${case_alias}/commission/${commission_alias}/lump-sum-commissions/${lump_sum_alias}/`,
        method: "PATCH",
        body: lumpSumData,
      }),
      invalidatesTags: ["Commission"],
    }),
    deleteLumpSumCommission: builder.mutation({
      query: ({ case_alias, commission_alias, lump_sum_alias }) => ({
        url: `/cases/${case_alias}/commission/${commission_alias}/lump-sum-commissions/${lump_sum_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Commission"],
    }),
  }),
});
export const {
  useGetCommissionQuery,
  useAddCommissionMutation,
  useGetLumpSumCommissionQuery,
  useAddLumpSumCommissionMutation,
  useUpdateLumpSumCommissionMutation,
  useDeleteLumpSumCommissionMutation,
} = CommissionApi;
