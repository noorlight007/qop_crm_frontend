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
    getNetworkCaseList: builder.query({
      query: ({ network_slug, params }) => ({
        url: `/api/networks/${network_slug}/cases/`,
        method: "GET",
        params,
      }),
      providesTags: ["NetworkList"],
    }),
    getNetworkCaseDetails: builder.query({
      query: ({ network_slug, case_alias }) => ({
        url: `/api/networks/${network_slug}/cases/${case_alias}/`,
        method: "GET",
      }),
      providesTags: ["NetworkList"],
    }),
  }),
});
export const {
  useGetNetworkListQuery,
  useGetNetworkDetailsQuery,
  useAddNetworkMutation,
  useUpdateNetworkMutation,
  useDeleteNetworkMutation,
  useGetNetworkCaseListQuery,
  useGetNetworkCaseDetailsQuery,
} = NetworksApi;
