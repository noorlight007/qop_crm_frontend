import { baseApi } from "@/Redux/Api/BaseApi";

export const NetworksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkList: builder.query({
      query: (params) => ({
        url: "/organization/onboard/networks/",
        method: "GET",
        params,
      }),
      providesTags: ["NetworkList"],
    }),
    getNetworkDetails: builder.query({
      query: ({ network_slug }) => ({
        url: `/organization/onboard/networks/${network_slug}/`,
        method: "GET",
      }),
      providesTags: ["NetworkList"],
    }),
    addNetwork: builder.mutation({
      query: ({ payload }) => ({
        url: "/organization/onboard/networks/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["NetworkList"],
    }),
    updateNetwork: builder.mutation({
      query: ({ network_slug, payload }) => ({
        url: `/organization/onboard/networks/${network_slug}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["NetworkList"],
    }),
    deleteNetwork: builder.mutation({
      query: ({ network_slug }) => ({
        url: `/organization/onboard/networks/${network_slug}/`,
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
