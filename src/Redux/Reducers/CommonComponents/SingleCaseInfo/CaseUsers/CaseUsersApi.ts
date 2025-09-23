import { baseApi } from "@/Redux/Api/BaseApi";

export const CaseUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCaseUsers: builder.query({
      query: ({case_alias}) => ({
        url: `/cases/${case_alias}/user/list/`,
        method: "GET",
      }),
      providesTags: ["ApplicantsDetails"],
    }),
  }),
});

export const { useGetCaseUsersQuery } = CaseUsersApi;
