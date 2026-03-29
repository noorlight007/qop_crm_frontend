import { baseApi } from "@/Redux/Api/BaseApi";

export const LeadsOrClientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeadsOrClients: builder.query({
      query: (params) => ({
        url: "/api/customers/",
        method: "GET",
        params,
      }),
      providesTags: ["LeadsOrClients"],
    }),
    addLeadsOrClients: builder.mutation({
      query: ({ payload }) => ({
        url: "/api/customers/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LeadsOrClients"],
    }),
    getSingleLeadsOrClientsDetails: builder.query({
      query: ({ customerAlias }) => ({
        url: `/api/customers/${customerAlias}/`,
        method: "GET",
      }),
      providesTags: ["LeadsOrClients"],
    }),
    updateLeadsOrClientsDetails: builder.mutation({
      query: ({ payload, customerAlias }) => ({
        url: `/api/customers/${customerAlias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["LeadsOrClients"],
    }),
    deleteLeadsOrClients: builder.mutation({
      query: ({ customerAlias }) => ({
        url: `/api/customers/${customerAlias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeadsOrClients"],
    }),
  }),
});
export const {
  useGetLeadsOrClientsQuery,
  useAddLeadsOrClientsMutation,
  useGetSingleLeadsOrClientsDetailsQuery,
  useUpdateLeadsOrClientsDetailsMutation,
  useDeleteLeadsOrClientsMutation,
} = LeadsOrClientsApi;
