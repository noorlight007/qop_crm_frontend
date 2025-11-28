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
  }),
});
export const { useGetCommissionQuery, useAddCommissionMutation } =
  CommissionApi;
