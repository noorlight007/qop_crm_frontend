import { baseApi } from "@/Redux/Api/BaseApi";

export const ApplicantCaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getApplicantCase: builder.query({
      query: () => ({
        url: `/cases/`,
        method: "GET",
      }),
      providesTags: ["ApplicantCase"],
    }),
  }),
});

export const { useGetApplicantCaseQuery } = ApplicantCaseApi;
