import { baseApi } from "@/Redux/Api/BaseApi";

export const CasesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCases: builder.query({
      query: (params) => ({
        url: `/cases/`,
        method: "GET",
        params,
      }),
      providesTags: ["CaseDetails", "LeadDetails"],
    }),
    getSingleCase: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/`,
        method: "GET",
      }),
      providesTags: ["CaseDetails"],
    }),
    addCase: builder.mutation({
      query: ({ payload }) => ({
        url: `/cases/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CaseDetails", "LeadDetails"],
    }),
    updateCase: builder.mutation({
      query: ({ caseAlias, payload }) => ({
        url: `/cases/${caseAlias}/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CaseDetails", "LeadDetails"],
    }),
    deleteCase: builder.mutation({
      query: ({ caseAlias }) => ({
        url: `/cases/${caseAlias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CaseDetails", "LeadDetails"],
    }),
  }),
});

export const {
  useGetCasesQuery,
  useGetSingleCaseQuery,
  useAddCaseMutation,
  useUpdateCaseMutation,
  useDeleteCaseMutation,
} = CasesApi;
