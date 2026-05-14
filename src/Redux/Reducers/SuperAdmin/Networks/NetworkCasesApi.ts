import { baseApi } from "@/Redux/Api/BaseApi";

export const NetworkCasesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({    
    getNetworkCaseList: builder.query({
      query: ({ network_slug, params }) => ({
        url: `/api/networks/${network_slug}/cases/`,
        method: "GET",
        params,
      }),
      providesTags: ["NetworkCases"],
    }),
    getNetworkCaseDetails: builder.query({
      query: ({ network_slug, case_alias }) => ({
        url: `/api/networks/${network_slug}/cases/${case_alias}/`,
        method: "GET",
      }),
      providesTags: ["NetworkCases"],
    }),
    addNetworkCase: builder.mutation({
      query: ({ network_slug, payload }) => ({
        url: `/api/networks/${network_slug}/cases/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["NetworkCases"],
    }),
    updateNetworkCase: builder.mutation({
      query: ({ network_slug, case_alias, payload }) => ({
        url: `/api/networks/${network_slug}/cases/${case_alias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["NetworkCases"],
    }),
    deleteNetworkCase: builder.mutation({
      query: ({ network_slug, case_alias }) => ({
        url: `/api/networks/${network_slug}/cases/${case_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkCases"],
    }),
  }),
});
export const {
  useGetNetworkCaseListQuery,
  useGetNetworkCaseDetailsQuery,
  useUpdateNetworkCaseMutation,
  useAddNetworkCaseMutation,
  useDeleteNetworkCaseMutation,
} = NetworkCasesApi;
