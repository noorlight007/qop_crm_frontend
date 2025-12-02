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
    // Lump Sum Commissions APIs
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
    // TrailCommission Apis
    getTrailCommission: builder.query({
      query: ({ case_alias, commission_alias }) => ({
        url: `/cases/${case_alias}/commission/${commission_alias}/trail-commissions/`,
        method: "GET",
      }),
      providesTags: ["Commission"],
    }),
    addTrailCommission: builder.mutation({
      query: ({ case_alias, commission_alias, trailCommissionData }) => ({
        url: `/cases/${case_alias}/commission/${commission_alias}/trail-commissions/`,
        method: "POST",
        body: trailCommissionData,
      }),
      invalidatesTags: ["Commission"],
    }),
    updateTrailCommission: builder.mutation({
      query: ({
        case_alias,
        commission_alias,
        trail_commission_alias,
        trailCommissionData,
      }) => ({
        url: `/cases/${case_alias}/commission/${commission_alias}/trail-commissions/${trail_commission_alias}/`,
        method: "PATCH",
        body: trailCommissionData,
      }),
      invalidatesTags: ["Commission"],
    }),
    deleteTrailCommission: builder.mutation({
      query: ({ case_alias, commission_alias, trail_commission_alias }) => ({
        url: `/cases/${case_alias}/commission/${commission_alias}/trail-commissions/${trail_commission_alias}/`,
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
  useGetTrailCommissionQuery,
  useAddTrailCommissionMutation,
  useUpdateTrailCommissionMutation,
  useDeleteTrailCommissionMutation,
} = CommissionApi;
