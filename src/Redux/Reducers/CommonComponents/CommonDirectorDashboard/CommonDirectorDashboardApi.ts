import { baseApi } from "@/Redux/Api/BaseApi";

export const CommonDirectorDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommonDirectorDashboard: builder.query({
      query: () => ({
        url: `/dashboard/common/`,
        method: "GET",
      }),
      providesTags: ["CommonDashboard"],
    }),
  }),
});
export const { useGetCommonDirectorDashboardQuery } =
  CommonDirectorDashboardApi;
