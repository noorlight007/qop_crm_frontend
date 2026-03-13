import { baseApi } from "@/Redux/Api/BaseApi";

export const BudgetPlannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCaseBudgetPlanner: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/budget/`,
        method: "GET",
      }),
      providesTags: ["BudgetPlanner"],
    }),
    updateBudgetPlanner: builder.mutation({
      query: ({
        case_alias,
        budgetplanner_alias,
        updatedBudgetPlannerData,
      }) => ({
        url: `/cases/${case_alias}/budget/${budgetplanner_alias}/`,
        method: "PUT",
        body: updatedBudgetPlannerData,
      }),
      invalidatesTags: ["BudgetPlanner"],
    }),
    updateBudgectPlannerNote: builder.mutation({
      query: ({ case_alias, budgetplanner_alias, note }) => ({
        url: `/cases/${case_alias}/budget/${budgetplanner_alias}/`,
        method: "PATCH",
        body: { note },
      }),
      invalidatesTags: ["BudgetPlanner"],
    }),
    validateBudgetPlanner: builder.mutation({
      query: ({
        case_alias,
        budgetplanner_alias,
        updatedBudgetPlannerData,
      }) => ({
        url: `/cases/${case_alias}/budget/${budgetplanner_alias}/?validate=true`,
        method: "PATCH",
        body: updatedBudgetPlannerData,
      }),
    }),
  }),
});

export const {
  useGetCaseBudgetPlannerQuery,
  useUpdateBudgetPlannerMutation,
  useUpdateBudgectPlannerNoteMutation,
  useValidateBudgetPlannerMutation,
} = BudgetPlannerApi;
