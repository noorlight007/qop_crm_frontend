import { baseApi } from "@/Redux/Api/BaseApi";

export const PortfolioSummaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolioSummary: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/properties/summary`,
        method: "GET",
      }),
      providesTags: ["Portfolio"],
    }),
  }),
});
export const { useGetPortfolioSummaryQuery } = PortfolioSummaryApi;
