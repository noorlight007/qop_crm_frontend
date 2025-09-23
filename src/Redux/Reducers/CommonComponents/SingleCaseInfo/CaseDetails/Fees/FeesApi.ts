import { baseApi } from "@/Redux/Api/BaseApi";

export const FeesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeesInDetails: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/fees/in/`,
        method: "GET",
      }),
      providesTags: ["Fees"],
    }),
    getFeesOutDetails: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/fees/out/`,
        method: "GET",
      }),
      providesTags: ["Fees"],
    }),
    addFeesInDetails: builder.mutation({
      query: ({ case_alias, feesInDetails }) => ({
        url: `/cases/${case_alias}/fees/in/`,
        method: "POST",
        body: feesInDetails,
      }),
      invalidatesTags: ["Fees"],
    }),
    addFeesOutDetails: builder.mutation({
      query: ({ case_alias, feesOutDetails }) => ({
        url: `/cases/${case_alias}/fees/out/`,
        method: "POST",
        body: feesOutDetails,
      }),
      invalidatesTags: ["Fees"],
    }),
  }),
});

export const {
  useGetFeesInDetailsQuery,
  useGetFeesOutDetailsQuery,
  useAddFeesInDetailsMutation,
  useAddFeesOutDetailsMutation,
} = FeesApi;
