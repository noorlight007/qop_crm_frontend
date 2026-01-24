import { baseApi } from "@/Redux/Api/BaseApi";

export const InsuranceHealthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInsuranceHealthDetails: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/health-insurance/`,
        method: "GET",
      }),
      providesTags: ["InsuranceHealthDetails"],
    }),
    updateInsuranceHealthDetails: builder.mutation({
      query: ({ case_alias, payload }) => ({
        url: `/cases/${case_alias}/health-insurance/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["InsuranceHealthDetails"],
    }),
  }),
});
export const {
  useGetInsuranceHealthDetailsQuery,
  useUpdateInsuranceHealthDetailsMutation,
} = InsuranceHealthApi;
