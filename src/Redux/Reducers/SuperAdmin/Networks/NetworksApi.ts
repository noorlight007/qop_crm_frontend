import { baseApi } from "@/Redux/Api/BaseApi";

export const NetworksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkList: builder.query({
      query: (params) => ({
        url: `/api/networks/`,
        method: "GET",
        params,
      }),
      providesTags: ["NetworkList"],
    }),

    getNetworkDetails: builder.query({
      query: ({ network_slug }) => ({
        url: `/api/networks/${network_slug}/`,
        method: "GET",
      }),
      providesTags: ["NetworkList"],
    }),
    addNetwork: builder.mutation({
      query: ({ payload }) => ({
        url: "/api/networks/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["NetworkList"],
    }),
    updateNetwork: builder.mutation({
      query: ({ network_slug, payload }) => ({
        url: `/api/networks/${network_slug}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["NetworkList"],
    }),
    deleteNetwork: builder.mutation({
      query: ({ network_slug }) => ({
        url: `/api/networks/${network_slug}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkList"],
    }),
  }),
});
export const {
  useGetNetworkListQuery,
  useGetNetworkDetailsQuery,
  useAddNetworkMutation,
  useUpdateNetworkMutation,
  useDeleteNetworkMutation,
} = NetworksApi;
