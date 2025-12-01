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
    getInsurancePolicies: builder.query({
      query: ({ case_alias, insurance_overview_alias }) => ({
        url: `/cases/${case_alias}/insurance-loan-details/${insurance_overview_alias}/insurance-policy/`,
        method: "GET",
      }),
      providesTags: ["InsurancePolicies"],
    }),
    addNewInsurancePolicy: builder.mutation({
      query: ({ case_alias, insurance_overview_alias, payload }) => ({
        url: `/cases/${case_alias}/insurance-loan-details/${insurance_overview_alias}/insurance-policy/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["InsurancePolicies", "InsuranceOverview"],
    }),
    updateInsurancePolicy: builder.mutation({
      query: ({
        case_alias,
        insurance_overview_alias,
        policy_alias,
        payload,
      }) => ({
        url: `/cases/${case_alias}/insurance-loan-details/${insurance_overview_alias}/insurance-policy/${policy_alias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["InsurancePolicies", "InsuranceOverview"],
    }),
    deleteInsurancePolicy: builder.mutation({
      query: ({ case_alias, insurance_overview_alias, policy_alias }) => ({
        url: `/cases/${case_alias}/insurance-loan-details/${insurance_overview_alias}/insurance-policy/${policy_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["InsurancePolicies", "InsuranceOverview"],
    }),
  }),
});

export const {
  useGetInsuranceOverviewQuery,
  useUpdateInsuranceOverviewMutation,
  useGetInsurancePoliciesQuery,
  useAddNewInsurancePolicyMutation,
  useUpdateInsurancePolicyMutation,
  useDeleteInsurancePolicyMutation,
} = InsuranceOverviewApi;
