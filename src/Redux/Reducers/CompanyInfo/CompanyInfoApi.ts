import { baseApi } from "@/Redux/Api/BaseApi";

export const CompanyInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyInfo: builder.query({
      query: () => ({
        url: "/director/company-profile/",
        method: "GET",
      }),
      providesTags: ["CompanyInfo"],
    }),
    updateCompanyInfo: builder.mutation({
      query: ({ payload }) => ({
        url: "/director/company-profile/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["CompanyInfo"],
    }),
  }),
});

export const { useGetCompanyInfoQuery, useUpdateCompanyInfoMutation } =
  CompanyInfoApi;
