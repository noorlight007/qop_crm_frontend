import { baseApi } from "@/Redux/Api/BaseApi";

export const VulnerableClientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVulnerableClient: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/vulnerability/`,
        method: "GET",
      }),
      providesTags: ["VulnerableClient"],
    }),
    updateVulnerableClient: builder.mutation({
      query: ({ case_alias, payload }) => ({
        url: `/cases/${case_alias}/vulnerability/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["VulnerableClient"],
    }),
  }),
});

export const {
  useGetVulnerableClientQuery,
  useUpdateVulnerableClientMutation,
} = VulnerableClientApi;
