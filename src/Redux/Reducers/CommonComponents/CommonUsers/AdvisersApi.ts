import { baseApi } from "@/Redux/Api/BaseApi";

export const AdviserDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdviserDetails: builder.query({
      query: (params) => ({
        url: `/director/advisers/`,
        method: "GET",
        params: params || {},
      }),
      providesTags: ["AdviserDetails"],
    }),
    addAdviserDetails: builder.mutation({
      query: ({ payload }) => ({
        url: `/director/advisers/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AdviserDetails"],
    }),
    updateAdviserDetails: builder.mutation({
      query: ({ adviserAlias, payload }) => ({
        url: `/director/advisers/${adviserAlias}/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AdviserDetails"],
    }),
    deleteAdviserDetails: builder.mutation({
      query: ({ adviserAlias }) => ({
        url: `/director/advisers/${adviserAlias}/`,
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
