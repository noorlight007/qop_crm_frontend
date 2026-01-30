import { baseApi } from "@/Redux/Api/BaseApi";

export const CasesSummaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCasesSummary: builder.query({
      query: () => ({
        url: `/cases/summary/`,
        method: "GET",
      }),
      providesTags: ["CasesSummary"],
    }),
  }),
});
export const { useGetCasesSummaryQuery } = CasesSummaryApi;
