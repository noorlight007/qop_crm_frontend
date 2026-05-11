import { baseApi } from "@/Redux/Api/BaseApi";

export const CompanyInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyInfo: builder.query({
      query: () => ({
        url: "/api/company-info",
        method: "GET",
      }),
    }),
    
  }),
});

export const { useGetCompanyInfoQuery } = CompanyInfoApi;