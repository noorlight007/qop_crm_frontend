import { baseApi } from "@/Redux/Api/BaseApi";

export const InsuranceOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInsuranceOverview: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/insurance-loan-details/`,
        method: "GET",
      }),
      providesTags: ["InsuranceOverview"],
    }),
    updateInsuranceOverview: builder.mutation({
      query: ({ case_alias, insurance_overview_alias, payload }) => ({
        url: `/cases/${case_alias}/insurance-loan-details/${insurance_overview_alias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["InsuranceOverview"],
    }),
  }),
});

export const {
  useGetInsuranceOverviewQuery,
  useUpdateInsuranceOverviewMutation,
} = InsuranceOverviewApi;
