import { baseApi } from "@/Redux/Api/BaseApi";

export const AdviserDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdviserDetails: builder.query({
      query: () => ({
        url: `/director/advisors/`,
        method: "GET",
      }),
      providesTags: ["AdviserDetails"],
    }),
    addAdviserDetails: builder.mutation({
      query: ({ payload }) => ({
        url: `/director/advisors/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AdviserDetails"],
    }),
    updateAdviserDetails: builder.mutation({
      query: ({ advisorAlias, payload }) => ({
        url: `/director/advisors/${advisorAlias}/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AdviserDetails"],
    }),
    deleteAdviserDetails: builder.mutation({
      query: ({ advisorAlias }) => ({
        url: `/director/advisors/${advisorAlias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdviserDetails"],
    }),
  }),
});

export const {
  useGetAdviserDetailsQuery,
  useAddAdviserDetailsMutation,
  useUpdateAdviserDetailsMutation,
  useDeleteAdviserDetailsMutation,
} = AdviserDetailsApi;
