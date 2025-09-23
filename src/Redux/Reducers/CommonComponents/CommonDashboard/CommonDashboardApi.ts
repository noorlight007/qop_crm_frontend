import { baseApi } from "@/Redux/Api/BaseApi";

export const CommonDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommonDashboard: builder.query({
      query: () => ({
        url: `/dashboard/common/`,
        method: "GET",
      }),
      providesTags: ["CommonDashboard"],
    }),
  }),
});
export const { useGetCommonDashboardQuery } = CommonDashboardApi;