import { baseApi } from "@/Redux/Api/BaseApi";

export const CommonAdviserDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdviserDashboardSummaryData: builder.query({
      query: () => ({
        url: "/dashboard/adviser-summary/",
        method: "GET",
      }),
      providesTags: ["AdviserDashboardData"],
    }),
  }),
});

export const { useGetAdviserDashboardSummaryDataQuery } =
  CommonAdviserDashboardApi;
