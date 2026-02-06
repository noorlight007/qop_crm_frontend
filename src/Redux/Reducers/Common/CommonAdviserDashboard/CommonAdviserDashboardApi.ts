import { baseApi } from "@/Redux/Api/BaseApi";

export const CommonAdviserDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdviserDashboardSummaryData: builder.query({
      query: () => ({
        url: "/dashboard/adviser-summary/",
        method: "GET",
      }),
      providesTags: ["AdviserDashboardData"],
      keepUnusedDataFor: 0,
    }),
    getAdviserDashboardClientData: builder.query({
      query: () => ({
        url: "/dashboard/adviser-clients/",
        method: "GET",
      }),
      providesTags: ["AdviserDashboardData"],
    }),
    getAdviserDashboardDocumentData: builder.query({
      query: () => ({
        url: "/dashboard/adviser-files/",
        method: "GET",
      }),
      providesTags: ["AdviserDashboardData"],
    }),
  }),
});

export const {
  useGetAdviserDashboardSummaryDataQuery,
  useGetAdviserDashboardClientDataQuery,
  useGetAdviserDashboardDocumentDataQuery,
} = CommonAdviserDashboardApi;
