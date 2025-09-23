import { baseApi } from "@/Redux/Api/BaseApi";

export const ClientDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientDetails: builder.query({
      query: () => ({
        url: `/director/clients/`,
        method: "GET",
      }),
      providesTags: ["ClientDetails"],
    }),
    addClientDetails: builder.mutation({
      query: ({ payload }) => ({
        url: `/director/clients/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ClientDetails"],
    }),
    updateClientDetails: builder.mutation({
      query: ({clientAlias, payload}) => ({
        url: `/director/clients/${clientAlias}/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["ClientDetails"],
    }),
    deleteClientDetails: builder.mutation({
      query: ({ clientAlias }) => ({
        url: `/director/clients/${clientAlias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ClientDetails"],
    }),
  }),
});

export const {
  useGetClientDetailsQuery,
  useAddClientDetailsMutation,
  useUpdateClientDetailsMutation,
  useDeleteClientDetailsMutation,
} = ClientDetailsApi;
