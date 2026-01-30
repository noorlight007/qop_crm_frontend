import { baseApi } from "@/Redux/Api/BaseApi";

export const IntroducerDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIntroducerDetails: builder.query({
      // Accept optional params: { page, page_size, search, ... }
      query: (params) => ({
        url: `/director/introducers/`,
        method: "GET",
        params: params || {},
      }),
      providesTags: ["IntroducerDetails"],
    }),
    addIntroducerDetails: builder.mutation({
      query: ({ payload }) => ({
        url: `/director/introducers/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["IntroducerDetails"],
    }),
    updateIntroducerDetails: builder.mutation({
      query: ({ introducerAlias, payload }) => ({
        url: `/director/introducers/${introducerAlias}/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["IntroducerDetails"],
    }),
    deleteIntroducerDetails: builder.mutation({
      query: ({ introducerAlias }) => ({
        url: `/director/introducers/${introducerAlias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["IntroducerDetails"],
    }),
  }),
});

export const {
  useGetIntroducerDetailsQuery,
  useAddIntroducerDetailsMutation,
  useUpdateIntroducerDetailsMutation,
  useDeleteIntroducerDetailsMutation,
} = IntroducerDetailsApi;
